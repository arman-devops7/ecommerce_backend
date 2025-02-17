import { company_access_api } from './company_access_api.js';
import { company_middleware } from './company_middleware.js';
import { company_public_api } from './company_public_api.js';
import { company_accessRight_api } from './company_accessRight_api.js';
import { company_accessRole_api } from './company_accessRole_api.js';
import { company_user_api } from './company_user_api.js';
import { company_auditLog_api } from './company_auditLog_api.js';
import { company_accessLog_api } from './company_accessLog_api.js';
import { company_product_api } from './company_product_api.js';
import { company_productCategory_api } from './company_productCategory_api.js';

export const companyApis = [
  company_middleware,
  company_access_api,
  company_public_api,
  company_accessLog_api,
  company_auditLog_api,
  company_accessRole_api,
  company_accessRight_api,
  company_user_api,
  company_product_api,
  company_productCategory_api,
];
