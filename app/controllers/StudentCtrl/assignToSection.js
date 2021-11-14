const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  // Check if E-mail Already Exist
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let user = await models.student.findById(id);
  if (!user) {
    return APIResponse.NotFound(res, "No Student With That Id");
  }
  let section = await models.section
    .findById(req.body.section)
    .populate("level");
  if (!section) return APIResponse.NotFound(res, "No Section with that id");

  if (section.current_capacity >= section.capacity)
    return res.status(400).json({ flag: 2 });

  let prevSection = await models.section
    .findById(user.section)
  user.level = section.level._id
  await user.set(req.body).save();
  if (prevSection.id !== req.body.section)
    prevSection.current_capacity--;
  if (prevSection.id !== req.body.section)
    section.current_capacity++;
  await section.save()
  await prevSection.save()
  return APIResponse.Ok(res, user);
});
