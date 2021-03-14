# REST-Endpunkte

```
GET         http://appsterdb.ackermann.digital/api/items                Liste aller Items
POST      * http://appsterdb.ackermann.digital/api/items                ADD Item
GET       * https://appsterdb.ackermann.digital/api/items/review        GET items to review

GET       * https://appsterdb.ackermann.digital/api/items/reviewed      GET userdata
GET       * https://appsterdb.ackermann.digital/api/items/created       GET userdata
GET       * https://appsterdb.ackermann.digital/api/items/liked         GET userdata
GET       * https://appsterdb.ackermann.digital/api/items/watched       GET userdata
GET       * https://appsterdb.ackermann.digital/api/items/watchlist     GET userdata
GET       * https://appsterdb.ackermann.digital/api/items/status        GET update with object of type Status

GET         http://appsterdb.ackermann.digital/api/items/136       GET Item mit ID 136
DELETE    * http://appsterdb.ackermann.digital/api/items/136       DELETE Item mit ID 136
PUT       * http://appsterdb.ackermann.digital/api/items/136       EDIT Item mit ID 136

GET       * http://appsterdb.ackermann.digital/api/types           Liste aller Typen
PUT       * http://appsterdb.ackermann.digital/api/types           Ändert einen Typen
DELETE    * http://appsterdb.ackermann.digital/api/types           Löscht einen Typen
POST      * http://appsterdb.ackermann.digital/api/types           Erstellt einen Typen

GET       * http://appsterdb.ackermann.digital/api/topic           Liste aller Topic
PUT       * http://appsterdb.ackermann.digital/api/topic           Ändert einen Topic
DELETE    * http://appsterdb.ackermann.digital/api/topic           Löscht einen Topic
POST      * http://appsterdb.ackermann.digital/api/topic           Erstellt einen Topic

GET         http://appsterdb.ackermann.digital/api/topics          Liste aller Topics

POST      * http://appsterdb.ackermann.digital/import              Import von JSON

GET         http://appsterdb.ackermann.digital/passwordRestore     Hier kann das neue Passwort gesetzt wernen
POST        http://appsterdb.ackermann.digital/passwordRestore     Nach Rücksetzen durch email wird hier das neue passwort gesetzt.


DELETE      http://appsterdb.ackermann.digital/login               Ausloggen
POST        http://appsterdb.ackermann.digital/login               Einloggen
GET         http://appsterdb.ackermann.digital/login               Eingeloggt?

DELETE    * http://appsterdb.ackermann.digital/account             Account löschen
POST        http://appsterdb.ackermann.digital/account             Account erstellen
GET         http://appsterdb.ackermann.digital/account             Passwortvergessen-Email-anfrage

GET         http://appsterdb.ackermann.digital/api/full            {type:[], information_data:[], topics:[]}
```

Vorgehen:
POST /login => Setzt Cookie der mitgeschickt werden muss um eingeloggt zu sein.

# Datentypen:

```
export interface Item {
    id: number,
    likes: number,
    explanation_id?: number,
    type_id: number,
    url: string,
    description: string,
    title: string,
    topic_id: number,
    language: [string],
    simple: number
}
```
```

export interface Topic {
    id: number,
    name: string
}
```

```
export interface Type {
    view_external: boolean,
    name: string,
    id: number
}
```

```
export interface User {
    username: string;
    password: string;
    email: string;
    role: string;
}
```

```
export interface Status {
    id: number;
    liked?: boolean;
    watchlist?: boolean;
    watched?: boolean;
}
```

Timestamp: gibt letzte veränderung des Nutzers wieder.