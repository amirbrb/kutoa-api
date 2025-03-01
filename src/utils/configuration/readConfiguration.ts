export enum AppEnvironment {
  Local = 'local',
  Dev = 'dev',
  Prod = 'prod',
}

export interface Configuration {
  env: AppEnvironment;
  sqlConfig: {
    host: string;
    user: string;
    password: string;
    databaseName: string;
    port: number;
  };
  gmailConfig: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken: string;
  };
}

interface AppConfiguration extends Configuration {
  appUrl: string;
}

export default function readConfiguration(): AppConfiguration {
  const config = require('../../../../kutoa.server.config.json');

  return {
    ...config,
    appUrl: `${config.env === AppEnvironment.Local ? 'http' : 'https'}://${config.env === AppEnvironment.Local ? 'localhost:3000' : 'kutoa-app.com'}`,
  };
}
