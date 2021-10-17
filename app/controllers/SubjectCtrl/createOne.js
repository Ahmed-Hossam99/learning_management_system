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
    const section = await models.section.findById(id).populate(['class']);//reemah
    // return APIResponse.Ok(res, section);
    if (!section) return APIResponse.NotFound(res, "No section WIth THat id");
    req.body.educationalSystem = section.educationalSystem
    req.body.level = section.class.level
    req.body.class = section.class.id
    req.body.section = id;

    if (req.files && req.files["icon"]) {
      req.body.icon = req.files["icon"][0].secure_url;
    }

    const subject = await new models.subject(req.body).save();
    await models.subject.populate(subject, [{ path: 'class', populate: { path: 'level', select: 'nameAr' } }, 'educationalSystem'])
    return APIResponse.Created(res, subject);
  }
);
