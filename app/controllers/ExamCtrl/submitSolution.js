const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");
const moment = require("moment");

module.exports = $baseCtrl(
  [{ name: "answerImage", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const exam = await models._exam
      .findById(id, {
        students: { $elemMatch: { student: req.me.id } },
        duration: 1,
        isTimed: 1,
      })
      .populate("students.solutions");
    if (!exam) return APIResponse.NotFound(res, "No Exam With That Id");
    const lastSolution =
      exam.students[0].solutions[exam.students[0].solutions.length - 1];//last solutions 
    // check timer
    if (exam.isTimed) {
      let remainingTime = moment(lastSolution.createdAt)
        .add(exam.duration, "m")
        .diff(moment.utc(), "s");
      if (remainingTime <= 0)
        return APIResponse.Forbidden(res, "Timer Is Finished");
    }

    const qid = parseInt(req.body.question);
    if (isNaN(qid)) return APIResponse.BadRequest(res);
    const question = await models._question.findById(qid);
    if (!question) return APIResponse.NotFound(res, "No Question with that id");

    // check if user upload photo for question
    if (req.files && req.files["answerImage"]) {
      req.body.answerImage = req.files["answerImage"][0].secure_url;
    }

    // await models.solution.bulkWrite([
    //   {
    //     updateOne: {
    //       filter: {
    //         student: req.me.id,
    //         status: "solving",
    //         exam: id,
    //         "questions.question": qid,
    //       },
    //       update: {
    //         $set: {
    //           ...(req.body.answer !== undefined && {
    //             "questions.$.answer": req.body.answer,
    //           }),
    //           ...(req.body.answerImage !== undefined && {
    //             "questions.$.answerImage": req.body.answerImage,
    //           }),
    //         },
    //       },
    //     },
    //   },
    //   {
    //     updateOne: {
    //       filter: {
    //         student: req.me.id,
    //         status: "solving",
    //         exam: id,
    //         "questions.question": { $ne: qid },
    //       },
    //       update: {
    //         $push: {
    //           question: qid,
    //           answer: req.body.answer,
    //           answerImage: req.body.answerImage,
    //           type: question.type,
    //         },
    //       },
    //     },
    //   },
    // ]);
    if (req.body.answer !== undefined)
      req.body.answer =
        question.type === "truefalse"
          ? req.body.answer === "true"
          : question.type === "choose"
            ? parseInt(req.body.answer)
            : req.body.answer;

    await models.solution.updateOne(
      {
        student: req.me.id,
        status: "solving",
        exam: id,
      },
      [
        { // first pip    to check if qestion exist or not 
          $set: {//update questions 
            questions: {
              $reduce: { // "$questions" from solution schema 
                input: { $ifNull: ["$questions", []] },//if have questions array that's return else return []
                initialValue: { Questions: [], update: false }, //Questions new array 
                in: { //for looping 
                  $cond: [
                    { $eq: ["$$this.question", qid] }, // current question  === qid
                    { // true case enter here exist question 
                      Questions: {
                        $concatArrays: [
                          "$$value.Questions", // اللي بجمع عليه == value 
                          [
                            { // exist question and update his solution 
                              question: "$$this.question",
                              type: "$$this.type",
                              answer:
                                req.body.answer !== undefined
                                  ? req.body.answer
                                  : "$$this.answer",
                              answerImage:
                                req.body.answerImage !== undefined
                                  ? req.body.answerImage
                                  : "$$this.answerImage",
                            },
                          ],
                        ],
                      },
                      update: true,
                    },
                    {//  flase case enter here 
                      Questions: { //push new question in questions
                        $concatArrays: ["$$value.Questions", ["$$this"]],
                      },
                      update: "$$value.update", //false 
                    },
                  ],
                },
              },
            },
          },
        },
        { //second pip 
          $set: {
            questions: {
              $cond: [
                { $eq: ["$questions.update", false] },
                { //true case non exist so we will push
                  $concatArrays: [
                    "$questions.Questions",
                    [
                      { //new data of suolution 
                        question: qid,
                        type: question.type,
                        answer: req.body.answer,
                        answerImage: req.body.answerImage,//why this 
                      },
                    ],
                  ],
                }, //false exist befor and already update it in first pipline   
                { $concatArrays: ["$questions.Questions", []] },
              ],
            },
          },
        },
      ]
    );

    return APIResponse.Ok(res, "OK");
  }
);
