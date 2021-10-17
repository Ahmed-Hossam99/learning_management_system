const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const subject = await models.subject.findById(id);
  if (!subject) return APIResponse.NotFound(res, "No subject With That id");

  if (subject.teacher !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont Allow To Do This Action");

  // let type = req.body.type;
  // if (!type) return APIResponse.BadRequest(res, "Type Of Unit Is Required");

  req.body.subject = id;

  let unit = await new models.unite(req.body).save();

  return APIResponse.Created(res, unit);
});
