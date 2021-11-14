const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  console.log(req.queryFilter)
  if (req.query.level) {
    req.queryFilter['level'] = parseInt(req.query.level)
  }

  console.log(req.queryFilter)

  let students = await models.student.fetchAll(
    req.allowPagination,
    req.queryFilter,
    {
      ...req.queryOptions,
      populate: ["section", "level"],
    }
  );
  return APIResponse.Ok(res, students);
});
