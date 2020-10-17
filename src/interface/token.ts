export interface Token {
    token: string;
    expire: number;
    created: number;
    owner: string;
    valid: boolean;
}