import { getInteractedItemsByUser, getItemsByUser } from "./item.controller";
import { getUser, getUserWithoutPassword } from "./user.controller";
import { User, UserWithoutPassword } from "../interface/user";
import { Item } from "../interface/item";

export async function fullUser(userId: number): Promise<UserWithoutPassword>{
    const [ user ] = await getUserWithoutPassword(userId) as UserWithoutPassword[];
    user.data = await getInteractedItemsByUser(userId) as Item[];
    return user;
}