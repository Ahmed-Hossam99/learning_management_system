const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const routePath = req.route.path.split("/");
  const objectType = routePath[1] === "lecture" ? "lecture" : "other";
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const object = await models[objectType].findById(id).populate("subject");
  if (!object) return APIResponse.NotFound(res);
  const subject = objectType === "lecture" ? object.subject.id : null;
  const user = req.me;

  if (objectType === "lecture") {
    if (req.me.role === "teacher" && req.me.subjects.indexOf(subject) === -1)
      return APIResponse.Forbidden(res, "Dont Allow To Do This Action");
  }

  let promises = [];
  const questions = req.body;
  for (let i = 0; i < questions.length; i++) {//how calculate length based on ??
    let question = questions[i];
    question.addedBy = user.id;
    question.object = id;
    question.objectType = objectType;
    question.subject = subject;
    let type = question.type;
    if (!type)
      return APIResponse.BadRequest(res, "Type of question is required .");
    let newQuestion = new models[type](question).save();
    promises.push(newQuestion);
  }
  await Promise.all(promises);

  return APIResponse.Created(res, questions);
});
