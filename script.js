const addToDoTaskButton = document.getElementById("Add-To-Do-Task");
const addInProgressTaskButton = document.getElementById("Add-In-Progress-Task");
const addIsDoneTaskButton = document.getElementById("Add-Is-Done-Task");

// Predefined tasks on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Local Storage at Load:", Object.entries(localStorage));

  if (localStorage.length === 0) {
    // alert("You Don't Have Something");

    // Storing Board Names as Strings
    localStorage.setItem("Learn Advanced JS", "to-do");
    localStorage.setItem("Learn ML In Python", "to-do");
    localStorage.setItem("Mastering Web Dev.", "in-progress");
    localStorage.setItem("Mastering Python", "in-progress");
    localStorage.setItem("Completed DSA In Java", "is-done");

    console.log("Newly Added Local Storage:", Object.entries(localStorage));

    setTimeout(() => {
      location.reload();
    }, 100);
  } else {
    // alert("You Have Something");

    // **Mapping Strings to Actual DOM Elements**
    const boardMap = {
      "to-do": document.getElementById("to-do"),
      "in-progress": document.getElementById("in-progress"),
      "is-done": document.getElementById("is-done"),
    };

    Object.keys(localStorage).forEach((taskName) => {
      let boardName = localStorage.getItem(taskName);
      let boardElement = boardMap[boardName]; // Get Actual Element

      addTask(taskName, boardElement);
    });
  }

  setNumberOfTasks();
});

// Function To Evaluate The Total cards In The Kanban....
function setNumberOfTasks() {
  allBoards.forEach((board) => {
    let count = board.querySelectorAll(".kanban-card").length;
    let numberElement = board.querySelector(".number");
    numberElement.textContent = count;
  });
}

const toDoKanbanBoard = document.getElementById("to-do");
const inProgressKanbanBoard = document.getElementById("in-progress");
const isDoneKanbanBoard = document.getElementById("is-done");

// Function To Add Event Listener of 'dragstart' & 'dragend'
function attachDragEvents(target) {
  target.addEventListener("dragstart", () => {
    target.classList.add("flying");
  });

  target.addEventListener("dragend", () => {
    target.classList.remove("flying");
  });
}

// Function To Return Date & Time....
function getFormattedDateTime() {
  let now = new Date();

  let day = now.getDate();
  let month = now.toLocaleString("en-US", {month: "short"});
  let year = now.getFullYear();

  let time = now.toLocaleTimeString("en-US", {hour12: true});

  return `${day} ${month} ${year} At ${time}`;
}

// Function To Create And Append Task In The Kanban Board
function addTask(inputTask, KanbanBoard) {
  let newToDoTask = document.createElement("div");
  newToDoTask.className = "kanban-card gap-2 p-2";
  newToDoTask.setAttribute("draggable", "true");

  // Task text
  let taskText = document.createElement("p");
  taskText.className = "mb-0 flex-grow-1";
  taskText.textContent = `${inputTask}`;

  // Edit Button
  let editButton = document.createElement("button");
  editButton.className = "btn btn-primary btn-sm";
  editButton.innerHTML = `<i class="fas fa-plus"></i>`;
  editButton.addEventListener("click", () => {
    let updatedTask = prompt("Edit Task:", taskText.textContent);
    if (updatedTask) {
      let editedTag = newToDoTask.querySelector("p").textContent;
      localStorage.setItem(updatedTask, localStorage.getItem(editedTag));
      localStorage.removeItem(editedTag);
      taskText.textContent = updatedTask;
    }
  });

  // Delete Button
  let deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger btn-sm";
  deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteButton.addEventListener("click", () => {
    newToDoTask.remove();
    localStorage.removeItem(newToDoTask.querySelector("p").textContent);
    setNumberOfTasks();
  });

  const DateAndTime = document.createElement("p");
  let currentDateAndTime = getFormattedDateTime();
  DateAndTime.textContent = currentDateAndTime;
  DateAndTime.className = "mb-0 text-end text-muted small mt-2"; // Smaller font & right aligned

  // Create a wrapper for task text and buttons (so they stay on one line)
  const taskRow = document.createElement("div");
  taskRow.className =
    "d-flex align-items-center justify-content-between gap-2 w-100";

  // Append elements to taskRow
  taskRow.appendChild(taskText);
  taskRow.appendChild(editButton);
  taskRow.appendChild(deleteButton);

  // Append elements to task card
  newToDoTask.appendChild(taskRow); // Add task + buttons in a row
  newToDoTask.appendChild(DateAndTime); // Add date below in small font

  // Attach drag event
  attachDragEvents(newToDoTask);

  // Append to Kanban board
  KanbanBoard.appendChild(newToDoTask);
  localStorage.setItem(inputTask, KanbanBoard.id);
  setNumberOfTasks();
}

// Event Listeners for Adding Tasks
addToDoTaskButton.addEventListener("click", () => {
  let inputTask = prompt("Enter The Task To Be Done");
  if (!inputTask) return;
  addTask(inputTask, toDoKanbanBoard);
});

addInProgressTaskButton.addEventListener("click", () => {
  let inputTask = prompt("Enter The Task In Progress");
  if (!inputTask) return;
  addTask(inputTask, inProgressKanbanBoard);
});

addIsDoneTaskButton.addEventListener("click", () => {
  let inputTask = prompt("Enter The Task Which Is Done");
  if (!inputTask) return;
  addTask(inputTask, isDoneKanbanBoard);
});

// Drag-and-drop functionality
const allBoards = document.querySelectorAll(".kanban-board");
const allItems = document.querySelectorAll(".kanban-card");

allItems.forEach((item) => attachDragEvents(item));

allBoards.forEach((board) => {
  board.addEventListener("dragover", () => {
    const flyingElement = document.querySelector(".flying");
    if (flyingElement) {
      const paraTags = flyingElement.querySelectorAll("p");
      if (paraTags.length > 1) {
        // Ensure there's more than one <p> tag
        paraTags[paraTags.length - 1].innerText = getFormattedDateTime(); // Change last <p> text
        let editedTag = paraTags[0].textContent;
        localStorage.setItem(editedTag, board.id);
      }
    }
    board.appendChild(flyingElement);
    console.log(flyingElement);
    setNumberOfTasks();
  });
});

// Dark Theme Toggle
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {
  let htmlElement = document.documentElement; // Select <html> tag
  let themeIcon = document.getElementById("themeIcon"); // Icon inside button
  let lightFooter = document.querySelector(".footer.bg-light"); // Light theme footer
  let darkFooter = document.querySelector(".footer.bg-dark"); // Dark theme footer

  if (htmlElement.getAttribute("data-bs-theme") === "dark") {
    htmlElement.setAttribute("data-bs-theme", "light");
    this.classList.replace("btn-outline-light", "btn-outline-dark"); // Change button style
    themeIcon.classList.replace("fa-sun", "fa-moon"); // Switch icon to Moon

    // Toggle footer visibility
    lightFooter.classList.remove("d-none");
    darkFooter.classList.add("d-none");
  } else {
    htmlElement.setAttribute("data-bs-theme", "dark");
    this.classList.replace("btn-outline-dark", "btn-outline-light"); // Change button style
    themeIcon.classList.replace("fa-moon", "fa-sun"); // Switch icon to Sun

    // Toggle footer visibility
    darkFooter.classList.remove("d-none");
    lightFooter.classList.add("d-none");
  }
});
