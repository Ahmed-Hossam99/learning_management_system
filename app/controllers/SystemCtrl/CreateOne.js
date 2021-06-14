const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  // create system
  const newSystem = await new models.system(req.body).save();
  return APIResponse.Created(res, newSystem);
});
