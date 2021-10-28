const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(async (req, res) => {
  const user = req.me;

  const id = parseInt(req.params.postId);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const post = await models.post.findById(id);
  if (!post) return APIResponse.NotFound(res, "post not found");
  if (post.author !== user.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res);

  //post
  if (post.depth === 0) {
    await post.delete();
    await models.post.deleteMany({ parents: post.id });
  }

  //comment
  if (post.depth === 1) {
    // delete comment
    await post.delete();
    // delete replies
    let replies = await models.post
      .find({ directParent: post.id })
      .select("_id"); //reply
    replies = replies.map((reply) => reply.id);
    console.log(replies);
    // pull it form  array of post comments
    await models.post.updateOne(
      { _id: post.directParent },
      { $pull: { comments: { $in: [post.id, ...replies] } } }
    );
    await models.post.deleteMany({ directParent: post.id }); //delete replies
  }

  //reply
  if (post.depth === 2) {
    // delete reply
    await post.delete();
    await models.post.updateMany(
      { _id: { $in: post.parents } },
      { $pull: { comments: post.id } }
    );
  }

  return APIResponse.NoContent(res);
});
