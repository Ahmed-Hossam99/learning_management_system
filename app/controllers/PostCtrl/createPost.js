const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
  [{ name: "photo", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    const user = req.me;
    // fetch type of creation
    let type =
      req.params.postId || req.params.materialId // in case you create comment on material/post
        ? "comment"
        : req.params.commentId // in case you create reply on comment
          ? "reply"
          : "post"; // in case you create post on subject discussion / on fly 'ogrty'
    let model = req.params.materialId
      ? "material"
      : req.params.courseId
        ? "course"
        : "post";
    let id =
      parseInt(req.params.materialId) || // in case you create comment on material
      parseInt(req.params.postId) || // in case you create comment on post
      parseInt(req.params.commentId) || // in case you create reply on comment
      null; // in case you create post in ogrty
    let post = null;
    if (id) {
      post = await models[model].findById(id);
      if (!post) return APIResponse.NotFound(res, `No ${model} with that id`);
    }
    let photos = [];
    if (req.files && req.files["photo"]) {
      for (let i = 0; i < req.files["photo"].length; i++) {
        photos.push(req.files["photo"][i].secure_url);
      }
    }

    let createdPost = await models
      .post({
        object:
          model === "material"
            ? parseInt(req.params.materialId)
            : model === "course"
              ? parseInt(req.params.courseId)
              : post.object,
        objectType:
          model === "material"
            ? "material"
            : model === "subject"
              ? "subject"
              : post.objectType,
        depth: type === "post" ? 0 : type === "comment" ? 1 : 2,
        directParent: type === "post" || model !== "post" ? null : post.id,
        parents: [
          ...(type !== "post" && model === "post" ? [post.id] : []), // direct parent
          ...(type === "reply" ? post.parents : []),
        ],
        author: user.id,
        images: photos,
        content: req.body.content,
        reactions: [],
      })
      .save();

    if (type === "comment" && model === "post") {
      post.comments.push(createdPost.id);
      await post.save();
    }
    if (type === "reply") {
      let ancestor = await models.post.findById(post.directParent); //ancestor post :)
      if (ancestor) {
        ancestor.comments.push(createdPost.id);
        await ancestor.save();
      }
      post.comments.push(createdPost.id);
      await post.save();
    }
    return APIResponse.Created(res, createdPost);
  }
);
