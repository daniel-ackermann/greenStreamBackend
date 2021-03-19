import pool from "../lib/db";


export async function updateUserLanguages(user: number, languages: [number]):Promise<void> {
    await pool.query("DELETE FROM user_languages WHERE user = ?", [user]);
    for (const i in languages) {
        await pool.query("INSERT INTO user_languages (user, language) VALUES (?, ?);", [user, languages[i] ]);
    }
}

export async function updateUserLanguage(user: number, language: number):Promise<void> {
    updateUserLanguages(user, [language]);
}

export async function addUserLanguages(user: number, languages: number[]):Promise<void> {
    for (const i in languages) {
        await pool.query("INSERT INTO user_languages (user, language) VALUES (?, ?);", [user, languages[i] ]);
    }
}

export async function addUserLanguage(user: number, language: number):Promise<void> {
    addUserLanguages(user, [language]);
}

export async function removeUserLanguages(user: number, languages: [number]):Promise<void> {
    await pool.query("DELETE FROM user_languages WHERE user = ? AND language IN ?;", [user, languages]);

}

export async function removeUserLanguage(user: number, language: number):Promise<void> {
    removeUserLanguages(user, [language]);
}


