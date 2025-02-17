import express from 'express';
import { Q_listoptions, Q_where } from '../helper/queryHelper.js';
import { seqVError } from '../../entityManagers/seqErrorHelper.js';
import { AMNotification } from '../../entityManagers/admin/amNotification.js';
export const admin_notification_api = express.Router();

const ns = `/admin/notification`;
admin_notification_api.get(`${ns}/test`, function (req, res) {
  res.send(`${ns} OK`);
});
//LIST
admin_notification_api.get(`${ns}/list`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }];
  const where = Q_where(conditions, req);
  console.log(`options?`, options);
  const detail = await AMNotification.list(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//GET
admin_notification_api.get(`${ns}/:id/get`, async (req, res) => {
  const { querier } = req.body;
  const { id } = req.params;
  const detail = await AMNotification.get(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//ADD
admin_notification_api.post(`${ns}/add`, async (req, res) => {
  const { querier, data } = req.body;
  const detail = await AMNotification.add(querier, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });

  return;
});
//UPDATE
admin_notification_api.post(`${ns}/:id/update`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  const detail = await AMNotification.update(querier, id, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
