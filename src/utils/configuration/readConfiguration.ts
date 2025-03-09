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
  console.log('reading configuration', process.env);

  return {
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
}
