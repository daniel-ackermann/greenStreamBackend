import { getInteractedItemsByUser, getItemsByUser, updateStatus } from "./item.controller";
import { getUser, getUserWithoutPassword, updateUserById } from "./user.controller";
import { User, UserWithoutPassword } from "../interface/user";
import { Item } from "../interface/item";
import { UserData } from "../interface/userdata";

export async function getFullUser(userId: number): Promise<UserWithoutPassword>{
    const [ user ] = await getUserWithoutPassword(userId) as UserWithoutPassword[];
    user.data = await getInteractedItemsByUser(userId) as UserData[];
    return user;
}

export async function saveFullUser(userId:number, user: UserWithoutPassword): Promise<void> {
    updateUserById(userId, user);
    (user.data|| []).forEach((item: UserData) => {
        updateStatus(userId, item as UserData);
    });
}