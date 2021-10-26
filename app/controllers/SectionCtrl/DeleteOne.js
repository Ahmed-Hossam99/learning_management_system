const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let section = await models.section.findById(id);
  if (!section) return APIResponse.NotFound(res, "No section with that id");

  await models.section.deleteOne(section);

  // here we will delete student related 

  return APIResponse.NoContent(res);
});
