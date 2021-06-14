const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);

  const Class = await models.class.findById(id);
  if (!Class) return APIResponse.NotFound(res, "No class with that id");
  return APIResponse.Ok(res, Class);
});
