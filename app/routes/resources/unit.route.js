const express = require("express");
const policies = require("../../policies");
const ctrls = require("../../controllers");

let router = express.Router();

router.get("/units/:id", ctrls.UnitCtrl.fetchOne);
router.patch("/units/:id", ctrls.UnitCtrl.updateOne);
router.delete("/units/:id", ctrls.UnitCtrl.deleteOne);
router.post("/courses/:id/units", ctrls.UnitCtrl.createOne);
router.get("/courses/:id/units", ctrls.UnitCtrl.fetchAll);
router.get("/courses/:id/units-months", ctrls.UnitCtrl.fetchMonthsOfUnits);

module.exports = router;
