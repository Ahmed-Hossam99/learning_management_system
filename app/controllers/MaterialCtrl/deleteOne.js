const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const material = await models.material.findById(id);
  if (!material) return APIResponse.NotFound(res, "NO material With That Id");

  if (material.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res);

  await material.delete();

  return APIResponse.NoContent(res);
});
