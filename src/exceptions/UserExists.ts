export class UserExists extends Error {
    constructor(err?: string) {
        super(err);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = UserExists.name; // stack traces display correctly now 
    }
}