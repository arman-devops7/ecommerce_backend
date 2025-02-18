import express from 'express';
import { Q_listoptions, Q_where } from '../helper/queryHelper.js';
import { seqVError } from '../../entityManagers/seqErrorHelper.js';
import multer from 'multer';
import * as fs from 'fs';
import { envConfig } from '../../config/config.js';
import { CMProduct } from '../../entityManagers/company/cmProduct.js';
export const company_product_api = express.Router();

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

const ns = `/company/product`;
company_product_api.get(`${ns}/test`, function (req, res) {
  res.send(`${ns} OK`);
});

//UPLOAD PROFILE PIC
company_product_api.post(
  `${ns}/:id/uploadProfilePic`,
  upload.any(),
  async (req, res) => {
    const { querier } = req;
    const { path, filename } = req.files[0];
    const mediaFolder = envConfig.mediaFolder;
    const { id } = req.params;
    const detail = await CMProduct.uploadProfilePic(querier, id, filename);
    if (detail.ok) {
      fs.copyFile(path, `${mediaFolder}${filename}`, (err) => {
        if (err) {
          console.log('Error Found:', err);
        }
      });
      res.send(detail);
    } else
      res.status(500).send({ ok: false, message: seqVError(detail.error) });
  }
);

//LIST
company_product_api.get(`${ns}/list`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }];
  const where = Q_where(conditions, req);
  const detail = await CMProduct.list(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//LIST
company_product_api.get(`${ns}/basicList`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }];
  const where = Q_where(conditions, req);
  const detail = await CMProduct.list(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//GET
company_product_api.get(`${ns}/:id/get`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMProduct.get(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//ADD
company_product_api.post(`${ns}/add`, async (req, res) => {
  const { querier, data } = req.body;
  let detail = await CMProduct.add(querier, data);
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

//UPDATE
company_product_api.post(`${ns}/:id/update`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  const detail = await CMProduct.update(querier, id, data);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//active
company_product_api.get(`${ns}/:id/active`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMProduct.active(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
//inactive
company_product_api.get(`${ns}/:id/inactive`, async (req, res) => {
  const { querier, companyId } = req.body;
  const { id } = req.params;
  const detail = await CMProduct.inactive(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//LIST UOM UNITS
company_product_api.get(`${ns}/listUomUnits`, async (req, res) => {
  const { querier } = req.body;
  const options = Q_listoptions(req);
  const conditions = [{ name: `status` }];
  const where = Q_where(conditions, req);
  const detail = await CMProduct.listUomUnits(querier, where, options);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});

//ADD UOM
company_product_api.post(`${ns}/:id/addProductUom`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  let detail = await CMProduct.addProductUom(querier, id, data);
  console.log(`detail?`, detail);
  if (detail.ok) res.send(detail);
  else
    return res
      .status(500)
      .send({ ok: false, message: seqVError(detail.error) });
});

//UPDATE UOM
company_product_api.post(
  `${ns}/:id/:productUomId/updateProductUom`,
  async (req, res) => {
    const { querier, data } = req.body;
    const { id, productUomId } = req.params;
    const detail = await CMProduct.updateProductUom(
      querier,
      id,
      productUomId,
      data
    );
    if (detail.ok) res.send(detail);
    else res.status(500).send({ ok: false, message: seqVError(detail.error) });
  }
);

//ADD PART
company_product_api.post(`${ns}/:id/addPart`, async (req, res) => {
  const { querier, data } = req.body;
  const { id } = req.params;
  let detail = await CMProduct.addPart(querier, id, data);
  console.log(`detail?`, detail);
  if (detail.ok) res.send(detail);
  else
    return res
      .status(500)
      .send({ ok: false, message: seqVError(detail.error) });
});

//UPDATE PART
company_product_api.post(
  `${ns}/:id/:productPartId/updatePart`,
  async (req, res) => {
    const { querier, data } = req.body;
    const { id, productPartId } = req.params;
    const detail = await CMProduct.updatePart(querier, id, productPartId, data);
    if (detail.ok) res.send(detail);
    else res.status(500).send({ ok: false, message: seqVError(detail.error) });
  }
);

//DELETE PART
company_product_api.get(
  `${ns}/:id/:productPartId/deletePart`,
  async (req, res) => {
    const { querier } = req.body;
    const { id, productPartId } = req.params;
    const detail = await CMProduct.deletePart(querier, id, productPartId);
    if (detail.ok) res.send(detail);
    else res.status(500).send({ ok: false, message: seqVError(detail.error) });
  }
);

//CLONE PRODUCT PARTS
company_product_api.get(`${ns}/:id/cloneProductParts`, async (req, res) => {
  const { querier } = req.body;
  const { id } = req.params;
  const detail = await CMProduct.cloneProductParts(querier, id);
  if (detail.ok) res.send(detail);
  else res.status(500).send({ ok: false, message: seqVError(detail.error) });
});
