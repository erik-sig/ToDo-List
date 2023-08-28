// Seleção de elementos
const todoInput = document.querySelector("#todo-input");
const todoContainer = document.querySelector("#todo-container");
const template = document.querySelector(".template");
const inputBtn = document.querySelector("#add-btn");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#todo-edit-input");
const cancelEditBtn = document.querySelector("#cancel-btn");
const searchInput = document.querySelector("#search-input");
const filterSelector = document.querySelector("#filter-selector");
const editBtn = document.querySelector("#confirm-edit-btn");
const eraseBtn = document.querySelector("#erase-btn");

let OldTodoTitle;

// Funções
function saveTodo(text, done = 0, save = 1) {
  const newTodo = template.cloneNode(true);
  newTodo.querySelector("h3").innerText = text;
  newTodo.classList.remove("template");
  newTodo.classList.add("todo");
  todoContainer.appendChild(newTodo);
  if (done) {
    newTodo.classList.add("done");
  }
  if (save) {
    saveTodoLocalStorage({ text, done });
  }
}

function toggleForms() {
  const todoForm = document.querySelector("#todo-form");
  const toolbarItems = document.querySelector("#toolbar");

  todoContainer.classList.toggle("hide");
  toolbarItems.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  editForm.classList.toggle("hide");
}

function updateTodo(editText) {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    if (todo.querySelector("h3").innerText === OldTodoTitle) {
      todo.querySelector("h3").innerText = editText;
      updateTodoList(OldTodoTitle, editText);
    }
  });
  toggleForms();
}

function searchTodo(searchText) {
  const todos = document.querySelectorAll(".todo");
  console.log(todos);
  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(searchText)) {
      todo.style.display = "none";
    }
  });
}

function filterTodo(filterValue) {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => {
        todo.style.display = "flex";
      });
      break;
    case "done":
      todos.forEach((todo) => {
        todo.style.display = "flex";
        if (!todo.classList.contains("done")) {
          todo.style.display = "none";
        }
      });
      break;
    case "todo":
      todos.forEach((todo) => {
        todo.style.display = "none";
        if (!todo.classList.contains("done")) {
          todo.style.display = "flex";
        }
      });
      break;
  }
}
// Eventos

inputBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (todoInput.value) {
    saveTodo(todoInput.value);
  }
  todoInput.value = "";
});

document.addEventListener("click", (e) => {
  targetEl = e.target;
  parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    updateTodoStatus(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    removeTodo(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    OldTodoTitle = todoTitle;
    console.log(OldTodoTitle);
  }
});

editBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (editInput.value) {
    updateTodo(editInput.value);
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  e.preventDefault();
  console.log(e.target.value);
  searchTodo(e.target.value);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterSelector.addEventListener("change", (e) => {
  filterTodo(e.target.value);
});

// Local Storage

function getTodosLocalStorage() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
}

function saveTodoLocalStorage(todo) {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
}

function updateTodoList(todoOldText, todoNewText) {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodoStatus(text) {
  const todos = getTodosLocalStorage();

  todos.map((todo) => (todo.text === text ? (todo.done = !todo.done) : null));

  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeTodo(text) {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != text);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

loadTodos();
