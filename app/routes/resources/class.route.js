const express = require("express");
const policies = require("../../policies");
const ctrls = require("../../controllers");

let router = express.Router();

router.post(
  "/levels/:id/classes",
  policies.isAllowed("admin"),
  ctrls.ClassCtrl.CreateOne
);
router.get(
  "/levels/:id/classes",
  policies.isAllowed("admin"),
  ctrls.ClassCtrl.fetchAll
);
router.get("/classes/:id", ctrls.ClassCtrl.fetchOne);
router.patch(
  "/classes/:id",
  policies.isAllowed("admin"),
  ctrls.ClassCtrl.UpdateOne
);
router.delete(
  "/classes/:id",
  policies.isAllowed("admin"),
  ctrls.ClassCtrl.DeleteOne
);

module.exports = router;
