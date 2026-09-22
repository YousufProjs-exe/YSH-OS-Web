
var userName = localStorage.getItem("yshUserName") || "";
var userNameInput = document.getElementById("userNameInput");
var saveNameButton = document.getElementById("saveNameButton");
var welcomeTitle = document.getElementById("welcomeTitle");
var welcomeMessage = document.getElementById("welcomeMessage");

function updateUserDisplay() {

    var displayName = userName || "User";
    document.getElementById("userName").textContent = displayName;
    document.getElementById("terminalUser").textContent = displayName.toLowerCase();

    if (userName) {

        welcomeTitle.textContent = "Welcome back, " + userName;
        welcomeMessage.textContent = "Your YSH OS desktop is ready.";
        userNameInput.value = userName;

    }

}

updateUserDisplay();

saveNameButton.addEventListener(
    "click",
    saveName
);

userNameInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            saveName();
        }

    }
);

function saveName() {

    var enteredName = userNameInput.value.trim();

    if (!enteredName) {

        userNameInput.focus();
        return;

    }

    userName = enteredName;

    localStorage.setItem("yshUserName", userName);

    updateUserDisplay();
    closeWindow("welcomeWindow");

}

// CLOCK
function updateTime() {

    document.getElementById("timeElement").textContent = new Date().toLocaleTimeString();

}

updateTime();
setInterval(updateTime, 1000);

// WINDOWS
var windowIds = [

    "welcomeWindow",
    "terminalWindow",
    "notesWindow",
    "browserWindow",
    "taskManagerWindow"

];

var windowNames = {

    welcomeWindow: "YSH OS",
    terminalWindow: "YSH Terminal",
    notesWindow: "Notes",
    browserWindow: "ARC - Browser",
    taskManagerWindow: "Task Manager"

};

var nextZIndex = 20;

function getWindow(id) {

    return document.getElementById(id);

}

function focusWindow(id) {

    var element = getWindow(id);

    if (!element) {
        return;
    }

    nextZIndex++;
    element.style.zIndex = nextZIndex;

}

function openWindow(id) {

    var element = getWindow(id);

    if (!element) {
        return;
    }

    element.style.display = "block";

    focusWindow(id);
    updateTaskManager();

}

function closeWindow(id) {

    var element = getWindow(id);

    if (!element) {
        return;
    }

    element.style.display = "none";
    updateTaskManager();

}

// DRAGGING
function dragElement(element) {

    var header = document.getElementById(element.id + "header");

    if (!header) {
        return;
    }

    var initialX = 0;
    var initialY = 0;

    header.addEventListener(
        "mousedown",
        function (event) {


            if (
                event.target.closest(
                    "button"
                )
            ) {

                return;

            }

            event.preventDefault();

            focusWindow(
                element.id
            );

            initialX = event.clientX;
            initialY = event.clientY;

            document.addEventListener(
                "mousemove",
                dragWindow
            );


            document.addEventListener(
                "mouseup",
                stopDragging,
                {
                    once: true
                }
            );

        }
    );

    function dragWindow(event) {

        var currentX = initialX - event.clientX;
        var currentY = initialY - event.clientY;
        initialX = event.clientX;
        initialY = event.clientY;

        element.style.top =
            (
                element.offsetTop -
                currentY
            ) + "px";


        element.style.left =
            (
                element.offsetLeft -
                currentX
            ) + "px";

    }

    function stopDragging() {

        document.removeEventListener(
            "mousemove",
            dragWindow
        );

    }

}

windowIds.forEach(
    function (id) {

        dragElement(
            getWindow(id)
        );

    }
);

// FOCUS WINDOWS
document
    .querySelectorAll(".window")
    .forEach(
        function (element) {

            element.addEventListener(
                "mousedown",
                function () {

                    focusWindow(
                        element.id
                    );

                }
            );

        }
    );


// OPEN BUTTONS
document
    .querySelectorAll("[data-open]")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    openWindow(
                        button.dataset.open
                    );

                }
            );

        }
    );


