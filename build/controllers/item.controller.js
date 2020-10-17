"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItem = exports.deleteItem = exports.getItem = exports.storeItem = exports.addItem = exports.getItems = void 0;
const db_1 = __importDefault(require("../lib/db"));
const pool = new db_1.default().getPool();
async function getItems(req, res) {
    const [rows] = await pool.query("SELECT  item.id, " +
        "item.likes, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "topic.name, " +
        "type.name, " +
        "type.view_external " +
        "FROM item, " +
        "topic, " +
        "type " +
        "WHERE " +
        "item.topic_id = topic.id " +
        "AND item.type_id = type.id;");
    return res.json(rows);
}
exports.getItems = getItems;
async function addItem(req, res) {
    storeItem(req.body).then(data => {
        return res.json(data);
    });
}
exports.addItem = addItem;
async function storeItem(data) {
    const [rows] = await pool.query('INSERT INTO item SET ?', [data]);
    data.id = rows.insertId;
    return data;
}
exports.storeItem = storeItem;
async function getItem(req, res) {
    const id = req.params.itemId;
    const [rows] = await pool.query("SELECT     item.id, " +
        "item.likes, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.type_id, " +
        "item.topic_id, " +
        "topic.name, " +
        "type.name, " +
        "type.view_external FROM item, " +
        "topic, " +
        "type " +
        "WHERE " +
        "item.topic_id = topic.id " +
        "AND item.type_id = type.id " +
        "AND item.id = ?", [id]);
    return res.json(rows);
}
exports.getItem = getItem;
async function deleteItem(req, res) {
    const id = req.params.itemId;
    await pool.query('DELETE FROM item WHERE item.id = ?', [id]);
    return res.json({
        message: 'Item deleted'
    });
}
exports.deleteItem = deleteItem;
async function updateItem(req, res) {
    const id = req.params.itemId;
    const updateItem = req.body;
    await pool.query('UPDATE item set ? WHERE id = ?', [updateItem, id]);
    return res.json({
        message: 'Item Updated'
    });
}
exports.updateItem = updateItem;
