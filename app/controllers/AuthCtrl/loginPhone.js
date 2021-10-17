const jwt = require("jsonwebtoken");
const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const bcrypt = require("bcryptjs");

module.exports = $baseCtrl(async (req, res) => {
  // Check if values not entered by user
  if (req.body.phone === undefined || req.body.password === undefined) {
    return APIResponse.BadRequest(res, "You have to fill all options");
  }

  // check if phone already exist
  const user = await models._user.findOne({ phone: req.body.phone });
  if (!user) {
    return APIResponse.Unauthorized(res, "Invalid phone or password 1");
  }
  // check if password correct
  if (!user.password)
    return APIResponse.Unauthorized(res, "This user login by socialMedia");
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return APIResponse.Unauthorized(res, "Invalid phone or password 2");
  }

  // if user not enter code , his email still disabled
  if (!user.enabled) {
    return APIResponse.Unauthorized(res, "Your account is disabled");
  }

  let payload = { userId: user.id, userRole: user.role };
  let options = {};
  let token = jwt.sign(payload, process.env.JWT_SECRET, options);

  const response = {
    token: token,
    user: user,
  };
  // for social media login 
  if (!user.used) {
    user.used = true;
    await user.save();
  }

  return APIResponse.Ok(res, response);
});
