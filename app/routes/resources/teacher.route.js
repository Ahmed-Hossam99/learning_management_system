const express = require("express");
const ctrls = require("../../controllers");
const policies = require('../../policies')
let router = express.Router();


router.post('/doctor', policies.isAllowed(['admin']), ctrls.TeacherCtrl.addTeacher)
router.get('/doctors', policies.isAllowed(['admin']), ctrls.TeacherCtrl.fetchTeachers)
router.patch('/doctors/:id/assign-subject-many', policies.isAllowed(['admin']), ctrls.TeacherCtrl.assignTeacherMany)
router.patch('/doctors/:id/assign-section-many', policies.isAllowed(['admin']), ctrls.TeacherCtrl.assignTeacherToSectionMany)

module.exports = router;
