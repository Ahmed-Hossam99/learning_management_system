const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);

  const subject = await models.subject.findById(id);
  if (!subject) return APIResponse.NotFound(res, "No Subject With that id ");

  return APIResponse.Ok(res, subject);
});
