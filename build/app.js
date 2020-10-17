"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
// Routes
const import_routes_1 = __importDefault(require("./routes/import.routes"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const topic_routes_1 = __importDefault(require("./routes/topic.routes"));
const type_routes_1 = __importDefault(require("./routes/type.routes"));
const path_1 = __importDefault(require("path"));
class App {
    constructor(port) {
        this.port = port;
        this.app = express_1.default();
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings() {
        this.app.set('port', this.port || process.env.PORT || 3000);
    }
    middlewares() {
        console.log(path_1.default.resolve(__dirname, '../html'));
        this.app.use(express_1.default.static(path_1.default.resolve(__dirname, '../html')));
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.default.json());
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(cookie_parser_1.default());
    }
    routes() {
        this.app.use('/api/import', import_routes_1.default);
        this.app.use('/', index_routes_1.default);
        this.app.use('/api/items', item_routes_1.default);
        this.app.use('/api/topics', topic_routes_1.default);
        this.app.use('/api/types', type_routes_1.default);
    }
    async listen() {
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}
exports.App = App;
