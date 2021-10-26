const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const lecture = await models.lecture.findById(id).populate(["subject"]);

  if (!lecture) return APIResponse.NotFound(res, "NO  lecture With That Id");

  return APIResponse.Ok(res, lecture);
});
