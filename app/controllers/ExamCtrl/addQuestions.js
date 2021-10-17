const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const exam = await models._exam.findById(id).select("-students");
  if (!exam) return APIResponse.NotFound(res, "NO Exam with that id");

  if (exam.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont allow to do this action");
  //check of exam alredy has a question and catch all id's of this qustion  
  let prevQuestions = exam.questions.map((q) => q.question);

  const questions = req.body;

  for (let i = 0; i < questions.length; i++) {
    let question = await models._question
      .findById(questions[i].question)
      .populate("childrenQuestions");
    if (!question) return APIResponse.NotFound(res, "NO Question With That Id");
    // if type of question or cild  = true 
    if (question.isChild)
      return APIResponse.Forbidden(
        res,
        "Can not add child question as main question"
      );
    // if qusetion alredy exist on exam 
    if (prevQuestions.indexOf(question.id) !== -1)
      return APIResponse.BadRequest(
        res,
        `This Question Already ${question.id} exists`
      );
    // handling of  question type = group 
    if (question.type === "group") {

      // calc sum weight
      let sumWeight = 0;
      question.childrenQuestions.forEach(
        (child) => (sumWeight += child.parentQuestion.weight)//parentQuestion id objec has{child ID , weight}
      );
      // prepare children questions array
      let children = [];
      question.childrenQuestions.forEach((child) => {
        children.push({
          child: child.id,
          point: (child.parentQuestion.weight / sumWeight) * questions[i].point,
        });
      });
      // push to exam's questions
      exam.questions.push({
        question: question.id,
        point: questions[i].point,
        childrenQuestions: children,
      });
    } else {
      exam.questions.push({
        question: question.id,
        point: questions[i].point,
      });
    }
  }

  await exam.save();
  await models._exam.populate(exam, [
    "questions.question",
    "questions.childrenQuestions.child",
  ]);
  return APIResponse.Ok(res, exam);
});
