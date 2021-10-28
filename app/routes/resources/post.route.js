const express = require("express");
const ctrls = require("../../controllers");
let router = express.Router();

router.post("/material/:materialId/comments", ctrls.PostCtrl.createPost); // create comment on lesson
router.post("/comments/:commentId/replies", ctrls.PostCtrl.createPost);

router.get("/material/:materialId/comments", ctrls.PostCtrl.fetchAll);
router.get("/posts/:commentId/replies", ctrls.PostCtrl.fetchAll);

router.delete("/posts/:postId", ctrls.PostCtrl.deletePost);
router.patch("/posts/:postId", ctrls.PostCtrl.updatePost);

module.exports = router;
