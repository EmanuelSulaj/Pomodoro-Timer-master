// mediaQueries
let mediaQuery400 = window.matchMedia("(min-width: 400px)");
let mediaQuery600 = window.matchMedia("(min-width: 600px)");
//Tabs
const pomoTab = document.getElementById('timer-pomo');
const shortTab = document.getElementById('timer-short');
const longTab = document.getElementById('timer-long');
//Timer
const startButton = document.getElementById('timer-button')
const timerNumber = document.getElementById('timer-number')
//Interval timer's ID
let idInterval;
//Counter of the pomo number
let pomoCount = 0;
const pomoCounDiv = document.getElementById('info-pomo-count');
//Tasks
const tasksContainer = document.getElementById('tasks-container')
let taskHope = document.querySelector('.task-hope')
let taskHopeCount = 0;
//Buttons
const taskAddButton = document.getElementById('task-add-button')
const nextButton = document.getElementById('timer-next-button');
//config
const settingButton = document.getElementById('settings-button');
const OKsettingButton = document.getElementById('ok-settings');
let pomoValue = 25;
let shortValue = 5;
let longValue = 15;
let intervalValue = 3;
//report
const reportButton= document.getElementById('report-button');
//Save the time studied
const myStorage = localStorage;
const hoursFocused = document.querySelector('.hours-focused');
const daysAccessed = document.getElementById('days-accesed');
const restartReportButton = document.getElementById('restart-report');
let dayCount =  0;
//alarm
let alarmSelected = 'alarm-beep';
let tictac = new Audio('./rsc/audios/countdown-alarm.mp3')

// Task Management View Toggle
const taskManagementBtn = document.querySelector('.sidebar button:first-child');
const taskManagementView = document.querySelector('.task-management-view');
const sidebar = document.querySelector('.sidebar');
const allSidebarButtons = document.querySelectorAll('.sidebar button');

taskManagementBtn.addEventListener('click', () => {
    taskManagementView.classList.add('active');
    sidebar.classList.add('hidden');
    // Hide all sidebar buttons individually
    allSidebarButtons.forEach(button => {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
    });
    updateTaskBoards();
});

// Update the close functionality
taskManagementView.addEventListener('click', (e) => {
    if (e.target === taskManagementView || e.target.classList.contains('task-board-close')) {
        taskManagementView.classList.remove('active');
        sidebar.classList.remove('hidden');
        // Show all sidebar buttons again
        allSidebarButtons.forEach(button => {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        });
    }
});

// Add function to handle escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && taskManagementView.classList.contains('active')) {
        taskManagementView.classList.remove('active');
        sidebar.classList.remove('hidden');
        // Show all sidebar buttons again
        allSidebarButtons.forEach(button => {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        });
    }
});

function updateTaskBoards() {
    const tasks = document.querySelectorAll('.one-task');
    const inProgressBoard = document.querySelector('.board:nth-child(1) .board-tasks');
    const completedBoard = document.querySelector('.board:nth-child(2) .board-tasks');
    const onHoldBoard = document.querySelector('.board:nth-child(3) .board-tasks');
    
    // Update task counts
    document.querySelector('.board:nth-child(1) .task-count').textContent = 
        Array.from(tasks).filter(task => !task.classList.contains('completed') && task.classList.contains('active')).length;
    document.querySelector('.board:nth-child(2) .task-count').textContent = 
        Array.from(tasks).filter(task => task.classList.contains('completed')).length;
    document.querySelector('.board:nth-child(3) .task-count').textContent = 
        Array.from(tasks).filter(task => !task.classList.contains('completed') && !task.classList.contains('active')).length;
    
    // Clear all boards
    inProgressBoard.innerHTML = '';
    completedBoard.innerHTML = '';
    onHoldBoard.innerHTML = '';
    
    tasks.forEach(task => {
        const taskName = task.querySelector('.task-name').textContent;
        const taskTime = task.querySelector('.task-time').textContent;
        const taskHope = task.querySelector('.task-hope').textContent;
        const isCompleted = task.classList.contains('completed');
        const isActive = task.classList.contains('active');
        
        const taskElement = `
            <div class="board-task ${isCompleted ? 'completed' : ''}">
                <i class="fa-solid fa-check complete-indicator"></i>
                <h4 class="task-title">${taskName}</h4>
                <div class="task-info">
                    <div class="time-info">
                        <i class="fa-regular fa-clock"></i>
                        <span>${taskTime}</span>
                    </div>
                    <div class="pomodoro-info">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>${taskHope}</span>
                    </div>
                </div>
            </div>
        `;
        
        if (isCompleted) {
            completedBoard.innerHTML += taskElement;
        } else if (isActive) {
            inProgressBoard.innerHTML += taskElement;
        } else {
            onHoldBoard.innerHTML = taskElement;
        }
    });
}

function handleMediaQuery(mediaQuery){
    const timerPomo = document.getElementById('timer-pomo');
    const timerShort = document.getElementById('timer-short');
    const timerLong = document.getElementById('timer-long');
    const headerTitle = document.getElementById('header-title');
    const headerReport = document.getElementById('header-title-report');
    const headerSettings = document.getElementById('header-title-settings');
    const headerLogin = document.getElementById('header-title-login');


    if(mediaQuery.media.includes('400')){
        if(mediaQuery.matches){
            timerPomo.innerHTML = 'Pomodoro'
            timerShort.innerHTML = 'Short Break'
            timerLong.innerHTML = 'Long break'
            headerTitle.innerHTML = 'Pomotimer'
        }else{
            timerPomo.innerHTML = 'Pomo'
            timerShort.innerHTML = 'Short'
            timerLong.innerHTML = 'Long'
            headerTitle.innerHTML = ''
        }
    }else if(mediaQuery.media.includes('600')){
        if(mediaQuery.matches){
            headerReport.innerHTML = 'Report'
            headerSettings.innerHTML = 'Settings'
            headerLogin.innerHTML = 'Login'
        }else{
            headerReport.innerHTML = ''
            headerSettings.innerHTML = ''
            headerLogin.innerHTML = ''
        }
    }

}

