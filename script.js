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
            completed: false,
            inProgress: false
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
                <button class="start-pomodoro-btn">${task.inProgress ? 'In Progress' : 'Start Pomodoro'}</button>
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

        const pomodoroBtn = li.querySelector('.start-pomodoro-btn');
        pomodoroBtn.addEventListener('click', () => {
            if (!task.inProgress) {
                startPomodoro(task.text);
                task.inProgress = true;
                pomodoroBtn.textContent = 'In Progress';
                pomodoroBtn.style.backgroundColor = '#FFA500'; // Orange color for "In Progress"
                saveTasks();
            }
        });

        todoList.appendChild(li);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Pomodoro Timer Variables
    let timer;
    let timerDuration = 25 * 60; // Default: 25 minutes
    let timeLeft = timerDuration;
    let currentMode = 'work';

    const timerDisplay = document.getElementById("timer-display");
    const currentModeDisplay = document.getElementById("current-mode");
    const startTimerBtn = document.getElementById("start-timer-btn");
    const pauseTimerBtn = document.getElementById("pause-timer-btn");
    const resetTimerBtn = document.getElementById("reset-timer-btn");
    const work25Btn = document.getElementById("work-25");
    const work50Btn = document.getElementById("work-50");
    const break5Btn = document.getElementById("break-5");

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
                    alert(`${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} session completed!`);
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

    function setTimerDuration(duration, mode) {
        timerDuration = duration * 60;
        timeLeft = timerDuration;
        currentMode = mode;
        currentModeDisplay.textContent = `${mode.charAt(0).toUpperCase() + mode.slice(1)} Session`;
        resetTimer();
    }

    function startPomodoro(taskName) {
        alert(`Starting Pomodoro for task: ${taskName}`);
        // Reset all tasks' inProgress status
        tasks.forEach(task => {
            task.inProgress = false;
        });
        // Update all task buttons
        document.querySelectorAll('.start-pomodoro-btn').forEach(btn => {
            btn.textContent = 'Start Pomodoro';
            btn.style.backgroundColor = '#4caf50'; // Reset to original color
        });
        setTimerDuration(25, 'work');
        startTimer();
        saveTasks();
    }

    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);

    work25Btn.addEventListener('click', () => setTimerDuration(25, 'work'));
    work50Btn.addEventListener('click', () => setTimerDuration(50, 'work'));
    break5Btn.addEventListener('click', () => setTimerDuration(5, 'break'));

    updateTimerDisplay();
});
