import { getInteractedItemsByUser, getItemsByUser } from "./item.controller";
import { getUser } from "./user.controller";
import { User } from "../interface/user";
import { Item } from "../interface/item";

export async function fullUser(userId: number){
    const [ user ] = await getUser(userId) as User[];
    user.data = await getInteractedItemsByUser(userId) as Item[];
    // TODO
    // delete user.password;
    return user;
}