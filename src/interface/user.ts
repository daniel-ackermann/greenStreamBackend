import { Item } from "./item";
import { UserData } from "./userdata";

export interface User extends UserWithoutPassword {
    password: string;
}

export interface UserWithoutPassword{
    email: string;
    role: string;
    id: number;
    username?: string;
    show_in_app?: number;
    notification_time?: string;
    language?: string[];
    last_change?: any;
    topics?: string[];
    data?: UserData[];
}

export interface UpdateUser {
    username?: string;
    show_in_app?: number;
    notification_time?: string;
    language?: string[];
    topics?: string[];
    data?: UserData[];
}