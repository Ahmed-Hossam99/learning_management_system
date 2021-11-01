const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");
const models = require("../../models");
const xlsx = require("node-xlsx");
const fs = require("fs");
const emailRules =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRules =
  /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
const bcrypt = require("bcryptjs");

module.exports = $baseCtrl(
  [{ name: "sheet", maxCount: 1 }],
  async (req, res) => {
    const id = parseInt(req.body.section);
    if (isNaN(id)) return APIResponse.NotFound(res);
    let section = await models.section.findById(id).populate("class");
    if (!section) return APIResponse.NotFound(res, "No Section with that id");
    if (
      !req.files["sheet"] ||
      req.files["sheet"][0].mimetype !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      return APIResponse.BadRequest(res, "No Excel Sheet uploaded");
    let data = xlsx.parse(
      req.files["sheet"][0].destination + "/" + req.files["sheet"][0].filename
    )[0]["data"];
    if (req.files && req.files["sheet"])
      fs.unlinkSync(
        req.files["sheet"][0].destination + "/" + req.files["sheet"][0].filename
      );

    let emails = [];
    let invalidEmail = false;
    let invalidPhone = false;
    let nullablePasswordOrUsername = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] && !data[i][2].startsWith("+962"))
        data[i][2] = "+962" + data[i][2];
      if (!data[i][1] || !data[i][1].match(emailRules)) invalidEmail = true;
      if (data[i][2] && !data[i][2].match(phoneRules)) invalidPhone = true;
      if (!data[i][3] || !data[i][0]) nullablePasswordOrUsername = true;
      emails.push(data[i][1]);
      if (invalidEmail || invalidPhone || nullablePasswordOrUsername)
        return APIResponse.BadRequest(
          res,
          `InvalidEmail: ${invalidEmail} , invalidPhone: ${invalidPhone} , nullablePasswordOrUsername : ${nullablePasswordOrUsername}`
        );
    }
    let result = await addStudentsToSection({
      students: data,
      section,
    });

    if (result.flag === 0)
      return res.status(400).json({ msg: "invalid upload" });

    return APIResponse.Ok(res, {});
  }
);

const addStudentsToSection = async (data) => {
  try {
    const { students, section } = data;
    const destination = await models.section.findById(section.id);
    let studentsIds = [];
    for (let i = 1; i < students.length; i++) {
      let student = await models.student.findOne({ email: students[i][1] });
      if (student) {
        let prevSection = await models.section.findById(student.section);
        prevSection.students.splice(
          prevSection.students.indexOf(student.id),
          1
        );
        await prevSection.save();

        await student
          .set({
            section: section.id,
            class: section.class.id,
            level: section.class.level,
            system: section.system,
            ...(students[i][4] && {
              address: students[i][4],
            }),
          })
          .save();
      } else {
        student = await new models.student({
          email: students[i][1],
          phone: students[i][2] ? students[i][2] : undefined,
          address: students[i][4] ? students[i][4] : undefined,
          username: students[i][0],
          password: bcrypt.hashSync(
            students[i][3].toString(),
            bcrypt.genSaltSync(10)
          ),
          enabled: true,
          section: section.id,
          class: section.class.id,
          level: section.class.level,
          system: section.system,
        }).save();
      }
      studentsIds.push(student.id);
    }
    destination.students.push(...studentsIds);
    await destination.save();
    return {
      flag: 1,
    };
  } catch (error) {
    console.log("in add students to section function ", error);
    return {
      flag: 0,
    };
  }
};
