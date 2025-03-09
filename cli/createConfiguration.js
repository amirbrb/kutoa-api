const {log} = require('console');
const fs = require('fs');

// Get environment from command line or use default
const environment = process.argv[2] || 'development';
const envFile = `.env.${environment}`;

// Check if the environment file exists
if (!fs.existsSync(envFile)) {
  console.error(`Environment file ${envFile} not found!`);
  process.exit(1);
}

// Read environment variables
require('dotenv').config({path: envFile});

// Create runtime config.js that will be bundled
const configContent = `
{
  "appUrl": "${process.env.APP_HOST}:${process.env.APP_PORT}",
  "host": "${process.env.APP_HOST}",
  "port": "${process.env.APP_PORT}",
  "sqlConfig" : {
    "host": "${process.env.SQL_HOST}",
    "user": "${process.env.SQL_USER}",
    "password": "${process.env.SQL_PASSWORD}",
    "databaseName": "${process.env.SQL_DATABASE}",
    "port": "${process.env.SQL_PORT}"
  },
  "emailConfig": {
    "appPassword": "${process.env.EMAIL_APP_PASSWORD}"
  }
}
`;

// Write to the config file
fs.writeFileSync('./src/app.config.json', configContent);
console.log(`Environment config for ${environment} created successfully.`);
