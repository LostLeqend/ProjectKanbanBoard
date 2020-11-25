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

document.getElementById("btn-add").addEventListener('click', () =>{
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