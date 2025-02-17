export const production_config = {
  emailApiToken: ``,
  emailApi: ``,
  emailJobApiRaw: ``,
  wsApi: ``,
  serverPath: `/var/crm/`,
  domain: ``,
  // domain: `https://app.web360.asia/`,
  mediaFolder: `/Users/qzt01/Desktop/profilepic`,
  mediaUrl: `http://localhost:8080/`,
  gcalendar: {},
  mode: `production`,
  db: {
    host: 'localhost',
    database: 'qz_crm',
    port: '3360',
    username: '',
    password: '',
    seekAccount: false,
    syncForce: false, // NEVER TOUCH THIS> FOREVER FALSE
    syncAlter: false,
    seek: {
      username: 'a',
      password: '123',
      companyName: 'coy',
    },
  },
};