// CLOSE BUTTONS
document
    .querySelectorAll("[data-close]")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    closeWindow(
                        button.dataset.close
                    );

                }
            );

        }
    );


// TASK MANAGER
function updateTaskManager() {

    var body = document.getElementById("taskManagerBody");
    body.innerHTML = "";
    var desktopRow = document.createElement("tr");

    desktopRow.innerHTML =
        "<td>Desktop</td>" +
        "<td>Running</td>" +
        "<td>-</td>";

    body.appendChild(desktopRow);

    windowIds.forEach(
        function (id) {

            var element = getWindow(id);

            if (
                !element ||
                getComputedStyle(
                    element
                ).display === "none"
            ) {

                return;

            }

            var row = document.createElement("tr");
            var nameCell = document.createElement("td");
            nameCell.textContent = windowNames[id];
            var statusCell = document.createElement("td");
            statusCell.textContent = "Running";
            var actionCell = document.createElement("td");
            var focusButton = document.createElement("button");

            focusButton.type = "button";
            focusButton.textContent = "Focus";


            focusButton.addEventListener(
                "click",
                function () {

                    focusWindow(id);

                }
            );

            actionCell.appendChild(focusButton);
            row.appendChild(nameCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);
            body.appendChild(row);

        }
    );

}

// **TERMINAL**
var terminalInput = document.getElementById("terminalInput");
var terminalOutput = document.getElementById("terminalOutput");

function writeTerminal(text) {

    var line = document.createElement("div");
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Enter") {
            return;
        }

        var command = terminalInput.value.trim();
        terminalInput.value = "";

        if (!command) {
            return;
        }

        writeTerminal(
            (userName || "user").toLowerCase() +
            "@ysh:~$ " + command
        );

        var parts = command.split(" ");
        var cmd = parts[0].toLowerCase();
        var argument = parts.slice(1).join(" ");

        if (cmd === "help") {

            writeTerminal(
                "Available commands:"
            );

            writeTerminal(
                "help  clear  date  time  whoami"
            );

            writeTerminal(
                "ver  about  echo"
            );

        }

        else if (cmd === "clear") {

            terminalOutput.innerHTML = "";

        }

        else if (cmd === "date") {

            writeTerminal(
                new Date().toLocaleDateString()
            );

        }

        else if (cmd === "time") {

            writeTerminal(
                new Date().toLocaleTimeString()
            );

        }

        else if (cmd === "whoami") {

            writeTerminal(
                userName || "User"
            );

        }

        else if (cmd === "ver") {

            writeTerminal(
                "YSH OS WebOS 1.0"
            );

        }

        else if (cmd === "about") {

            writeTerminal(
                "YSH OS - A web-based OS built by Yousuf."
            );

        }

        else if (cmd === "echo") {

            writeTerminal(
                argument
            );

        }

        else {

            writeTerminal(
                "Command not found: " + cmd
            );

        }

    }
);

// **NOTES**
var notesArea = document.getElementById("notesArea");
notesArea.value = localStorage.getItem("yshNotes") || "";
notesArea.addEventListener(
    "input",
    function () {

        localStorage.setItem(
            "yshNotes",
            notesArea.value
        );

    }
);


// **BROWSER**
var browserForm = document.getElementById("browserForm");
var browserInput = document.getElementById("browserInput");
var browserFrame = document.getElementById("browserFrame");
var browserNewTab = document.getElementById("browserNewTab");

// BROWSER WINDOW
browserForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        var query = browserInput.value.trim();

        if (!query) {
            return;
        }

        browserFrame.src = "https://www.google.com/search?igu=1&q=" + encodeURIComponent(query);

    }
);

// BROWSER TAB
browserNewTab.addEventListener(
    "click",
    function () {

        var query = browserInput.value.trim();

        if (!query) {
            query = "Google";
        }

        window.open(
            "https://www.google.com/search?q=" +
            encodeURIComponent(query),
            "_blank"
        );

    }
);

// START
openWindow("welcomeWindow");
updateTaskManager();
