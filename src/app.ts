import express, { Application } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

// Routes
import ImportRoutes from './routes/import.routes';
import IndexRoutes from './routes/index.routes'
import ItemRoutes from './routes/item.routes';
import TopicRoutes from './routes/topic.routes';
import TypeRoutes from './routes/type.routes';
import FullRoutes from './routes/full.routes';
import FullUserRoutes from './routes/fullUser.routes';
import UserRoutes from './routes/user.routes';
import FeedbackRoutes from './routes/feedback.routes';
import LanguageRoutes from './routes/language.routes';
import * as http from 'http';
import * as https from 'https';

export class App {
    app: Application = express();

    constructor(
        private port: number | string,
        private secPort: number | string
    ) {
        this.middlewares();
        this.routes();
    }

    private middlewares() {
        this.app.use((req, res, next) => {
            if (process.env.PROD === 'true') {
                if (req.protocol !== 'https') {
                    return res.redirect('https://' + (req.headers.host || 'appsterdb.ackermann.digital').split(':')[0] + req.url);
                } else {
                    return next();
                }
            } else {
                return next();
            }
        });
        this.app.use(express.static(path.resolve(__dirname, '../html'), { maxAge: 31557600000 }));
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "*");
            next();
        });
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private routes() {
        this.app.use('/api/import', ImportRoutes);
        this.app.use('/', IndexRoutes);
        this.app.use('/api/items', ItemRoutes);
        this.app.use('/api/topics', TopicRoutes);
        this.app.use('/api/types', TypeRoutes);
        this.app.use('/api/full', FullRoutes);
        this.app.use('/api/fullUser', FullUserRoutes);
        this.app.use("/api/user", UserRoutes);
        this.app.use("/api/feedback", FeedbackRoutes);
        this.app.use("/api/languages", LanguageRoutes);
        this.app.all('/*', (req, res) => {
            res.sendFile('/index.html', { root: path.resolve(__dirname, '../html') });
        })
    }

    async listen(): Promise<void> {
        const privateKey = fs.readFileSync(process.env.KEY_PATH as string);
        const certificate = fs.readFileSync(process.env.CERT_PATH as string);
        const credentials = { key: privateKey, cert: certificate };
        http.createServer(this.app).listen(this.port || process.env.PORT || 3000);
        https.createServer(credentials, this.app).listen(this.secPort || process.env.PORT || 443);
    }

}