const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  // fetch specif level
  const level = await models.level.findById(id);
  if (!level) return APIResponse.NotFound(res, "No Level With That Id");
  await level.set(req.body).save();

  return APIResponse.Ok(res, level);
});
