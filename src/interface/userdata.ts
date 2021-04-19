export interface UserData {
    user_id?: number;
    id: number;
    liked?: number | null;
    watched?: number | null;
    watchlist?: number | null;
    last_recommended?: number | null;
}