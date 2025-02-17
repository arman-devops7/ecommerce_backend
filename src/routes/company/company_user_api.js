import express from 'express';
import { Q_listoptions, Q_where } from '../helper/queryHelper.js';
import { seqVError } from '../../entityManagers/seqErrorHelper.js';
import { CMUserProfile } from '../../entityManagers/company/cmUserProfile.js';
import multer from 'multer';
import * as fs from 'fs';
import { envConfig } from '../../config/config.js';
export const company_user_api = express.Router();

const folder = 'uploads/';
let counter = 0;
const storage = multer.diskStorage({
  destination: folder,
  filename: function (req, file, cb) {
    const { mimetype, originalname } = file;
    const originalnameS = originalname.split('.');
    const ext = originalnameS.length > 0 ? `.${originalnameS[originalnameS.length - 1]}` : `.png`;
    cb(null, Date.now() + counter++ + ext);
  },
});
const upload = multer({ storage });

const ns = `/company/user`;
company_user_api.get(`${ns}/test`, function (req, res) {
  res.send(`${ns} OK`);
});

//UPLOAD PROFILE PIC
company_user_api.post(`${ns}/:id/uploadProfilePic`, upload.any(), async (req, res) => {
  const { querier } = req;
  const { path, filename } = req.files[0];
  const mediaFolder = envConfig.mediaFolder;
  const { id } = req.params;
  const detail = await CMUserProfile.uploadProfilePic(querier, id, filename);
  if (detail.ok) {
    fs.copyFile(path, `${mediaFolder}${filename}`, (err) => {
      if (err) {
        console.log('Error Found:', err);
      } else {
      }
    });
    res.send(detail);
  } else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//LIST
company_user_api.get(`${ns}/list`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }];
  const where = Q_where(conditions, req);
  const detail = await CMUserProfile.list(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//LIST
company_user_api.get(`${ns}/basicList`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }];
  const where = Q_where(conditions, req);
  const detail = await CMUserProfile.list(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//GET
company_user_api.get(`${ns}/:id/get`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMUserProfile.get(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//ADD
company_user_api.post(`${ns}/add`, async (req, res) => {
  const { querier, data } = req.body;
  let detail = await CMUserProfile.add(querier, data);
  console.log(`detail?`, detail);
  if (detail.ok) res.send(detail);
  else return res.status(500).send({ ok: false, message: seqVError(detail.error) });
  // if (detail.ok) res.send(detail);
  // else res.status(500).send({ ok: false, message: seqVError(detail.error) });
  // return;
});

//active
company_user_api.get(`${ns}/:id/active`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMUserProfile.active(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//inactive
company_user_api.get(`${ns}/:id/inactive`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMUserProfile.inactive(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//UPDATE
company_user_api.post(`${ns}/:id/update`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  const detail = await CMUserProfile.update(querier, id, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//GENERATE SSO
company_user_api.get(`${ns}/generateSSO`, async (req, res) => {
  const { querier } = req.body;
  const { id } = req.params;
  const detail = await CMUserProfile.generateSSO(querier, querier.claims.id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//ASSIGN ROLE
company_user_api.post(`${ns}/:id/assignRole`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  const detail = await CMUserProfile.assignRole(querier, id, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
