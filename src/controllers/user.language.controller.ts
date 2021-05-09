import { environment } from "../env/environment";
import pool from "../lib/db";


export async function updateUserLanguages(user: number, languages: string[]):Promise<void> {
    if(!languages || !languages.length){
        languages = environment.defaultLanguages;
    }
    await pool.query("DELETE FROM user_languages WHERE user = ?", [user]);
    for (const i in languages) {
        await pool.query("INSERT INTO user_languages (user, language) VALUES (?, ?);", [user, languages[i] ]);
    }
}

export async function updateUserLanguage(user: number, language: string):Promise<void> {
    updateUserLanguages(user, [language]);
}

export async function addUserLanguages(user: number, languages: string[]):Promise<void> {
    for (const i in languages) {
        await pool.query("INSERT INTO user_languages (user, language) VALUES (?, ?);", [user, languages[i] ]);
    }
}

export async function addUserLanguage(user: number, language: string):Promise<void> {
    addUserLanguages(user, [language]);
}

export async function removeUserLanguages(user: number, languages: string[]):Promise<void> {
    await pool.query("DELETE FROM user_languages WHERE user = ? AND language IN (?);", [user, languages]);
}

export async function removeUserLanguage(user: number, language: string):Promise<void> {
    removeUserLanguages(user, [language]);
}


