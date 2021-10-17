const express = require("express");
const ctrls = require("../../controllers");
const policies = require('../../policies')
let router = express.Router();


router.post('/teachers', policies.isAllowed(['admin']), ctrls.TeacherCtrl.addTeacher)
router.get('/teachers', policies.isAllowed(['admin']), ctrls.TeacherCtrl.fetchTeachers)
router.patch('/teachers/:id/assign-many', policies.isAllowed(['admin']), ctrls.TeacherCtrl.assignTeacherMany)

module.exports = router;
