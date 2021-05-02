import { Request, Response } from "express";
import { addItem } from "../controllers/item.controller"
import { Item } from "../interface/item";

export async function importJSON(req: Request, res: Response): Promise<Response> {
    const data = JSON.parse(req.body.data);
    for(let index = 0; index < data.length; index++ ){
        const item = data[index];
        if (item.title == '' || item.description == '') {
            continue;
        }
        if (item.explanation_id == 'N') {
            item.explanation_id = 0;
        }
        const newItem = new Item(item.title, item.description, item.url, item.type, item.topic, item.language, item.image);
        await addItem(newItem);
    }
    return res.json(200);
}