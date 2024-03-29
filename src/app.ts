import express, { Application } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';

// Routes
import ImportRoutes from './routes/import.routes';
import IndexRoutes from './routes/index.routes'
import ItemRoutes from './routes/item.routes';
import LabelsRoutes from './routes/labels.routes';
import ItemsRoutes from './routes/items.routes';
import TopicRoutes from './routes/topic.routes';
import TypeRoutes from './routes/type.routes';
import UserRoutes from './routes/user.routes';
import FeedbackRoutes from './routes/feedback.routes';
import FeedbacksRoutes from './routes/feedbacks.routes';
import LanguageRoutes from './routes/language.routes';
import CollectionRoutes from './routes/collection.routes';
import CollectionsRoutes from './routes/collections.routes';
import { recalculateItemPositions } from './controllers/items.controller';
import * as https from 'https';
import compression from 'compression';

export class App {
    app: Application = express();

    constructor(
        private port: number
    ) {
        this.middleware();
        this.routes();

        recalculateItemPositions();
        setInterval(() => {
            recalculateItemPositions();
        }, 1000 * 60 * parseInt(process.env.POSITION_RECALCULATE_INTERVAL || "5"));
    }

    private middleware() {
        this.app.use(express.static(path.resolve(__dirname, '../html'), { maxAge: 31557600000 }));
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(compression());
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "*");
            res.header("Strict-Transport-Security", "max-age=63072000");
            res.header("X-Content-Type-Options", "nosniff");
            res.header("X-Frame-Options", "DENY");
            res.header("X-XSS-Protection", "1; mode=block");
            next();
        });
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    private routes() {
        this.app.use('/api/import', ImportRoutes);
        this.app.use('/', IndexRoutes);
        this.app.use('/api/items', ItemsRoutes);
        this.app.use('/api/item', ItemRoutes);
        this.app.use('/api/labels', LabelsRoutes);
        this.app.use('/api/topics', TopicRoutes);
        this.app.use('/api/types', TypeRoutes);
        this.app.use("/api/user", UserRoutes);
        this.app.use("/api/feedback", FeedbackRoutes);
        this.app.use("/api/feedbacks", FeedbacksRoutes);
        this.app.use("/api/languages", LanguageRoutes);
        this.app.use("/api/collection", CollectionRoutes);
        this.app.use("/api/collections", CollectionsRoutes);
        this.app.all('/*', (req, res) => {
            res.sendFile('/index.html', { root: path.resolve(__dirname, '../html') });
        })
    }

    async listen(): Promise<void> {
        const credentials = {
            key: fs.readFileSync(process.env.KEY_PATH as string),
            cert: fs.readFileSync(process.env.CERT_PATH as string)
        };
        https.createServer(credentials, this.app).listen(this.port || 3000, "0.0.0.0", 511);
    }
}