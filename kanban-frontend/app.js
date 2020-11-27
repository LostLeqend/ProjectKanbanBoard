let columns = [];
let tasks = [];

const addTaskDto = {
    title: '',
    state: ''
}

var addTaskPopup = document.getElementById("add-task-popup");

window.addEventListener('load', async () => {
    columns = await getColumns();
    tasks = await getTasks();

    for (let i = 0; i < columns.length; i++) {
        const th = document.createElement('th');
        th.className = "header-" + columns[i];
        th.id = "header-" + columns[i];
        th.textContent = columns[i];
        document.getElementById('table-header').appendChild(th);

        const td = document.createElement('td')
        td.classList.add ("dropzone");
        td.id = "td-" + columns[i];
        if (i % 2 !== 0) {
            td.classList.add("alternatebackground-td");
        } else {
            td.classList.add("background-td");
        }
        document.getElementById('table-body').appendChild(td);

        const button = document.createElement('button');
        button.classList.add("btn")
        button.classList.add("btn-add")
        button.classList.add("btn-outline-secondary")
        button.textContent = "+"
        button.id = columns[i];
        button.addEventListener('click', (listener) => openTaskPopUp(listener))
        td.appendChild(button);
    }
});

function buildTable() {

}

function openTaskPopUp(listener) {
    console.log(listener.target);
    addTaskDto.state = listener.target.id;
    addTaskPopup.style.display = "block";
}

// document.getElementById('btnDeleteTask').addEventListener('click', async (listener) => {
//     await deleteTask(listener.target.offsetParent.childNodes[3].innerHTML);
// });

// When the user clicks on button (x), close the addTaskPopup
document.getElementById("btn-close").addEventListener('click', () => {
    addTaskPopup.style.display = "none";
});

document.getElementById("btn-add").addEventListener('click', async (listener) => {
    addTaskDto.title = document.getElementById("txt-taskname").value;
    await addTask(addTaskDto);
    addTaskPopup.style.display = "none";
});

// When the user clicks anywhere outside of the addTaskPopup, close it
window.onclick = function (event) {
    if (event.target == addTaskPopup) {
        addTaskPopup.style.display = "none";
    }
}

///Drag and Drop
var startingDropzone;

document.addEventListener("dragstart", function (event) {
    startingDropzone = event.target;
}, false);

document.addEventListener("dragover", function (event) {
    event.preventDefault();
}, false);

document.addEventListener("drop", function (event) {
    event.preventDefault();
    if (event.target.className.includes("dropzone")) {
        event.target.style.background = "";
        startingDropzone.parentNode.removeChild(startingDropzone);
        event.target.insertBefore(startingDropzone, event.target.firstChild);
    }
}, false);


async function addTask(dto) {
    await fetch('http://localhost:8000/add', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto)
    });
    updateTableCards();
}

async function deleteTask(id) {
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

async function updateTableCards() {
    tasks = await getTasks();
    columns = await getColumns();



    for(let i = 0; i < columns.length; i++) {
        const button = document.createElement('button');
        button.classList.add("btn")
        button.classList.add("btn-add")
        button.classList.add("btn-outline-secondary")
        button.textContent = "+"
        button.id = columns[i];
        button.addEventListener('click', (listener) => openTaskPopUp(listener));
        document.getElementById('td-' + columns[i]).innerHTML = "";
        document.getElementById('td-' + columns[i]).appendChild(button);
        const result = tasks.filter((task) => {
            return task.state === columns[i];
        })
        const td = document.getElementById('td-' + columns[i]);
        for (let x = 0; x < result.length; x++) {
            const div = document.createElement('div');
            div.classList.add('card');
            div.id = 'draggable';
            div.draggable = true;

            const p1 = document.createElement('p');
            p1.textContent = result[x].title;

            const p2 = document.createElement('p');
            p2.textContent = result[x].id;

            const button = document.createElement('button');
            button.classList.add('btn');
            button.classList.add('btn-light');
            button.id = 'btnDeleteTask';
            button.addEventListener('click', () => deleteTask(result[x].id));

            const trash = document.createElement('i');
            trash.classList.add('fa');
            trash.classList.add('fa-trash');

            div.appendChild(p1);
            div.appendChild(p2);
            button.appendChild(trash);
            div.appendChild(button);
            td.appendChild(div);
        }
    }
}

async function getColumns() {
    let response = await fetch('http://localhost:8000/columns', {
        method: 'GET',
    });
    return await response.json();
}

async function getTasks() {
    let response = await fetch('http://localhost:8000/fetch', {
        method: 'GET',
    });
    return await response.json();
}
