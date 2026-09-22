
// TIME

function updateTime() {

    var currentTime = new Date().toLocaleTimeString();

    var timeText = document.querySelector("#timeElement");

    timeText.innerHTML = currentTime;

}

updateTime();

setInterval(updateTime, 1000);


// WINDOW

var welcomeScreen = document.querySelector("#welcome");


// DRAG WINDOW

dragElement(welcomeScreen);

function dragElement(element) {

    var initialX = 0;
    var initialY = 0;

    var currentX = 0;
    var currentY = 0;


    if (document.getElementById(element.id + "header")) {

        document.getElementById(
            element.id + "header"
        ).onmousedown = startDragging;

    }

    else {

        element.onmousedown = startDragging;

    }


    function startDragging(e) {

        e = e || window.event;

        e.preventDefault();

        initialX = e.clientX;
        initialY = e.clientY;

        document.onmouseup = stopDragging;

        document.onmousemove = dragWindow;

    }


    function dragWindow(e) {

        e = e || window.event;

        e.preventDefault();

        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;

        initialX = e.clientX;
        initialY = e.clientY;

        element.style.top =
            (element.offsetTop - currentY) + "px";

        element.style.left =
            (element.offsetLeft - currentX) + "px";

        element.style.transform = "none";

    }


    function stopDragging() {

        document.onmouseup = null;

        document.onmousemove = null;

    }

}


// CLOSE WINDOW

function closeWindow(element) {

    element.style.display = "none";

}


// OPEN WINDOW

function openWindow(element) {

    element.style.display = "flex";

}


// CLOSE BUTTON

var welcomeScreenClose =
    document.querySelector("#welcomeclose");

welcomeScreenClose.addEventListener(
    "click",
    function () {

        closeWindow(welcomeScreen);

    }
);


// OPEN BUTTON

var welcomeScreenOpen =
    document.querySelector("#welcomeopen");

welcomeScreenOpen.addEventListener(
    "click",
    function () {

        openWindow(welcomeScreen);

    }
);

// APP WINDOWS

function openApp(id) {

    var app = document.getElementById(id);

    app.style.display = "block";

    app.style.zIndex = 100;

}


function closeApp(id) {

    document.getElementById(id).style.display = "none";

}


// MAKE APP WINDOWS DRAGGABLE

dragElement(document.getElementById("terminal"));

dragElement(document.getElementById("notes"));

dragElement(document.getElementById("taskmanager"));


// TERMINAL

var terminalInput =
    document.getElementById("terminalInput");

var terminalOutput =
    document.getElementById("terminalOutput");


terminalInput.addEventListener("keydown", function(e) {

    if (e.key !== "Enter") {
        return;
    }

    var command = terminalInput.value.trim();

    terminalInput.value = "";

    if (command === "help") {

        terminalOutput.innerHTML +=
            "<p>help &nbsp; clear &nbsp; date</p>";

    }

    else if (command === "clear") {

        terminalOutput.innerHTML = "";

    }

    else if (command === "date") {

        terminalOutput.innerHTML +=
            "<p>" + new Date().toLocaleString() + "</p>";

    }

    else if (command !== "") {

        terminalOutput.innerHTML +=
            "<p>Command not found: " + command + "</p>";

    }

});
