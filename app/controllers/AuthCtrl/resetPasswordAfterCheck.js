const jwt = require("jsonwebtoken");
const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const bcrypt = require("bcryptjs");

// [TODO] refactor this with html page
module.exports = $baseCtrl(async (req, res) => {
  const phone = req.body.phone;

  if (!req.body.password)
    return APIResponse.BadRequest(res, "Password is required");

  let user = await models._user.findOne({ phone });
  if (!user.isAllowedToResetPassword)
    return APIResponse.Forbidden(res, "You dont allow to reset password");
  // Encrypt Password
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hash;

  await user
    .set({ password: req.body.password, isAllowedToResetPassword: false })
    .save();

  const payload = { userId: user.id, userRole: user.role };
  const options = {};
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  const response = {
    token: token,
    user: user,
  };

  return APIResponse.Ok(res, response);
});
