import express from 'express';
import { Q_listoptions, Q_where } from '../helper/queryHelper.js';
import { seqVError } from '../../entityManagers/seqErrorHelper.js';
import multer from 'multer';
import * as fs from 'fs';
import { envConfig } from '../../config/config.js';
import { CMProductCategory } from '../../entityManagers/company/cmProductCategory.js';

export const company_productCategory_api = express.Router();

const folder = 'uploads/';
let counter = 0;
const storage = multer.diskStorage({
  destination: folder,
  filename: function (req, file, cb) {
    const { mimetype, originalname } = file;
    const originalnameS = originalname.split('.');
    const ext =
      originalnameS.length > 0
        ? `.${originalnameS[originalnameS.length - 1]}`
        : `.png`;
    cb(null, Date.now() + counter++ + ext);
  },
});
const upload = multer({ storage });

const ns = `/company/productCategory`;
company_productCategory_api.get(`${ns}/test`, function (req, res) {
  res.send(`${ns} OK`);
});

//UPLOAD PROFILE PIC
company_productCategory_api.post(
  `${ns}/:id/uploadProfilePic`,
  upload.any(),
  async (req, res) => {
    const { querier } = req;
    const { path, filename } = req.files[0];
    const mediaFolder = envConfig.mediaFolder;
    const { id } = req.params;
    const detail = await CMProductCategory.uploadProfilePic(
      querier,
      id,
      filename
    );
    if (detail.ok) {
      fs.copyFile(path, `${mediaFolder}${filename}`, (err) => {
        if (err) {
          console.log('Error Found:', err);
        } else {
        }
      });
      res.send(detail);
    } else
      res.status(500).send({ ok: false, message: seqVError(detail.error) });
  }
);

//LIST
company_productCategory_api.get(`${ns}/list`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }, { name: `productCategoryId` }];
  const where = Q_where(conditions, req);
  console.log('where', where);
  const detail = await CMProductCategory.list(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//LIST
company_productCategory_api.get(`${ns}/basicList`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }];
  const where = Q_where(conditions, req);
  const detail = await CMProductCategory.list(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//GET
company_productCategory_api.get(`${ns}/:id/get`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMProductCategory.get(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//ADD
company_productCategory_api.post(`${ns}/add`, async (req, res) => {
  const { querier, data } = req.body;
  let detail = await CMProductCategory.add(querier, data);
  console.log(`detail?`, detail);
  if (detail.ok) res.send(detail);
  else
    return res
      .status(500)
      .send({ ok: false, message: seqVError(detail.error) });
  // if (detail.ok) res.send(detail);
  // else res.status(500).send({ ok: false, message: seqVError(detail.error) });
  // return;
});

//active
company_productCategory_api.get(`${ns}/:id/active`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMProductCategory.active(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//inactive
company_productCategory_api.get(`${ns}/:id/inactive`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMProductCategory.inactive(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//UPDATE
company_productCategory_api.post(`${ns}/:id/update`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  const detail = await CMProductCategory.update(querier, id, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//GENERATE SSO
company_productCategory_api.get(`${ns}/generateSSO`, async (req, res) => {
  const { querier } = req.body;
  const { id } = req.params;
  const detail = await CMProductCategory.generateSSO(
    querier,
    querier.claims.id
  );
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//ASSIGN ROLE
company_productCategory_api.post(`${ns}/:id/assignRole`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  const detail = await CMProductCategory.assignRole(querier, id, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
