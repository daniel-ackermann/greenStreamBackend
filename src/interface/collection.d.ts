import { PublicUser } from "./user";

export interface Collection {
    id: number;
    title: string;
    language: string;
    owner: PublicUser;
    created: number;
    likes?: number;
}