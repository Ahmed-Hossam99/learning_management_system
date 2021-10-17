const express = require('express');
const policies = require('../../policies');
const ctrls = require('../../controllers');

let router = express.Router();

router.get("/systems", ctrls.SectionCtrl.fetchAll);
router.get('/systems/:id', ctrls.SectionCtrl.fetchOne);
router.post(
  '/class/:id/sections',
  policies.isAllowed(['admin']),
  ctrls.SectionCtrl.CreateOne,
);
router.put(
  '/systems/:id',
  policies.isAllowed(['admin']),
  ctrls.SectionCtrl.UpdateOne,
);
router.delete(
  '/systems/:id',
  policies.isAllowed(['admin']),
  ctrls.SectionCtrl.DeleteOne,
);

module.exports = router;

