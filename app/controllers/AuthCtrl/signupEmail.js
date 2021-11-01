const jwt = require("jsonwebtoken");
const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const bcrypt = require("bcryptjs");
const CodeGenerator = require("node-code-generator");
const generator = new CodeGenerator();
const nodemailer = require("nodemailer");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

// config gmail
const transproter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.email,
    pass: process.env.passGmail,
  },
});

module.exports = $baseCtrl(
  [{ name: "photo", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    req
      .checkBody("email")
      .notEmpty()
      .withMessage("Email field is required")
      .isEmail()
      .withMessage("Please write email in right format");
    let errorsCheck = req.validationErrors();
    if (errorsCheck) {
      return APIResponse.UnprocessableEntity(res, errorsCheck[0].msg);
    }

    // Check if values not entered
    if (
      req.body.username === undefined ||
      req.body.password === undefined ||
      req.body.email === undefined

    ) {
      return APIResponse.BadRequest(res, "You have to fill all options .");
    }

    // Check if E-mail Already Exist
    let user = await models._user.findOne({ email: req.body.email });
    if (user) {
      return APIResponse.BadRequest(res, " Email Already in use .");
    }

    // Check if phone Already Exist
    if (req.body.phone) {
      let existPhone = await models._user.findOne({ phone: req.body.phone });
      if (existPhone) {
        return APIResponse.BadRequest(res, " phone Already in use .");
      }
    }

    // Encrypt Password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    // Upload photo if enter by user
    if (req.files && req.files["photo"]) {
      req.body.photo = req.files["photo"][0].secure_url;
    }

    if (req.authenticatedUser) {
      if (req.authenticatedUser.role === "admin" && req.body.role === "teacher")
        req.body.enabled = true;
      else
        return APIResponse.Forbidden(
          res,
          "Your role dont allow you to add teacher "
        );
    } else {
      // generate random code ***** , and send to user
      const newCode = generator.generateCodes("#+#+#", 100)[0];
      req.body.code = newCode;
      transproter.sendMail({
        to: req.body.email,
        from: process.env.email,
        subject: "verification code",
        text: ` your verification code is ${newCode}`,
      });
    }
    // save user to db
    const newUser = await new models._user(req.body).save();

    const payload = {
      userId: newUser.id,
      userRole: newUser.role,
      enabled: newUser.enabled,
    };
    const options = {};
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);

    const response = {
      token: token,
      user: newUser,
    };

    return APIResponse.Created(res, response);
  }
);
