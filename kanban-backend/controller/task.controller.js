import { Application, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {Task} from "../classes/Task.js";
import {State} from "../classes/State.js";
const app = new Application();
const router = new Router();
const jsonStoragePath = './../persistence/storage.json';

router.get('/fetch', async function () {
    return await json();
});

router.get('/add', async function () {
    const result = await json();
    const task = new Task();
    task.id = result.length + 1;
    task.state = State.IN_PROGRESS;
    task.title = 'test';
    result.push(task);
    await writeJson(result);
});

app.use(router.routes());
await app.listen({port:8000});
