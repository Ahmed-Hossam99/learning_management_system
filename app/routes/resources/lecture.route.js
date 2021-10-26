const express = require("express");
const policies = require("../../policies");
const ctrls = require("../../controllers");

let router = express.Router();

router.post("/subject/:id/lecture", ctrls.LectureCtrl.createOne);
router.patch("/lecture/:id", ctrls.LectureCtrl.updateOne);
router.delete("/lecture/:id", ctrls.LectureCtrl.deleteOne);
router.get("/lecture/:id", ctrls.LectureCtrl.fetchOne);
router.get("/subject/:id/lecture", ctrls.LectureCtrl.fetchAll);

module.exports = router;
