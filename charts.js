// Add this at the top of charts.js
window.addEventListener('DOMContentLoaded', () => {
    // Initialize chart-related event listeners
    const chartsBtn = document.querySelector('.sidebar button:nth-child(3)');
    const chartsView = document.querySelector('.charts-view');

    chartsBtn?.addEventListener('click', () => {
        chartsView.classList.add('active');
        sidebar.classList.add('hidden');
        allSidebarButtons.forEach(button => {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        });
        initializeCharts();
    });

    document.querySelector('.charts-close')?.addEventListener('click', closeChartsView);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPeriod = btn.dataset.period;
            updateCharts();
        });
    });

    // Add click event for clicking outside the charts content
    document.querySelector('.charts-view')?.addEventListener('click', (e) => {
        if (e.target === document.querySelector('.charts-view')) {
            closeChartsView();
        }
    });

    // Add escape key functionality
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.querySelector('.charts-view').classList.contains('active')) {
            closeChartsView();
        }
    });
});

// Chart data management
let charts = {};
let currentPeriod = 'week';

// Data tracking functions
function trackPomodoroData() {
    const data = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    const today = new Date().toISOString().split('T')[0];
    
    if (!data[today]) {
        data[today] = {
            pomodoros: 0,
            focusHours: 0,
            completedTasks: 0,
            totalTasks: 0,
            lastUpdate: new Date().toISOString()
        };
    }
    
    data[today].pomodoros++;
    data[today].focusHours += pomoValue/60; // Use actual pomodoro duration
    data[today].lastUpdate = new Date().toISOString();
    
    localStorage.setItem('pomodoroData', JSON.stringify(data));
    if (charts.pomodoros) updateCharts();
}

function trackTaskCompletion(completed = true, isUncomplete = false, silent = false) {
    const data = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    const today = new Date().toISOString().split('T')[0];
    
    if (!data[today]) {
        data[today] = {
            pomodoros: 0,
            focusHours: 0,
            completedTasks: 0,
            totalTasks: 0,
            lastUpdate: new Date().toISOString()
        };
    }
    
    if (!completed && !isUncomplete) {
        // New task being created
        data[today].totalTasks++;
    } else if (completed && !isUncomplete) {
        // Task being completed
        data[today].completedTasks++;
    } else if (!completed && isUncomplete) {
        // Task being uncompleted
        data[today].completedTasks--;
    }
    
    localStorage.setItem('pomodoroData', JSON.stringify(data));
    
    // Only update charts if not in silent mode
    if (!silent && charts.completion) {
        updateCharts();
    }
}

// Chart initialization and updates
function initializeCharts() {
    loadHistoricalData();
    const pomodorosCtx = document.getElementById('pomodorosChart').getContext('2d');
    const focusHoursCtx = document.getElementById('focusHoursChart').getContext('2d');
    const completionCtx = document.getElementById('taskCompletionChart').getContext('2d');
    
    const chartData = getChartData(currentPeriod);
    
    // Common options for line charts
    const lineOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            }
        },
        plugins: {
            legend: {
                labels: { color: 'rgba(255, 255, 255, 0.7)' }
            }
        }
    };

    // Create Pomodoros Chart
    charts.pomodoros = new Chart(pomodorosCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Pomodoros',
                data: chartData.pomodoros,
                backgroundColor: '#ba4949',
                borderColor: '#ba4949',
                tension: 0.4
            }]
        },
        options: lineOptions
    });

    // Create Focus Hours Chart
    charts.focus = new Chart(focusHoursCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Hours',
                data: chartData.focusHours,
                backgroundColor: '#31834f',
                borderColor: '#31834f',
                tension: 0.4
            }]
        },
        options: lineOptions
    });

    // Create Task Completion Chart
    charts.completion = new Chart(completionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress'],
            datasets: [{
                data: [chartData.completionRate, 100 - chartData.completionRate],
                backgroundColor: ['#4CAF50', '#FFA726']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });

    updateStats(chartData);
}

function getChartData(period) {
    const data = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    const dates = Object.keys(data).sort();
    const today = new Date();
    
    let filteredDates = dates;
    if (period === 'week') {
        const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
        filteredDates = dates.filter(date => new Date(date) >= weekAgo);
    } else if (period === 'month') {
        const monthAgo = new Date(today - 30 * 24 * 60 * 60 * 1000);
        filteredDates = dates.filter(date => new Date(date) >= monthAgo);
    }
    
    const chartData = {
        labels: filteredDates.map(date => formatDate(date)),
        pomodoros: filteredDates.map(date => data[date].pomodoros),
        focusHours: filteredDates.map(date => data[date].focusHours),
        completionRate: calculateCompletionRate(data, filteredDates)
    };
    
    return chartData;
}

