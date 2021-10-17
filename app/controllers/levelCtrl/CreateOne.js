const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const newLevel = await new models.level(req.body).save();
  return APIResponse.Created(res, newLevel);
});
