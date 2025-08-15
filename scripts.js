const STORAGE_KEY = "tasksData";

function loadTasksFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [
    { id: 1, title: "Launch Epic Career 🚀", description: "Create a killer Resume", status: "todo", priority: "high" },
    { id: 2, title: "Conquer React 🧪", description: "Understand how to build UIs with components", status: "todo", priority: "medium" },
    { id: 3, title: "Understand Databases ⚙️", description: "Learn how back-end data storage works", status: "todo", priority: "low" },
    { id: 4, title: "Crush Frameworks 📗", description: "Get comfortable using frontend frameworks", status: "todo", priority: "low" },
    { id: 5, title: "Master JavaScript 💛", description: "Get comfortable with the fundamentals", status: "doing", priority: "high" },
    { id: 6, title: "Never Give Up 🏆", description: "You're almost there", status: "doing", priority: "medium" },
    { id: 7, title: "Explore ES6 Features 🚀", description: "Learn modern JavaScript syntax", status: "done", priority: "low" },
    { id: 8, title: "Have fun 🥳", description: "Celebrate your progress!", status: "done", priority: "medium" },
  ];
}

function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
}

let initialTasks = loadTasksFromStorage();

let modalOverlay = null;

const columnContainers = {
  todo: document.querySelector('[data-status="todo"] .tasks-container'),
  doing: document.querySelector('[data-status="doing"] .tasks-container'),
  done: document.querySelector('[data-status="done"] .tasks-container'),
};

const toDoText   = document.getElementById("toDoText");
const doingText  = document.getElementById("doingText");
const doneText   = document.getElementById("doneText");

const addTaskBtn   = document.getElementById("add-task-btn");
const addTaskFab   = document.getElementById("add-task-fab");

const sidebar      = document.getElementById("sidebar");
const hideSidebar  = document.getElementById("hide-sidebar");
const showSidebar  = document.getElementById("show-sidebar");

const themeSwitchDesktop = document.getElementById("theme-switch");

function renderTasks(){
  Object.values(columnContainers).forEach(c => c.innerHTML = "");

  initialTasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-div";

    const header = document.createElement("div");
    header.className = "task-header";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const badge = document.createElement("span");
    badge.className = `priority-badge priority-${task.priority}`;

    header.appendChild(title);
    header.appendChild(badge);

    card.appendChild(header);

    card.addEventListener("click", () => openTaskModal(task));
    columnContainers[task.status].appendChild(card);
  });

  updateColumnHeaders();
}

function updateColumnHeaders(){
  toDoText.textContent  = `TODO (${columnContainers.todo.children.length})`;
  doingText.textContent = `DOING (${columnContainers.doing.children.length})`;
  doneText.textContent  = `DONE (${columnContainers.done.children.length})`;
}

function closeTaskModal(){
  if(modalOverlay){
    modalOverlay.remove();
    modalOverlay = null;
  }
}

function openTaskModal(task){
  closeTaskModal();

  modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-header">
      <h2>Task</h2>
      <button class="modal-close-btn" aria-label="Close">✖</button>
    </div>

    <label for="task-title">Title</label>
    <input type="text" id="task-title" value="${task.title}" />

    <label for="task-desc">Description</label>
    <textarea id="task-desc" rows="4">${task.description}</textarea>

    <label for="task-priority">Priority</label>
    <select id="task-priority">
      <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
      <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
      <option value="high" ${task.priority === "high" ? "selected" : ""}>High</option>
    </select>

    <label for="task-status">Status</label>
    <select id="task-status">
      <option value="todo"  ${task.status === "todo"  ? "selected" : ""}>todo</option>
      <option value="doing" ${task.status === "doing" ? "selected" : ""}>doing</option>
      <option value="done"  ${task.status === "done"  ? "selected" : ""}>done</option>
    </select>

    <div class="modal-actions">
      <button class="btn primary" id="save-btn">Save Changes</button>
      <button class="btn danger"  id="delete-btn">Delete Task</button>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  modal.querySelector(".modal-close-btn").addEventListener("click", closeTaskModal);

  modal.querySelector("#save-btn").addEventListener("click", () => {
    task.title = modal.querySelector("#task-title").value.trim() || task.title;
    task.description = modal.querySelector("#task-desc").value.trim();
    task.priority = modal.querySelector("#task-priority").value;
    task.status = modal.querySelector("#task-status").value;
    saveTasksToStorage();
    closeTaskModal();
    renderTasks();
  });

  modal.querySelector("#delete-btn").addEventListener("click", () => {
    if(confirm("Delete this task?")){
      const idx = initialTasks.findIndex(t => t.id === task.id);
      if(idx !== -1) initialTasks.splice(idx,1);
      saveTasksToStorage();
      closeTaskModal();
      renderTasks();
    }
  });
}

function openNewTaskModal(){
  closeTaskModal();

  modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-header">
      <h2>Add New Task</h2>
      <button class="modal-close-btn" aria-label="Close">✖</button>
    </div>

    <label for="new-title">Title</label>
    <input type="text" id="new-title" placeholder="e.g. Take chilled break" />

    <label for="new-desc">Description</label>
    <textarea id="new-desc" rows="6" placeholder="Take a breather and come back refreshed"></textarea>

    <label for="new-priority">Priority</label>
    <select id="new-priority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>

    <label for="new-status">Status</label>
    <select id="new-status">
      <option value="todo">todo</option>
      <option value="doing">doing</option>
      <option value="done">done</option>
    </select>

    <div class="modal-actions">
      <button class="btn primary" id="create-btn">Create Task</button>
      <button class="btn ghost"   id="cancel-btn">Cancel</button>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  modal.querySelector(".modal-close-btn").addEventListener("click", closeTaskModal);
  modal.querySelector("#cancel-btn").addEventListener("click", closeTaskModal);

  modal.querySelector("#create-btn").addEventListener("click", () => {
    const title = modal.querySelector("#new-title").value.trim();
    const description = modal.querySelector("#new-desc").value.trim();
    const priority = modal.querySelector("#new-priority").value;
    const status = modal.querySelector("#new-status").value;

    if(!title){
      alert("Please enter a title for the task.");
      return;
    }

    const newTask = { id: Date.now(), title, description, status, priority };
    initialTasks.push(newTask);
    saveTasksToStorage();
    closeTaskModal();
    renderTasks();
  });
}

function hideSidebarDesktop(){
  sidebar.classList.add("hidden");
  showSidebar.style.display = "block";
}
function showSidebarDesktop(){
  sidebar.classList.remove("hidden");
  showSidebar.style.display = "none";
}

function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  themeSwitchDesktop.checked = isDark;
  localStorage.setItem("theme", theme);
}

function initTheme(){
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();

  addTaskBtn?.addEventListener("click", openNewTaskModal);
  addTaskFab?.addEventListener("click", openNewTaskModal);

  hideSidebar?.addEventListener("click", hideSidebarDesktop);
  showSidebar?.addEventListener("click", showSidebarDesktop);

  initTheme();
  themeSwitchDesktop?.addEventListener("change", (e) => applyTheme(e.target.checked ? "dark" : "light"));
});
