import { MODELS } from '../../sequelize.js';
import { JWT_signProfile } from '../../routes/JWT/JWTHelper.js';
const classIdentifier = 'Company Auth';
export class CMAuth {
  static async login(username, password) {
    const { Account, UserProfile, CompanyProfile, Jwt } = MODELS;
    console.log(`username, password`, username, password);
    const accountE = await Account.findOne({
      where: { username, password },
      include: [
        {
          model: UserProfile,
          required: true,
          where: {
            status: `active`,
          },
        },
      ],
    });
    console.log(accountE.username, username);
    console.log(accountE.password, password);
    if (accountE.username != username) throw Error(`Invalid Credential (1)`);
    console.log(`pass 1`);
    if (accountE.password != password || !password) throw Error(`Invalid Credential (2)`);
    console.log(`pass 2`);
    const account = await accountE.get({ plain: true });

    const status = account.userProfile.status;
    if (`active` !== status) {
      throw Error(`status invalid`);
    }

    const tokenObj = JWT_signProfile(account.userProfile, 'userProfile');
    account.tokenObj = tokenObj;
    await Jwt.create({
      token: tokenObj.token,
      expire: tokenObj.expiresIn,
      profileType: `userProfile`,
      userProfileId: account.userProfile.id,
    });
    return account;
  }

  static async loginViaSSO(querier, ssoToken) {
    console.log(`sso??`, ssoToken);
    const { Account, UserProfile, CompanyProfile, UserXCompany } = MODELS;
    const userXCompanyE = await UserXCompany.findOne({ where: { ssoToken } });
    if (userXCompanyE) {
      await userXCompanyE.update({ ssoToken: null });
      console.log(`userXCompanyE??`, userXCompanyE);
      const userProfileE = await UserProfile.findByPk(userXCompanyE.userProfileId);
      console.log(`userProfileE??`, userProfileE);
      const account = await Account.findByPk(userProfileE.accountId, {
        include: [
          {
            model: UserProfile,
            include: [
              {
                model: CompanyProfile,
                where: { id: userXCompanyE.companyProfileId },
              },
            ],
          },
        ],
      });
      return await account.get({ plain: true });
    }
    return null;
  }

  static async profile(querier) {
    const { UserProfile, CompanyProfile } = MODELS;
    const claims = querier.claims;
    const account = await UserProfile.findByPk(claims.id, { where: { status: `active` } });
    return await account.get({ plain: true });
  }
  
  static async getProfileAccess(userXCompanyId) {
    const { UserXCompany, AccessRole, AccessRoleRight } = MODELS;
    const account = await UserXCompany.findByPk(userXCompanyId, {
      include: [
        {
          model: AccessRole,
          required: true,
          include: [
            {
              model: AccessRoleRight,
            },
          ],
        },
      ],
    });
    console.log(`has account?`, !!account);
    if (!account) return null;
    return await account.get({ plain: true });
  }

  static async checkJwt(token) {
    const { Jwt } = MODELS;
    const jwt = await Jwt.findOne({ where: { token } });
    return !!jwt;
  }
}