function changeTab(e){
    let target = e.target;
    let activeTab;
    const root = document.documentElement.style;
    
    // return the div
    while(target.tagName == 'FONT'){
        target = target.parentNode;
    }
    if(target.tagName == 'H2'){
        target = target.parentNode;
    }
    
    // Change the active tab
    for(let tab of [pomoTab,shortTab,longTab]){
        tab = tab.parentNode
        if(tab.matches('.timer-pomo-active')){
            activeTab = tab;
            tab.classList.toggle('timer-pomo-active');
        }
    }
    
    // pause the audio 
    tictac.pause();
    tictac.currentTime = 0;
    
    // Set background image based on which tab is clicked
    if (target.childNodes[0].id === 'timer-short') {
        document.body.style.backgroundImage = 'var(--bg-image-short)';
    } else if (target.childNodes[0].id === 'timer-long') {
        document.body.style.backgroundImage = 'var(--bg-image-long)';
    } else if (target.childNodes[0].id === 'timer-pomo') {
        document.body.style.backgroundImage = 'var(--bg-image-pomo)';
    }
    
    applyTabEffects(target, activeTab.childNodes[0]);
    target.classList.toggle('timer-pomo-active');
}

function applyTabEffects(target,activeTab){
    const timerAdvice = document.getElementById('timer-advice')
    const root = document.documentElement.style;
    //Short tab
    if(target.childNodes[0].matches('#timer-short')){
        if(activeTab.matches('#timer-long')){
            console.log('La anterior fue long');
        }else{
            saveTimeStudied()
        }
        clearInterval(idInterval)
        startButton.childNodes[1].innerHTML = 'START'
        root.setProperty('--bg-color','#31834f')
        root.setProperty('--bg-image', 'var(--bg-image-short)')
        timerNumber.innerHTML = shortValue.toString().length == 1 ? `0${shortValue}:00` : `${shortValue}:00`
        timerAdvice.innerHTML = 'Time to take a break!'
        root.setProperty('----button-bg-hover','#31834f')
        root.setProperty('--border-bottom-header','#c9ecd6')


    //Pomo tab
    }else if(target.childNodes[0].matches('#timer-pomo')){
        startButton.childNodes[1].innerHTML = 'START'
        root.setProperty('--bg-color','#ba4949')
        root.setProperty('--bg-image', 'var(--bg-image-pomo)')
        timerNumber.innerHTML = pomoValue.toString().length == 1 ? `0${pomoValue}:00` : `${pomoValue}:00`
        timerAdvice.innerHTML = 'Time to focus!'
        root.setProperty('----button-bg-hover','#ba4949')
        root.setProperty('--border-bottom-header','#ecc9c9')
        clearInterval(idInterval)
    
    //Long tab
    }else if(target.childNodes[0].matches('#timer-long')){
        if(activeTab.matches('#timer-short')){
            console.log('La anterior fue short');

        }else{
            saveTimeStudied()
        }
        clearInterval(idInterval)
        startButton.childNodes[1].innerHTML = 'START'
        root.setProperty('--bg-color','#84b6f4')
        root.setProperty('--bg-image', 'var(--bg-image-long)')
        timerNumber.innerHTML = longValue.toString().length == 1 ? `0${longValue}:00` : `${longValue}:00`
        timerAdvice.innerHTML = 'Time to take a rest!'
        root.setProperty('----button-bg-hover','#84b6f4')
        root.setProperty('--border-bottom-header','#c9daec')

    }
}
function saveTimeStudied(){
    let timeStudied = Number.parseInt(myStorage.getItem('timeStudied'))
    let minutesInTimer = Number.parseInt(timerNumber.textContent.slice(0,2))
    let secondsInTimer = Number.parseInt(timerNumber.textContent.slice(3,5))
    
    if(myStorage.getItem('timeStudied')== NaN || myStorage.getItem('timeStudied')== null){
        myStorage.setItem('timeStudied', 0)
        timeStudied = (pomoValue * 60)-(minutesInTimer * 60 + secondsInTimer);
        myStorage.setItem('timeStudied', timeStudied)
    }else{
        timeStudied += (pomoValue * 60)-(minutesInTimer * 60 + secondsInTimer)
        myStorage.setItem('timeStudied', timeStudied)
        hoursFocused.innerHTML = `${(parseFloat(myStorage.getItem('timeStudied'))/3600).toFixed(2)} h`
    }

}
function nextTab() {
    let target;
    const root = document.documentElement.style;
    
    // Handle task completion if timer reached zero in pomodoro mode
    if(pomoTab.parentNode.matches('.timer-pomo-active') && timerNumber.textContent === '00:00') {
        // Handle active task updates
        const activeTask = document.querySelector('.one-task.active');
        if(activeTask) {
            const taskHopeElement = activeTask.querySelector('.task-hope');
            const [completed, total] = taskHopeElement.textContent.split('/');
            const newCompleted = parseInt(completed) + 1;
            
            taskHopeElement.textContent = `${newCompleted}/${total}`;
            
            // Check if task is complete
            if(newCompleted >= parseInt(total)) {
                activeTask.classList.add('completed');
                activeTask.classList.remove('active');
                
                // Show completion notification
                const notification = document.createElement('div');
                notification.classList.add('task-completion-notification');
                notification.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Task "${activeTask.querySelector('.task-name').textContent}" completed!
                `;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);

                // Track task completion and save immediately
                if (typeof trackTaskCompletion === 'function') {
                    trackTaskCompletion(true);
                }
                saveAppData(); // Save the completed state immediately
            }
            updateTaskBoards();
            saveAppData(); // Save the updated pomodoro count
        }

        // Check if it's time for a long break (every 4 pomodoros)
        if(pomoCount % 4 === 0) {
            target = longTab.parentNode;
            document.body.style.backgroundImage = 'var(--bg-image-long)';
            
            const notification = document.createElement('div');
            notification.classList.add('task-completion-notification');
            notification.style.backgroundColor = 'rgba(132, 182, 244, 0.9)';
            notification.innerHTML = `
                <i class="fa-solid fa-couch"></i>
                Time for a long break! You've completed 4 pomodoros.
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } else {
            target = shortTab.parentNode;
            document.body.style.backgroundImage = 'var(--bg-image-short)';
            
            const notification = document.createElement('div');
            notification.classList.add('task-completion-notification');
            notification.style.backgroundColor = 'rgba(49, 131, 79, 0.9)';
            notification.innerHTML = `
                <i class="fa-solid fa-mug-hot"></i>
                Time for a short break!
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    } else {
        // Normal tab switching logic
        if(pomoTab.parentNode.matches('.timer-pomo-active')){
            target = shortTab.parentNode;
            document.body.style.backgroundImage = 'var(--bg-image-short)';
        } else if(shortTab.parentNode.matches('.timer-pomo-active')){
            target = pomoTab.parentNode;
            document.body.style.backgroundImage = 'var(--bg-image-pomo)';
        } else if(longTab.parentNode.matches('.timer-pomo-active')){
            target = pomoTab.parentNode;
            document.body.style.backgroundImage = 'var(--bg-image-pomo)';
        }
    }

    // Update the active tab
    document.querySelector('.timer-pomo-active')?.classList.remove('timer-pomo-active');
    target?.classList.add('timer-pomo-active');
    
    // Reset button states
    startButton.childNodes[1].classList.add('start');
    startButton.childNodes[1].innerHTML = 'START';
    nextButton.style.opacity = '0';
}

// Add this near the top with other variables
const timerWorker = new Worker(URL.createObjectURL(new Blob([`
    let interval = null;
    
    self.onmessage = function(e) {
        if (e.data.command === 'start') {
            interval = setInterval(() => {
                self.postMessage('tick');
            }, 1000);
        } else if (e.data.command === 'stop') {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        }
    };
`], { type: 'text/javascript' })));

// Update only the timer part of handleChronometer
function handleChronometer() {
    if (!startButton.childNodes[1].classList.contains('start')) {
        clearInterval(idInterval);
        timerWorker.postMessage({ command: 'stop' });
        startButton.childNodes[1].innerHTML = 'START';
        startButton.childNodes[1].classList.add('start');
        nextButton.style.opacity = '0';
        tictac.pause();
        tictac.currentTime = 0;
        isTimerRunning = false;
        return;
    }

    isTimerRunning = true;
    const timer = document.getElementById('timer-number');
    let initialSeconds = parseInt(timer.textContent.split(':')[0]) * 60 + 
                        parseInt(timer.textContent.split(':')[1]);

    setTimeout(() => { tictac.play(); }, 400);
    
    timerWorker.postMessage({ command: 'start' });
    
    timerWorker.onmessage = function() {
        if (initialSeconds > 0) {
            initialSeconds--;
            let minutes = Math.floor(initialSeconds / 60);
            let seconds = initialSeconds % 60;
            timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (initialSeconds === 0) {
                timerWorker.postMessage({ command: 'stop' });
                isTimerRunning = false;
                tictac.pause();
                tictac.currentTime = 0;
                const alarma = new Audio(`./rsc/audios/${alarmSelected}.mp3`);
                alarma.play();
                setTimeout(() => alarma.pause(), 3000);
                
                if (pomoTab.parentNode.matches('.timer-pomo-active')) {
                    addCompletedPomodoro();
                    pomoCount++;
                    pomoCounDiv.textContent = `#${pomoCount}`;
                    saveAppData();
                }
                
                nextTab();
            }
        }
    };
    
    startButton.childNodes[1].innerHTML = 'PAUSE';
    startButton.childNodes[1].classList.remove('start');
    nextButton.style.opacity = '1';
}

