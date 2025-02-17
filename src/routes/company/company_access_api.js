import express from 'express';
import { CMAuth } from '../../entityManagers/company/cmAuth.js';
import { JWT_signProfile } from '../JWT/JWTHelper.js';

export const company_access_api = express.Router();

const ns = `/company/access`;
company_access_api.get(`${ns}/test`, function (req, res) {
  res.send('COMPANY ACCESS API OK');
});
company_access_api.post(`${ns}/login`, async (req, res) => {
  const body = req.body;

  const { querier, data } = body;

  if (!querier) {
    return res.status(403).send(`Failure to detech IP`);
  }

  const account = await CMAuth.login(data.username, data.password).catch((e) => {
    // return res
    //   .status(500)
    //   .send({ ok: false, message: `Server Internal Error` });
    return null;
  });
  if (!account || !account.userProfile || !account.tokenObj) {
    return res.status(403).send({ ok: false, message: `Unauthorized Access` });
  }
  const tokenObj = account.tokenObj;
  return res.send({
    profile: account.userProfile,
    token: tokenObj,
  });
});

company_access_api.get(`${ns}/profile`, async (req, res) => {
  const { querier } = req.body;
  console.log(`access profile???`);
  console.log(`querier.userProfileId?`, querier.userProfileId);
  // const userXCompany = await CMAuth.getProfileAccess(querier.userProfileId);
  return res.send({ profile: querier.userProfile });
});

company_access_api.get(`${ns}/sso`, async (req, res) => {
  const { sso } = req.query;
  const { querier } = req.body;
  const account = await CMAuth.loginViaSSO(querier, sso).catch((e) => {
    // res.status(500).send(`Server Internal Error`);
    console.log(`e??`, e);
    return;
  });
  console.log(`account???`, account);
  if (!account || !account.userProfile || !account.userProfile.companyProfiles) {
    return res.status(403).send(`Unauthorized Access`);
  }
  console.log(`ook`);
  const tokenObj = JWT_signProfile(account.userProfile, 'userProfile');
  return res.send({ profile: account.userProfile, token: tokenObj });
});
