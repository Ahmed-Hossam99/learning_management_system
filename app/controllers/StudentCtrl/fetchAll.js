const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {

  const classes = await models.educationalSystem.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
    },
    req.queryOptions
  );

  return APIResponse.Ok(res, classes);
});
