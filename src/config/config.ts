import * as dotenv from 'dotenv';

dotenv.config();

const _config = {
    port: process.env.PORT,
    DB_Username: process.env.DB_Username,
    DB_Password: process.env.DB_Password,
    DB_URL: process.env.DB_URL,
    database: process.env.Database,
    DB_encrypt: Boolean(process.env.DB_encrypt),
    DB_TrustServerCertificate: Boolean(process.env.DB_TrustServerCertificate),
    jwt_sercet: process.env.JWT_SECRET,
    default_user_role: process.env.DEFAULT_USER_ROLE,
}

export const config = Object.freeze(_config);