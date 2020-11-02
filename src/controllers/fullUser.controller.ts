import { getItemsByUser } from "./item.controller";
import { getUser } from "./user.controller";
import { User } from "../interface/user";
import { Item } from "../interface/item";

export async function fullUser(userId: number): Promise<User>{
    const [ user ] = await getUser(userId) as User[];
    user.data = await getItemsByUser(userId) as Item[];
    return user;
}