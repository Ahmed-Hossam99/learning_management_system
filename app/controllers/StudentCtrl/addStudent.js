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
        let section = await models.section
            .findById(req.body.section)
            .populate(['level']);

        if (!section) return APIResponse.NotFound(res, 'No section with that id ');
        // check capacity of section
        if (section.current_capacity === section.capacapacity || section.current_capacity >= section.capacapacity) return APIResponse.BadRequest(res, 'section capacity is full ')
        //    handel extra data
        console.log(section.educationalSystem)
        req.body.level = section.level
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;
        req.body.enabled = true;
        //upload image by user 
        if (req.files && req.files["photo"]) {
            req.body.photo = req.files["photo"][0].secure_url;
        }
        const newStudent = await new models.student(req.body).save()
        section.current_capacity = section.current_capacity + 1
        console.log(section.current_capacity)
        await section.save()
        return APIResponse.Created(res, newStudent)
    })
