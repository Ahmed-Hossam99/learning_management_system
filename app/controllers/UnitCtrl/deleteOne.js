const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const unit = await models._unit.findById(id).populate("course");
  if (!unit) return APIResponse.NotFound(res, "No Unit with that id");

  if (unit.course.teacher !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont Allow To Do This Action");

  // delete all lessons
  await models.lesson.deleteMany({ unit: id });

  await unit.delete();

  return APIResponse.NoContent(res);
});
