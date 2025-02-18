import express from 'express';
import { Q_listoptions, Q_where } from '../helper/queryHelper.js';
import { seqVError } from '../../entityManagers/seqErrorHelper.js';
import { CMAccessLog } from '../../entityManagers/company/cmAccessLog.js';
import { ApiLogManager } from '../../entityManagers/ApiAccessLogHelper.js';
export const company_accessLog_api = express.Router();

const ns = `/company/accessLog`;
company_accessLog_api.get(`${ns}/test`, function (req, res) {
  res.send(`${ns} OK`);
});

//LIST
company_accessLog_api.get(`${ns}/list`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ field: `docType` }, { field: `docId` }];
  const where = Q_where(conditions, req);
  const detail = await CMAccessLog.list(querier, where, options);
  if (detail.ok) {
    res.send(detail);
    ApiLogManager.log(req.body.querier, req.path, detail);
  } else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
