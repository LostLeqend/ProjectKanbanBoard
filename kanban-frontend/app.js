let columns = [];
let tasks = [];

async function addTask() {
    const data = {state: 'inProgress', title: 'testtesttest'};
    await fetch('http://localhost:8000/add', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

async function deleteTask() {
    const id = 1;
    await fetch('http://localhost:8000/delete/' + id, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function moveTask() {
    const data = {
        id: 5,
        state: 'done',
    }
    await fetch('http://localhost:8000/move', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

async function getTables() {
     columns = await fetch('http://localhost:8000/columns', {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

async function getTasks() {
    tasks = await fetch('http://localhost:8000/columns', {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
