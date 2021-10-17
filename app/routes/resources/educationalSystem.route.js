const express = require("express");
const policies = require("../../policies");
const ctrls = require("../../controllers");

let router = express.Router();

router.post(
    "/eduSystem",
    policies.isAllowed("admin"),
    ctrls.EducationalSystemCtrl.CreateOne
);
router.get(
    "/eduSystem",
    policies.isAllowed("admin"),
    ctrls.EducationalSystemCtrl.fetchAll
);
router.get("/eduSystem/:id", ctrls.EducationalSystemCtrl.fetchOne);
router.patch(
    "/eduSystem/:id",
    policies.isAllowed("admin"),
    ctrls.EducationalSystemCtrl.UpdateOne
);
router.delete(
    "/eduSystem/:id",
    policies.isAllowed("admin"),
    ctrls.EducationalSystemCtrl.DeleteOne
);

module.exports = router;
