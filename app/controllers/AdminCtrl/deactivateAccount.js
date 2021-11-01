const models = require("../../models");
const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const user = await models._user.findById(id)
  if(!user) return APIResponse.NotFound(res,'No User With that id')

  user.enabled = req.body.enabled

  await user.save()

  return APIResponse.Ok(res,user)
});
