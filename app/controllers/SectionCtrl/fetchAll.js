const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  let systems = await models.section.fetchAll(
    req.allowPagination,
    req.queryFilter,
    req.queryOptions
  );
  return APIResponse.Ok(res, systems);
});
