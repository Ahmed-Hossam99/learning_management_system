const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  // fetch specific class by id
  const eduSystem = await models.educationalSystem.findById(id);
  if (!eduSystem) return APIResponse.NotFound(res);
  // delete req.body.level;
  // save changes
  await eduSystem.set(req.body).save();

  return APIResponse.Ok(res, eduSystem);
});
