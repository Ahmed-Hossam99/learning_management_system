const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let section = await models.section.findById(id);
  if (!section) return APIResponse.NotFound(res, "No system with that id ");

  await section.set(req.body).save();

  return APIResponse.Ok(res, section);
});
