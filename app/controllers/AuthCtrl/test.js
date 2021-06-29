const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");
const smsService = require("../../services/sms");
const bcrypt = require("bcryptjs");
const models = require("../../models");

module.exports = $baseCtrl(async (req, res) => {
  // Encrypt Password
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync("123456", salt);
  let admin = await new models.student({
    username: "Remah",
    password: hash,
    enabled: true,
    phone: '+201552619667'
  }).save();
  return APIResponse.Ok(res, admin);
});
