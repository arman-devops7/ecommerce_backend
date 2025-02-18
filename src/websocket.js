import dotenv from 'dotenv';
dotenv.config();
import { loadConfig } from './config/config.js';
import express from 'express';
import { startConnection } from './sequelize.js';
// import { generalApis } from './routes/general/general_api.js';
import serverHttp from 'http';
import socket from 'socket.io';
import { JWT_verifyProfile } from './routes/JWT/JWTHelper.js';
import { AMNotification } from './entityManagers/admin/amNotification.js';
import Sequelize from 'sequelize';

const init = async () => {
  console.log(`process.env.NODE_ENV?`, process.env.NODE_ENV);
  const envConfig = loadConfig(process.env.NODE_ENV);
  startConnection();
  const app = express();

  const server = serverHttp.createServer(app);
  // app.use(admin_access_api);
  const io = socket(server);

  const connectedProfile = {};
  io.on('connection', (socket) => {
    //ASKING TO REPORT IN
    io.emit('report_in');

    //DISCONNECT
    socket.on('disconnect', function () {
      delete connectedProfile[socket.profileKey];
    });

    //REQUEST TO CONNECT
    socket.on('request_connection', ({ jwt }) => {
      const claims = JWT_verifyProfile(jwt.startsWith('Bearer ') ? jwt.slice(7) : jwt);
      if (claims) {
        const extend = jwt.substr(jwt.length - 10, jwt.length);
        const profileKey = `${claims.profileType}${claims.id}_${extend}`;
        connectedProfile[profileKey] = claims;
        socket.profileKey = profileKey;
        io.emit(`${profileKey}_connected`);
      } else {
        socket.disconnect();
      }
    });
  });

  setInterval(() => {
    const sent = [];
    console.log(`start`);
    Object.keys(connectedProfile).forEach(async (k) => {
      const profile = connectedProfile[k];

      const unique = `${profile.profileType}${profile.id}`;
      if (!sent.includes(unique)) {
        sent.push(unique);
        try {
          const Op = Sequelize.Op;
          const where = {
            [Op.or]: [
              { profileType: 'everyone' },
              {
                [Op.and]: [
                  { profileType: profile.profileType },
                  { profileId: profile.id },
                ],
              },
            ],
          };
          const detail = await AMNotification.list(null, where, { limit: 10 });
          io.emit(k, {
            detail,
          });
        } catch (error) { }
      }
    });
  }, 5000);
  server.listen(process.env.NOTIFICATION_SOCKET_PORT, () => {
    console.log(
      `ADMIN START:: Listening on NOTIFICATION_SOCKET_PORT ${process.env.NOTIFICATION_SOCKET_PORT}!`
    );
    console.log(
      `ADMIN START:: ENV MODE ${JSON.stringify(process.env.NODE_ENV)}!`
    );
    //load config
  });
};
init();
