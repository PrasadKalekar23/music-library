import sql, { config as sqlConf}  from 'mssql';
import {config} from "./config/config";

const dbConfig: sqlConf = {
  user: config.DB_Username,
  password: config.DB_Password,
  server: config.DB_URL,
  database: config.database,
  options: {
    encrypt: config.DB_encrypt || false,
    trustServerCertificate: config.DB_TrustServerCertificate || false,
  },
};

let connectionPool: sql.ConnectionPool | null = null;

export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!connectionPool) {
      connectionPool = await new sql.ConnectionPool(dbConfig).connect();
      console.log('Connected to MSSQL database successfully.');
    }
  } catch (error) {
    console.error('Error connecting to MSSQL database:', error);
    throw error;
  }
};

export const getDbConnection = async(): sql.ConnectionPool => {
  if (!connectionPool) {
    throw new Error('Database connection has not been initialized. Call initializeDatabase first.');
  }
  return connectionPool;
};
