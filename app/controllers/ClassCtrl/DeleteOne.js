const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);

  // catch specific class
  const Class = await models.class.findById(id);
  if (!Class) return APIResponse.NotFound(res);

  await models.subject.deleteMany({ class: id });

  // delete class
  await Class.delete();

  return APIResponse.NoContent(res);
});
