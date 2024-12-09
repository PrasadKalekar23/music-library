"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const config_1 = require("./src/config/config");
const startServer = async () => {
    const port = config_1.config.port || 3000;
    // await initializeDatabase();
    app_1.default.listen(port, () => {
        console.log(`server started at port: ${[port]}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map