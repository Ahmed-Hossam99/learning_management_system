const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
  [{ name: "photo", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {

    const user = req.me;
    const id = parseInt(req.params.postId);
    if (isNaN(id)) return APIResponse.NotFound(res);
    const post = await models.post.findById(id);
    if (!post) return APIResponse.NotFound(res, "post not found");
    if (post.author !== user.id && req.me.role !== "admin")
      return APIResponse.Forbidden(res);

    let photos = [];
    photos = [...(req.body.oldImg ? req.body.oldImg : [])];
    if (req.files && req.files["photo"]) {
      for (let i = 0; i < req.files["photo"].length; i++) {
        photos.push(req.files["photo"][i].secure_url);
      }
      post.images = photos;
    }
    if (req.body.content) {
      post.content = req.body.content;
    }

    await post.save();

    return APIResponse.Created(res, post);
  }
);
