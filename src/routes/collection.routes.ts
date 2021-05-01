import { Router } from 'express'
import { getCollection, deleteCollection, updateCollection, addCollection, getCollectionItems, deleteCollectionItem, addCollectionItem } from '../controllers/collection.controller';
import { Collection } from '../interface/collection';
import { Request, Response } from '../interface/custom.request'
import { authenticate, hasValidToken } from '../middleware';


const router = Router();


router.route('/:id')
    .get(async (req: Request, res: Response) => {
        try {
            return res.json(
                await getCollection(parseInt(req.params.id))
            )
        } catch (e) {
            return res.status(422).send();
        }
    })
    .delete(authenticate, async (req: Request, res: Response) => {
        try {
            return res.json(
                await deleteCollection(parseInt(req.params.id))
            );
        } catch (e) {
            return res.status(422).send();
        }
    })
    .put(authenticate, async (req: Request, res: Response) => {
        try {
            return res.json(
                await updateCollection(req.body as Collection)
            )
        } catch (e) {
            return res.status(422).send();
        }
    })
    .post(authenticate, async (req: Request, res: Response) => {
        try {
            return res.json(
                await addCollection(req.body as Collection)
            )
        } catch (e) {
            console.log(e);
            return res.status(422).send();
        }
    });

router.route('/:collection/items/:start/:limit')
    .get(async (req: Request, res: Response) => {
        try {
            req.token = hasValidToken(req.cookies.jwt);
            if (req.cookies.jwt &&  req.token != false ) {
                return res.json(
                    await getCollectionItems(parseInt(req.params.id), parseInt(req.params.start), parseInt(req.params.limit) || 0, parseInt(req.token.id)  )
                );
            } else {
                return res.json(
                    await getCollectionItems(parseInt(req.params.id), parseInt(req.params.start), parseInt(req.params.limit) || 0 )
                );
            }
        } catch (e) {
            console.log(e);
            return res.status(422).send();
        }
    })

router.route('/:collection/item/:id')
    .delete(async (req: Request, res: Response) => {
        try {
            return res.json(
                await deleteCollectionItem(parseInt(req.params.collection), parseInt(req.params.id))
            );
        } catch (e) {
            return res.status(422).json();
        }
    })
    .post(async (req: Request, res: Response) => {
        try {
            return res.json(
                await addCollectionItem(parseInt(req.params.collection), parseInt(req.params.id))
            );
        } catch (e) {
            return res.status(422).json();
        }
    });

router.route('')
    .post(authenticate, async (req: Request, res: Response) => {
        try {
            req.body.created_by_id = req.token.id;
            return res.json(
                await addCollection(req.body)
            );
        } catch (e) {
            return res.status(422).send();
        }
    })

export default router;