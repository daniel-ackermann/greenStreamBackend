import { UserData } from "./userdata";

// number[] can be empty, [number] not

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
    languages?: string[];
    last_change?: Date;
    topics?: number[];
    data?: UserData[];
}

export interface UpdateUser {
    username?: string;
    show_in_app?: number;
    notification_time?: string;
    languages?: string[];
    topics?: number[];
    id: number;
}

export interface PublicUser {
    username: string;
    id: number;
}