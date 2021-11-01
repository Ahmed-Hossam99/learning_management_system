const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const CodeGenerator = require("node-code-generator");
const generator = new CodeGenerator();
const nodemailer = require("nodemailer");

// config gmail
const transproter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.email,
    pass: process.env.passGmail,
  },
});

module.exports = $baseCtrl(async (req, res) => {
  const user = await models._user.findOne({ email: req.body.email });
  if (!user) return APIResponse.NotFound(res);
  console.log("here")
  const newCode = generator.generateCodes("#+#+#", 100)[0];
  transproter.sendMail({
    to: req.body.email,
    from: process.env.email,
    subject: "verification code",
    text: ` your verification code is ${newCode}`,
  });
  console.log(newCode)
  // save user and send it
  user.code = newCode;
  await user.save();

  return APIResponse.NoContent(res);
});