function updateCharts(sessionsData) {
    if (!sessionsData || sessionsData.length === 0) {
        // Handle empty data case
        displayEmptyState();
        return;
    }

    // Process the data for charts
    const chartData = processDataForCharts(sessionsData);
    
    // Update your charts with the processed data
    updateDailyProgressChart(chartData.daily);
    updateWeeklyProgressChart(chartData.weekly);
    updateMonthlyProgressChart(chartData.monthly);
}

function processDataForCharts(sessions) {
    // Group sessions by day, week, and month
    const now = new Date();
    const daily = {};
    const weekly = {};
    const monthly = {};

    sessions.forEach(session => {
        const date = new Date(session.date);
        
        // Daily data
        const dayKey = date.toISOString().split('T')[0];
        if (!daily[dayKey]) {
            daily[dayKey] = {
                completed: 0,
                total: 0,
                duration: 0
            };
        }
        daily[dayKey].total++;
        if (session.completed) {
            daily[dayKey].completed++;
            daily[dayKey].duration += session.duration || 0;
        }

        // Weekly data
        const weekKey = getWeekNumber(date);
        if (!weekly[weekKey]) {
            weekly[weekKey] = {
                completed: 0,
                total: 0,
                duration: 0
            };
        }
        weekly[weekKey].total++;
        if (session.completed) {
            weekly[weekKey].completed++;
            weekly[weekKey].duration += session.duration || 0;
        }

        // Monthly data
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!monthly[monthKey]) {
            monthly[monthKey] = {
                completed: 0,
                total: 0,
                duration: 0
            };
        }
        monthly[monthKey].total++;
        if (session.completed) {
            monthly[monthKey].completed++;
            monthly[monthKey].duration += session.duration || 0;
        }
    });

    return {
        daily: Object.entries(daily).map(([date, data]) => ({
            date,
            ...data
        })),
        weekly: Object.entries(weekly).map(([week, data]) => ({
            week,
            ...data
        })),
        monthly: Object.entries(monthly).map(([month, data]) => ({
            month,
            ...data
        }))
    };
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function displayEmptyState() {
    // Display empty state in your charts
    // This will depend on how you want to show when there's no data
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.innerHTML = '<p class="no-data">No session data available yet</p>';
    });
}

// Update your individual chart update functions accordingly
function updateDailyProgressChart(data) {
    // Update your daily progress chart with the processed data
    // This will depend on your charting library and specific chart implementation
}

function updateWeeklyProgressChart(data) {
    // Update your weekly progress chart
}

function updateMonthlyProgressChart(data) {
    // Update your monthly progress chart
}

function updateStats(chartData) {
    const data = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    const totalPomodoros = Object.values(data).reduce((sum, day) => sum + day.pomodoros, 0);
    const totalFocusHours = Object.values(data).reduce((sum, day) => sum + day.focusHours, 0);
    
    document.querySelector('.total-pomodoros').textContent = totalPomodoros;
    document.querySelector('.total-focus-hours').textContent = `${totalFocusHours.toFixed(1)}h`;
    document.querySelector('.completion-rate').textContent = `${chartData.completionRate.toFixed(1)}%`;
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function calculateCompletionRate(data, dates) {
    let totalCompleted = 0;
    let totalTasks = 0;
    
    dates.forEach(date => {
        if (data[date]) {
            totalCompleted += data[date].completedTasks || 0;
            totalTasks += data[date].totalTasks || 0;
        }
    });
    
    // Ensure we don't divide by zero and return a valid percentage
    if (totalTasks === 0) return 0;
    const rate = (totalCompleted / totalTasks) * 100;
    return Math.min(100, Math.max(0, rate)); // Ensure rate is between 0 and 100
}

// Event Listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        updateCharts();
    });
});

// Add this function after the DOMContentLoaded event listener
function closeChartsView() {
    const chartsView = document.querySelector('.charts-view');
    const sidebar = document.querySelector('.sidebar');
    const allSidebarButtons = document.querySelectorAll('.sidebar button');
    
    chartsView.classList.remove('active');
    sidebar.classList.remove('hidden');
    allSidebarButtons.forEach(button => {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
    });
}

// Add function to load historical data
function loadHistoricalData() {
    const data = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    const today = new Date().toISOString().split('T')[0];
    
    // Initialize today's data if it doesn't exist
    if (!data[today]) {
        data[today] = {
            pomodoros: 0,
            focusHours: 0,
            completedTasks: 0,
            totalTasks: 0,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('pomodoroData', JSON.stringify(data));
    }
    
    return data;
}
