import {Application, Router, send} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {oakCors} from "https://deno.land/x/cors/mod.ts";
import {Task} from "../classes/Task.js";
import {State} from "../classes/State.js";

const app = new Application();
const router = new Router();
const jsonStoragePath = './../persistence/storage.json';

const tasks = [];
let id = 1;

router.get('/fetch', async function (context) {
    console.log('fetch', tasks);
    context.response.body = JSON.stringify(tasks);
    context.response.status = 200;
});

router.get('/columns', (context) => {
    context.response.body = JSON.stringify([State.TODO, State.IN_PROGRESS, State.DONE]);
    context.response.status = 200;

});

router.post('/add', async (context) => {
    if (context.request.hasBody) {
        const body = JSON.parse(await context.request.body().value);
        const task = new Task();
        task.title = body.title;
        task.state = body.state;
        task.id = id;
        tasks.push(task);
        console.log(tasks);
        id++;
        context.response.state = 200;
        context.response();
    }
});

router.post('/delete/:id', async (context) => {
    if (context.params && context.params.id) {
        const task = tasks.find(function (task) {
            return task.id = context.params.id;
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

app.use(
    oakCors({
        origin: "http://127.0.0.1:5500",
        optionsSuccessStatus: 200
    }),
);
app.use(router.routes());

// Logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
await app.listen({port: 8000});
