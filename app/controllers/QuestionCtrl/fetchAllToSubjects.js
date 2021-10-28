const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const subject = await models.subject.findById(id);
  if (!subject) return APIResponse.NotFound(res, "NO Subject with that id");

  if (subject.teacher !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont allow to do this action");

  const lessons = await models._question.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
      isChild: false,
      subject: id,
    },
    {
      ...req.queryOptions,
      populate: [
        { path: "subject", select: "nameAr nameEn" },
        { path: "object", select: "nameAr nameEn" },
        {
          path: "childrenQuestions",
          select:
            "head modelAnswer choices numberOfInputs attachment parentQuestion image",
        },
      ],
    }
  );

  return APIResponse.Ok(res, lessons);
});
