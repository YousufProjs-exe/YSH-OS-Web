
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
    if (terminalUser) terminalUser.textContent = name.toLowerCase();

    if (userName) {
        welcomeTitle.textContent = "Welcome back, " + name;
        welcomeMessage.textContent = "Your YSH OS desktop is ready.";
        nameInput.value = name;
    }
}

function saveUserName() {
    const name = nameInput.value.trim();
    if (!name) {
        nameInput.focus();
        return;
    }

    userName = name;
    localStorage.setItem("yshUserName", userName);
    setUser();
    closeWindow("welcomeWindow");
}

saveNameButton.addEventListener("click", saveUserName);
nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveUserName();
    }
});

setUser();

// CLOCK
function updateClock() {
    document.getElementById("timeElement").textContent = new Date().toLocaleTimeString();
}
updateClock();
setInterval(updateClock, 1000);

// WINDOWS
const windows = document.querySelectorAll(".window");
let topWindow = 20;

function openWindow(id) {
    const windowElement = document.getElementById(id);
    if (!windowElement) return;

    windowElement.style.display = "block";
    topWindow++;
    windowElement.style.zIndex = topWindow;
    updateTaskManager();
}

function closeWindow(id) {
    const windowElement = document.getElementById(id);
    if (!windowElement) return;

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
    const header = windowElement.querySelector(".window-header");
    if (!header) return;

    let moving = false;
    let oldX = 0;
    let oldY = 0;

    header.addEventListener("mousedown", function (event) {
        if (event.target.closest(".close-button")) return;

        moving = true;
        oldX = event.clientX;
        oldY = event.clientY;
        focusWindow(windowElement);
        document.addEventListener("mousemove", moveWindow);
        document.addEventListener("mouseup", stopMoving);
    });

    function moveWindow(event) {
        if (!moving) return;

        const x = event.clientX - oldX;
        const y = event.clientY - oldY;
        windowElement.style.left = windowElement.offsetLeft + x + "px";
        windowElement.style.top = windowElement.offsetTop + y + "px";
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
    settingsWindow: "System Settings",
    notesWindow: "Notes",
    browserWindow: "Arc - Browser",
    pulseWindow: "Pulse",
    taskManagerWindow: "Task Manager",
    calculatorWindow: "Calculator",
    calendarWindow: "Calendar"
};

function updateTaskManager() {
    const taskBody = document.getElementById("taskManagerBody");
    if (!taskBody) return;

    taskBody.innerHTML = "";
    windows.forEach(function (windowElement) {
        if (windowElement.style.display === "none") return;

        const row = document.createElement("tr");
        const name = document.createElement("td");
        const status = document.createElement("td");
        const action = document.createElement("td");
        name.textContent = taskNames[windowElement.id] || windowElement.id;
        status.textContent = "Running";

        const focusButton = document.createElement("button");
        focusButton.textContent = "Focus";
        focusButton.addEventListener("click", function () {
            focusWindow(windowElement);
        });
        action.appendChild(focusButton);

        if (windowElement.id !== "taskManagerWindow") {
            const endButton = document.createElement("button");
            endButton.textContent = "End Task";
            endButton.addEventListener("click", function () {
                closeWindow(windowElement.id);
            });
            action.appendChild(endButton);
        }

        row.appendChild(name);
        row.appendChild(status);
        row.appendChild(action);
        taskBody.appendChild(row);
    });
}

// TERMINAL
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

function printTerminal(text) {
    const line = document.createElement("div");
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalInput.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const text = terminalInput.value.trim();
    terminalInput.value = "";
    if (!text) return;

    printTerminal((userName || "user").toLowerCase() + "@ysh:~$ " + text);
    const parts = text.split(/\s+/);
    const command = parts[0].toLowerCase();
    const argument = parts.slice(1).join(" ");

    if (command === "help") printTerminal("help  clear  date  time  whoami  ver  about  echo open run");
    else if (command === "clear") terminalOutput.innerHTML = "";
    else if (command === "date") printTerminal(new Date().toLocaleDateString());
    else if (command === "time") printTerminal(new Date().toLocaleTimeString());
    else if (command === "whoami") printTerminal(userName || "User");
    else if (command === "ver") printTerminal("YSH OS WebOS 2.0");
    else if (command === "about") printTerminal("YSH OS WebOS - YSH running in a browser.");
    else if (command === "echo") printTerminal(argument);
    else if (command === "open" || command === "run") {
        const target = argument.toLowerCase();

        const apps = {
            terminal: "terminalWindow",
            notes: "notesWindow",
            browser: "browserWindow",
            arc: "browserWindow",
            pulse: "pulseWindow",
            taskmanager: "taskManagerWindow",
            calculator: "calculatorWindow",
            calendar: "calendarWindow"
        };

        if (apps[target]) {
            openWindow(apps[target]);
            printTerminal("Opened " + target);
        } else {
            printTerminal("App not found: " + argument);
            printTerminal("Apps: terminal, notes, browser, arc, pulse, taskmanager, calculator, calendar");
        }
    }
    else printTerminal("Command not found: " + command);
});

