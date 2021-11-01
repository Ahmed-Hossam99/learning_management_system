const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require('lodash')

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let newteacher = await models.teacher.findById(id);
  if (!newteacher) {
    return APIResponse.NotFound(res, "No teacher With That Id");
  }

  const subjects = await models.subject
    .find({ _id: { $in: req.body.subjects } })
    .populate(["teachers", "level"]);
  let changed = false;

  let secId = req.body.section
  const teachers = await models.teacher
    .find({
      sections
        : secId
    })
  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i];
    for (let j = 0; j < teachers.length; j++) {
      const teacher = teachers[j];
      if (teacher.subjects.indexOf(subject._id) !== -1) {
        teacher.subjects.splice(subjects.indexOf(subject._id), 1);
        await teacher.save();
      }
    }
    let counter = 2;
    newteacher.subjects.indexOf(subject._id) === -1
      ? newteacher.subjects.push(subject._id)
      : counter--;
    newteacher.sections.indexOf(secId) === -1
      ? newteacher.sections.push(secId)
      : counter--;

    if (counter) {
      console.log('here')
      changed = true;
      await newteacher.save();
    }
  }
  if (changed) await newteacher.save();

  return APIResponse.Ok(res, newteacher);
});
