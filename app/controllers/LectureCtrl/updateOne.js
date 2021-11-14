const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const lecture = await models.lecture.findById(id);
  if (!lecture) return APIResponse.NotFound(res, "No lecture With That Id");
  console.log(lecture.addedBy)
  console.log(req.me.id)
  if (lecture.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res);

  delete req.body.subject;
  delete req.body.addedBy;

  await lecture.set(req.body).save();

  return APIResponse.Ok(res, lecture);
});
