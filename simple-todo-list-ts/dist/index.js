"use strict";
var btn = document.getElementById("btn");
var input = document.getElementById("todo-input");
var todoList = document.getElementById("todo-list");
btn.addEventListener("click", function () {
    var liElement = document.createElement("li");
    liElement.textContent = input.value;
    todoList.appendChild(liElement);
    input.value = "";
});