function restartPomoCount(){
    confirm('Está seguro que desea reestablecer la cuenta a 0?') == true ? pomoCounDiv.innerHTML = '#0' : null;
    pomoCount = 0
}
function createModalTask() {
    const modalTask = document.createElement('div');
    modalTask.className = 'modal-task';
    
    modalTask.innerHTML = `
        <div class="modal-task-container">
            <div class="modal-task-header">
                <h3>Add Task</h3>
                <i class="fa-solid fa-xmark modal-task-cruz"></i>
            </div>
            <div class="modal-task-main">
                <input type="text" class="task-input" placeholder="What are you working on?" maxlength="40">
                <div class="time-estimation">
                    <h4>Estimated Time</h4>
                    <div class="time-inputs">
                        <div class="hours-input">
                            <input type="number" min="0" max="99" value="0" id="task-hours">
                            <label>hours</label>
                        </div>
                        <div class="minutes-input">
                            <input type="number" min="0" max="59" value="0" id="task-minutes">
                            <label>minutes</label>
                        </div>
                    </div>
                </div>
                <div class="pomodoro-estimation">
                    <h4>Est Pomodoros</h4>
                    <input type="number" min="1" value="1" class="task-hope-input">
                </div>
            </div>
            <div class="modal-task-footer">
                <button class="modal-task-cancel">Cancel</button>
                <button class="modal-task-save">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalTask);

    const closeModal = () => modalTask.remove();

    // Add event listeners
    modalTask.querySelector('.modal-task-cruz').addEventListener('click', closeModal);
    modalTask.querySelector('.modal-task-cancel').addEventListener('click', closeModal);
    modalTask.querySelector('.modal-task-save').addEventListener('click', () => {
        const taskInput = modalTask.querySelector('.task-input');
        const hoursInput = modalTask.querySelector('#task-hours');
        const minutesInput = modalTask.querySelector('#task-minutes');
        const pomosInput = modalTask.querySelector('.task-hope-input');

        if (taskInput.value.trim()) {
            addTask(
                taskInput.value,
                pomosInput.value,
                `${hoursInput.value}h ${minutesInput.value}m`
            );
            closeModal();
        }
    });
}
function addTask(name, pomos, time) {
    const taskElement = document.createElement('div');
    taskElement.className = 'one-task';
    taskElement.innerHTML = `
        <div class="task-content">
            <i class="fa-solid fa-check task-complete-icon"></i>
            <span class="task-name">${name}</span>
            <span class="task-time">${time}</span>
            <span class="task-hope">0/${pomos}</span>
        </div>
        <div class="task-actions">
            <button class="task-edit">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="task-delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    tasksContainer.appendChild(taskElement);
    tasksContainer.style.display = 'flex';

    // Track new task creation
    if (typeof trackTaskCompletion === 'function') {
        trackTaskCompletion(false); // false means new task, not completed
    }

    // Add event listeners
    taskElement.addEventListener('click', (e) => {
        if (!e.target.closest('.task-actions')) {
            document.querySelectorAll('.one-task').forEach(t => t.classList.remove('active'));
            if (!taskElement.classList.contains('completed')) {
                taskElement.classList.add('active');
            }
        }
    });

    const editButton = taskElement.querySelector('.task-edit');
    const deleteButton = taskElement.querySelector('.task-delete');

    editButton.addEventListener('click', () => {
        editTask(taskElement, name, pomos, time);
    });

    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
            taskElement.remove();
            if (tasksContainer.children.length === 0) {
                tasksContainer.style.display = 'none';
            }
            updateTaskBoards();
            saveAppData();
        }
    });

    // Add click handler for task completion
    const taskContent = taskElement.querySelector('.task-content');
    const completeIcon = taskContent.querySelector('.task-complete-icon');
    
    completeIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasCompleted = taskElement.classList.contains('completed');
        taskElement.classList.toggle('completed');
        
        if (!wasCompleted) { // Task is being completed
            taskElement.classList.remove('active');
            if (typeof trackTaskCompletion === 'function') {
                trackTaskCompletion(true); // true means task completed
            }
        } else { // Task is being uncompleted
            if (typeof trackTaskCompletion === 'function') {
                trackTaskCompletion(false, true); // second parameter true means uncomplete
            }
        }
        updateTaskBoards();
    });

    updateTaskBoards();
    saveAppData();
}

