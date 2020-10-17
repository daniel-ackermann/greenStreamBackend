import { Request, Response } from "express";
import { storeItem } from "../controllers/item.controller"
import { Item } from "../interface/item";

export async function importJSON(req: Request, res: Response): Promise<void> {
    const data = JSON.parse(req.body.data);
    data.forEach((item: any) => {
        if (item.title == '' || item.description == '') {
            return;
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
        storeItem(newItem);
    });
}