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

    const subject = await models.subject.findById(id);
    if (!subject) return APIResponse.NotFound(res, "No Subject With that id ");

    if (req.files && req.files["icon"]) {
      req.body.icon = req.files["icon"][0].secure_url;
    }

    delete req.body.class;

    await subject.set(req.body).save();

    return APIResponse.Ok(res, subject);
  }
);
