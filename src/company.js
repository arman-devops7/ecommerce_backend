import dotenv from 'dotenv';
dotenv.config();
import { loadConfig } from './config/config.js';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { companyApis } from './routes/company/company_api.js';
import { adminApis } from './routes/admin/admin_api.js';
import { sequelize, startConnection } from './sequelize.js';

// import moment from 'moment';
// import { CronJob } from 'cron';

const init = async () => {
  console.log(`process.env.NODE_ENV?`, process.env);
  const envConfig = loadConfig(process.env.NODE_ENV);

  startConnection();
  // const [results, metadata] = await sequelize.query('SELECT * from accounts');
  // console.log(`results?`, results);

  const app = express();
  app.use(cors());
  app.use(
    morgan('combined', {
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    bodyParser.json({
      limit: '300mb',
    })
  );

  app.use(companyApis);
  app.use(adminApis);

  app.listen(process.env.COMPANY_PORT, () => {
    console.log(
      `COMPANY START:: Listening on COMPANY_PORT ${process.env.COMPANY_PORT}!`
    );
    console.log(
      `COMPANY START:: ENV MODE ${JSON.stringify(process.env.NODE_ENV)}!`
    );
    //load config
  });

  // const job = new CronJob('* * * * *', function () {
  //   console.log('Running cron', new Date());
  //   // AutomationManager.scheduledAutomationMessage();
  // });
  // job.start();
};
init();
