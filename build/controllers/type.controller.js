"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateType = exports.deleteType = exports.getTypes = exports.addType = exports.getType = void 0;
const db_1 = __importDefault(require("../lib/db"));
const pool = new db_1.default().getPool();
async function getType(req, res) {
    const [rows] = await pool.query("SELECT  type.id, " +
        "type.name, " +
        "type.view_external " +
        "FROM " +
        "type " +
        "WHERE " +
        "type.id = ?;", [req.params.typeId]);
    return res.json(rows);
}
exports.getType = getType;
async function addType(req, res) {
    await pool.query('INSERT INTO item SET ?', [req.body]);
    return res.json({
        message: 'New Item Created'
    });
}
exports.addType = addType;
async function getTypes(req, res) {
    const [rows] = await pool.query("SELECT  type.id, " +
        "type.name, " +
        "type.view_external " +
        "FROM " +
        "type;");
    return res.json(rows);
}
exports.getTypes = getTypes;
async function deleteType(req, res) {
    await pool.query('DELETE FROM type WHERE type.id = ?', [req.params.typeId]);
    return res.json({
        message: 'Item deleted'
    });
}
exports.deleteType = deleteType;
async function updateType(req, res) {
    const id = req.params.typeId;
    const updateItem = req.body;
    await pool.query('UPDATE type SET ? WHERE id = ?', [updateItem, id]);
    return res.json({
        message: 'Item Updated'
    });
}
exports.updateType = updateType;
