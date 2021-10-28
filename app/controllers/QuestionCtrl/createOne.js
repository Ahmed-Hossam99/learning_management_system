const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require('../../services/cloudinaryStorage')
module.exports = $baseCtrl(
    [
        { name: "image", maxCount: 1 },
        { name: "modelAnswer", maxCount: 1 },
        { name: "attachment", maxCount: 1 },
    ],
    cloudinaryStorage,
    async (req, res) => {
        const routePath = req.route.path.split("/");
        console.log(routePath[1])
        const objectType = routePath[1] === 'lecture' ? 'lecture' : 'other'
        const id = parseInt(req.params.id)
        if (isNaN(id)) return APIResponse.NotFound(res)
        console.log(objectType)

        // object  = type  of question ref ex => lesson / ..... 
        const object = await models[objectType].findById(id).populate("subject");
        if (!object) return APIResponse.NotFound(res, `No ${objectType} With that id`);
        const subject = objectType === 'lecture' ? object.subject.id : null;
        const user = req.me;
        // Handle Authorization
        if (objectType === "lecture") {
            if (req.me.role === "teacher" && req.me.subjects.indexOf(subject) === -1)
                return APIResponse.Forbidden(res, "Dont Allow To Do This Action");
        }
        // check if user upload photo for question
        if (req.files && req.files["image"]) {
            req.body.image = req.files["image"][0].secure_url;
        }
        // check if user upload photo for modelAnswer
        if (req.files && req.files["modelAnswer"]) {
            req.body.modelAnswer = req.files["modelAnswer"][0].secure_url;
        }
        // check if user upload file for voice question
        if (req.files && req.files["attachment"]) {
            if (!req.files["attachment"][0].mimetype.includes("audio"))
                return APIResponse.BadRequest(res, "You Can Upload Audio File only");
            req.body.attachment = req.files["attachment"][0].secure_url;
        }

        let question = req.body
        question.addedBy = user.id
        question.object = id
        question.objectType = objectType
        question.subject = subject;
        let type = question.type;
        if (!type)
            return APIResponse.BadRequest(res, "Type of question is required .");
        const newQuestion = await new models[type](question).save();
        return APIResponse.Created(res, newQuestion);
    });
