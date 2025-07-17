document.addEventListener("DOMContentLoaded", function () {
  new Typed('#element', {
    strings: ['Manage Your Task', 'Manage Your Time'],
    typeSpeed: 50,
    backSpeed: 40,
    loop: true
  });
  

  const categorycontainer = document.querySelector(".categories");
  const categorySelect = document.getElementById("category-select");
  const taskScreen = document.querySelector(".task-screen");
  taskScreen.querySelector(".tasks").innerHTML = "";
  const addTaskbtn = document.querySelector(".add-task-btn");
  const addtaskform = document.querySelector(".add-task");
  const blackbackdrop = document.querySelector(".black-backdrop");
  const backbtn = document.querySelector(".back-btn");
  const taskList = taskScreen.querySelector(".tasks");
  const taskInput = document.getElementById("task-input");
  const addBtn = document.querySelector(".add-btn");
  const cancelBtn = document.querySelector(".cancle-btn");

  const categories = [
    { title: "Personal", img: "personal_list.png" },
    { title: "Work", img: "work.png" },
    { title: "Shopping", img: "shopping.png" },
    { title: "Education", img: "education.png" },
    { title: "Health", img: "health.png" },
    { title: "Finance", img: "finance.png" },
  ];

  // ✅ Load from localStorage or fallback to default tasks
 let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasksToLocal() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderCategories() {
    categorycontainer.innerHTML = "";
    categorySelect.innerHTML = "";

    categories.forEach((category) => {
      const categoryTasks = tasks.filter(task => task.category.toLowerCase() === category.title.toLowerCase());

      const div = document.createElement("div");
      div.classList.add("category");
      div.innerHTML = `
        <div class="section">
          <img src="${category.img}" alt="${category.title}" />
          <div class="section_content">
            <h1>${category.title}</h1>
            <p>${categoryTasks.length} Tasks</p>
          </div>
        </div>
        <div class="options">
          <div class="toggle-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </div>
        </div>
      `;

      div.addEventListener("click", () => {
        document.body.classList.add("task-active");
        taskScreen.querySelector(".details h1").innerText = `${category.title} Tasks`;
        taskScreen.querySelector(".details p").innerText = `${categoryTasks.length} task${categoryTasks.length !== 1 ? 's' : ''}`;
        taskScreen.querySelector("#category-img").src = category.img;
        history.pushState({ page: "task" }, "", "#task");
        renderTasksForCategory(category.title);
      });

      categorycontainer.appendChild(div);

      const option = document.createElement("option");
      option.value = category.title;
      option.innerText = category.title;
      categorySelect.appendChild(option);
    });
  }
  function updateTasksWrapperVisibility() {
  const tasksWrapper = document.querySelector('.tasks-wrapper');
  const visibleTasks = taskList.querySelectorAll('.task-wrapper');

  if (visibleTasks.length === 0) {
    tasksWrapper.style.display = 'none';
  } else {
    tasksWrapper.style.display = 'block';
  }
}

  function renderTasksForCategory(title) {
    const categoryTasks = tasks.filter(task => task.category === title);
    taskList.innerHTML = "";

    categoryTasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task-wrapper");
      taskDiv.innerHTML = `
        <label class="task">
          <input type="checkbox" ${task.completed ? "checked" : ""} />
          <span class="checkmark">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <p>${task.task}</p>
        </label>
        <div class="delete" style="cursor: pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 7.5h12M9.75 7.5V5.25A1.5 1.5 0 0111.25 3.75h1.5a1.5 1.5 0 011.5 1.5V7.5m-7.5 0v12A2.25 2.25 0 008.25 21h7.5a2.25 2.25 0 002.25-2.25V7.5M10.5 11.25v6m3-6v6" />
          </svg>
        </div>
      `;

      taskDiv.querySelector("input").addEventListener("change", (e) => {
        task.completed = e.target.checked;
        updateTaskCounts();
        saveTasksToLocal();
         const label = e.target.closest("label");
  if (e.target.checked) {
    label.classList.add("completed");
  } else {
    label.classList.remove("completed");
  }
      });

      taskDiv.querySelector(".delete").addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasksToLocal();
        renderTasksForCategory(title);
        renderCategories();
        updateTaskCounts();
        
        const updatedCount = tasks.filter(t => t.category === title).length;
        taskScreen.querySelector(".details p").innerText = `${updatedCount} task${updatedCount !== 1 ? 's' : ''}`;
      });

      taskList.appendChild(taskDiv);
    });
     updateTasksWrapperVisibility();
  }

  function toggleAddTaskForm() {
    addtaskform.classList.toggle("active");
    blackbackdrop.classList.toggle("active");
    addTaskbtn.classList.toggle("active");
  }

  addTaskbtn.addEventListener("click", toggleAddTaskForm);
  blackbackdrop.addEventListener("click", toggleAddTaskForm);
  backbtn.addEventListener("click", () => history.back());

  window.addEventListener("popstate", (event) => {
    if (!event.state || event.state.page !== "task") {
      document.body.classList.remove("task-active");
    }
  });

  function updateTaskCounts() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    document.getElementById("total-task").textContent = total;
    document.getElementById("completed-task").textContent = completed;
  }

  addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;
    if (!taskText || !category) return;

    const newTask = {
      id: Date.now(),
      task: taskText,
      category,
      completed: false
    };

    tasks.push(newTask);
    saveTasksToLocal();
    taskInput.value = "";

    toggleAddTaskForm();
    renderCategories();
    updateTaskCounts();

    const currentCategory = taskScreen.querySelector(".details h1")?.innerText.replace(" Tasks", "");
    if (document.body.classList.contains("task-active") && currentCategory === category) {
      renderTasksForCategory(category);

      const updatedCount = tasks.filter(t => t.category === category).length;
      taskScreen.querySelector(".details p").innerText = `${updatedCount} task${updatedCount !== 1 ? 's' : ''}`;
    }
  });

  cancelBtn.addEventListener("click", toggleAddTaskForm);

  renderCategories();
  updateTaskCounts();
});
