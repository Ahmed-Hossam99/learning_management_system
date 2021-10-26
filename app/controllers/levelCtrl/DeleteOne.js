const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  // fetch specific level by id
  const level = await models.level.findById(id);
  if (!level) return APIResponse.NotFound(res, "NO Level With That Id");

  await models.section.deleteMany({ level: id });

  await level.delete();

  return APIResponse.NoContent(res);
});
