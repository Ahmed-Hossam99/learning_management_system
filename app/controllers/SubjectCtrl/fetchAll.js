const models = require("../../models");
const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const level = await models.level.findById(id);
  if (!level) return APIResponse.NotFound(res, "No level With That Id");

  // remah ??
  if (req.queryFilter.isAssigned) {
    req.queryFilter.teacher = { $exists: false };
    delete req.queryFilter.isAssigned;
  }

  const subjects = await models.subject.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
      level: id,
      ...(req.me.role === "student" && {
        visibility: true,
      }),
    },
    {
      ...req.queryOptions,
      populate: [{ path: "teacher", select: "username photo" }],
    }
  );

  return APIResponse.Ok(res, subjects);
});
