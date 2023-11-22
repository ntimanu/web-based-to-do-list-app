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

  // Edit task function for inline editing
  window.editTask = function (index) {
    const taskList = document.getElementById("taskList");
    const li = taskList.children[index];
    const span = li.querySelector("span");

    // Store the category for later restoration
    const categoryContainer = li.querySelector(".category");
    const originalCategory = categoryContainer.textContent;

    // Create an input field for editing
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;

    // Replace the span with the input field
    li.replaceChild(input, span);

    // Hide the category during editing
    categoryContainer.style.display = "none";

    // Hide the "Edit" and "Delete" buttons during editing
    const editButton = li.querySelector(".edit");
    const deleteButton = li.querySelector(".delete");
    editButton.style.display = "none";
    deleteButton.style.display = "none";

    // Create a "Save" button with styles
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.style.backgroundColor = "#2ecc71";
    saveButton.style.color = "#ffffff";
    saveButton.style.padding = "8px 16px";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "4px";
    saveButton.style.cursor = "pointer";
    saveButton.style.transition = "background-color 0.3s ease";

    // Hover style for "Save" button
    saveButton.addEventListener("mouseover", function () {
      saveButton.style.backgroundColor = "#27ae60";
    });

    // Revert to original style when not hovering
    saveButton.addEventListener("mouseout", function () {
      saveButton.style.backgroundColor = "#2ecc71";
    });

    // Create a "Cancel" button with styles
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.backgroundColor = "#808080";
    cancelButton.style.color = "#ffffff";
    cancelButton.style.padding = "8px 16px";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "4px";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.transition = "background-color 0.3s ease";

    // Hover style for "Cancel" button
    cancelButton.addEventListener("mouseover", function () {
      cancelButton.style.backgroundColor = "#a9a9a9";
    });

    // Revert to original style when not hovering
    cancelButton.addEventListener("mouseout", function () {
      cancelButton.style.backgroundColor = "#808080";
    });

    // Add event listener to the "Save" button
    saveButton.addEventListener("click", function () {
      tasks[index].text = input.value;
      // Restore the category when saving
      tasks[index].category = originalCategory;
      displayTasks(tasks);
      updateLocalStorage();
    });

    // Add event listener to the "Cancel" button
    cancelButton.addEventListener("click", function () {
      displayTasks(tasks);
    });

    // Append the buttons to the list item
    li.appendChild(saveButton);
    li.appendChild(cancelButton);

    // Focus on the input field for immediate editing
    input.focus();
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
                            <button class="delete" onclick="deleteTask(${index})">Delete</button>
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
