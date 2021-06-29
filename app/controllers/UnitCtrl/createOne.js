const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const course = await models._course.findById(id);
  if (!course) return APIResponse.NotFound(res, "No Course With That id");

  if (course.teacher !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont Allow To Do This Action");

  let type = req.body.type;
  if (!type) return APIResponse.BadRequest(res, "Type Of Unit Is Required");

  req.body.course = id;

  let unit = await new models._unit(req.body).save();

  return APIResponse.Created(res, unit);
});
