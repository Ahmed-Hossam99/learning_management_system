const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require("lodash");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let teacher = await models.teacher.findById(id);
  if (!teacher) {
    return APIResponse.NotFound(res, "No teacher With That Id");
  }

  await models.subject.updateMany(
    { _id: { $in: req.body.subjects } },
    {
      $set: {
        teacher: id,
      },
    }
  );

  return APIResponse.Ok(res);
});
