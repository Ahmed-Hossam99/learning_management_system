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
    const material = await models.material.findById(id);
    if (!material) return APIResponse.NotFound(res, "NO material With That Id");

    if (material.addedBy !== req.me.id && req.me.role !== "admin")
      return APIResponse.Forbidden(res);

    delete req.body.lecture;

    if (req.body.type === "pdf") {
      if (req.files && req.files["pdf"]) {
        // check file type :
        // if (req.files["pdf"][0].mimetype !== "application/pdf")
        //   return APIResponse.BadRequest(res, "You Can Upload PDF File only");
        req.body.link = req.files["pdf"][0].secure_url;
      } else {
        return APIResponse.BadRequest(res, "No pdf files uploaded");
      }
    } else if (req.body.type === "video") {
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
    if (req.files && req.files["videoPhoto"]) {
      console.log(req.body);
      req.body.videoPhoto = req.files["videoPhoto"][0].secure_url;
    }
    await material.set(req.body).save();

    return APIResponse.Ok(res, material);
  }
);
