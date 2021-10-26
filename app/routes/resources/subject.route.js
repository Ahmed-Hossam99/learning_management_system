const express = require("express");
const policies = require("../../policies");
const ctrls = require("../../controllers");

let router = express.Router();

router.post(
  "/level/:id/subjects",
  policies.isAllowed(["admin"]),
  ctrls.SubjectCtrl.createOne
); //done
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
router.get(
  "/teacher-subjects",
  policies.isAllowed(["teacher"]),
  ctrls.SubjectCtrl.teacherSubjects
);//done

router.get(
  "/student-subjects",
  policies.isAllowed(["student"]),
  ctrls.SubjectCtrl.studentSubjects
);//done
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
router.get("/subjects/:id", ctrls.SubjectCtrl.fetchOne);//done
// router.post(
//   "/sections/:id/subjects",
//   policies.isAllowed(["admin"]),
//   ctrls.SubjectCtrl.createOne
// );
router.get("/levels/:id/subjects", ctrls.SubjectCtrl.fetchAll);//done

module.exports = router;
