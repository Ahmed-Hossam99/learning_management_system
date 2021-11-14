const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(

  async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const unite = await models.subject.findById(id).populate("class  section");
    if (!unite) return APIResponse.NotFound(res, "No unite WIth THat id");

    req.body.subject = id
    req.body.addedBy = req.me.id
    const lecture = await new models.lecture(req.body).save();

    return APIResponse.Created(res, lecture);
  }
);
