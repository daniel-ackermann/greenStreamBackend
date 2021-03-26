import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { getLabels, getLabelsOfItem } from '../controllers/labels.controller';

const router = Router();

router.route('/item/:id')
    .get(async (req: Request, res: Response) => {
        return res.json(
            await getLabelsOfItem(parseInt(req.params.id))
        )
    });

router.route('/')
    .get(async (req: Request, res: Response) => {
        return res.json(
            await getLabels()
        )
    })

export default router;