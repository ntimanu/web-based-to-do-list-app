document.addEventListener("DOMContentLoaded", function () {
  // Define tasks array
  let tasks = [];

  // Define categories
  const categories = ["Work", "Personal", "Shopping", "Study", "Other"];

  // Filter tasks based on selected category
  window.filterTasks = function (category) {
    const filteredTasks =
      category === "All"
        ? tasks
        : tasks.filter(
            (task) =>
              category === "Choose category" || task.category === category
          );
    displayTasks(filteredTasks);

    // Update the status based on the selected category
    const statusElement = document.getElementById("status");
    statusElement.textContent =
      category === "Choose category" ? "All Tasks" : `Category: ${category}`;
  };

  // Add task function
  window.addTask = function () {
    const taskInput = document.getElementById("taskInput");
    const categoryInput = document.getElementById("categoryDropdown");
    const taskText = taskInput.value.trim();
    const category = categoryInput.value;
    if (taskText !== "" && category !== "Choose category") {
      const newTask = {
        text: taskText,
        category: category,
        important: false,
        completed: false,
      };
      tasks.unshift(newTask);
      displayTasks(tasks);
      updateLocalStorage();
      taskInput.value = "";
      categoryInput.value = "Choose category";
      updateCategoryFilter();
    }
  };

  // Delete task function
  window.deleteTask = function (index) {
    tasks.splice(index, 1);
    displayTasks(tasks);
    updateLocalStorage();
    updateCategoryFilter();
  };

  // Edit task function
  window.editTask = function (index) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null) {
      tasks[index].text = newText.trim();
      displayTasks(tasks);
      updateLocalStorage();
    }
  };

  // Toggle task importance function
  window.toggleImportance = function (index) {
    tasks[index].important = !tasks[index].important;
    if (tasks[index].important) {
      tasks.unshift(tasks.splice(index, 1)[0]);
    }
    displayTasks(tasks);
    updateLocalStorage();
  };

  // Toggle task completion function
  window.toggleCompletion = function (index) {
    tasks[index].completed = !tasks[index].completed;
    displayTasks(tasks);
    updateLocalStorage();
  };

  // Update local storage function
  function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Display tasks function
  function displayTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" ${
        task.completed ? "checked" : ""
      } onchange="toggleCompletion(${index})">
                        <span class="${task.important ? "important" : ""} ${
        task.completed ? "completed" : ""
      }" onclick="toggleImportance(${index})">${task.text}</span>
                        <span class="category">${task.category}</span>
                        <div class="buttons-container">
                            <button class="edit" onclick="editTask(${index})">Edit</button>
                            <button onclick="deleteTask(${index})">Delete</button>
                            <button class="important-btn ${
                              task.important ? "important" : ""
                            }" title="Click to ${
        task.important ? "Unmark" : "Mark"
      } as Important" onclick="toggleImportance(${index})">&#9733;</button>
                        </div>`;
      taskList.appendChild(li);
    });

    updateCategoryFilter();
  }

  // Update category filter dropdown function
  function updateCategoryFilter() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="All">All</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.text = category;
      categoryFilter.add(option);
    });
  }

  // Populate the category dropdown
  const categoryDropdown = document.getElementById("categoryDropdown");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryDropdown.add(option);
  });

  // Retrieve tasks from local storage on page load
  const storedTasks = localStorage.getItem("tasks");
  tasks = storedTasks ? JSON.parse(storedTasks) : [];
  displayTasks(tasks);
});
