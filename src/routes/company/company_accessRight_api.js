import express from 'express';
import { Q_listoptions, Q_where } from '../helper/queryHelper.js';
import { seqVError } from '../../entityManagers/seqErrorHelper.js';
import { _accessRights } from '../../models/ModelConstant.js';
export const company_accessRight_api = express.Router();

const ns = `/company/accessRight`;
company_accessRight_api.get(`${ns}/test`, function (req, res) {
  res.send(`${ns} OK`);
});
//LIST ACCESS RIGHTS
company_accessRight_api.get(`${ns}/list`, async (req, res) => {
  const { querier } = req.body;
  const detail = {
    ok: true,
    list: _accessRights,
  };
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
