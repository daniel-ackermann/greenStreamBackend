import express, { Application } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// Routes
import ImportRoutes from './routes/import.routes';
import IndexRoutes from './routes/index.routes'
import ItemRoutes from './routes/item.routes';
import TopicRoutes from './routes/topic.routes';
import TypeRoutes from './routes/type.routes';
import path from 'path';

export class App {
    app: Application;

    constructor(
        private port?: number | string
    ) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    private settings() {
        this.app.set('port', this.port || process.env.PORT || 3000);
    }

    private middlewares() {
        console.log(path.resolve(__dirname, '../html'));
        this.app.use(express.static(path.resolve(__dirname, '../html')));
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
    }

    async listen(): Promise<void> {
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }

}