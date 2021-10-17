const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);

  const eduSysem = await models.educationalSystem.findById(id);
  if (!eduSysem) return APIResponse.NotFound(res, "No educational Sysem with that id");
  return APIResponse.Ok(res, eduSysem);
});
