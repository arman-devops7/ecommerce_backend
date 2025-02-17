import express from 'express';
import { AMAuth } from '../../entityManagers/admin/amAuth.js';
import { JWT_signProfile } from '../JWT/JWTHelper.js';

export const admin_access_api = express.Router();

const ns = `/admin/access`;
admin_access_api.get(`${ns}/test`, function (req, res) {
  res.send('ADMIN ACCESS API OK');
});
admin_access_api.post(`${ns}/login`, async (req, res) => {
  const body = req.body;

  const { querier, data } = body;
  if (!querier) {
    return res.status(403).send(`Failure to detech IP`);
  }
  const account = await AMAuth.login(
    querier,
    data.username,
    data.password
  ).catch((e) => {
    return res.status(500).send(`Server Internal Error`);
  });
  if (!account || !account.adminProfile) {
    return res.status(403).send(`Unauthorized Access`);
  }
  const tokenObj = JWT_signProfile(account.adminProfile, 'adminProfile');
  return res.send({ profile: account.adminProfile, token: tokenObj });
});

admin_access_api.get(`${ns}/profile`, async (req, res) => {
  const { querier } = req.body;
  return res.send({ profile: querier.adminProfile });
});
