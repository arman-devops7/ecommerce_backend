import express from 'express';
import { Q_listoptions, Q_where } from '../helper/queryHelper.js';
import { seqVError } from '../../entityManagers/seqErrorHelper.js';
import { CMAccessRole } from '../../entityManagers/company/cmAccessRole.js';
export const company_accessRole_api = express.Router();

const ns = `/company/accessRole`;
company_accessRole_api.get(`${ns}/test`, function (req, res) {
  res.send(`${ns} OK`);
});
//LIST
company_accessRole_api.get(`${ns}/list`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }];
  const where = Q_where(conditions, req);
  const detail = await CMAccessRole.list(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//GET
company_accessRole_api.get(`${ns}/:id/get`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMAccessRole.get(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//ADD
company_accessRole_api.post(`${ns}/add`, async (req, res) => {
  const { querier, data } = req.body;
  const detail = await CMAccessRole.add(querier, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });

  return;
});
//UPDATE
company_accessRole_api.post(`${ns}/:id/update`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  const detail = await CMAccessRole.update(querier, id, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//ADD RIGHT
company_accessRole_api.post(`${ns}/:id/addRight`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  const detail = await CMAccessRole.addRight(querier, id, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//DELETE RIGHT
company_accessRole_api.get(
  `${ns}/:id/:accessRoleRightId/deleteRight`,
  async (req, res) => {
    const { querier } = req.body;
    const { id, accessRoleRightId } = req.params;
    const detail = await CMAccessRole.deleteRight(
      querier,
      id,
      accessRoleRightId
    );
    if (detail.ok) res.send(detail);
    else res.status(500).send({ ok: false, message: seqVError(detail.error) });
  }
);
