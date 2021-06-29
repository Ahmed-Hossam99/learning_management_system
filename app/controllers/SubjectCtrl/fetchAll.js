const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
  [{ name: "icon", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const _class = await models.class.findById(id);
    if (!_class) return APIResponse.NotFound(res, "No Class WIth THat id");

    if (req.queryFilter.isAssigned) {
      req.queryFilter.teacher = { $exists: false };
      delete req.queryFilter.isAssigned;
    }

    const subjects = await models.subject.fetchAll(
      req.allowPagination,
      {
        ...req.queryFilter,
        class: id,
      },
      req.queryOptions
    );

    return APIResponse.Ok(res, subjects);
  }
);
