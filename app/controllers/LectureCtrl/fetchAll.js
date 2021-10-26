const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const subject = await models.subject.findById(id);
  if (!subject) return APIResponse.NotFound(res, "NO subject With That Id");

  const lectures = await models.lecture.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
      subject: id,
    },
    req.queryOptions
  );

  return APIResponse.Ok(res, lectures);
});
