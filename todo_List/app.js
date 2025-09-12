// SELECTOR
const todoList = document.querySelector(".todo-list");
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const filterOption  = document.querySelector(".filter-todo")

// EVENT LISTENER
document.addEventListener('DOMContentLoaded',getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);

// FUNCTIONS
function addTodo (event){
    // PREVENT FORM FROM SUBMITTING
    event.preventDefault();

    // CREATE ELEMENTS
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // CREATE LIST
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //ADD TO DO
    saveLocalTodos(todoInput.value);

    // CREATE CHECK MARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // CREATE TRASH BUTTON
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // APPEND TODO-DIV TO TODO-LIST
    todoList.appendChild(todoDiv);
    todoInput.value = "";

};
function deleteCheck(e){
    const item = e.target;
    //DELETE TODO
    if (item.classList[0] === "trash-btn"){
        const todo = item.parentElement;
        //ANIMATION
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function(){
            todo.remove();
        });
    };

    //CHECK MARK
    if (item.classList[0] === "complete-btn"){
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    };
};

function filterTodo(e){
    const todos = todoList.childNodes;
    todos.forEach(function (todo){
        switch(e.target.value){
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains("completed")){
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains("completed")){
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    })
};
function saveLocalTodos (todo){
    //CHECK FOR EXISTING TODOS
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos (){
    //CHECK FOR EXISTING TODOS
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function(todo){
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        // CREATE LIST
        const newTodo = document.createElement("li");
        newTodo.innerText = todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        
        // CREATE CHECK MARK BUTTON
        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        // CREATE TRASH BUTTON
        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        // APPEND TODO-DIV TO TODO-LIST
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo){
    //CHECK FOR EXISTING TODOS
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    console.log(todo.children[0].innerHTML);
    const todoIndex = todo.children[0].innerHTML;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}
