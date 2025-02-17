import { CMCustomer } from '../../entityManagers/company/cmCustomer.js';
import { MODELS } from '../../sequelize.js';

export let reloading = false;
export let customerCache = {};
export const getCustomerCache = async (companyId, querier) => {
  let detail = customerCache[`${companyId}`];
  if (!detail || !detail.list) {
    console.log(`1:: cannot find cache for companyId:`, companyId, detail);
    await reloadCustomerCache(querier);
    detail = customerCache[`${companyId}`];
    if (!detail || !detail.list) {
      console.log(`2:: cannot find cache for companyId:`, companyId, detail);
      return { ok: true, list: [] };
    }
  }
  console.log(`preparing from cache`);
  const list = detail.list;
  const role = querier.role;
  if (`ADMIN` === role) return detail;
  const accessRole = querier.accessRole;
  if (accessRole && accessRole.all) return detail;
  if (accessRole) {
    const foundGlobal = accessRole.accessRoleRights.find(
      (r) => r.accessClassName === `Customer` && `global` === r.key
    );
    if (foundGlobal) return detail;
  }
  const filterList = [];

  console.log(`not admin...`);
  //Get User Team Id
  const teams = await MODELS.Team.findAll({
    where: { companyProfileId: querier.companyId },
    include: [
      {
        required: true,
        model: MODELS.TeamMember,
        where: { userXCompanyId: querier.userXCompanyId },
      },
    ],
  });

  const teamIds = [];
  teams.forEach((t) => {
    teamIds.push(t.id);
  });
  for (const l of list) {
    const docShares = l.docShares;
    for (const d of docShares) {
      if (d.userXCompanyId === querier.userXCompanyId) {
        filterList.push(l);
        continue;
      }
      if (teamIds.includes(d.teamId)) {
        filterList.push(l);
        continue;
      }
    }
  }
  console.log(`get customer cache done`);
  return { ok: true, list: filterList };
};
export const setCustomerCache = (companyId, detail, customerId) => {
  console.log(`setCustomerCache?`, companyId, customerId);
  // load new row or replace row
  if (customerId) {
    const foundDetail = customerCache[`${companyId}`];
    if (foundDetail && detail.list.length > 0) {
      const list = foundDetail.list;
      let found = false;
      for (let l of list) {
        if (l.id == customerId) {
          // l = detail.list[0];
          Object.assign(l, detail.list[0]);
          found = true;
          break;
        }
      }
      if (!found) {
        list.push(detail.list[0]);
      }
      customerCache[`${companyId}`].list = list;
    } else {
    }
  } else {
    customerCache[`${companyId}`] = detail;
  }
};
export const reloadCustomerCache = async (querier, customerId) => {
  if (!reloading) {
    const { companyId } = querier;
    console.log(`reloadCustomerCache?`, companyId);
    const where = {};
    let forceDefault = false;
    if (customerId && customerCache[`${companyId}`]) {
      console.log(`reload only customer????`);
      where.id = customerId;
    } else {
      forceDefault = true;
    }
    const detail = await CMCustomer.list(querier, where);
    if (forceDefault) setCustomerCache(companyId, detail);
    else setCustomerCache(companyId, detail, customerId);
    reloading = false;
  } else {
    setTimeout(() => {
      reloading = false;
    }, 5000);
  }
};
