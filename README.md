# REST-Endpunkte

```
GET         http://appsterdb.ackermann.digital/api/items                GET list of all items, returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/review        GET items to review returns [Item]

GET       * https://appsterdb.ackermann.digital/api/items/reviewed      GET users reviewed items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/created       GET users created items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/liked         GET users liked items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/watched       GET users watched items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/watchlist     GET users watchlist items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/status        POST update item (watchlist, liked, watched) expects Status

GET         http://appsterdb.ackermann.digital/api/items/136            GET Item mit ID 136
DELETE    * http://appsterdb.ackermann.digital/api/items/136            DELETE Item mit ID 136
PUT       * http://appsterdb.ackermann.digital/api/items/136            EDIT Item mit ID 136, argument: Item
POST      * http://appsterdb.ackermann.digital/api/items                ADD item expect: Item

GET       * http://appsterdb.ackermann.digital/api/types           Liste aller Typen, returns [Type]
PUT       * http://appsterdb.ackermann.digital/api/types           Ändert einen Typen, exprects Type
DELETE    * http://appsterdb.ackermann.digital/api/types           Löscht einen Typen, expects id
POST      * http://appsterdb.ackermann.digital/api/types           Erstellt einen Typen, expects Type

GET       * http://appsterdb.ackermann.digital/api/topic           Liste aller Topic, returns Topic
PUT       * http://appsterdb.ackermann.digital/api/topic           Ändert einen Topic, expects Topic
DELETE    * http://appsterdb.ackermann.digital/api/topic           Löscht einen Topic, expects id
POST      * http://appsterdb.ackermann.digital/api/topic           Erstellt einen Topic, expects Topic

GET         http://appsterdb.ackermann.digital/api/topics          Liste aller Topics, returns [Topics]

POST      * http://appsterdb.ackermann.digital/import              Import von JSON, expects [Item]

GET         http://appsterdb.ackermann.digital/passwordRestore     Hier kann das neue Passwort gesetzt wernen, expects token
POST        http://appsterdb.ackermann.digital/passwordRestore     Nach Rücksetzen durch email wird hier das neue passwort gesetzt. expects password, token as cookie


DELETE    * http://appsterdb.ackermann.digital/login               Ausloggen, returns 200
POST        http://appsterdb.ackermann.digital/login               Einloggen, expects email:string, password:string,  returns User
GET         http://appsterdb.ackermann.digital/login               Eingeloggt? returns boolean

DELETE    * http://appsterdb.ackermann.digital/account             Account löschen, expects id
POST        http://appsterdb.ackermann.digital/account             Account erstellen, expects User
GET       * http://appsterdb.ackermann.digital/account             Passwortvergessen-Email-anfrage, 

GET         http://appsterdb.ackermann.digital/api/feedback        Get all Feedbacks, returns [feedback]
POST      * http://appsterdb.ackermann.digital/api/feedback        Add feedback, expects feedback
GET         http://appsterdb.ackermann.digital/api/feedback/item/12        Get all Feedbacks of Item 12, returns [feedback]
GET         http://appsterdb.ackermann.digital/api/feedback/12        Get Feedback with id 12, returns feedback
DELETE    * http://appsterdb.ackermann.digital/api/feedback/12        Deletes Feedback with id 12, returns feedback


GET         http://appsterdb.ackermann.digital/api/languages       Languages, returns [language] 

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


```
export interface language {
    name: string;
    value: string;
}
```

```
export interface Feedback { 
    id?: number;
    information_id: number;
    feedback:string;
    created_by_id:number;
}
```

Timestamp: gibt letzte veränderung des Nutzers wieder.