"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbConnection = exports.initializeDatabase = void 0;
const mssql_1 = __importDefault(require("mssql"));
const config_1 = require("./config/config");
const dbConfig = {
    user: config_1.config.DB_Username,
    password: config_1.config.DB_Password,
    server: config_1.config.DB_URL,
    database: config_1.config.database,
    options: {
        encrypt: config_1.config.DB_encrypt || false,
        trustServerCertificate: config_1.config.DB_TrustServerCertificate || false,
    },
};
let connectionPool = null;
const initializeDatabase = async () => {
    try {
        if (!connectionPool) {
            connectionPool = await new mssql_1.default.ConnectionPool(dbConfig).connect();
            console.log('Connected to MSSQL database successfully.');
        }
    }
    catch (error) {
        console.error('Error connecting to MSSQL database:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
const getDbConnection = async () => {
    if (!connectionPool) {
        throw new Error('Database connection has not been initialized. Call initializeDatabase first.');
    }
    return connectionPool;
};
exports.getDbConnection = getDbConnection;
//# sourceMappingURL=DBConnection.js.map