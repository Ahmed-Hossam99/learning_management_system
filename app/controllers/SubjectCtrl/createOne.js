const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
  [{ name: "icon", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const level = await models.level.findById(id)//reemah
    // return APIResponse.Ok(res, section);
    if (!level) return APIResponse.NotFound(res, "No level WIth THat id");
    req.body.level = id
    if (req.files && req.files["icon"]) {
      req.body.icon = req.files["icon"][0].secure_url;
    }

    // let tid
    // let existTeacher
    // if (req.body.teacher) {
    //   tid = req.body.teacher
    //   if (isNaN(tid)) return APIResponse.NotFound(res);
    //   existTeacher = await models.teacher.findById(tid)
    //   if (!existTeacher) return APIResponse.NotFound(res, 'not doctor with that id')
    //   // teachers.push(tid)
    // }
    const subject = await new models.subject(req.body).save();
    // if (existTeacher) {
    //   if (existTeacher.subjects.indexOf(subject.id) === -1) existTeacher.subjects.push(subject.id);
    //   await existTeacher.save();
    // }
    await models.subject.populate(subject, ['level', 'teachers'])
    //  [{ path: 'level', populate: { path: 'level', select: 'nameAr' } }, 'educationalSystem'])
    return APIResponse.Created(res, subject);
  }
);
