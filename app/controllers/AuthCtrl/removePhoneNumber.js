const jwt = require("jsonwebtoken");
const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  await models._user.deleteOne({ phone: req.body.phone });
  return APIResponse.Ok(res, "OK");
});
