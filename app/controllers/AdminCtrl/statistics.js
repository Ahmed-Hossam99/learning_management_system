const models = require("../../models");
const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  let users = await models._user.estimatedDocumentCount();
  let exams = await models._exam.estimatedDocumentCount();
  let questions = await models._question.estimatedDocumentCount();
  let subjects = await models.subject.estimatedDocumentCount();
  let lectures = await models.lecture.estimatedDocumentCount();
  let response = {
    users,
    exams,
    questions,
    subjects,
    lectures,

  };
  return APIResponse.Ok(res, response);
});
