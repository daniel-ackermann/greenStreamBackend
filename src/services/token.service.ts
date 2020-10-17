import crypto from 'crypto';
import { Token } from '../interface/token';

export default class tokenService {
    private static tokenBag: Token[] = [];

    constructor() {
        setInterval(() => {
            this.checkExpiring();
        }, 1000 * 60);
    }
    getNew(owner: string, hour: number): string {
        const token = crypto.randomBytes(20).toString('hex');
        tokenService.tokenBag.push({
            token: token,
            expire: new Date().getTime() + 1000 * 60 * 60 * hour,
            created: new Date().getTime(),
            owner: owner,
            valid: true
        });
        return token;
    }
    valid(token: string): Token {
        for (let i = 0; i < tokenService.tokenBag.length; i++) {
            const item = tokenService.tokenBag[i];
            if (item.token == token) {
                if (item.expire > new Date().getTime()) {
                    tokenService.tokenBag.splice(i, 1);
                    return item;
                } else {
                    item.valid = false;
                    return item;
                }
            }
        }
        return {
            token: "",
            expire: new Date().getTime(),
            created: new Date().getTime(),
            owner: "",
            valid: false
        };
    }
    private checkExpiring() {
        tokenService.tokenBag.forEach((item: Token, index: number) => {
            if (item.expire < new Date().getTime()) {
                console.log(`Item removed: ${item.token}`);
                tokenService.tokenBag.splice(index, 1);
            }
        });
    }
}