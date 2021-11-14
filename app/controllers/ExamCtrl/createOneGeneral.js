const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.body.object);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const objectType = req.body.objectType;
  let populateQuery = objectType === 'lecture' ? { path: 'subject' } :
    objectType === 'subject' ? { path: 'level' } : ''
    ;


  //populate unit it's hold subjectId and nested populate subject
  // let populateObject =
  //   objectType === "lesson"
  //     ? { path: "unite", populate: "subject" }
  //     : objectType === "unite"
  //       ? { path: "subject" }
  //       : "";
  const doc = await models[objectType].findById(id).populate(populateQuery);
  if (!doc) return APIResponse.NotFound(res, `No ${objectType} with that id`);
  // console.log(doc)

  if (req.me.role === 'admin' || req.me.role === 'teacher') {
    console.log(req.me.role)

    if (objectType === "subject" && req.me.role === "teacher") {
      if (req.me.subjects.indexOf(doc._id) === -1)
        return APIResponse.Forbidden(res, "Dont Allow To Do this action");
      req.body.subject = doc.subject.id;

    }

    // handle authorization
    if (objectType === "lecture" && req.me.role === "teacher") {
      if (req.me.subjects.indexOf(doc.subject._id) === -1)
        return APIResponse.Forbidden(res, "Dont Allow To Do this action");
    }

    if (objectType === "lecture")
      req.body.subject = doc.subject.id;



    if (objectType === "subject")
      req.body.subject = doc.id;

    if (req.body.duration) req.body.isTimed = true;
    else req.body.duration = null;

    req.body.addedBy = req.me.id;

    const exam = await new models.generalExam(req.body).save();

    return APIResponse.Created(res, exam);
  } else {
    return APIResponse.Forbidden(res, "Dont Allow To Do this action");
  }
});
