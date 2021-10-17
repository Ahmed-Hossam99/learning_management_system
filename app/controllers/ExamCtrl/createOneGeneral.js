const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.body.object);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const objectType = req.body.objectType;
  let populateQuery = objectType === 'lesson' ? { path: 'unite', populate: 'subject' } :
    objectType === 'unit' ? { path: 'subject' } : ''
    ;


  //populate unit it's hold subjectId and nested populate subject
  let populateObject =
    objectType === "lesson"
      ? { path: "unite", populate: "subject" }
      : objectType === "unite"
        ? { path: "subject" }
        : "";
  const doc = await models[objectType].findById(id).populate(populateObject);
  if (!doc) return APIResponse.NotFound(res, `No ${objectType} with that id`);
  console.log(doc)
  // handle authorization
  console.log(doc.unite.subject)
  if (objectType === "lesson") {
    if (doc.unite.subject.teacher !== req.me.id && req.me.role !== "admin")
      return APIResponse.Forbidden(res, "Dont Allow To Do this action");
    req.body.subject = doc.unite.subject.id;
  } else if (objectType === "unite") {
    if (doc.subject.teacher !== req.me.id && req.me.role !== "admin")
      return APIResponse.Forbidden(res, "Dont Allow To Do this action");
    req.body.subject = doc.subject.id;
  } else {
    if (doc.teacher !== req.me.id && req.me.role !== "admin")
      return APIResponse.Forbidden(res, "Dont Allow To Do this action");
    req.body.subject = doc.id;
  }

  if (req.body.duration) req.body.isTimed = true;
  else req.body.duration = null;

  req.body.addedBy = req.me.id;

  const exam = await new models.generalExam(req.body).save();

  return APIResponse.Created(res, exam);
});
