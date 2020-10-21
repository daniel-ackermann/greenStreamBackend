import { App } from './app'

async function main() {
    const app = new App(3000, 443);
    await app.listen();
}

main();