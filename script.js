document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById("todo-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const todoList = document.getElementById("todo-list");

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => renderTask(task));

    addTaskButton.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);
        todoInput.value = ""; // Clear input
    });

    function renderTask(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        if (task.completed) li.classList.add('completed');
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="start-pomodoro-btn">Start Pomodoro</button>
                <button class="delete-btn">Delete</button>
            </div>`;

        li.addEventListener('click', (e) => {
            if (e.target.tagName === "BUTTON") return;
            task.completed = !task.completed;
            li.classList.toggle('completed');
            saveTasks();
        });

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent toggle from firing
            tasks = tasks.filter(t => t.id !== task.id);
            li.remove();
            saveTasks();
        });

        li.querySelector('.start-pomodoro-btn').addEventListener('click', () => {
            startPomodoro(task.text);
        });

        todoList.appendChild(li);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Pomodoro Timer Variables
    let timer;
    let timerDuration = 25 * 60; // 25 minutes
    let timeLeft = timerDuration;

    const timerDisplay = document.getElementById("timer-display");
    const startTimerBtn = document.getElementById("start-timer-btn");
    const pauseTimerBtn = document.getElementById("pause-timer-btn");
    const resetTimerBtn = document.getElementById("reset-timer-btn");

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (!timer) {
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timer);
                    timer = null;
                    alert("Time's up! Take a break or start a new session.");
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        clearInterval(timer);
        timer = null;
    }

    function resetTimer() {
        clearInterval(timer);
        timer = null;
        timeLeft = timerDuration;
        updateTimerDisplay();
    }

    function startPomodoro(taskName) {
        alert(`Starting Pomodoro for task: ${taskName}`);
        resetTimer();
        startTimer();
    }

    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);

    updateTimerDisplay();
});