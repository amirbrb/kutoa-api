import {AppConfiguration} from './config.types';

// config.js
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({path: path.resolve(process.cwd(), '.env')});

// Define configuration with defaults
const config: AppConfiguration = {
  appUrl: `${process.env.APP_HOST}:${process.env.PORT}`,
  host: process.env.APP_HOST,
  port: parseInt(process.env.PORT),
  sqlConfig: {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    databaseName: process.env.SQL_DATABASE,
    port: parseInt(process.env.SQL_PORT),
  },
  emailConfig: {
    appPassword: process.env.EMAIL_APP_PASSWORD,
  },
};

// Freeze the configuration to prevent modifications
const frozenConfig = Object.freeze(config);

export default frozenConfig;
