const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const bcrypt = require("bcryptjs");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
  [{ name: "photo", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    // Check if E-mail Already Exist
    let user;
    if (req.body.phone) {
      user = await models._user.findOne({
        $or: [{ email: req.body.email }, { phone: req.body.phone }],
      });
    } else {
      user = await models._user.findOne({
        email: req.body.email,
      });
    }
    if (user) return APIResponse.BadRequest(res, { msg: " Email/phone Already in use .", })

    // Encrypt Password
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
    req.body.enabled = true;
    // Upload photo if enter by user
    if (req.files && req.files["photo"]) {
      req.body.photo = req.files["photo"][0].secure_url;
    }
    // save user to db
    const newUser = await new models.teacher(req.body).save();

    return APIResponse.Created(res, newUser);
  }
);
