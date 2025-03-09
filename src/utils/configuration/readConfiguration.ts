export enum AppEnvironment {
  Local = 'local',
  Dev = 'dev',
  Prod = 'prod',
}

export interface Configuration {
  sqlConfig: {
    host: string;
    user: string;
    password: string;
    databaseName: string;
    port: number;
  };
  emailConfig: {
    appPassword: string;
  };
}

interface AppConfiguration extends Configuration {
  appUrl: string;
  port: number;
  host: string;
}

export default function readConfiguration(): AppConfiguration {
  const config = require('../../app.config.json');
  return JSON.parse(JSON.stringify(config));
}
