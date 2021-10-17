const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const { escapeRegExp } = require("lodash");


module.exports = $baseCtrl(async (req, res) => {
  console.log(req.queryFilter)
  if (req.query.nameEn) {
    req.queryFilter['nameEn'] = new RegExp(
      escapeRegExp(req.query.nameEn),
      "i")
  }
  const classes = await models.educationalSystem.fetchAll(
    req.allowPagination,
    req.queryFilter,
    {
      ...req.queryOptions,
      // populate: [
      //   { path: 'class' },
      //   { path: "level", populate: { path: 'system' } }
      // ]

    }
  );

  return APIResponse.Ok(res, classes);
});
