const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const smsService = require("../../services/sms");

module.exports = $baseCtrl(async (req, res) => {
  // retreive specific user by phone
  const user = await models._user.findOne({ phone: req.body.phone });
  if (!user) return APIResponse.NotFound(res, "User Not Found");

  if (req.body.phone === undefined || req.body.code === undefined) {
    return APIResponse.BadRequest(res, "Phone / code is required");
  }

  if (!req.body.phone.match(/^\+201[0125][0-9]{8}$/))
    return APIResponse.BadRequest(res, "Phone is invailed");

  // check if code which send to user is equal to code which entered by him
  var verificationResult = await smsService.verificationCode(
    req.body.phone,
    req.body.code
  );
  if (verificationResult.status !== "approved")
    return APIResponse.BadRequest(res, "Code is invailed");

  await user.set({ enabled: true }).save();

  return APIResponse.Ok(res, user);
});
