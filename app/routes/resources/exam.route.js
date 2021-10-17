const express = require("express");
const ctrls = require("../../controllers");
const policies = require("../../policies");
let router = express.Router();

router.post("/exams", ctrls.ExamCtrl.createOneGeneral);

router.patch("/exams/:id", ctrls.ExamCtrl.updateOneGeneral);

router.patch("/exams-add-questions/:id", ctrls.ExamCtrl.addQuestions);

router.post("/exams/:eid/lessons/:oid", ctrls.ExamCtrl.addNewQuestions);

router.delete("/exams/:id", ctrls.ExamCtrl.deleteOne);

router.patch("/exams/:eid/questions/:qid", ctrls.ExamCtrl.deleteQuestion);

router.patch(
  "/exams/:eid/questions-point/:qid",
  ctrls.ExamCtrl.updatePointOfQuestion
);

router.post(
  "/exams/:id/start",
  policies.isAllowed(["student"]),
  ctrls.ExamCtrl.startExam
);

router.get(
  "/lessons/:id/exams",
  policies.isAllowed(["student", "admin", "teacher"]),
  ctrls.ExamCtrl.fetchGeneralExams
);
router.get(
  "/units/:id/exams",
  policies.isAllowed(["student", "admin", "teacher"]),
  ctrls.ExamCtrl.fetchGeneralExams
);
router.get(
  "/subjects/:id/exams",
  policies.isAllowed(["student", "admin", "teacher"]),
  ctrls.ExamCtrl.fetchGeneralExams
);

router.patch("/exams/:id/solutions", ctrls.ExamCtrl.submitSolution);

router.get(
  "/exams/:id",
  policies.isAllowed(["student", "admin", "teacher"]),
  ctrls.ExamCtrl.fetchOne
);
router.patch("/exams-done/:id", ctrls.ExamCtrl.doneSolving);

router.get("/exams/:id/solutions", ctrls.ExamCtrl.fetchCheckingSolutions);

router.patch("/solutions/:id/check", ctrls.ExamCtrl.checkSolution);

module.exports = router;
