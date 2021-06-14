const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let system = await models.system.findById(id);
  if (!system) return APIResponse.NotFound(res, "NO system With That Id");

  const levels = await models.level.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
      system: id,
    },
    req.queryOptions
  );

  return APIResponse.Ok(res, levels);
});
