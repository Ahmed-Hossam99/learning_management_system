const $baseCtrl = require('../$baseCtrl')
const models = require('../../models')
const { APIResponse } = require('../../utils')
const bcrypt = require("bcryptjs");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
    [{ name: "photo", maxCount: 1 }],
    cloudinaryStorage,
    async (req, res) => {
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
        if (req.body.students) {
            //set used to guarenty that uniqe value is inserted in arrray 
            req.body.students = [...new Set(req.body.students)];
        }
        //    handel extra data
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;
        req.body.enabled = true;
        //upload image by user 
        if (req.files && req.files["photo"]) {
            req.body.photo = req.files["photo"][0].secure_url;
        }
        const newParent = await new models.parent(req.body).save()
        return APIResponse.Created(res, newParent)
    })
