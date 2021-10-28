const express = require("express");
const ctrls = require("../../controllers");
const policies = require("../../policies");
let router = express.Router();

router.post(
  "/lecture/:id/questions-many",
  policies.isAllowed(["admin", "teacher"]),
  ctrls.QuestionCtrl.createMany
);

router.post(
  "/lecture/:id/questions",
  policies.isAllowed(["admin", "teacher"]),
  ctrls.QuestionCtrl.createOne
);

router.patch("/questions/:id", ctrls.QuestionCtrl.updateOne);

router.get(
  "/questions/:id",
  policies.isAllowed(["admin", "teacher"]),
  ctrls.QuestionCtrl.fetchOne
);

router.get("/subjects/:id/questions", ctrls.QuestionCtrl.fetchAllToSubjects);

router.delete("/questions/:id", ctrls.QuestionCtrl.deleteOne);

router.post("/questions-group/:id/children", ctrls.QuestionCtrl.createChildren);

module.exports = router;
