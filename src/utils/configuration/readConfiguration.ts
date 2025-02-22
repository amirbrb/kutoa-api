export interface Configuration {
  sqlConfig: {
    host: string;
    user: string;
    password: string;
    databaseName: string;
    port: number;
  };
}

export default function readConfiguration(): Configuration {
  const config = require('../../../../kutoa.server.config.json');
  return config;
}
