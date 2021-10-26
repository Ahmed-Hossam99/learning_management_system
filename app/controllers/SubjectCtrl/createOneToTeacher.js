const models = require("../../models");
const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
    [{ name: 'photo', maxCount: 1 }],
    cloudinaryStorage,
    async (req, res) => {
        const lid = parseInt(req.params.lid)
        if (isNaN(lid)) return APIResponse.NotFound(res);
        const tid = paseINt(req.params.tid)
        if (isNaN(tid)) return APIResponse.NotFound(res)
        const level = await models.level.findById(lid)
        if (!level) return APIResponse.NotFound(res, 'No level with that id !!')
        const teacher = await models.teacher.findById(tid)
        if (!teacher) return APIResponse.NotFound(res, 'No doctor with that id')

        req.body.level = lid
        req.body.teacher = tid
        // photo 
        if (req.files && req.files["photo"]) {
            req.body.photo = req.files["photo"][0].secure_url;
        }
        const subject = await new models.subject(req.body).save();

        if (t) { }

    }
)