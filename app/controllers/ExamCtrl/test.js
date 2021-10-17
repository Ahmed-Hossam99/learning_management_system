const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");
const moment = require("moment");

module.exports = $baseCtrl(
    [{ name: "answerImage", maxCount: 1 }],
    cloudinaryStorage,
    async (req, res) => {
        const id = +parseInt(req.params.id)
        if (isNAN(id)) return APIResponse.NotFound(res)
        const exam = await models._exam.findById(id, {
            students: { $elemMatch: { student: req.me.id } },
            duration: 1,
            isTimed: 1
        })
            .populate('students.solutions')

        if (!exam) return APIResponse.NotFound(res, 'no exam with that id ')

        // now i have exam and solutions has status solving , done  about this student 
        const lastSolution =
            exam.students[0].solutions[exam.students[0].solutions.length - 1] //catch last solution from array solutions
        if (exam.isTimed) {
            let remaningTime = moment(lastSolution.createdAt)
                .add(exam.duration, 'm')//how many exam time in minite
                .diff(moment.utc(), 's'); // return remainiong time after operations 
            if (remaningTime <= 0)
                return APIResponse.Forbidden(res, 'timer is finish ')
        }
        qid = parseInt(req.body.question);
        const question = await models._question.findById(qid)
        if (!question) return APIResponse.NotFound(res, ' no question with that id ')

        if (req.files && req.files['answerImage']) {
            req.body.answerImage = req.files['answerImage'][0].secure_url
        }
        if (req.body.answer !== undefined)
            req.body.answer =
                question.type === "truefalse" && typeof req.body.answer === 'string'
                    ? req.body.answer === 'true' //this line if answer = true store it else  store false 
                    : question.type === 'choose'
                        ? parseInt(req.body.answer)
                        : req.body.answer
        // update exam solution 
        await models.solution.updateOne(
            {
                student: req.me.id,
                status: 'solving',
                exam: id
            },
            [ //update with aggrigation piplimes we have two pipline 
                {
                    $set: {
                        questions: {

                            $reduce: {
                                input: { $ifNull: ['$questions', []] },
                                initialValue: { concatArr: [], update: false },
                                in: { //loop in questions and acces questin feild 
                                    $cond: [
                                        // expression 
                                        { $eq: ['$$this.question', qid] },
                                        {
                                            // true case 
                                            concatArr: {
                                                $concatArrays: [
                                                    "$$value.concatArr", // first array 
                                                    [//second array
                                                        {
                                                            question: '$$this.question',
                                                            type: 'this.type',
                                                            answer:
                                                                req.body.answer !== undefined
                                                                    ? req.body.answer : '$$this.answer',
                                                            answerImage:
                                                                req.body.answerImage !== undefined
                                                                    ? req.body.answerImage
                                                                    : '$$this.answerImage',
                                                        },
                                                    ],
                                                ],
                                            },
                                            update: true,
                                        },
                                        { //false case 
                                            concateArr: {
                                                $concatArrays: [
                                                    '$$value.concatArr', ['$$this']

                                                ],
                                            },
                                            update: '$$value.update',
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $set: {
                        questions:
                        {
                            $cond: [
                                { $eq: ['$questions.update', false] },
                                { //true case 
                                    $concatArrays: [
                                        '$questions.concatArr', //  first array empty array 
                                        [
                                            {
                                                question: qid,
                                                type: question.type,
                                                answer: req.body.answer,
                                                answerImage: req.body.answerImage,
                                            },
                                        ],
                                    ],

                                },
                                {//false case 
                                    $concatArrays: ["$questions.concatArr", []]
                                },
                            ],
                        },
                    },
                },


            ]
        );
        return APIResponse.Ok(res, "OK");
    }
);
