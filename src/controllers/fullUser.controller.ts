import { getInteractedItemsByUser, } from "./items.controller";
import { getUserWithoutPassword, updateUserById } from "./user.controller";
import { UserWithoutPassword } from "../interface/user";
import { UserData } from "../interface/userdata";
import { updateStatus } from "./item.controller";

export async function getFullUser(userId: number): Promise<UserWithoutPassword>{
    const [ user ] = await getUserWithoutPassword(userId) as UserWithoutPassword[];
    user.data = await getInteractedItemsByUser(userId) as UserData[];
    return user;
}

export async function saveFullUser(userId:number, data: UserWithoutPassword): Promise<void> {
    const user = {
        username: data.username,
        show_in_app: data.show_in_app,
        notification_time: data.notification_time,
        topics: data.topics,
        language: data.language,
        email: data.email,
    }
    updateUserById(userId, user);
    (data.data|| []).forEach((item: UserData) => {
        updateStatus(userId, item as UserData);
    });
}