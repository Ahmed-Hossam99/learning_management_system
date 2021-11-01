const express = require("express");
const ctrls = require("../../controllers");
const policies = require("../../policies");
let router = express.Router();

router.patch(
    "/activate/:id",
    policies.isAllowed(["admin"]),
    ctrls.AdminCtrl.deactivateAccount
);

router.get(
    "/statistics",
    policies.isAllowed(["admin"]),
    ctrls.AdminCtrl.statistics
);

router.patch(
    "/users/:id",
    policies.isAllowed(["admin"]),
    ctrls.AdminCtrl.updateProfile
);

module.exports = router;
