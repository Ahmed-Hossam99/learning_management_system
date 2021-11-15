const express = require("express");
const policies = require("../../policies");
const ctrls = require("../../controllers");

let router = express.Router();

router.get(
    "/student/:id",
    policies.isAllowed(["admin"]),
    ctrls.StudentCtrl.fetchOne
);
router.get(
    "/students",
    ctrls.StudentCtrl.fetchAll
);


router.post(
    "/student",
    policies.isAllowed(["admin"]),
    ctrls.StudentCtrl.addStudent
);

router.patch(
    "/students/:id/path",
    policies.isAllowed(["admin"]),
    ctrls.StudentCtrl.assignToSection
);

module.exports = router;
