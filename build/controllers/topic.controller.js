"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTopic = exports.deleteTopic = exports.getTopics = exports.addTopic = exports.getTopic = void 0;
const db_1 = __importDefault(require("../lib/db"));
const pool = new db_1.default().getPool();
async function getTopic(req, res) {
    const [rows] = await pool.query("SELECT  id, " +
        "name " +
        "FROM " +
        "topic " +
        "WHERE " +
        "id = ?;", [req.params.typeId]);
    return res.json(rows);
}
exports.getTopic = getTopic;
async function addTopic(req, res) {
    await pool.query('INSERT INTO topic SET ?', [req.body]);
    return res.json({
        message: 'New Topic Created'
    });
}
exports.addTopic = addTopic;
async function getTopics(req, res) {
    const [rows] = await pool.query("SELECT  id, " +
        "name " +
        "FROM " +
        "topic;");
    return res.json(rows);
}
exports.getTopics = getTopics;
async function deleteTopic(req, res) {
    const id = req.params.topicId;
    await pool.query('DELETE FROM topic WHERE topic.id = ?', [id]);
    return res.json({
        message: 'Topic deleted'
    });
}
exports.deleteTopic = deleteTopic;
async function updateTopic(req, res) {
    const id = req.params.topicId;
    const updateItem = req.body;
    await pool.query('UPDATE topic SET ? WHERE id = ?', [updateItem, id]);
    return res.json({
        message: 'Topic Updated'
    });
}
exports.updateTopic = updateTopic;