// NOTES
const notesArea = document.getElementById("notesArea");
notesArea.value = localStorage.getItem("yshNotes") || "";
notesArea.addEventListener("input", function () {
    localStorage.setItem("yshNotes", notesArea.value);
});

// PULSE: NASA APOD
const pulseRefresh = document.getElementById("pulseRefresh");
const pulseStatus = document.getElementById("pulseStatus");
const pulseTitle = document.getElementById("pulseTitle");
const pulseDate = document.getElementById("pulseDate");
const pulseMedia = document.getElementById("pulseMedia");
const pulseExplanation = document.getElementById("pulseExplanation");

async function loadPulse() {
    pulseStatus.textContent = "Loading NASA's picture of the day...";
    pulseTitle.textContent = "";
    pulseDate.textContent = "";
    pulseMedia.innerHTML = "";
    pulseExplanation.textContent = "";

    try {
        const response = await fetch(
            "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
        );

        if (!response.ok) {
            throw new Error(
                response.status === 429
                    ? "NASA API rate limit reached. Try again later."
                    : response.status === 500
                        ? "NASA APOD server error. Try again later."
                        : "NASA API error: " + response.status
            );
        }

        const data = await response.json();

        pulseStatus.textContent = "";
        pulseTitle.textContent = data.title || "NASA APOD";
        pulseDate.textContent = data.date || "";

        if (data.media_type === "image" && data.url) {
            const image = document.createElement("img");
            image.src = data.url;
            image.alt = data.title || "NASA astronomy picture";
            pulseMedia.appendChild(image);
        } 
        else if (data.media_type === "video" && data.url) {
            const link = document.createElement("a");
            link.href = data.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Watch today's NASA video";
            pulseMedia.appendChild(link);
        }

        pulseExplanation.textContent = data.explanation || "";
    } catch (error) {
        pulseStatus.textContent = error.message + " Try Refresh later.";
    }
}

pulseRefresh.addEventListener("click", loadPulse);
loadPulse();

// SYSTEM SETTINGS
const wallpaperSelect = document.getElementById("wallpaperSelect");
const themeSelect = document.getElementById("themeSelect");
const solidColor = document.getElementById("solidColor");

function applySettings() {
    const wallpaper = localStorage.getItem("yshWallpaper") || "default";
    const theme = localStorage.getItem("yshTheme") || "dark";
    const color = localStorage.getItem("yshSolidColor") || "#050505";

    wallpaperSelect.value = wallpaper;
    themeSelect.value = theme;
    solidColor.value = color;

    document.body.classList.toggle("light-theme", theme === "light");

    if (wallpaper === "solid") {
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = color;
    } else if (wallpaper === "space") {
        document.body.style.backgroundImage = 'url("images/space.png")';
        document.body.style.backgroundColor = "#050505";
    } else if (wallpaper === "blackhole") {
        document.body.style.backgroundImage = 'url("images/blackhole.jpg")';
        document.body.style.backgroundColor = "#050505";
    } else {
        document.body.style.backgroundImage = 'url("images/OS background.png")';
        document.body.style.backgroundColor = "#050505";
    }

}

solidColor.addEventListener("input", function () {
    const color = solidColor.value;

    localStorage.setItem("yshSolidColor", color);

    if (wallpaperSelect.value === "solid") {
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = color;
    }
});

wallpaperSelect.addEventListener("change", function () {
    localStorage.setItem("yshWallpaper", wallpaperSelect.value);
    applySettings();
});

themeSelect.addEventListener("change", function () {
    localStorage.setItem("yshTheme", themeSelect.value);
    applySettings();
});

applySettings();

// BROWSER
const browserForm = document.getElementById("browserForm");
const browserInput = document.getElementById("browserInput");
const browserFrame = document.getElementById("browserFrame");
const browserNewTab = document.getElementById("browserNewTab");

browserForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = browserInput.value.trim();
    if (!query) return;

    browserFrame.src = "https://www.google.com/search?igu=1&q=" + encodeURIComponent(query);
});

browserNewTab.addEventListener("click", function () {
    const query = browserInput.value.trim() || "Google";
    window.open("https://www.google.com/search?q=" + encodeURIComponent(query), "_blank");
});

// CALCULATOR 
const calculatorDisplay = document.getElementById("calculatorDisplay");
const calculatorWindow = document.getElementById("calculatorWindow");

