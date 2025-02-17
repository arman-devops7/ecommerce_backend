import { MODELS } from '../../sequelize.js';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

export class CMHelper {
  static getStdIncSim = (querier) => {
    return [
      {
        model: MODELS.CompanyProfile,
        where: { id: querier.companyId },
        required: true,
      },
    ];
  };
  static getStdInc = async (querier, globalName) => {
    if (!globalName) throw Error(`Invalid INCLUDE ERROR`);
    const arr = [
      {
        model: MODELS.CompanyProfile,
        where: { id: querier.companyId },
        required: true,
      },
    ];
    const role = querier.role;
    if (`ADMIN` === role) return arr;
    const accessRole = querier.accessRole;
    if (accessRole && accessRole.all) return arr;
    if (accessRole) {
      const foundGlobal = accessRole.accessRoleRights.find(
        (r) => r.accessClassName === globalName && `global` === r.key
      );
      if (foundGlobal) return arr;
    }

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

    const opOrs = [{ userXCompanyId: querier.userXCompanyId }];
    teams.forEach((t) => {
      opOrs.push({
        teamId: t.id,
      });
    });
    arr.push({
      model: MODELS.DocShare,
      required: true,
      where: {
        [Op.or]: opOrs,
      },
    });
    return arr;
  };
}
