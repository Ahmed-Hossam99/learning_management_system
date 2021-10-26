const models = require("../../models");
const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const subjects = await models.subject.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
      level: req.me.level,
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