if (calculatorDisplay && calculatorWindow) {
    let currentInput = "0";
    let storedValue = null;
    let pendingOperator = null;
    let resetInput = false;

    function updateCalculatorDisplay() {
        calculatorDisplay.value = currentInput;
    }

    function enterDigit(digit) {
        if (resetInput || currentInput === "Error") {
            currentInput = digit;
            resetInput = false;
        } else if (currentInput === "0") {
            currentInput = digit;
        } else if (currentInput.length < 16) {
            currentInput += digit;
        }
        updateCalculatorDisplay();
    }

    function enterDecimal() {
        if (resetInput || currentInput === "Error") {
            currentInput = "0";
            resetInput = false;
        }
        if (!currentInput.includes(".")) {
            currentInput += ".";
        }
        updateCalculatorDisplay();
    }

    function calculate(a, operator, b) {
        switch (operator) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return b === 0 ? null : a / b;
            default: return b;
        }
    }

    function formatResult(value) {
        if (value === null || !Number.isFinite(value)) return "Error";
        return String(Number(value.toPrecision(12)));
    }

    function chooseOperator(operator) {
        const value = Number(currentInput);
        if (!Number.isFinite(value)) return;

        if (pendingOperator && !resetInput && storedValue !== null) {
            const result = calculate(storedValue, pendingOperator, value);
            currentInput = formatResult(result);
            storedValue = result;
        } else {
            storedValue = value;
        }

        pendingOperator = currentInput === "Error" ? null : operator;
        resetInput = true;
        updateCalculatorDisplay();
    }

    function calculateResult() {
        if (pendingOperator === null || storedValue === null) return;

        const result = calculate(
            storedValue,
            pendingOperator,
            Number(currentInput)
        );

        currentInput = formatResult(result);
        storedValue = null;
        pendingOperator = null;
        resetInput = true;
        updateCalculatorDisplay();
    }

    function clearCalculator() {
        currentInput = "0";
        storedValue = null;
        pendingOperator = null;
        resetInput = false;
        updateCalculatorDisplay();
    }

    function backspaceCalculator() {
        if (resetInput || currentInput === "Error") {
            currentInput = "0";
            resetInput = false;
        } else {
            currentInput = currentInput.length > 1
                ? currentInput.slice(0, -1)
                : "0";

            if (currentInput === "-") currentInput = "0";
        }
        updateCalculatorDisplay();
    }

    function toggleSign() {
        if (currentInput === "0" || currentInput === "Error") return;
        currentInput = currentInput.startsWith("-")
            ? currentInput.slice(1)
            : "-" + currentInput;
        updateCalculatorDisplay();
    }

    calculatorWindow.querySelectorAll("[data-calc]").forEach(button => {
        button.addEventListener("click", () => {
            const action = button.dataset.calc;
            const value = button.dataset.value;

            if (action === "digit") enterDigit(value);
            else if (action === "decimal") enterDecimal();
            else if (action === "operator") chooseOperator(value);
            else if (action === "equals") calculateResult();
            else if (action === "clear") clearCalculator();
            else if (action === "backspace") backspaceCalculator();
            else if (action === "sign") toggleSign();
        });
    });

    document.addEventListener("keydown", event => {
        if (calculatorWindow.style.display === "none") return;

        // Avoid intercepting shortcuts while typing in other inputs.
        if (event.target.matches("input, textarea, select")) return;

        if (/^[0-9]$/.test(event.key)) enterDigit(event.key);
        else if (event.key === ".") enterDecimal();
        else if (["+", "-", "*", "/"].includes(event.key)) {
            chooseOperator(event.key);
        } else if (event.key === "Enter" || event.key === "=") {
            calculateResult();
        } else if (event.key === "Backspace") {
            backspaceCalculator();
        } else if (event.key === "Escape") {
            clearCalculator();
        } else {
            return;
        }

        event.preventDefault();
    });

    updateCalculatorDisplay();
}

// CALENDAR
const calendarGrid = document.getElementById("calendarGrid");
const calendarMonth = document.getElementById("calendarMonth");
const calendarToday = document.getElementById("calendarToday");
const calendarPrev = document.getElementById("calendarPrev");
const calendarNext = document.getElementById("calendarNext");

let calendarDate = new Date();

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    calendarMonth.textContent = calendarDate.toLocaleDateString(
        undefined,
        { month: "long", year: "numeric" }
    );

    calendarToday.textContent = "Today: " + new Date().toLocaleDateString();

    calendarGrid.innerHTML = "";

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    weekdays.forEach(day => {
        const cell = document.createElement("div");
        cell.className = "calendar-day calendar-weekday";
        cell.textContent = day;
        calendarGrid.appendChild(cell);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-day empty";
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        cell.textContent = day;

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
        }

        calendarGrid.appendChild(cell);
    }
}

calendarPrev.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});

calendarNext.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

// START
openWindow("welcomeWindow");
updateTaskManager();
