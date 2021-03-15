# REST-Endpunkte

```
GET         https://appsterdb.ackermann.digital/api/items                GET list of all items, returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/review        GET items to review returns [Item]

GET       * https://appsterdb.ackermann.digital/api/items/reviewed      GET users reviewed items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/created       GET users created items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/liked         GET users liked items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/watched       GET users watched items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/watchlist     GET users watchlist items returns [Item]
GET       * https://appsterdb.ackermann.digital/api/items/status        POST update item (watchlist, liked, watched) expects Status

GET         https://appsterdb.ackermann.digital/api/items/136            GET Item mit ID 136
DELETE    * https://appsterdb.ackermann.digital/api/items/136            DELETE Item mit ID 136
PUT       * https://appsterdb.ackermann.digital/api/items/136            EDIT Item mit ID 136, argument: Item
POST      * https://appsterdb.ackermann.digital/api/items                ADD item expect: Item

GET       * https://appsterdb.ackermann.digital/api/types           Liste aller Typen, returns [Type]
PUT       * https://appsterdb.ackermann.digital/api/types           Ändert einen Typen, exprects Type
DELETE    * https://appsterdb.ackermann.digital/api/types           Löscht einen Typen, expects id
POST      * https://appsterdb.ackermann.digital/api/types           Erstellt einen Typen, expects Type

GET       * https://appsterdb.ackermann.digital/api/topic           Liste aller Topic, returns Topic
PUT       * https://appsterdb.ackermann.digital/api/topic           Ändert einen Topic, expects Topic
DELETE    * https://appsterdb.ackermann.digital/api/topic           Löscht einen Topic, expects id
POST      * https://appsterdb.ackermann.digital/api/topic           Erstellt einen Topic, expects Topic

GET         https://appsterdb.ackermann.digital/api/topics          Liste aller Topics, returns [Topics]

POST      * https://appsterdb.ackermann.digital/import              Import von JSON, expects [Item]

GET         https://appsterdb.ackermann.digital/passwordRestore     Hier kann das neue Passwort gesetzt wernen, expects token
POST        https://appsterdb.ackermann.digital/passwordRestore     Nach Rücksetzen durch email wird hier das neue passwort gesetzt. expects password, token as cookie


DELETE    * https://appsterdb.ackermann.digital/login               Ausloggen, returns 200
POST        https://appsterdb.ackermann.digital/login               Einloggen, expects email:string, password:string,  returns User
GET         https://appsterdb.ackermann.digital/login               Eingeloggt? returns boolean

DELETE    * https://appsterdb.ackermann.digital/account             Account löschen, expects id
POST        https://appsterdb.ackermann.digital/account             Account erstellen, expects User
GET       * https://appsterdb.ackermann.digital/account             Passwortvergessen-Email-anfrage, 

GET         https://appsterdb.ackermann.digital/api/feedback        Get all Feedbacks, returns [feedback]
POST      * https://appsterdb.ackermann.digital/api/feedback        Add feedback, expects feedback
GET         https://appsterdb.ackermann.digital/api/feedback/item/12        Get all Feedbacks of Item 12, returns [feedback]
GET         https://appsterdb.ackermann.digital/api/feedback/12        Get Feedback with id 12, returns feedback
DELETE    * https://appsterdb.ackermann.digital/api/feedback/12        Deletes Feedback with id 12, returns feedback


GET         https://appsterdb.ackermann.digital/api/languages       Languages, returns [language] 

GET         https://appsterdb.ackermann.digital/api/full            {type:[], information_data:[], topics:[]}
```

Vorgehen:
POST /login => Setzt Cookie der mitgeschickt werden muss um eingeloggt zu sein.

# Datentypen:

## Item
Standard:
```
export interface Item {
    id?: number,
    likes: number,
    explanation_id?: number,
    url: string,
    description: string,
    title: string,
    language: [string],
    simple: number,
    reviewed?: number,
    created_by_id?: number,
    topic_id: number,
    type_id: number,
    topic_name?: string,
    type_name?: string,
    icon?: string,
    view_external?: number
}
```
authentifiziert:
```
export interface Item {
    id?: number,
    likes: number,
    explanation_id?: number,
    url: string,
    description: string,
    title: string,
    language: [string],
    simple: number,
    reviewed?: number,
    created_by_id?: number,
    topic_id: number,
    type_id: number,
    topic_name?: string,
    type_name?: string,
    icon?: string,
    liked?: number,
    watched?: number,
    watchlist?: number,
    last_recommended?: number | null
    view_external?: number
}
```
## Authentifikation
In der Datenbank ist die emailadresse und ein hash des passwords gespeichert.
Folgende Schritte sind notwendig:

* Token generieren (request an Server mit email/passwort)
* Token bei weiteren Anfragen mitschicken.

### Token generieren:
Die Emailadresse und das Passwort werden im Body als Post-Request ( `x-www-form-urlencoded` ) mit den keys `email`, `password` an `https://appsterdb.ackermann.digital/login` gesendet.
Antwort (200):
```
{
    "username": "FooBar",
    "id": 46431,
    "email": "foo@bar.de",
    "role": "admin",
    "language": [
        "de",
        "en"
    ],
    "show_in_app": 1,
    "notification_time": "12:00",
    "topics": [],
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFja2VybWFubi1kYUB3ZWIuZGUiLCJyb2xlIjoiYWRtaW4iLCJpZCI6MjIsImlhdCI6MTYxNTgwMzEwNiwiZXhwIjoxNjE1ODI0NzA2fQ.otgpCed2HHlZgJV1j5X_mUEGeTXYpZSVVYqr4-r8HUI",
}

```
Im Fehlerfall ist die Antwort ein 403 Forbidden.

### Token mitsenden:
Der Token ist als cookie unter dem namen `jwt` bei jedem weiteren Request der auf Authentifizierung angewiesen ist als als Bearer mitzusenden.
Der Inhalt des Cookies `jwt` sieht also wie folgt aus:
```
Bearer ${access_token} 
```

Ein Token ist 6 Stunden gültig.


-----


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
    icon: string,
    id: number
}
```

```
export interface User {
    username: string;
    password: string;
    email: string;
    role: string;
    language?: [string],(e.g. ["de", "en"])
    show_in_app: number,
    notification_time: string (e.g. "12:00"),
    topics:[number],
    access_token?: string
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

```
export interface UserData {
    user_id?: number;
    id: number;
    liked?: boolean;
    watched?: boolean;
    watchlist?: boolean;
    last_recommended?: number;
}
```

Timestamp: gibt letzte veränderung des Nutzers wieder.