const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const exam = await models._exam.findById(id).select("-students");
  if (!exam) return APIResponse.NotFound(res, "No exam with that id");

  if (exam.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont allow to do this action");

  let allSolutions = await models.solution.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
      exam: id,
      status: "checking",
    },
    {
      ...req.queryOptions,
      populate: [
        { path: "student", select: "username photo phone email" },
        {
          path: "questions.question",
          select:
            "head modelAnswer choices numberOfInputs attachment parentQuestion image",
        },
      ],
    }
  );
  let solutions = req.allowPagination
    ? res.toJSON(allSolutions.docs)
    : res.toJSON(allSolutions);
  for (let i = 0; i < solutions.length; i++) {
    let solution = solutions[i];
    let questions = [];
    for (let j = 0; j < solution.questions.length; j++) {
      let q = solution.questions[j];
      if (q.correct === null) questions.push(q);
    }
    solution.questions = questions;
  }
  if (req.allowPagination) {
    allSolutions.docs = solutions;
    return APIResponse.Ok(res, allSolutions);
  }
  return APIResponse.Ok(res, solutions);
});
