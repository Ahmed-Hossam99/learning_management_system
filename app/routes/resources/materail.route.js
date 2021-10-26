const express = require("express");
const ctrls = require("../../controllers");
const policies = require("../../policies");
let router = express.Router();

router.patch(
    "/material/:id",
    ctrls.MaterialCtrl.updateOne
);
router.delete(
    "/material/:id",
    ctrls.MaterialCtrl.deleteOne
);
router.post(
    "/lecture/:id/material",
    ctrls.MaterialCtrl.createOne
);
router.get("/material/:id", ctrls.MaterialCtrl.fetchOne);
router.get("/lecture/:id/material", ctrls.MaterialCtrl.fetchAll);

module.exports = router;
