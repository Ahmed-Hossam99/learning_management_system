const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
  [{ name: "pdf", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const lecture = await models.lecture.findById(id);
    if (!lecture) return APIResponse.NotFound(res, "NO lecture With That Id");

    const material = await models.material.fetchAll(
      req.allowPagination,
      {
        ...req.queryFilter,
        lecture: id,
      },
      req.queryOptions
    );

    return APIResponse.Ok(res, material);
  }
);
