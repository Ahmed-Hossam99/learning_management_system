const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(

  async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const unite = await models.unite.findById(id).populate("class  section");
    if (!unite) return APIResponse.NotFound(res, "No unite WIth THat id");

    req.body.unite = id;
    req.body.subject = unite.subject
    const lesson = await new models.lesson(req.body).save();

    return APIResponse.Created(res, lesson);
  }
);
