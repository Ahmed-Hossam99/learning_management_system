const express = require("express");
const policies = require("../../policies");
const ctrls = require("../../controllers");

let router = express.Router();

router.get("/subjects/:id", ctrls.SubjectCtrl.fetchOne);
router.get("/section/:id/subjects", ctrls.SubjectCtrl.fetchAll);
router.post(
  "/section/:id/subjects",
  policies.isAllowed(["admin"]),
  ctrls.SubjectCtrl.createOne
);
router.patch(
  "/subjects/:id",
  policies.isAllowed(["admin"]),
  ctrls.SubjectCtrl.updateOne
);
router.delete(
  "/subjects/:id",
  policies.isAllowed(["admin"]),
  ctrls.SubjectCtrl.deleteOne
);

module.exports = router;
