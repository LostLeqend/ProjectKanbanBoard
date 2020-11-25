var addTaskPopup = document.getElementById("add-task-popup");

// Get the button that opens the addTaskPopup
document.querySelectorAll('.btn-add').forEach(x => {
    x.addEventListener('click', () => {
        addTaskPopup.style.display = "block";
    })
});

// When the user clicks on button (x), close the addTaskPopup
document.getElementById("btn-close").addEventListener('click', () => {
    addTaskPopup.style.display = "none";
});

document.getElementById("btn-add").addEventListener('click', () => {
    let taskname = document.getElementById("txt-taskname").value;
    console.log();
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