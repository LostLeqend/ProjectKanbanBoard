import { Application, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {Task} from "../classes/Task.js";
import {State} from "../classes/State.js";
const app = new Application();
const router = new Router();
const jsonStoragePath = './../persistence/storage.json';

router.get('/fetch', async function () {
    return await json();
});

app.use(router.routes());
await app.listen({port:8000});
