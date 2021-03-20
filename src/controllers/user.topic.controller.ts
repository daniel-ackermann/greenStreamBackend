import { environment } from "../env/environment";
import pool from "../lib/db";


export async function updateUserTopics(user: number, topics: number[]):Promise<void> {
    if(!topics || topics.length){
        topics = environment.defaultTopics;
    }
    await pool.query("DELETE FROM user_topics WHERE user = ?", [user]);
    for (const i in topics) {
        await pool.query("INSERT INTO user_topics (user, topic) VALUES (?, ?);", [user, topics[i] ]);
    }
}

export async function updateUserTopic(user: number, topic: number):Promise<void> {
    updateUserTopics(user, [topic]);
}

export async function addUserTopics(user: number, topics: number[]):Promise<void> {
    for (const i in topics) {
        await pool.query("INSERT INTO user_topics (user, topic) VALUES (?, ?);", [user, topics[i] ]);
    }
}

export async function addUserTopic(user: number, topic: number):Promise<void> {
    addUserTopics(user, [topic]);
}

export async function removeUserTopics(user: number, topics: number[]):Promise<void> {
    await pool.query("DELETE FROM user_topics WHERE user = ? AND topic IN ?;", [user, topics]);
}

export async function removeUserTopic(user: number, topic: number):Promise<void> {
    removeUserTopics(user, [topic]);
}