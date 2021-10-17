const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require("lodash");
const moment = require("moment");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const exam = await models._exam
    .findById(id)
    .select("-students")
    .populate(["questions.question", "questions.childrenQuestions.child"]);
  if (!exam) return APIResponse.NotFound(res, "No exam with that id");

  let examObj = {};
  exam.questions.forEach((q) => {
    if (q.question.type === "group") {
      examObj[q.question.id] = {}; //   ===   { '1': {} ,'2':{} } }
      q.childrenQuestions.forEach((chq) => {
        // { parentID'1': { childID'1':{questionID} ,'2':{question} } } 
        examObj[q.question.id][chq.child.id] = chq;
      });
    } else {
      examObj[q.question.id] = q;  //{ '1': {} ,'2':{}  }
    }
  });
  // return exam object here 
  let solution = await models.solution
    .findOne({
      student: req.me.id,
      exam: id,
      status: "solving",
    })
    .populate("questions.question");
  if (!solution)
    return APIResponse.NotFound(
      res,
      "no solution to that exam and that student"
    );

  let requireChecking = false;
  solution.questions.forEach((obj) => {
    if (obj.question.type === "truefalse" || obj.question.type === "choose") {

      if (obj.question.parentQuestion.question !== undefined) {//child  
        if (//{ '1': {'5':{question} ,'9':{question} } } 
          examObj[obj.question.parentQuestion.question][obj.question.id].child
            .modelAnswer === obj.answer //.modelAnswer in exam model , obj.answer in solution model
        ) {
          obj.correct = true;
          obj.mark =
            examObj[obj.question.parentQuestion.question][
              obj.question.id
            ].point;//from exam model 
        } else obj.correct = false;
      } else {
        // checking T ,F   &&  MCQ without parent question 
        if (examObj[obj.question.id].question.modelAnswer === obj.answer) {
          obj.correct = true;
          obj.mark = examObj[obj.question.id].point;
        } else obj.correct = false;
      }
    } else requireChecking = true;
  });
  if (requireChecking) solution.status = "checking";
  else solution.status = "done";
  solution.submittedAt = moment.utc();
  await solution.save();

  // checking solution
  if (solution.status === "checking") {
    // send notification to teacher
    return APIResponse.NoContent(res);
  }

  // done solution
  // let percentage = (solution.mark / exam.points) * 100;
  return APIResponse.Ok(res, {
    mark: solution.mark,
    points: exam.points
  });
});
