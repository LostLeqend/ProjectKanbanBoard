let columns = [];
let tasks = [];

const addTaskDto = {
    title: '',
    state: ''
}

document.getElementById("txt-taskname").addEventListener("keyup", (event) =>{
    if(event.keyCode == 13){
        event.preventDefault();
        document.getElementById("btn-add").click();
    }
});

var addTaskPopup = document.getElementById("add-task-popup");

window.addEventListener('load', async () => {
    columns = await getColumns();
    tasks = await getTasks();

    for (let i = 0; i < columns.length; i++) {
        createTableHeaders(columns[i]);
        const td = createTableData(columns[i], i);
        createAddButtons(td, columns[i]);
    }
    await updateTableCards();
});

function createTableData(state, index) {
    const td = document.createElement('td')
    td.classList.add("dropzone");
    td.id = state;
    if (index % 2 !== 0) {
        td.classList.add("alternatebackground-td");
    } else {
        td.classList.add("background-td");
    }
    document.getElementById('table-body').appendChild(td);
    return td;
}

function createTableHeaders(state) {
    const th = document.createElement('th');
    th.className = "header-" + state;
    th.id = "header-" + state;
    th.textContent = state;
    document.getElementById('table-header').appendChild(th);
}

function createAddButtons(parentElement, state) {
    const button = document.createElement('button');
    button.classList.add("btn")
    button.classList.add("btn-add")
    button.classList.add("btn-outline-secondary")
    button.textContent = "+"
    button.id = state;
    button.addEventListener('click', (listener) => openTaskPopUp(listener))
    parentElement.appendChild(button);
}

///Popup
function openTaskPopUp(listener) {
    addTaskDto.state = listener.target.id;
    addTaskPopup.style.display = "block";
    document.getElementById("txt-taskname").focus();
}

document.getElementById("btn-close").addEventListener('click', () => {
    addTaskPopup.style.display = "none";
});

document.getElementById("btn-add").addEventListener('click', async (listener) => {

    addTaskDto.title = document.getElementById("txt-taskname").value;

    if (addTaskDto.title.trim() == "")
        return;

    document.getElementById("txt-taskname").value = "";
    await addTask(addTaskDto);
    addTaskPopup.style.display = "none";
});

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

function findParentNodeByClass(element, className) {
    while (element.parentNode) {
        if (element.className.includes(className)) {
            return element;
        }
        element = element.parentNode;
    }

    return null;
}

document.addEventListener("drop", async function (event) {
    event.preventDefault();

    var dropzone = findParentNodeByClass(event.target, "dropzone");

    if (dropzone != null) {
        dropzone.style.background = "";
        startingDropzone.parentNode.removeChild(startingDropzone);
        dropzone.insertBefore(startingDropzone, dropzone.firstChild);
        await moveTask({
            id: dropzone.childNodes[0].childNodes[1].innerHTML,
            state: dropzone.id
        });
    }
}, false);

async function addTask(dto) {
    await fetch('http://localhost:8000/add', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(dto)
    });
    await updateTableCards();
}

async function deleteTask(id) {
    await fetch('http://localhost:8000/delete/' + id, {
        method: 'DELETE',
    });
    await updateTableCards();
}

async function moveTask(data) {
    await fetch('http://localhost:8000/move', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

function createCard() {
    const div = document.createElement('div');
    div.classList.add('card');
    div.id = 'draggable';
    div.draggable = true;
    return div;
}

function createCardContext(card, task) {
    const p1 = document.createElement('p');
    p1.textContent = task.title;

    const p2 = document.createElement('p');
    p2.textContent = task.id;
    p2.style.display = 'none';

    card.appendChild(p1);
    card.appendChild(p2);
}

function createCardTrashButton(div, task) {
    const button = document.createElement('button');
    button.classList.add('btn');
    button.classList.add('btn-light');
    button.id = 'btnDeleteTask';
    button.addEventListener('click', () => deleteTask(task.id));

    const trash = document.createElement('i');
    trash.classList.add('fa');
    trash.classList.add('fa-trash');

    button.appendChild(trash);
    div.appendChild(button);
}

async function updateTableCards() {
    tasks = await getTasks();
    columns = await getColumns();

    for (let i = 0; i < columns.length; i++) {
        document.getElementById(columns[i]).innerHTML = '';
        createAddButtons(document.getElementById(columns[i]), columns[i]);
        const result = tasks.filter((task) => {
            return task.state === columns[i];
        })
        const td = document.getElementById(columns[i]);
        for (let x = 0; x < result.length; x++) {
            const div = createCard();
            createCardContext(div, result[x]);
            createCardTrashButton(div, result[x]);
            td.insertBefore(div, td.childNodes[0]);
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