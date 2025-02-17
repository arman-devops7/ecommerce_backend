import express from 'express';
import { JWT_verifyProfile } from '../JWT/JWTHelper.js';
import { CMAuth } from '../../entityManagers/company/cmAuth.js';
import { ApiLogManager } from '../../entityManagers/ApiAccessLogHelper.js';
import { getAccessRight } from '../../models/ModelConstant.js';
export const company_middleware = express.Router();
const ns = `/company`;
const errorObj = (message) => {
  return { ok: false, message };
};
company_middleware.all(`${ns}/*`, async function (req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`in ${ns}/*`, req.path);
  console.log(`res:: incoming`, ip);
  req.body.querier = { jwt: false, ip };

  if (
    req.path === '/company/access/login' ||
    req.path === '/company/access/sso' ||
    req.path.startsWith(`/company/public`) ||
    req.path.startsWith(`/company/product`) ||
    req.path.endsWith(`/test`)
  )
    return next();

  const BearerRaw = req.headers.authorization;
  if (!BearerRaw) return res.status(403).send(errorObj(`Unauthorized Access`));
  const Bearer = BearerRaw.startsWith(`Bearer`)
    ? BearerRaw.substr(7, BearerRaw.length)
    : BearerRaw;

  const checkJwt = await CMAuth.checkJwt(Bearer);
  if (!checkJwt)
    return res
      .status(403)
      .send(errorObj(`Unauthorized Access Reason: Expired`));

  const claims = JWT_verifyProfile(
    Bearer.startsWith(`Bearer`) ? Bearer.substr(7, Bearer.length) : Bearer
  );
  if (!claims || 'userProfile' !== claims.profileType)
    return res.status(403).send(errorObj(`Unauthorized Access`));

  req.body.querier.claims = claims;
  const profile = await CMAuth.profile(req.body.querier);
  if (profile.jwtVersion !== claims.jwtVersion)
    return res.status(403).send(errorObj(`Unauthorized Access (CODE: 0)`));

  if ('active' !== profile.status)
    return res.status(403).send(errorObj(`Unauthorized Access (CODE: 0)`));
  req.body.querier.userProfile = profile;
  req.body.querier.userProfileId = profile.id;
  req.querier = req.body.querier;

  // //check access rights
  // const userXCompany = profile.companyProfiles[0].userXCompany;
  // const userXCompanyId = userXCompany.id;
  // const subNs = req.path.substr(ns.length + 1, req.path.length);
  // const subNsStart = req.path.substr(ns.length + 1, req.path.length).split('/')[0];
  // req.body.querier.role = userXCompany.role;

  // if (userXCompany.role !== `ADMIN` && `access/profile` !== subNs) {
  //   const points = req.path.split('/');
  //   const endPoint = points[points.length - 1];
  //   const accessRightObj = getAccessRight(subNsStart, endPoint);
  //   if (!accessRightObj)
  //     return res
  //       .status(403)
  //       .send(errorObj(`Unauthorized Access (CODE: 1) ${subNsStart} ${endPoint}`));
  //   const profileAccess = await CMAuth.getProfileAccess(userXCompanyId);
  //   if (!profileAccess || !profileAccess.accessRole)
  //     return res.status(403).send(errorObj(`No Access Role`));
  //   const accessRole = profileAccess.accessRole;
  //   req.body.querier.accessRole = accessRole;
  //   if (!accessRole.all) {
  //     const accessRight = accessRole.accessRoleRights.find(
  //       (r) => accessRightObj.className.startsWith(r.accessClassName) && r.key === endPoint
  //     );
  //     if (!accessRight)
  //       return res
  //         .status(403)
  //         .send(errorObj(`Unauthorized Access (CODE: 2) ${accessRightObj.className} ${endPoint}`));
  //   }
  // }

  ApiLogManager.log(req.body.querier, req.path);
  next(); // pass control to the next handler
});
