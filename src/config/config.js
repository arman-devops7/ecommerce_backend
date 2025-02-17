import { development_config } from './development.js';
import { sandbox_config } from './sandbox.js';
import { production_config } from './production.js';
export let envConfig;
export const loadConfig = (mode) => {
  console.log(`loadConfig??`, mode);
  console.log(`DB_USERNAME??`, process.env.DB_USERNAME);
  switch (mode) {
    case 'development':
      console.log(`loading development`);
      envConfig = development_config;
      break;
    case 'sandbox':
      console.log(`loading development`);
      envConfig = sandbox_config;
      break;

    case 'production':
      console.log(`loading production`);
      envConfig = production_config;
      break;
  }
  return envConfig;
};