function editTask(taskElement, currentName, currentPomos, currentTime) {
    const modalTask = document.createElement('div');
    modalTask.classList.add('modal-task');
    
    // Parse current time values
    const timeMatch = currentTime.match(/(\d+)h\s*(\d+)m/);
    const currentHours = timeMatch ? timeMatch[1] : '0';
    const currentMinutes = timeMatch ? timeMatch[2] : '0';
    const currentPomosNum = currentPomos.split('/')[1];

    modalTask.innerHTML = `
        <div class="modal-task-container">
            <div class="modal-task-header">
                <h3>Edit Task</h3>
                <i class="fa-solid fa-xmark modal-task-cruz"></i>
            </div>
            <div class="modal-task-main">
                <input type="text" class="task-input" placeholder="What are you working on?" maxlength="40" value="${currentName}">
                <div class="time-estimation">
                    <h4>Estimated Time</h4>
                    <div class="time-inputs">
                        <div class="hours-input">
                            <input type="number" min="0" max="99" value="${currentHours}" id="task-hours">
                            <label>hours</label>
                        </div>
                        <div class="minutes-input">
                            <input type="number" min="0" max="59" value="${currentMinutes}" id="task-minutes">
                            <label>minutes</label>
                        </div>
                    </div>
                </div>
                <div class="pomodoro-estimation">
                    <h4>Est Pomodoros</h4>
                    <input type="number" min="1" value="${currentPomosNum}" class="task-hope-input">
                </div>
            </div>
            <div class="modal-task-footer">
                <button class="modal-task-cancel">Cancel</button>
                <button class="modal-task-save">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalTask);
    
    // Add event listeners
    const hoursInput = document.getElementById('task-hours');
    const minutesInput = document.getElementById('task-minutes');
    const closeBtn = modalTask.querySelector('.modal-task-cruz');
    const cancelBtn = modalTask.querySelector('.modal-task-cancel');
    const saveBtn = modalTask.querySelector('.modal-task-save');
    const taskInput = modalTask.querySelector('.task-input');
    
    // Validate inputs
    minutesInput.addEventListener('change', () => {
        if (minutesInput.value > 59) minutesInput.value = 59;
        if (minutesInput.value < 0) minutesInput.value = 0;
    });

    hoursInput.addEventListener('change', () => {
        if (hoursInput.value < 0) hoursInput.value = 0;
    });

    const closeModal = () => {
        document.body.removeChild(modalTask);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Save edited task
    saveBtn.addEventListener('click', () => {
        if (taskInput.value.trim() !== '') {
            const newName = taskInput.value;
            const newHours = hoursInput.value || 0;
            const newMinutes = minutesInput.value || 0;
            const newPomos = modalTask.querySelector('.task-hope-input').value;
            const completedPomos = taskElement.querySelector('.task-hope').textContent.split('/')[0];
            
            // Update task element
            taskElement.querySelector('.task-name').textContent = newName;
            taskElement.querySelector('.task-time').textContent = `${newHours}h ${newMinutes}m`;
            taskElement.querySelector('.task-hope').textContent = `${completedPomos}/${newPomos}`;
            
            closeModal();
            updateTaskBoards(); // Update the task management view
        }
    });

    saveAppData();
}

function showSettings(){
    settingButton.classList.toggle('setting-active');
    const settingsCruz = document.querySelector('.settings-header-cruz');
    const settings = document.querySelector('.settings');
    const options = document.querySelector('.options');
    const selectInput = document.getElementById('alarm-audio');

    //show the settings
    if(settingButton.classList.contains('setting-active')){
        options.style.height = '100vh';
        body.style.overflow = 'hidden';
        settings.style.transform = "translateY(35%)"
    }
    settingsCruz.addEventListener('click',()=>{
        settingButton.classList.toggle('setting-active');
        options.style.height = '0vh';
        body.style.overflow = 'scroll'; 
        settings.style.transform = "translateY(-200%)"

    });
    options.addEventListener('click',(e)=>{
        if(e.target.classList.contains('options')){
            settingButton.classList.toggle('setting-active');
            options.style.height = '0vh';
            body.style.overflow = 'scroll';
            settings.style.transform = "translateY(-200%)"
        }

    });

    //Play the audio to hear a demo
    selectInput.addEventListener('change',async(e)=>{
        let demoAudio = new Audio(`./rsc/audios/${e.target.value}.mp3`)
        demoAudio.play();
        setTimeout(()=>{
            demoAudio.pause();
        },4000)
    })
    //When click in 'OK'
    OKsettingButton.addEventListener('click',()=>{

        pomoValue = document.getElementById('pomo-value').value
        shortValue = document.getElementById('short-value').value
        longValue = document.getElementById('long-value').value
        intervalValue = document.getElementById('interval-value').value

        settingButton.classList.toggle('setting-active');
        options.style.height = '0vh';
        settings.style.transform = "translateY(-200%)"

        for(let tab of [pomoTab,shortTab,longTab]){
            //Change the number
            if(tab.parentNode.matches('.timer-pomo-active')){
                if((tab.id == 'timer-pomo')){
                    pomoValue > 99 ? pomoValue = 99 : pomoValue;
                    timerNumber.innerHTML = pomoValue.toString().length == 1 ? `0${pomoValue}:00` : `${pomoValue}:00`
                }else if(tab.id == 'timer-short'){
                    shortValue > 99 ? shortValue = 99 : shortValue;
                    timerNumber.innerHTML = shortValue.toString().length == 1 ? `0${shortValue}:00` : `${shortValue}:00`
                }else if(tab.id == 'timer-long'){
                    longValue > 99 ? longValue = 99 : longValue;
                    timerNumber.innerHTML = longValue.toString().length == 1 ? `0${longValue}:00` : `${longValue}:00`
                }
            }
        }
        //CHange the default audio alarm
        alarmSelected = selectInput.value;

    body.style.overflow = 'scroll'; 
    });

}
function showreports(){
    reportButton.classList.toggle('report-active');
    const reportCruz = document.querySelector('.report-header-cruz');
    const report = document.querySelector('.report');
    const options = document.querySelector('.options');
    const reportClose = document.querySelector('.report-button')

    hoursFocused.innerHTML = `${(parseFloat(myStorage.getItem('timeStudied'))/3600).toFixed(2)} h`
    daysAccessed.innerHTML = dayCount;

    if(reportButton.classList.contains('report-active')){
        options.style.height = '100vh';
        report.style.transform = "translateY(15%)";
        body.style.overflow = 'hidden';
    }
    reportCruz.addEventListener('click',()=>{
        reportButton.classList.toggle('report-active');
        options.style.height = '0vh';
        report.style.transform = "translateY(-200%)"
        body.style.overflow = 'scroll';

    });
    options.addEventListener('click',(e)=>{
        if(e.target.classList.contains('options')){
            reportButton.classList.toggle('setting-active');
            options.style.height = '0vh';
            report.style.transform = "translateY(-200%)";
            body.style.overflow = 'scroll';
        }
    });
    reportClose.addEventListener('click',()=>{
        reportButton.classList.toggle('setting-active');
        options.style.height = '0vh';
        report.style.transform = "translateY(-200%)";
        body.style.overflow = 'scroll';
    })
}
function countDays(){
    let date = new Date;

    if(myStorage.getItem('date') == null){
        dayCount++;
        let objectDate = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            daysIn: dayCount
        }
        myStorage.setItem('date',JSON.stringify(objectDate))
    }else{
        let todayDate = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            daysIn: dayCount
        }
        let datefromStorage = JSON.parse(myStorage.getItem('date'));
        if(todayDate.day == datefromStorage.day && todayDate.month == datefromStorage.month && todayDate.year == datefromStorage.year){
        }else{
            dayCount++
            myStorage.setItem('date',JSON.stringify(todayDate));
        }
    }

}

//runs when started
window.addEventListener('DOMContentLoaded ',()=>{
    hoursFocused.innerHTML = `${(parseFloat(myStorage.getItem('timeStudied'))/360).toFixed(3)} h` 
    daysAccessed.innerHTML = dayCount;

});
window.addEventListener('load',()=>{
    handleMediaQuery(mediaQuery400)
    handleMediaQuery(mediaQuery600)
    countDays()
})

//Event Listeners
mediaQuery400.addEventListener('change',()=>{handleMediaQuery(mediaQuery400)});
mediaQuery600.addEventListener('change',()=>{handleMediaQuery(mediaQuery600)});
    //tabs
pomoTab.addEventListener('click',changeTab);
shortTab.addEventListener('click',changeTab);
longTab.addEventListener('click',changeTab);
    //buttons
startButton.addEventListener('click',handleChronometer);
taskAddButton.addEventListener('click',createModalTask);
    //counter
pomoCounDiv.addEventListener('click',restartPomoCount);
    //config
settingButton.addEventListener('click',showSettings)
reportButton.addEventListener('click',showreports)
    //report
restartReportButton.addEventListener('click',()=>{
    myStorage.setItem('timeStudied', 0);
    myStorage.removeItem('date');
    hoursFocused.innerHTML = 0;
    daysAccessed.innerHTML = 0;

});

//options

// Add these after your existing task management code

const viewButtons = document.querySelectorAll('.board-view-btn');
const taskBoards = document.querySelector('.task-boards');
const taskList = document.querySelector('.task-list');

viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle active class on buttons
        viewButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Switch views
        if (button.dataset.view === 'list') {
            taskBoards.classList.add('hidden');
            taskList.classList.add('active');
            updateListView();
        } else {
            taskBoards.classList.remove('hidden');
            taskList.classList.remove('active');
            updateTaskBoards();
        }
    });
});

function updateListView() {
    const tasks = document.querySelectorAll('.one-task');
    const taskList = document.querySelector('.task-list');
    
    // Clear existing list items
    taskList.innerHTML = '';
    
    // Add each task to the list
    tasks.forEach(task => {
        const taskName = task.querySelector('.task-name').textContent;
        const taskHope = task.querySelector('.task-hope').textContent;
        const [completed, total] = taskHope.split('/');
        
        // Determine status
        let status = 'In Progress';
        let statusClass = 'status-progress';
        if (completed === total) {
            status = 'Completed';
            statusClass = 'status-completed';
        } else if (completed === '0') {
            status = 'On Hold';
            statusClass = 'status-hold';
        }
        
        const listItem = `
            <div class="task-list-item">
                <div class="task-list-info">
                    <h4 class="task-title">${taskName}</h4>
                    <div class="time-info">
                        <i class="fa-regular fa-clock"></i>
                        <span>0h / --h</span>
                    </div>
                    <div class="pomodoro-info">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>${taskHope}</span>
                    </div>
                </div>
                <span class="task-list-status ${statusClass}">${status}</span>
            </div>
        `;
        
        taskList.innerHTML += listItem;
    });
}

function saveTask() {
    const taskName = document.querySelector('.task-input').value;
    const taskHours = document.getElementById('task-hours').value || 0;
    const taskMinutes = document.getElementById('task-minutes').value || 0;
    const taskHope = document.querySelector('.task-hope-input').value;
    
    const totalTime = `${taskHours}h ${taskMinutes}m`;
    
    const taskElement = `
        <div class="one-task">
            <div class="task-name">${taskName}</div>
            <div class="task-time">${totalTime}</div>
            <div class="task-hope">0/${taskHope}</div>
            <i class="fa-solid fa-ellipsis-vertical task-options"></i>
        </div>
    `;
    
    tasksContainer.innerHTML += taskElement;
    closeModal();
}

// Add these variables at the top with your other constants
const allPomodorosBtn = document.querySelector('.sidebar button:nth-child(2)');
const allPomodorosView = document.querySelector('.all-pomodoros-view');
const pomodorosGrid = document.querySelector('.pomodoros-grid');
const todayCount = document.querySelector('.today-count');
const totalCount = document.querySelector('.total-count');

// Add event listeners for the All Pomodoros view
allPomodorosBtn.addEventListener('click', () => {
    allPomodorosView.classList.add('active');
    sidebar.classList.add('hidden');
    allSidebarButtons.forEach(button => {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
    });
    updatePomodoroStats();
});

// Update the close button event listener
document.querySelector('.pomodoros-close').addEventListener('click', () => {
    closeAllPomodorosView();
});

// Add escape key functionality
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (allPomodorosView.classList.contains('active')) {
            closeAllPomodorosView();
        }
        if (taskManagementView.classList.contains('active')) {
            taskManagementView.classList.remove('active');
            sidebar.classList.remove('hidden');
            allSidebarButtons.forEach(button => {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            });
        }
    }
});

// Add function to close All Pomodoros view
function closeAllPomodorosView() {
    allPomodorosView.classList.remove('active');
    sidebar.classList.remove('hidden');
    allSidebarButtons.forEach(button => {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
    });
}

// Update the click outside functionality
allPomodorosView.addEventListener('click', (e) => {
    if (e.target === allPomodorosView) {
        closeAllPomodorosView();
    }
});

// Update addCompletedPomodoro to ensure immediate save
function addCompletedPomodoro() {
    const timestamp = new Date().toISOString();
    
    // Save to localStorage immediately
    const savedPomodoros = JSON.parse(localStorage.getItem('completedPomodoros') || '[]');
    savedPomodoros.push(timestamp);
    localStorage.setItem('completedPomodoros', JSON.stringify(savedPomodoros));
    
    // Track in charts immediately
    if (typeof trackPomodoroData === 'function') {
        trackPomodoroData();
    }
    
    // Update UI if view is active
    if (allPomodorosView.classList.contains('active')) {
        updatePomodoroStats();
    }
}

// Update clearAllPomodoros to clear both visual and stored data
function clearAllPomodoros() {
    if (confirm('Are you sure you want to delete all pomodoros? This cannot be undone.')) {
        localStorage.removeItem('completedPomodoros');
        localStorage.removeItem('pomodoroData');
        pomodorosGrid.innerHTML = '';
        todayCount.textContent = '0';
        totalCount.textContent = '0';
        pomoCount = 0;
        pomoCounDiv.textContent = '#0';
        if (charts.pomodoros) {
            updateCharts();
        }
    }
}

// Function to update pomodoro statistics
function updatePomodoroStats() {
    const savedPomodoros = JSON.parse(localStorage.getItem('completedPomodoros') || '[]');
    const today = new Date().toDateString();
    
    // Count today's pomodoros
    const todayPomodoros = savedPomodoros.filter(timestamp => 
        new Date(timestamp).toDateString() === today
    ).length;
    
    todayCount.textContent = todayPomodoros;
    totalCount.textContent = savedPomodoros.length;
    
    // Clear and rebuild grid
    pomodorosGrid.innerHTML = '';
    
    // Group pomodoros into sets of 30
    const numKetchupBottles = Math.floor(savedPomodoros.length / 30);
    const remainingPomodoros = savedPomodoros.length % 30;
    
    // Add ketchup bottles for complete sets of 30
    for (let i = 0; i < numKetchupBottles; i++) {
        const ketchupBottle = document.createElement('div');
        ketchupBottle.className = 'ketchup-bottle';
        ketchupBottle.title = '30 Pomodoros Completed!';
        pomodorosGrid.appendChild(ketchupBottle);
    }
    
    // Add remaining individual pomodoros
    if (remainingPomodoros > 0) {
        const remainingTimestamps = savedPomodoros.slice(-remainingPomodoros);
        remainingTimestamps.forEach(timestamp => {
            const pomodoroItem = document.createElement('div');
            pomodoroItem.className = 'pomodoro-item';
            pomodoroItem.dataset.timestamp = timestamp;
            pomodoroItem.title = new Date(timestamp).toLocaleString();
            pomodorosGrid.appendChild(pomodoroItem);
        });
    }
}

// Update the handleSpeedUp function
function handleSpeedUp() {
    if (idInterval || isTimerRunning) {
        // Stop both the interval and the worker
        clearInterval(idInterval);
        timerWorker.postMessage({ command: 'stop' });
        idInterval = null;
        isTimerRunning = false;
        
        // Stop all audio
        tictac.pause();
        tictac.currentTime = 0;
        
        // Save data before resetting if in pomodoro mode
        if (pomoTab.parentNode.matches('.timer-pomo-active')) {
            addCompletedPomodoro();
            pomoCount++;
            pomoCounDiv.textContent = `#${pomoCount}`;
            saveAppData();
        }
        
        timerNumber.textContent = '00:00';
        nextTab();
        
        // Reset timer to appropriate value after a short delay
        setTimeout(() => {
            if (pomoTab.parentNode.matches('.timer-pomo-active')) {
                timerNumber.textContent = pomoValue.toString().length == 1 ? `0${pomoValue}:00` : `${pomoValue}:00`;
            } else if (shortTab.parentNode.matches('.timer-pomo-active')) {
                timerNumber.textContent = shortValue.toString().length == 1 ? `0${shortValue}:00` : `${shortValue}:00`;
            } else if (longTab.parentNode.matches('.timer-pomo-active')) {
                timerNumber.textContent = longValue.toString().length == 1 ? `0${longValue}:00` : `${longValue}:00`;
            }
            startButton.childNodes[1].classList.add('start');
            startButton.childNodes[1].innerHTML = 'START';
        }, 100);
    }
}

