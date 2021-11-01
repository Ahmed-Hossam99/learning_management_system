const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const exam = await models.generalExam.findById(id).select("-students");
  if (!exam) return APIResponse.NotFound(res, "No General exam with that id");
  //check Auth
  if (exam.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont allow to do this action");

  await models.solution.deleteMany({ exam: id });
  await exam.delete();

  return APIResponse.NoContent(res);
});
