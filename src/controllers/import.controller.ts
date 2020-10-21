import { Request, Response } from "express";
import { addItem } from "../controllers/item.controller"
import { Item } from "../interface/item";

export async function importJSON(req: Request, res: Response): Promise<Response> {
    const data = JSON.parse(req.body.data);
    for(let index = 0; index < data.length; index++ ){
        let item = data[index];
        if (item.title == '' || item.description == '') {
            continue;
        }
        if (item.explanation_id == 'N') {
            item.explanation_id = 0;
        }
        const newItem: Item = {
            title: item.title,
            description: item.description,
            url: item.url || '',
            topic_id: item.topic_id || 0,
            type_id: item.type_id || 0,
            likes: item.likes || 0,
            simple: item.simple || 0,
            explanation_id: item.explanation_id,
            language: ["de"]
        }
        await addItem(newItem);
    }
    return res.json(200);
}