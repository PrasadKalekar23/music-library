"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExistingUser = checkExistingUser;
exports.createNewUser = createNewUser;
const DBConnection_1 = require("../DBConnection");
async function checkExistingUser(userEmail) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const emailCheckQuery = `SELECT * FROM Users WHERE email = '${userEmail}'`;
        const sqlResponse = await pool.request().query(emailCheckQuery);
        const recordSet = sqlResponse.recordset;
        if (recordSet.length)
            return true;
        else
            return false;
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function createNewUser(email, password, role) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const emailCheckQuery = `insert into Users values('${email}', '${password}', '${role}')`;
        await pool.request().query(emailCheckQuery);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
//# sourceMappingURL=expenseTrackerSQLDataStore.js.map