"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importJSON = void 0;
const item_controller_1 = require("../controllers/item.controller");
async function importJSON(req, res) {
    const data = JSON.parse(req.body.data);
    data.forEach((item) => {
        if (item.title == '' || item.description == '') {
            return;
        }
        if (item.explanation_id == 'N') {
            item.explanation_id = 0;
        }
        const newItem = {
            title: item.title,
            description: item.description,
            url: item.url || '',
            topic_id: item.topic_id || 0,
            type_id: item.type_id || 0,
            likes: item.likes || 0,
            simple: item.simple || 0,
            explanation_id: item.explanation_id,
            language: ["de"]
        };
        item_controller_1.storeItem(newItem);
    });
}
exports.importJSON = importJSON;
