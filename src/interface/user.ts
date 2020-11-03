import { Item } from "./item";

export interface User extends UserWithoutPassword {
    password: string;
}

export interface UserWithoutPassword{
    username: string;
    email: string;
    role: string;
    id: number;
    data?: Item[];
}