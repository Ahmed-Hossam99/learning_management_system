const express = require('express');
const policies = require('../../policies');
const ctrls = require('../../controllers');

let router = express.Router();

router.get("/systems", ctrls.SystemCtrl.fetchAll);
router.get('/systems/:id', ctrls.SystemCtrl.fetchOne);
router.post(
  '/systems',
  policies.isAllowed(['admin']),
  ctrls.SystemCtrl.CreateOne,
);
router.put(
  '/systems/:id',
  policies.isAllowed(['admin']),
  ctrls.SystemCtrl.UpdateOne,
);
router.delete(
  '/systems/:id',
  policies.isAllowed(['admin']),
  ctrls.SystemCtrl.DeleteOne,
);

module.exports = router;

