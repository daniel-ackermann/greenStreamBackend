import { Item } from "./item";
import { UserData } from "./userdata";

export interface User extends UserWithoutPassword {
    password: string;
}

export interface UserWithoutPassword{
    username: string;
    email: string;
    role: string;
    id: number;
    data?: UserData[];
}