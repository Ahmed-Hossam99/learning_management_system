const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const question = await models.group.findById(id);
  if (!question) return APIResponse.NotFound(res);
  if (question.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont Allow To Do This Action");
  const objectType = question.objectType;
  const unit = objectType === "lesson" ? question.unit : null;
  const subject = objectType === "lesson" ? question.subject : null;
  const user = req.me;

  const questions = req.body;
  for (let i = 0; i < questions.length; i++) {
    questions[i].addedBy = user.id
    questions[i].object = question.object
    questions[i].objectType = objectType
    questions[i].unit = unite
    questions[i].subject = subject
    questions[i].isChild = true
    questions[i].paarentQuestion = {}
    questions[i].parentQuestion.question = id
    questions[i].parentQuestion.weight = questions[i].weight
    questions[i].type = questions[i].type
  }


  for (let i = 0; i < questions.length; i++) {
    questions[i].addedBy = user.id;
    questions[i].object = question.object;
    questions[i].objectType = objectType;
    questions[i].unit = unit;
    questions[i].subject = subject;
    questions[i].isChild = true;
    questions[i].parentQuestion = {};
    questions[i].parentQuestion.question = id; //id of gruop question  
    questions[i].parentQuestion.weight = questions[i].weight;  //weight of current question 
    let type = questions[i].type;
    let weight = questions[i].weight;
    if (!type || !weight)
      return APIResponse.BadRequest(
        res,
        "Type/weight of question is required ."
      );
    let newQuestion = await new models[type](questions[i]).save();
    question.childrenQuestions.push(newQuestion.id); //link parent with child questions  
  }
  await question.save();
  return APIResponse.Created(res, question);
});
