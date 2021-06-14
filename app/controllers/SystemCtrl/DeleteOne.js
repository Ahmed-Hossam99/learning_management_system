const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let system = await models.system.findById(id);
  if (!system) return APIResponse.NotFound(res, "No system with that id");

  await models.level.deleteMany({ system: id });

  await system.delete();

  return APIResponse.NoContent(res);
});
