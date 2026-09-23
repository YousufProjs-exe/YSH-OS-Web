
// USER

let userName = localStorage.getItem("yshUserName") || "";

const userDisplay = document.getElementById("userName");
const terminalUser = document.getElementById("terminalUser");

const nameInput = document.getElementById("userNameInput");
const saveNameButton = document.getElementById("saveNameButton");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeMessage = document.getElementById("welcomeMessage");


function setUser() {
    const name = userName || "User";

    userDisplay.textContent = name;
    terminalUser.textContent = name.toLowerCase();

    if (userName) {
        welcomeTitle.textContent = "Welcome back, " + name;
        welcomeMessage.textContent = "Your YSH OS desktop is ready.";
        nameInput.value = name;
    }
}


saveNameButton.addEventListener("click", function () {

    const name = nameInput.value.trim();

    if (name === "") {
        nameInput.focus();
        return;
    }

    userName = name;

    localStorage.setItem("yshUserName", userName);

    setUser();

});


nameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        saveNameButton.click();
    }

});

setUser();


// CLOCK

function updateClock() {
    document.getElementById("timeElement").textContent =
        new Date().toLocaleTimeString();
}

updateClock();

setInterval(updateClock, 1000);


// WINDOWS

const windows = document.querySelectorAll(".window");

let topWindow = 20;


function openWindow(id) {

    const windowElement = document.getElementById(id);

    if (!windowElement) {
        return;
    }

    windowElement.style.display = "block";

    topWindow++;
    windowElement.style.zIndex = topWindow;

    updateTaskManager();
}


function closeWindow(id) {

    const windowElement = document.getElementById(id);

    if (!windowElement) {
        return;
    }

    windowElement.style.display = "none";

    updateTaskManager();
}


function focusWindow(windowElement) {

    topWindow++;

    windowElement.style.zIndex = topWindow;
}


windows.forEach(function (windowElement) {

    windowElement.addEventListener("mousedown", function () {
        focusWindow(windowElement);
    });

});


// OPEN BUTTONS

document.querySelectorAll("[data-open]").forEach(function (button) {

    button.addEventListener("click", function () {
        openWindow(button.dataset.open);
    });

});


// CLOSE BUTTONS

document.querySelectorAll("[data-close]").forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.stopPropagation();

        closeWindow(button.dataset.close);

    });

});


// DRAGGING

windows.forEach(function (windowElement) {

    const header =
        windowElement.querySelector(".window-header");

    if (!header) {
        return;
    }

    let moving = false;
    let oldX = 0;
    let oldY = 0;


    header.addEventListener("mousedown", function (event) {

        if (event.target.closest(".close-button")) {
            return;
        }

        moving = true;

        oldX = event.clientX;
        oldY = event.clientY;

        focusWindow(windowElement);

        document.addEventListener("mousemove", moveWindow);
        document.addEventListener("mouseup", stopMoving);

    });


    function moveWindow(event) {

        if (!moving) {
            return;
        }

        const x = event.clientX - oldX;
        const y = event.clientY - oldY;

        windowElement.style.left =
            windowElement.offsetLeft + x + "px";

        windowElement.style.top =
            windowElement.offsetTop + y + "px";

        oldX = event.clientX;
        oldY = event.clientY;
    }


    function stopMoving() {

        moving = false;

        document.removeEventListener("mousemove", moveWindow);
        document.removeEventListener("mouseup", stopMoving);

    }

});


// TASK MANAGER

const taskNames = {
    welcomeWindow: "Welcome",
    terminalWindow: "YSH Terminal",
    notesWindow: "Notes",
    browserWindow: "Browser",
    taskManagerWindow: "Task Manager"
};


function updateTaskManager() {

    const taskBody =
        document.getElementById("taskManagerBody");

    if (!taskBody) {
        return;
    }

    taskBody.innerHTML = "";

    windows.forEach(function (windowElement) {

        if (windowElement.style.display === "none") {
            return;
        }

        const row = document.createElement("tr");

        const name = document.createElement("td");
        name.textContent =
            taskNames[windowElement.id] || windowElement.id;

        const status = document.createElement("td");
        status.textContent = "Running";

        const action = document.createElement("td");

        const button = document.createElement("button");
        button.textContent = "Focus";

        button.addEventListener("click", function () {
            focusWindow(windowElement);
        });

        action.appendChild(button);

        row.appendChild(name);
        row.appendChild(status);
        row.appendChild(action);

        taskBody.appendChild(row);

    });
}


// TERMINAL

const terminalInput =
    document.getElementById("terminalInput");

const terminalOutput =
    document.getElementById("terminalOutput");


function printTerminal(text) {

    const line = document.createElement("div");

    line.textContent = text;

    terminalOutput.appendChild(line);

    terminalOutput.scrollTop =
        terminalOutput.scrollHeight;
}


terminalInput.addEventListener("keydown", function (event) {

    if (event.key !== "Enter") {
        return;
    }

    const text = terminalInput.value.trim();

    terminalInput.value = "";

    if (text === "") {
        return;
    }

    printTerminal(
        (userName || "user").toLowerCase() +
        "@ysh:~$ " +
        text
    );

    const parts = text.split(" ");
    const command = parts[0].toLowerCase();
    const argument = parts.slice(1).join(" ");


    if (command === "help") {

        printTerminal(
            "help  clear  date  time  whoami  ver  about  echo"
        );

    } else if (command === "clear") {

        terminalOutput.innerHTML = "";

    } else if (command === "date") {

        printTerminal(new Date().toLocaleDateString());

    } else if (command === "time") {

        printTerminal(new Date().toLocaleTimeString());

    } else if (command === "whoami") {

        printTerminal(userName || "User");

    } else if (command === "ver") {

        printTerminal("YSH OS WebOS 1.0");

    } else if (command === "about") {

        printTerminal("YSH OS - YSH running in a browser.");

    } else if (command === "echo") {

        printTerminal(argument);

    } else {

        printTerminal("Command not found: " + command);

    }

});


// NOTES

const notesArea =
    document.getElementById("notesArea");

notesArea.value =
    localStorage.getItem("yshNotes") || "";

notesArea.addEventListener("input", function () {

    localStorage.setItem(
        "yshNotes",
        notesArea.value
    );

});


// BROWSER

const browserForm =
    document.getElementById("browserForm");

const browserInput =
    document.getElementById("browserInput");

const browserFrame =
    document.getElementById("browserFrame");

const browserNewTab =
    document.getElementById("browserNewTab");


browserForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const query = browserInput.value.trim();

    if (query === "") {
        return;
    }

    browserFrame.src =
        "https://www.google.com/search?igu=1&q=" +
        encodeURIComponent(query);

});


browserNewTab.addEventListener("click", function () {

    const query =
        browserInput.value.trim() || "Google";

    window.open(
        "https://www.google.com/search?q=" +
        encodeURIComponent(query),
        "_blank"
    );

});


// START

openWindow("welcomeWindow");

updateTaskManager();
