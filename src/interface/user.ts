import { UserData } from "./userdata";

export interface UserWithPassword extends User {
    password: string;
}

export interface User{
    email: string;
    role: string;
    id: number;
    username?: string;
    show_in_app?: number;
    notification_time?: string;
    language?: [string];
    last_change?: Date;
    topics?: [number];
    data?: [UserData];
}

export interface UpdateUser {
    username?: string;
    show_in_app?: number;
    notification_time?: string;
    language?: [string];
    topics?: [number];
    id: number;
}