const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) return APIResponse.NotFound(res)
  let existClass = await models.class.findById(id);
  if (!existClass) return APIResponse.NotFound(res, 'No class With that id');
  req.body.class = id
  const newSection = await new models.section(req.body).save();
  return APIResponse.Created(res, newSection);
});
