const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
  [{ name: "icon", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const _class = await models.class.findById(id);
    if (!_class) return APIResponse.NotFound(res, "No Class WIth THat id");

    req.body.class = id;

    if (req.files && req.files["icon"]) {
      req.body.icon = req.files["icon"][0].secure_url;
    }

    const subject = await new models.subject(req.body).save();

    return APIResponse.Created(res, subject);
  }
);
