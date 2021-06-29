const express = require("express");
const policies = require("../../policies");
const ctrls = require("../../controllers");

let router = express.Router();

router.get(
  "/teachers",
  policies.isAllowed(["admin"]),
  ctrls.TeacherCtrl.fetchTeachers
);

router.post(
  "/teachers",
  policies.isAllowed(["admin"]),
  ctrls.TeacherCtrl.addTeacher
);

router.patch(
  "/teachers/:id/subjects",
  policies.isAllowed(["admin"]),
  ctrls.TeacherCtrl.assignSubjectsToTeacher
);

module.exports = router;
