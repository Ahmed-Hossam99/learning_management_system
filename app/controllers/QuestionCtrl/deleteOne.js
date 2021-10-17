const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require("lodash");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const question = await models._question.findById(id);
  if (!question) return APIResponse.NotFound(res);

  if (question.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont Allow To Do This Action");

  // child question
  if (question.parentQuestion.question !== undefined) {
    // remove from parent question
    let parent = await models._question.findById(
      question.parentQuestion.question
    );
    if (!parent) return APIResponse.NotFound(res, "Parent Question Removed");
    let key = parent.childrenQuestions.indexOf(id);
    parent.childrenQuestions.splice(key, 1);
    await parent.save();
    // remove from all childrenQuestions exams
    let exams = await models._exam.find({
      "questions.childrenQuestions.child": id,
    });
    for (let i = 0; i < exams.length; i++) {
      let keyParent = _.findKey(exams[i].questions, { question: parent.id });
      let keyChild = _.findKey(
        exams[i].questions[keyParent].childrenQuestions,
        { child: id }
      );
      exams[i].questions[keyParent].point -=
        exams[i].questions[keyParent].childrenQuestions[keyChild].point;
      exams[i].questions[keyParent].childrenQuestions.splice(keyChild, 1);
      await exams[i].save();
    }
  } else {
    // let exams = await models._exam.find({
    //   "questions.question": question.id,
    // });
    // for (let i = 0; i < exams.length; i++) {
    //   let key = _.findKey(exams[i].questions, {
    //     question: question.id,
    //   });
    //   if (key === undefined) continue;
    //   exams[i].questions.splice(key, 1);
    //   await exams[i].save();
    // }
    await models._exam.updateMany(
      {
        "questions.question": id,
      },
      { $pull: { questions: { question: id } } }
    );
  }
  // let solutions = await models.solution.find({
  //   "questions.question": question.id,
  // });
  // for (let i = 0; i < solutions.length; i++) {
  //   let key = _.findKey(solutions[i].questions, {
  //     question: question.id,
  //   });
  //   if (key === undefined) continue;
  //   solutions[i].questions.splice(key, 1);
  //   await solutions[i].save();
  // }
  if (question.type !== "group") {
    await models.solution.updateMany(
      {
        "questions.question": id,
      },
      { $pull: { questions: { question: id } } }
    );
  } else {
    await models.solution.updateMany(
      {
        "questions.question": { $in: question.childrenQuestions },
      },
      {
        $pull: { questions: { question: { $in: question.childrenQuestions } } },
      }
    );
  }

  await question.delete();

  return APIResponse.NoContent(res);
});
