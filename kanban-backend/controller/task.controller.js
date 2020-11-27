import { Application, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import {Task} from "../classes/Task.js";
import {State} from "../classes/State.js";
const app = new Application();
const router = new Router();
const jsonStoragePath = './../persistence/storage.json';

const tasks = [];

router.get('/fetch', async function () {
    return JSON.stringify(tasks);
});

router.get('/columns', async (context) => {
   return [State.TODO, State.IN_PROGRESS, State.DONE];
});

router.post('/add', async (context) => {
    if (context.request.hasBody) {
        const body = JSON.parse(await context.request.body().value);
        const task = new Task();
        task.id = tasks.length + 1;
        task.title = body.title;
        task.state = body.state;
        tasks.push(task);
        console.log(tasks);
        context.response.state = 200;
        context.response();
    }
});

router.post('/delete/:id', async (context) => {
    if (context.params && context.params.id) {
        const id = context.params.id;
        const task = tasks.find(function (task) {
            return task.id = id;
        });
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
    }
});

router.post('/move', async (context) => {
    if (context.request.hasBody) {
        const body = JSON.parse(await context.request.body().value);
        const task = tasks.find(function (task) {
           return task.id = body.id;
        });
        task.state = body.state;
    }
});

let json = async function () {
    let json = await Deno.readFile('./persistence/storage.json');
    return JSON.parse(json);
}

async function writeJson(data) {
    console.log('test');
    const json = JSON.stringify(data);
    console.log(json);
    await Deno.writeTextFile(jsonStoragePath, json);
}

// Logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(
    oakCors({
        origin: "http://localhost:5500"
    }),
);
app.use(router.routes());
await app.listen({port:8000});
