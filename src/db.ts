import mysql from 'mysql2';
import readConfiguration from './utils/configuration/readConfiguration';
const config = readConfiguration();

const pool = mysql.createPool({
  host: config.sqlConfig.host,
  user: config.sqlConfig.user,
  password: config.sqlConfig.password,
  database: config.sqlConfig.databaseName,
  connectionLimit: 10,
  port: config.sqlConfig.port,
  multipleStatements: true,
});

export default pool.promise();
