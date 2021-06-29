const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const unit = await models._unit.findById(id);
  if (!unit) return APIResponse.NotFound(res, "No Unit with that id");
  
  return APIResponse.Ok(res, unit);
});
