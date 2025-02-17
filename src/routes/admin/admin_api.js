import { admin_access_api } from './admin_access_api.js';
import { admin_middleware } from './admin_middleware.js';
import { admin_company_api } from './admin_companyProfile_api.js';
import { admin_notification_api } from './admin_notification_api.js';

export const adminApis = [
  admin_middleware,
  admin_access_api,
  admin_company_api,
  admin_notification_api,
];
