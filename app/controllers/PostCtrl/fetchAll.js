const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  let query = req.params.materialId
    ? {
        depth: 1,
        object: parseInt(req.params.materialId),
        objectType: "material",
      }
    : req.params.courseId
    ? {
        depth: 0,
        object: parseInt(req.params.courseId),
        objectType: "course",
      }
    : req.params.postId
    ? {
        depth: 1,
        directParent: parseInt(req.params.postId),
      }
    : req.params.commentId
    ? {
        depth: 2,
        directParent: parseInt(req.params.commentId),
      }
    : 0; // 0 in case empty 'ogrty'

  let posts = await models.post.fetchAll(
    req.allowPagination,
    {
      ...req.queryFilter,
      ...query,
    },
    {
      ...req.queryOptions,
      populate: [{ path: "author", select: "username photo" }],
      ...(query.depth !== 2 && {
        sort: "-_id",
      }),
    }
  );
  return APIResponse.Ok(res, posts);
});
