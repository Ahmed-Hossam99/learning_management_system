const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");
const bcrypt = require("bcryptjs");

module.exports = $baseCtrl(
  [{ name: "photo", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const user = await models._user.findById(id);
    if (!user) return APIResponse.NotFound(res, "No User with that id");

    let query = {};
    query._id = { $ne: id };
    if (req.body.phone && req.body.email) {
      query.$or = [{ email: req.body.email }, { phone: req.body.phone }];
    } else if (req.body.phone) {
      query.phone = req.body.phone;
    } else if (req.body.email) {
      query.email = req.body.email;
    }

    // Check if phone/email Already Exist
    if (req.body.phone || req.body.email) {
      const prevUser = await models._user.findOne(query);
      if (prevUser) {
        return APIResponse.BadRequest(res, " phone/Email Already in use .");
      }
    }

    if (req.body.password) {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.body.password, salt);
      req.body.password = hash;
    }

    // Upload photo if enter by user
    if (req.files && req.files["photo"]) {
      req.body.photo = req.files["photo"][0].secure_url;
    }

    delete req.body.subjects;
    delete req.body.students;
    delete req.body.sections;
    delete req.body.classes;
    delete req.body.section;
    delete req.body.class;
    delete req.body.level;
    delete req.body.system;
    delete req.body.role;
    delete req.body.code;
    delete req.body.pushTokens;
    // save user to dbs
    await user.set(req.body).save();

    return APIResponse.Ok(res, user);
  }
);
