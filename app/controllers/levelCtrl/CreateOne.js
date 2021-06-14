const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let systemDetails = await models.system.findById(id);
  if (!systemDetails)
    return APIResponse.NotFound(res, "NO System With That Id");
  req.body.system = id;
  // create new level
  const newLevel = await new models.level(req.body).save();

  return APIResponse.Created(res, newLevel);
});