// Make sure the next button is properly set up
nextButton.addEventListener('click', () => {
    if (nextButton.style.opacity !== '0') {
        handleSpeedUp();
    }
});

// Data persistence
function saveAppData() {
    const tasks = Array.from(document.querySelectorAll('.one-task')).map(task => {
        const hopeText = task.querySelector('.task-hope').textContent;
        const [completed, total] = hopeText.split('/').map(Number);
        const isCompleted = task.classList.contains('completed') || completed >= total;
        
        // If task should be completed based on pomodoros, ensure it's marked as completed
        if (completed >= total && !task.classList.contains('completed')) {
            task.classList.add('completed');
            task.classList.remove('active');
        }
        
        return {
            name: task.querySelector('.task-name').textContent,
            time: task.querySelector('.task-time').textContent,
            hope: hopeText,
            isCompleted: isCompleted,
            isActive: !isCompleted && task.classList.contains('active'),
            completedPomodoros: completed
        };
    });

    localStorage.setItem('pomodoroAppData', JSON.stringify({
        tasks,
        pomoCount,
        pomoValue,
        shortValue,
        longValue,
        intervalValue,
        alarmSelected,
        dayCount
    }));
}

function loadAppData() {
    const savedData = localStorage.getItem('pomodoroAppData');
    if (!savedData) return;

    const appData = JSON.parse(savedData);
    
    // Restore app settings
    pomoCount = appData.pomoCount || 0;
    pomoValue = appData.pomoValue || 25;
    shortValue = appData.shortValue || 5;
    longValue = appData.longValue || 15;
    intervalValue = appData.intervalValue || 3;
    alarmSelected = appData.alarmSelected || 'alarm-beep';
    dayCount = appData.dayCount || 0;
    
    // Update UI
    pomoCounDiv.textContent = `#${pomoCount}`;
    
    // Clear existing tasks
    tasksContainer.innerHTML = '';
    
    // Restore tasks with their exact state
    appData.tasks?.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'one-task';
        
        // Parse hope values
        const [completed, total] = task.hope.split('/').map(Number);
        
        // Set completion state
        if (task.isCompleted || completed >= total) {
            taskElement.classList.add('completed');
        }
        
        // Set active state only if not completed
        if (task.isActive && !task.isCompleted && completed < total) {
            taskElement.classList.add('active');
        }
        
        taskElement.innerHTML = `
            <div class="task-content">
                <i class="fa-solid fa-check task-complete-icon"></i>
                <span class="task-name">${task.name}</span>
                <span class="task-time">${task.time}</span>
                <span class="task-hope">${task.hope}</span>
            </div>
            <div class="task-actions">
                <button class="task-edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="task-delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        tasksContainer.appendChild(taskElement);
        tasksContainer.style.display = 'flex';

        // Add event listeners
        taskElement.addEventListener('click', (e) => {
            if (!e.target.closest('.task-actions')) {
                document.querySelectorAll('.one-task').forEach(t => t.classList.remove('active'));
                if (!taskElement.classList.contains('completed')) {
                    taskElement.classList.add('active');
                }
            }
        });

        const editButton = taskElement.querySelector('.task-edit');
        const deleteButton = taskElement.querySelector('.task-delete');
        const completeIcon = taskElement.querySelector('.task-complete-icon');

        editButton.addEventListener('click', () => {
            editTask(taskElement, task.name, task.hope.split('/')[1], task.time);
        });

        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                taskElement.remove();
                if (tasksContainer.children.length === 0) {
                    tasksContainer.style.display = 'none';
                }
                updateTaskBoards();
                saveAppData();
            }
        });

        completeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasCompleted = taskElement.classList.contains('completed');
            taskElement.classList.toggle('completed');
            
            if (!wasCompleted) {
                taskElement.classList.remove('active');
                if (typeof trackTaskCompletion === 'function') {
                    trackTaskCompletion(true);
                }
            } else {
                if (typeof trackTaskCompletion === 'function') {
                    trackTaskCompletion(false, true);
                }
            }
            updateTaskBoards();
            saveAppData();
        });

        // If task was completed, ensure it's tracked in the charts
        if (taskElement.classList.contains('completed')) {
            trackTaskCompletion(true, false, true);
        }
    });

    updateTaskBoards();
}

// Add event listener for data loading
window.addEventListener('load', loadAppData);

// Add this function to track task completion
function trackTaskStatus(task, isCompleted) {
    if (typeof trackTaskCompletion === 'function') {
        trackTaskCompletion(isCompleted);
    }
    saveAppData();
}

// Add this after your existing pomodoro view initialization
document.querySelector('.clear-all-btn')?.addEventListener('click', clearAllPomodoros);

// Add this near the top of your file with other initialization code
let isTimerRunning = false;

// Update the beforeunload event listener to be simpler
window.addEventListener('beforeunload', (event) => {
    if (isTimerRunning) {
        event.preventDefault();
        event.returnValue = 'Changes you want may not be saved. Are you sure you want to reload?';
        return event.returnValue;
    }
});

// Add these functions near the top of your file
function clearFinishedTasks() {
    if (confirm('Are you sure you want to clear all finished tasks?')) {
        const completedTasks = document.querySelectorAll('.one-task.completed');
        completedTasks.forEach(task => task.remove());
        if (tasksContainer.children.length === 0) {
            tasksContainer.style.display = 'none';
        }
        updateTaskBoards();
        saveAppData();
    }
}

function clearUnfinishedTasks() {
    if (confirm('Are you sure you want to clear all unfinished tasks?')) {
        const unfinishedTasks = document.querySelectorAll('.one-task:not(.completed)');
        unfinishedTasks.forEach(task => task.remove());
        if (tasksContainer.children.length === 0) {
            tasksContainer.style.display = 'none';
        }
        updateTaskBoards();
        saveAppData();
    }
}

function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasksContainer.innerHTML = '';
        tasksContainer.style.display = 'none';
        updateTaskBoards();
        saveAppData();
    }
}

// Add this after your existing initialization code
const taskOptionsButton = document.querySelector('.task-button');
const taskOptionsMenu = document.createElement('div');
taskOptionsMenu.className = 'task-options-menu';
taskOptionsMenu.innerHTML = `
    <div class="task-option" onclick="clearUnfinishedTasks()">
        <i class="fa-solid fa-trash"></i>
        Clear unfinished tasks
    </div>
    <div class="task-option" onclick="clearFinishedTasks()">
        <i class="fa-solid fa-trash"></i>
        Clear finished tasks
    </div>
    <div class="task-option" onclick="clearAllTasks()">
        <i class="fa-solid fa-trash"></i>
        Clear all tasks
    </div>
`;

document.querySelector('.task-top-container').appendChild(taskOptionsMenu);

// Toggle menu on button click
taskOptionsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    taskOptionsMenu.style.display = taskOptionsMenu.style.display === 'block' ? 'none' : 'block';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.task-button') && !e.target.closest('.task-options-menu')) {
        taskOptionsMenu.style.display = 'none';
    }
});

// Add cleanup for the worker when the page unloads
window.addEventListener('unload', () => {
    timerWorker.terminate();
});

// Add this near the top with your other constants
const premiumBtn = document.querySelector('.sidebar button:nth-child(4)');
const premiumView = document.querySelector('.premium-view');

// Add these event listeners after your existing initialization code
premiumBtn.addEventListener('click', () => {
    premiumView.classList.add('show');
    sidebar.classList.add('hidden');
    allSidebarButtons.forEach(button => {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
    });
});

document.querySelector('.premium-close').addEventListener('click', closePremiumView);

premiumView.addEventListener('click', (e) => {
    if (e.target === premiumView) {
        closePremiumView();
    }
});

function closePremiumView() {
    premiumView.classList.remove('show');
    sidebar.classList.remove('hidden');
    allSidebarButtons.forEach(button => {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
    });
}

// Add to your existing keydown event listener
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (premiumView.classList.contains('show')) {
            closePremiumView();
        }
        // ... your other escape key handlers ...
    }
});

// Add payment handling
document.querySelectorAll('.plan-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const planType = btn.closest('.plan-card').querySelector('h3').textContent;
        alert(`Selected ${planType} plan. Please choose a payment method.`);
    });
});

document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', () => {
        const paymentMethod = option.textContent.trim();
        alert(`Selected ${paymentMethod} as payment method. This would redirect to payment processing.`);
    });
});

// Add these constants with your other ones at the top
const moreBtn = document.querySelector('.sidebar button:last-child');
const moreInfoView = document.querySelector('.more-info-view');
const moreInfoCloseBtn = document.querySelector('.more-info-close');

// Add these event listeners with your other initialization code
moreBtn.addEventListener('click', () => {
    moreInfoView.classList.add('active');
    sidebar.classList.add('hidden');
    allSidebarButtons.forEach(button => {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
    });
});

moreInfoCloseBtn.addEventListener('click', closeMoreInfoView);

// Add this to your existing keydown event listener
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (moreInfoView.classList.contains('active')) {
            closeMoreInfoView();
        }
        // ... your other escape key handlers ...
    }
});

// Add this function with your other close view functions
function closeMoreInfoView() {
    moreInfoView.classList.remove('active');
    sidebar.classList.remove('hidden');
    allSidebarButtons.forEach(button => {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
    });
}

// Add these functions at an appropriate place in your app.js

// Function to save pomodoro session data
function savePomodoroSession(userId, sessionData) {
    if (!firebase.auth().currentUser) return; // Only save if user is logged in
    
    const sessionRef = firebase.database().ref(`users/${userId}/sessions`).push();
    return sessionRef.set({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        duration: sessionData.duration,
        type: sessionData.type, // 'pomodoro', 'shortBreak', or 'longBreak'
        completed: sessionData.completed,
        taskId: sessionData.taskId || null,
        createdAt: new Date().toISOString()
    });
}

// Function to save task data
function saveTask(userId, taskData) {
    if (!firebase.auth().currentUser) return;
    
    const taskRef = firebase.database().ref(`users/${userId}/tasks`).push();
    return taskRef.set({
        name: taskData.name,
        estimatedPomodoros: taskData.estimatedPomodoros,
        completedPomodoros: taskData.completedPomodoros || 0,
        status: taskData.status || 'active', // 'active', 'completed', 'on-hold'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
}

// Function to update task status
function updateTaskStatus(userId, taskId, status) {
    if (!firebase.auth().currentUser) return;
    
    const taskRef = firebase.database().ref(`users/${userId}/tasks/${taskId}`);
    return taskRef.update({
        status: status,
        updatedAt: new Date().toISOString()
    });
}

// Function to load user's data
function loadUserData(userId) {
    if (!firebase.auth().currentUser) return;
    
    // Load tasks
    firebase.database().ref(`users/${userId}/tasks`)
        .orderByChild('createdAt')
        .once('value')
        .then((snapshot) => {
            const tasks = [];
            snapshot.forEach((childSnapshot) => {
                tasks.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            // Update your UI with tasks
            updateTasksUI(tasks);
        })
        .catch((error) => {
            console.error("Error loading tasks:", error);
        });

    // Load session history
    firebase.database().ref(`users/${userId}/sessions`)
        .orderByChild('timestamp')
        .limitToLast(100) // Limit to last 100 sessions
        .once('value')
        .then((snapshot) => {
            const sessions = [];
            snapshot.forEach((childSnapshot) => {
                sessions.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            // Update your UI with session history
            updateSessionHistoryUI(sessions);
        })
        .catch((error) => {
            console.error("Error loading sessions:", error);
        });
}

// Add these event listeners to your existing auth state change listener
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Load user's data when they log in
        loadUserData(user.uid);
    } else {
        // Clear UI when user logs out
        clearUserDataFromUI();
    }
});

// Modify your existing timer completion handler
function handleTimerComplete() {
    // ... your existing timer completion code ...

    // Save the session data
    if (firebase.auth().currentUser) {
        const sessionData = {
            duration: currentTimer.duration,
            type: currentTimer.type,
            completed: true,
            taskId: currentActiveTask ? currentActiveTask.id : null
        };
        savePomodoroSession(firebase.auth().currentUser.uid, sessionData);
    }
}

// Modify your task creation handler
function handleNewTask(taskName, estimatedPomodoros) {
    // ... your existing task creation code ...

    if (firebase.auth().currentUser) {
        const taskData = {
            name: taskName,
            estimatedPomodoros: estimatedPomodoros,
            status: 'active'
        };
        saveTask(firebase.auth().currentUser.uid, taskData);
    }
}

// Helper function to update Tasks UI
function updateTasksUI(tasks) {
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = ''; // Clear existing tasks
    
    tasks.forEach(task => {
        // Create and append task elements based on your UI design
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

// Helper function to update Session History UI
function updateSessionHistoryUI(sessions) {
    if (!sessions || sessions.length === 0) {
        // Handle empty sessions case
        updateCharts([]);
        updateStats({
            totalSessions: 0,
            totalTime: 0,
            completionRate: 0
        });
        return;
    }

    // Process sessions data for charts
    const processedData = sessions.map(session => ({
        date: new Date(session.createdAt),
        duration: session.duration,
        type: session.type,
        completed: session.completed
    }));

    // Update charts with processed data
    updateCharts(processedData);

    // Calculate statistics
    const stats = calculateSessionStats(sessions);
    updateStats(stats);
}

// Helper function to calculate session statistics
function calculateSessionStats(sessions) {
    const stats = {
        totalSessions: sessions.length,
        totalTime: 0,
        completedSessions: 0
    };

    sessions.forEach(session => {
        if (session.completed) {
            stats.completedSessions++;
            stats.totalTime += session.duration || 0;
        }
    });

    stats.completionRate = (stats.completedSessions / stats.totalSessions) * 100 || 0;

    return stats;
}

// Helper function to update statistics display
function updateStats(stats) {
    // Update your statistics UI elements
    const totalSessionsElement = document.querySelector('.total-count');
    const completionRateElement = document.querySelector('.completion-rate');
    
    if (totalSessionsElement) {
        totalSessionsElement.textContent = stats.totalSessions;
    }
    
    if (completionRateElement) {
        completionRateElement.textContent = `${Math.round(stats.completionRate)}%`;
    }

    // Update any other statistics displays you have
}

// Helper function to clear user data from UI
function clearUserDataFromUI() {
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = '';
    // Clear any other user-specific UI elements
}