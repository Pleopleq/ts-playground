const btn = document.getElementById("btn")!;
const input = document.getElementById("todo-input")! as HTMLInputElement;
const todoList = document.getElementById("todo-list")! as HTMLUListElement;

btn.addEventListener("click", function () {
  const liElement = document.createElement("li")! as HTMLLIElement;

  liElement.textContent = input.value;
  todoList.appendChild(liElement);

  input.value = "";
});
