const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  let teachers = await models.teacher.fetchAll(
    req.allowPagination,
    req.queryFilter,
    {
      ...req.queryOptions,
      select: "username photo email phone",
    }
  );
  return APIResponse.Ok(res, teachers);
});
