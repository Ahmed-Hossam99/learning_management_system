const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const course = await models._course.findById(id);
  if (!course) return APIResponse.NotFound(res, "No Course With That id");

  const units = await models._unit.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
      course: id,
    },
    req.queryOptions
  );

  return APIResponse.Ok(res, units);
});
