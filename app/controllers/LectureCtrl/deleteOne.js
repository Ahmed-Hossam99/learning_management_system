const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const lecture = await models.lecture.findById(id);
  if (!lecture) return APIResponse.NotFound(res, "No lecture With That Id");

  if (lecture.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res);

  // await models.material.deleteMany({ lesson: id });
  await lecture.delete();

  return APIResponse.NoContent(res);
});
