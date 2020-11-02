import { Item } from "./item";

export interface User {
    username: string;
    password: string;
    email: string;
    role: string;
    id: number;
    data?: Item[];
}