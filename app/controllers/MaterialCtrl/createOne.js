const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
    [
        { name: "pdf", maxCount: 1 },
        { name: "video", maxCount: 1 },
        { name: "videoPhoto", maxCount: 1 },
    ],
    cloudinaryStorage,
    async (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return APIResponse.NotFound(res);
        const lesson = await models.lesson.findById(id);
        if (!lesson) return APIResponse.NotFound(res, "NO Lesson With That Id");
        //only admin can add leson && material 
        if (lesson.addedBy !== req.me.id && req.me.role !== "admin")
            return APIResponse.Forbidden(res);

        req.body.addedBy = req.me.id;
        req.body.lesson = id;
        // add PDF
        if (req.body.type === "pdf") {
            if (req.files && req.files["pdf"]) {
                req.body.link = req.files["pdf"][0].secure_url;
            } else {
                return APIResponse.BadRequest(res, "No pdf files uploaded");
            }
            // add Video
        } else if (req.body.type === "video") {
            // check content of video timing 
            if (req.body.content === undefined) {
                return APIResponse.BadRequest(res, "Content is required");
            }  //upload video cover
            if (req.files && req.files["videoPhoto"]) {
                req.body.videoPhoto = req.files["videoPhoto"][0].secure_url;
            } else {
                return APIResponse.BadRequest(res, "No videoPhoto files uploaded");
            }
            if (req.files && req.files["video"]) {
                // check file type :
                if (!req.files["video"][0].mimetype.includes("video"))
                    return APIResponse.BadRequest(res, "You Can Upload Video File only");
                req.body.link = req.files["video"][0].secure_url;
            } else {
                if (req.body.link === undefined) {
                    return APIResponse.BadRequest(res, "Video link is required");
                }
            }
        }
        const material = await new models.material(req.body).save();

        return APIResponse.Created(res, material);
    }
);
