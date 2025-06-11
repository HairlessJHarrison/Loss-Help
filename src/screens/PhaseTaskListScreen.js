// src/screens/PhaseTaskListScreen.js

// Dummy data for tasks, later this will come from Firestore via API
const allTasks = {
    phase1Tasks: {
        title: "Phase 1: The First Few Days",
        tasks: [
            { id: "p1t1", text: "Official Pronouncement of Death", completed: false, detailsScreen: "taskDetailPronouncement" },
            { id: "p1t2", text: "Notify Close Family and Friends", completed: false, detailsScreen: "taskDetailNotifyFamily" },
            { id: "p1t3", text: "Check for Pre-Arranged Plans", completed: true, detailsScreen: "taskDetailPrearranged" },
            { id: "p1t4", text: "Arrange for Care (Dependents & Pets)", completed: false, detailsScreen: "taskDetailCare" },
            { id: "p1t5", text: "Select a Funeral Home", completed: false, detailsScreen: "taskDetailFuneralHome" },
        ]
    },
    phase2Tasks: {
        title: "Phase 2: The First Two Weeks",
        tasks: [
            { id: "p2t1", text: "Gather Important Documents", completed: false, detailsScreen: "taskDetailGatherDocs" },
            { id: "p2t2", text: "Plan Funeral or Memorial Service", completed: false, detailsScreen: "taskDetailPlanService" },
        ]
    },
    phase3Tasks: {
        title: "Phase 3: The Following Months",
        tasks: [
            { id: "p3t1", text: "Notify Banks and Financial Institutions", completed: false, detailsScreen: "taskDetailNotifyBanks" },
            { id: "p3t2", text: "Handle Insurance Policies", completed: false, detailsScreen: "taskDetailInsurance" },
        ]
    }
};

function renderPhaseTaskListScreen(phaseKey, container = document.getElementById('root')) {
    const phaseData = allTasks[phaseKey];
    if (!phaseData) {
        container.innerHTML = `<p>Error: Task phase not found.</p><button onclick="loadScreen('dashboard')">Back to Dashboard</button>`;
        return;
    }

    let taskItemsHtml = '';
    phaseData.tasks.forEach(task => {
        taskItemsHtml += `
            <li class="task-item" data-task-id="${task.id}" data-details-screen="${task.detailsScreen}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}"></div>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <span class="task-chevron">&gt;</span>
            </li>
        `;
    });

    container.innerHTML = `
        <div class="phase-task-list-screen" id="${phaseKey}Screen">
            <header class="task-list-header">
                <a href="#" class="back-button-icon" id="backToDashboardButton">&lt;</a>
                <h2>${phaseData.title}</h2>
            </header>
            <ul class="task-list">
                ${taskItemsHtml}
            </ul>
        </div>
    `;

    // Event Listeners
    // Need to ensure this ID is unique if multiple task lists could somehow be on screen,
    // or rely on the container scoping. For SPA, usually one active screen.
    container.querySelector('#backToDashboardButton').addEventListener('click', (e) => {
        e.preventDefault();
        if (container.classList.contains('screen-slide-in')) {
            container.classList.remove('active'); // Trigger slide out
            setTimeout(() => {
                loadScreen('dashboard');
            }, 500); // time for slide animation
        } else {
            loadScreen('dashboard'); // Navigate back to dashboard
        }
    });

    container.querySelectorAll('.task-item').forEach(item => {
        item.addEventListener('click', function(event) {
            // Allow clicking checkbox without navigating
            if (event.target.classList.contains('task-checkbox')) return;

            const detailsScreen = this.dataset.detailsScreen;
            const taskId = this.dataset.taskId;
            console.log('Navigating to task detail:', detailsScreen, 'for task ID:', taskId);
            loadScreen(detailsScreen, { taskId: taskId, phaseKey: phaseKey, transition: 'slide-in' });
        });
    });

    container.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent task item click event
            const taskId = this.dataset.taskId;
            const task = phaseData.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed; // Toggle completion state (in-memory)
                this.classList.toggle('checked');
                this.closest('.task-item').querySelector('.task-text').classList.toggle('completed');
                // Later: Update this in Firestore via API
                console.log(`Task ${taskId} completion toggled to ${task.completed}`);
            }
        });
    });
}
