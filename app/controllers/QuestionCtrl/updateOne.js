const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
  [
    { name: "image", maxCount: 1 },
    { name: "modelAnswer", maxCount: 1 },
    { name: "attachment", maxCount: 1 },
  ],
  cloudinaryStorage,
  async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const question = await models._question.findById(id);
    if (!question) return APIResponse.NotFound(res);

    // Handle Authorization
    if (req.me.role !== "admin" && question.addedBy !== req.me.id)
      return APIResponse.Forbidden(res, "Dont Allow To Do This Action");

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

    delete req.body.addedBy;
    delete req.body.object;
    delete req.body.objectType;
    delete req.body.subject;
    delete req.body.type;

    await question.set(req.body).save();

    return APIResponse.Ok(res, question);
  }
);
