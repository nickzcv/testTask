// On app load, get all tasks from localStorage
window.addEventListener('load',() => {
  render(0);
});

// On form submit add task and render
document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  addTask();
  render(0);
});

document.querySelector('#search').addEventListener('keyup', event => {
  event.preventDefault();
  const searchString = event.target.value;
  const tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));
  const searchResults = tasks.filter(element => element.task.includes(searchString));
  if (searchResults.lenght !== 0) {
    render(searchResults);
  }
});

document.querySelector('.tasks').addEventListener('click', (event) => {
  event.preventDefault();
  const isLink = event.target.nodeName === 'A';
  if (!isLink) {
    return;
  }
  const sortParam = event.target.getAttribute('data-sort');
  sortTasks(sortParam);
})


/* 
  Render function
*/
function render(searchResults) {
  const completedBlock = document.querySelector('#completed');
  const inprocessBlock = document.querySelector('#inprocess');
  // Clear lists before each render
  completedBlock.innerHTML = null;
  inprocessBlock.innerHTML = null;
  // Check if localStorage has any tasks
  if (localStorage.getItem('tasks') === null) return;

  // Get the tasks from localStorage and convert it to an array
  const tasks = (searchResults !== 0) ? searchResults : Array.from(JSON.parse(localStorage.getItem('tasks')));

  // Loop through the tasks and add them to the list
  tasks.forEach(task => {
    const list = task.completed ? completedBlock : inprocessBlock;
    const li = document.createElement('li');
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
      <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <span class="date">${new Date(task.completionDate).toDateString()}</span>
      <strong onclick="removeTask(this)">X</strong>`;
    list.insertBefore(li, list.children[0]);
  });
}

/* 
  Add task function
*/
function addTask() {
  const task = document.querySelector('form input');
  const list = document.querySelector('#inprocess');
  // Return if task is empty
  if (task.value === '') {
    alert("Please add some task!");
    return false;
  }
  // Check is task already exist
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert('Task already exist!');
    return false;
  }
  // Add task to local storage
  localStorage.setItem('tasks', JSON.stringify([...JSON.parse(localStorage.getItem('tasks') || '[]'), { task: task.value, completed: false }]));
}

/* 
  Complete task function
*/
function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));
  tasks.forEach(task => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
      task.completionDate = Date.now();
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle('completed');
  render(0);
}

/* 
  Remove task function
*/
function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      // delete task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  event.parentElement.remove();
}

// Store current task to track changes
var currentTask = null;

/* 
  Get current task function
*/
function getCurrentTask(event) {
  currentTask = event.value;
}

/* 
  Edit the task and update local storage
*/
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));
  // Check if task is empty
  if (event.value === '') {
    alert('Task is empty!');
    event.value = currentTask;
    return;
  }
  // Update task
  tasks.forEach(task => {
    if (task.task === currentTask) {
      task.task = event.value;
    }
  });
  // Update local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/* 
  Sorting function
*/
function sortTasks(sortParam) {
  let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));

  switch (sortParam) {
    case 'asc-first': {
      tasks.sort((a, b) => {
        const taskA = a.task.toUpperCase(); // ignore upper and lowercase
        const taskB = b.task.toUpperCase(); // ignore upper and lowercase
        if (taskA > taskB & !a.completed & !b.completed) {
          return -1;
        }
        if (taskA < taskB & !a.completed & !b.completed) {
          return 1;
        }
        return 0;
      });
      break;
    }
    case 'desc-first': {
      tasks.sort((a, b) => {
        const taskA = a.task.toUpperCase();
        const taskB = b.task.toUpperCase();
        if (taskA < taskB & !a.completed & !b.completed) {
          return -1;
        }
        if (taskA > taskB & !a.completed & !b.completed) {
          return 1;
        }
        return 0;
      });
      break;
    }
    case 'asc-second': {
      tasks.sort((a, b) => {
        const taskA = a.task.toUpperCase();
        const taskB = b.task.toUpperCase();
        if (taskA > taskB & a.completed & b.completed) {
          return -1;
        }
        if (taskA < taskB & a.completed & b.completed) {
          return 1;
        }
        return 0;
      });
      break;
    }
    case 'desc-second': {
      tasks.sort((a, b) => {
        const taskA = a.task.toUpperCase();
        const taskB = b.task.toUpperCase();
        if (taskA < taskB & a.completed & b.completed) {
          return -1;
        }
        if (taskA > taskB & a.completed & b.completed) {
          return 1;
        }
        return 0;
      });
      break;
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  render(0);
}
