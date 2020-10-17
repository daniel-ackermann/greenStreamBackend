"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class tokenService {
    constructor() {
        setInterval(() => {
            this.checkExpiring();
        }, 1000 * 60);
    }
    getNew(owner, hour) {
        const token = crypto_1.default.randomBytes(20).toString('hex');
        tokenService.tokenBag.push({
            token: token,
            expire: new Date().getTime() + 1000 * 60 * 60 * hour,
            created: new Date().getTime(),
            owner: owner,
            valid: true
        });
        return token;
    }
    valid(token) {
        for (let i = 0; i < tokenService.tokenBag.length; i++) {
            const item = tokenService.tokenBag[i];
            if (item.token == token) {
                if (item.expire > new Date().getTime()) {
                    tokenService.tokenBag.splice(i, 1);
                    return item;
                }
                else {
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
    checkExpiring() {
        tokenService.tokenBag.forEach((item, index) => {
            if (item.expire < new Date().getTime()) {
                console.log(`Item removed: ${item.token}`);
                tokenService.tokenBag.splice(index, 1);
            }
        });
    }
}
exports.default = tokenService;
tokenService.tokenBag = [];
