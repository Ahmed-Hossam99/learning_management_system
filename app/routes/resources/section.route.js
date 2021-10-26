const express = require('express');
const policies = require('../../policies');
const ctrls = require('../../controllers');

let router = express.Router();

router.get("/sections", ctrls.SectionCtrl.fetchAll);
router.get('/section/:id', ctrls.SectionCtrl.fetchOne);
router.post(
  '/level/:id/sections',
  policies.isAllowed(['admin']),
  ctrls.SectionCtrl.CreateOne,
);
router.patch(
  '/section/:id',
  policies.isAllowed(['admin']),
  ctrls.SectionCtrl.UpdateOne,
);
router.delete(
  '/section/:id',
  policies.isAllowed(['admin']),
  ctrls.SectionCtrl.DeleteOne,
);

module.exports = router;

