import { Language } from "./language";
import { Topic } from "./topic";
import { Type } from "./type";

export class Item {
    constructor(title: string, description: string, url: string, type: Type, topic: Topic, language: Language, image: string){
        this.title = title;
        this.description = description;
        this.type = type;
        this.topic = topic;
        this.language = language;
        this.url = url;
        this.image = image;
    }
    id?: number;
    likes = 0;
    marked = 0;
    explanation_id: number| null = null;
    url: string;
    description: string;
    title: string;
    simple = 0;
    reviewed = 0;
    public = 0;
    type: Type;
    topic: Topic;
    language: Language;
    liked: number|null = null;              // 1 wenn geliked, 0 sonst
    watched: number|null = null;            // 1 wenn angesehen, 0 sonst
    watchlist: number|null = null;          // 1 wenn auf watchlater, 0 sonst
    created: number = Math.floor(new Date().getTime() / 1000);
    score = 100;
    readingDuration = 2;
    image: string;
}