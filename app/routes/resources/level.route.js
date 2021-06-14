const express = require('express');
const policies = require('../../policies');
const ctrls = require('../../controllers');

let router = express.Router();

router.get('/levels/:id', ctrls.levelCtrl.fetchOne);
router.get('/systems/:id/levels', ctrls.levelCtrl.fetchAll);
router.post(
  '/systems/:id/levels',
  policies.isAllowed(['admin']),
  ctrls.levelCtrl.CreateOne,
);
router.patch(
  '/levels/:id',
  policies.isAllowed(['admin']),
  ctrls.levelCtrl.UpdateOne,
);
router.delete(
  '/levels/:id',
  policies.isAllowed(['admin']),
  ctrls.levelCtrl.DeleteOne,
);

module.exports = router;
