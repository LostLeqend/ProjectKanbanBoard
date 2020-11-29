import {Application, Router, send} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {oakCors} from "https://deno.land/x/cors/mod.ts";
import {Task} from "../classes/Task.js";
import {State} from "../classes/State.js";

const app = new Application();
const router = new Router();

const tasks = [];
let id = 1;

router.get('/fetch', async function (context) {
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
        id++;
        context.response.state = 200;
        context.response.body = 'Task with id: ' + id + 'has been created';
    } else {
        context.response.state = 400;
        context.response.body = 'Request has no body';
    }
});

router.delete('/delete/:id', async (context) => {
    if (context.params && context.params.id) {
        const task = tasks.find(function (task) {
            return task.id == context.params.id;
        });
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
        context.response.state = 200;
        context.response.body = 'Item with id ' + context.params.id + ' was deleted';
    } else {
        context.response.state = 400;
        context.response.body = "No parameter found"
    }
});

router.post('/move', async (context) => {
    if (context.request.hasBody) {
        const body = JSON.parse(await context.request.body().value);
        const task = tasks.find(function (task) {
            return task.id == body.id;
        });
        task.state = body.state;
        context.response.state = 200;
        context.response.body = 'Task with id:' + body.id + ' has been updated with state:' + body.state;
    } else {
        context.response.state = 400;
        context.response.body = 'Request has no body';
    }
});
app.use(
    oakCors()
    // oakCors({
    //     origin: "http://127.0.0.1:5500",
    //     optionsSuccessStatus: 200
    // }),
);
app.use(router.routes());
await app.listen({port: 8000});
