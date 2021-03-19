import { getInteractedItemsByUser, } from "./items.controller";
import { getUser, updateUserById } from "./user.controller";
import { User } from "../interface/user";
import { UserData } from "../interface/userdata";
import { updateStatus } from "./item.controller";

export async function getFullUser(userId: number): Promise<User>{
    const [ user ] = await getUser(userId) as User[];
    user.data = await getInteractedItemsByUser(userId) as [UserData];
    return user;
}

export async function saveFullUser(userId:number, data: User): Promise<void> {
    const user = {
        username: data.username,
        show_in_app: data.show_in_app,
        notification_time: data.notification_time,
        topics: data.topics,
        languages: data.languages,
        email: data.email,
        id: userId
    }
    updateUserById(userId, user);
    (data.data|| []).forEach((item: UserData) => {
        updateStatus(userId, item as UserData);
    });
}