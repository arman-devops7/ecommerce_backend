import express from 'express';
import { AMCompanyProfile } from '../../entityManagers/admin/amCompanyProfile.js';
import { Q_listoptions, Q_where } from '../helper/queryHelper.js';
import { seqVError } from '../../entityManagers/seqErrorHelper.js';
export const admin_company_api = express.Router();

const ns = `/admin/company`;
admin_company_api.get(`${ns}/test`, function (req, res) {
  res.send({ ok: true });
});

//LIST
admin_company_api.get(`${ns}/list`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }];
  const where = Q_where(conditions, req);
  console.log(`options?`, options);
  const detail = await AMCompanyProfile.list(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//GET
admin_company_api.get(`${ns}/:id/get`, async (req, res) => {
  const { querier } = req.body;
  const { id } = req.params;
  const detail = await AMCompanyProfile.get(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//ADD
admin_company_api.post(`${ns}/add`, async (req, res) => {
  const { querier, data } = req.body;
  const detail = await AMCompanyProfile.add(querier, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });

  return;
});

//UPDATE
admin_company_api.post(`${ns}/:id/update`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  const detail = await AMCompanyProfile.update(querier, id, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

admin_company_api.get(`${ns}/:id/:userProfildId/resetUserPassword`, async (req, res) => {
  const { querier } = req.body;
  const { id, userProfildId } = req.params;
  const detail = await AMCompanyProfile.resetUserPassword(querier, id, userProfildId);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
