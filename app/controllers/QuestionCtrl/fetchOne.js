const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const question = await models._question.findById(id).populate([
    { path: "subject", select: "nameAr nameEn" },
    { path: "unit", select: "nameAr nameEn" },
    { path: "object", select: "nameAr nameEn" },
    {
      path: "childrenQuestions",
      select:
        "head modelAnswer choices numberOfInputs attachment parentQuestion",
    },
  ]);
  if (!question) return APIResponse.NotFound(res, "No Question With That id");

  // Handle Authorization
  if (
    req.me.role === "teacher" &&
    req.me.subjects.indexOf(question.subject.id) === -1
  )
    return APIResponse.Forbidden(res, "Dont Allow To Do This Action");

  return APIResponse.Ok(res, question);
});
