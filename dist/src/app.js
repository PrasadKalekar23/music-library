"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const artistsRoutes_1 = __importDefault(require("./routes/artistsRoutes"));
const albumRoutes_1 = __importDefault(require("./routes/albumRoutes"));
const tracksRoutes_1 = __importDefault(require("./routes/tracksRoutes"));
const favoritesRoutes_1 = __importDefault(require("./routes/favoritesRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/api/v1', (req, res, next) => {
    res.json({ status: 200, message: "Welcome to Music Library" });
});
app.use('/api/v1', userRoutes_1.default, artistsRoutes_1.default, albumRoutes_1.default, tracksRoutes_1.default, favoritesRoutes_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map