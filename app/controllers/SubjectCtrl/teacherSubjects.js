const models = require("../../models");
const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  let subjects = await models.subject.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
      _id: { $in: req.me.subjects },
    },
    {
      ...req.queryOptions,
      populate: {
        path: "level",
        select: "nameAr nameEn ",
      },
    }
  );

  return APIResponse.Ok(res, subjects);
});
