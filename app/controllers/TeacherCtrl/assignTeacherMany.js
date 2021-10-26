const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require('lodash')

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let teacher = await models.teacher.findById(id);
  if (!teacher) {
    return APIResponse.NotFound(res, "No teacher With That Id");
  }

  const subjects = await models.subject
    .find({ _id: { $in: req.body.subjects } })
    .populate(["teachers", "level"]);
  console.log(subjects[0])
  let changed = false;

  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i];

    // update teacher
    if (subject.teacher && subject.teacher !== id) {
      let prevTeacher = await models.teacher
        .findById(subject.teacher)
        .populate({ path: "subjects", populate: "section" });
      let sections = prevTeacher.subjects.map(
        (_subject) => _subject.section.id
      );
      let classes = prevTeacher.subjects.map(
        (_subject) => _subject.section.class
      );
      sections.splice(sections.indexOf(subject.section.id), 1);
      classes.splice(classes.indexOf(subject.section.class), 1);
      if (classes.indexOf(subject.section.class) === -1)
        prevTeacher.classes.splice(
          prevTeacher.classes.indexOf(subject.section.class),
          1
        );
      if (sections.indexOf(subject.section.id) === -1)
        prevTeacher.sections.splice(
          prevTeacher.sections.indexOf(subject.section.id),
          1
        );
      prevTeacher.subjects.splice(
        _.findKey(prevTeacher.subjects, { _id: id }),
        1
      );
      await prevTeacher.save();
    }

    let counter = 3;
    teacher.classes.indexOf(subject.section.class) === -1
      ? teacher.classes.push(subject.section.class)
      : counter--;
    teacher.subjects.indexOf(subject.id) === -1
      ? teacher.subjects.push(subject.id)
      : counter--;
    teacher.sections.indexOf(subject.section.id) === -1
      ? teacher.sections.push(subject.section.id)
      : counter--;

    if (counter) {
      changed = true;
      subject.teacher = id;
      await subject.save();
    }
  }
  if (changed) await teacher.save();

  return APIResponse.Ok(res, teacher);
});
