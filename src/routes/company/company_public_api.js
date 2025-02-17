import express from 'express';
import { loadConfig } from '../../config/config.js';
import { CMPublic } from '../../entityManagers/company/cmPublic.js';
import { seqVError } from '../../entityManagers/seqErrorHelper.js';

export const company_public_api = express.Router();

const envConfig = loadConfig(process.env.NODE_ENV);
const ns = `/company/public`;
company_public_api.get(`${ns}/test`, function (req, res) {
  // res.send(`${ns} OK`);
  CMPublic.kmsKey();
  res.send({ ok: true });
});

company_public_api.get(`${ns}/kms`, function (req, res) {
  // res.send(`${ns} OK`);
  res.send({ ok: true });
});

//ForgetPassword
company_public_api.post(`${ns}/forgetPassword`, async (req, res) => {
  const body = req.body;
  const { data } = body;
  const { username, companyId } = data;
  const detail = await CMApi.forgetPassword(companyId, username);

  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//ForgetPasswordReset
company_public_api.post(`${ns}/forgetPasswordReset`, async (req, res) => {
  const body = req.body;
  const { data } = body;
  const { password, token } = data;
  const detail = await CMApi.forgetPasswordReset(password, token);

  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

// //DOWNLOAD SAMPLE STOCK ON HAND IMPORT CSV
// company_public_api.get(`${ns}/sampleStockOnHandCsv`, async (req, res) => {
//   const path = `${envConfig.serverPath}assets/import stock on hand template.csv`;
//   res.download(path, `import stock on hand template.csv`);
// });

// //DOWNLOAD FILE
// company_public_api.get(`${ns}/download/file`, async (req, res) => {
//   const { fileName } = req.query;
//   console.log(`fileName?`, fileName);
//   const path = `${envConfig.serverPath}z_export/${fileName}`; // z_export is just a folder name within Node. It can actually be any folder you want.
//   res.download(path, fileName);
// });
