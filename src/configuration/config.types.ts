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

export interface AppConfiguration extends Configuration {
  appUrl: string;
  port: number;
  host: string;
}
