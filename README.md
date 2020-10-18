# REST-Endpunkte

```
GET         http://appsterdb.ackermann.digital:3000/api/items           Liste aller Items
POST      * http://appsterdb.ackermann.digital:3000/api/items           ADD Item

GET         http://appsterdb.ackermann.digital:3000/api/items/136       GET Item mit ID 136
DELETE    * http://appsterdb.ackermann.digital:3000/api/items/136       DELETE Item mit ID 136
PUT       * http://appsterdb.ackermann.digital:3000/api/items/136       EDIT Item mit ID 136

GET       * http://appsterdb.ackermann.digital:3000/api/types           Liste aller Typen
PUT       * http://appsterdb.ackermann.digital:3000/api/types           Ändert einen Typen
DELETE    * http://appsterdb.ackermann.digital:3000/api/types           Löscht einen Typen
POST      * http://appsterdb.ackermann.digital:3000/api/types           Erstellt einen Typen

GET       * http://appsterdb.ackermann.digital:3000/api/topic           Liste aller Topic
PUT       * http://appsterdb.ackermann.digital:3000/api/topic           Ändert einen Topic
DELETE    * http://appsterdb.ackermann.digital:3000/api/topic           Löscht einen Topic
POST      * http://appsterdb.ackermann.digital:3000/api/topic           Erstellt einen Topic

GET         http://appsterdb.ackermann.digital:3000/api/topics          Liste aller Topics

POST      * http://appsterdb.ackermann.digital:3000/import              Import von JSON

GET         http://appsterdb.ackermann.digital:3000/passwordRestore     Hier kann das neue Passwort gesetzt wernen
POST        http://appsterdb.ackermann.digital:3000/passwordRestore     Nach Rücksetzen durch email wird hier das neue passwort gesetzt.


DELETE      http://appsterdb.ackermann.digital:3000/login               Ausloggen
POST        http://appsterdb.ackermann.digital:3000/login               Einloggen
GET         http://appsterdb.ackermann.digital:3000/login               Eingeloggt?

DELETE    * http://appsterdb.ackermann.digital:3000/account             Account löschen
POST        http://appsterdb.ackermann.digital:3000/account             Account erstellen
GET         http://appsterdb.ackermann.digital:3000/account             Passwortvergessen-Email-anfrage

GET         http://appsterdb.ackermann.digital:3000/api/full            {type:[], information_data:[], topics:[]}
```

Vorgehen:
POST /login => Setzt Cookie der mitgeschickt werden muss um eingeloggt zu sein.

# Datentypen:

```
export interface Item {
    id?: number,
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