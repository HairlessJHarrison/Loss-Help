// src/screens/TaskDetailScreen.js

// Dummy data for task details - this would normally be part of the main task objects or fetched
const taskDetailsData = {
    taskDetailPronouncement: {
        title: "Official Pronouncement of Death",
        description: "Obtain an official pronouncement of death. This is typically done by a doctor, hospice nurse, or medical examiner.",
        actionableSteps: [
            "If at a hospital or care facility, staff will usually handle this.",
            "If at home under hospice care, contact the hospice nurse.",
            "If death is unexpected at home, call 911. Medical personnel or a medical examiner will make the pronouncement."
        ],
        importantNote: "This step is crucial for obtaining a death certificate, which you'll need for many administrative tasks."
    },
    taskDetailNotifyFamily: {
        title: "Notify Close Family and Friends",
        description: "Reach out to immediate family members and very close friends to share the news.",
        actionableSteps: [
            "Decide who should be told in person, if possible.",
            "Prepare a simple, direct statement to avoid having to retell the story in detail each time.",
            "Consider asking a close relative or friend to help you make some of these difficult calls."
        ],
        importantNote: "It is okay to delegate. This is an exhausting task. Ask for help."
    },
    // Add more details for other tasks as needed...
    taskDetailPrearranged: {
        title: "Check for Pre-Arranged Plans",
        description: "Determine if the deceased made any pre-arranged funeral or burial plans.",
        actionableSteps: ["Look through important papers.", "Check with family members.", "Contact known local funeral homes if unsure."],
        importantNote: "These plans can sometimes be found with wills or other important documents."
    },
    taskDetailCare: {
        title: "Arrange for Care (Dependents & Pets)",
        description: "Ensure any dependents (children, elderly) or pets are cared for.",
        actionableSteps: ["Contact family or friends who can help.", "If necessary, arrange temporary professional care."],
        importantNote: "This is an immediate priority if applicable."
    },
    taskDetailFuneralHome: {
        title: "Select a Funeral Home",
        description: "If no pre-arrangements exist, you'll need to select a funeral home.",
        actionableSteps: ["Ask for recommendations.", "Compare services and prices.", "Consider location and cultural/religious needs."],
        importantNote: "The funeral home will guide you through many subsequent steps."
    },
    taskDetailGatherDocs: {
        title: "Gather Important Documents",
        description: "Collect essential documents needed for administrative and legal processes.",
        actionableSteps: [
            "Locate the deceased's Will (if any).",
            "Find birth certificate, marriage certificate, social security card.",
            "Gather bank account statements, insurance policies, property deeds, and tax returns."
        ],
        importantNote: "Keep these documents organized and secure. You may need multiple copies of the death certificate."
    },
    taskDetailPlanService: {
        title: "Plan Funeral or Memorial Service",
        description: "Decide on and arrange the details of the funeral, memorial, or celebration of life.",
        actionableSteps: [
            "Discuss wishes with family.",
            "Coordinate with the funeral home or venue.",
            "Choose readings, music, and participants.",
            "Prepare an obituary."
        ],
        importantNote: "Services can be personalized to reflect the life of your loved one. Don't feel pressured to rush."
    },
    taskDetailNotifyBanks: {
        title: "Notify Banks and Financial Institutions",
        description: "Inform banks, credit card companies, and other financial institutions of the death.",
        actionableSteps: [
            "You'll likely need a death certificate for each institution.",
            "Identify joint accounts versus individual accounts.",
            "Inquire about any outstanding debts or credits."
        ],
        importantNote: "This can help prevent identity theft and manage financial affairs."
    },
    taskDetailInsurance: {
        title: "Handle Insurance Policies",
        description: "Locate life insurance policies and begin the claims process. Also notify other insurers (health, auto, home).",
        actionableSteps: [
            "Find policy documents.",
            "Contact the insurance companies to understand the claim procedure.",
            "Notify health, auto, and home insurers to update or cancel policies as needed."
        ],
        importantNote: "Life insurance claims can provide financial support for funeral costs and other expenses."
    }
};

function renderTaskDetailScreen(detailKey, taskId, phaseKey, transitionType) {
    const detailData = taskDetailsData[detailKey];
    const phaseAllTasks = allTasks[phaseKey]; // Accessing global allTasks from PhaseTaskListScreen.js
    const currentTask = phaseAllTasks ? phaseAllTasks.tasks.find(t => t.id === taskId) : null;

    if (!detailData || !currentTask) {
        // Attempt to render into the current slide-in container if it exists, or root.
        let container = document.querySelector('.screen-slide-in.active') || document.getElementById('root');
        if (container.classList.contains('screen-slide-in') && !container.classList.contains('active')) {
            // If a slide-in container exists but is not active, it might be the one we're trying to reuse or a previous one.
            // Default to root if the found container is not the active one we are trying to load into.
             container = document.getElementById('root');
        }
        container.innerHTML = `<p>Error: Task details not found for ${detailKey}/${taskId}.</p><button onclick="loadScreen('${phaseKey || 'dashboard'}')">Back</button>`;
        return;
    }

    const root = document.getElementById('root'); // Keep root reference for overall page structure
    let stepsHtml = '';
    if (detailData.actionableSteps && detailData.actionableSteps.length > 0) {
        stepsHtml = '<ul>';
        detailData.actionableSteps.forEach(step => {
            stepsHtml += `<li>${step}</li>`;
        });
        stepsHtml += '</ul>';
    }

    // Create a new container for this screen to manage its slide-in independently
    const screenContainer = document.createElement('div');
    screenContainer.className = 'task-detail-screen'; // General class for styling
    screenContainer.id = detailKey + 'Screen'; // Unique ID

    screenContainer.innerHTML = `
        <header class="task-detail-header">
            <a href="#" class="back-button-icon" data-target-phase="${phaseKey}">&lt;</a>
            <h2>${detailData.title}</h2>
        </header>
        <div class="task-detail-content">
            ${detailData.description ? `<h3>Description</h3><p>${detailData.description}</p>` : ''}
            ${stepsHtml ? `<h3>Actionable Steps</h3>${stepsHtml}` : ''}
            ${detailData.importantNote ? `<div class="important-note"><h3>Important Note</h3><p>${detailData.importantNote}</p></div>` : ''}
            <button class="mark-complete-button ${currentTask.completed ? 'completed' : ''}" data-task-id="${taskId}">
                ${currentTask.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
        </div>
    `;

    // Clear only if not a slide-in, or manage existing slide-ins.
    // For slide-in, we append. app.js will handle removing previous slide-in if necessary.
    if (transitionType !== 'slide-in') {
         root.innerHTML = '';
    }
    root.appendChild(screenContainer);


    if (transitionType === 'slide-in') {
        screenContainer.classList.add('screen-slide-in'); // Add class for slide-in styling
        void screenContainer.offsetWidth; // Trigger reflow
        screenContainer.classList.add('active'); // Activate slide-in animation
    }


    // Event Listeners
    screenContainer.querySelector('.back-button-icon').addEventListener('click', (e) => {
        e.preventDefault();
        const targetPhase = e.target.dataset.targetPhase;

        if (screenContainer.classList.contains('active') && screenContainer.classList.contains('screen-slide-in')) {
            screenContainer.classList.remove('active'); // Trigger slide-out
            // Wait for animation then load previous screen and remove this one
            setTimeout(() => {
                screenContainer.remove();
                loadScreen(targetPhase, { transition: 'slide-in' }); // Previous screen also slides in
            }, 500);
        } else {
            screenContainer.remove(); // Remove if not part of slide transition (e.g. direct load)
            loadScreen(targetPhase);
        }
    });

    const completeButton = screenContainer.querySelector('.mark-complete-button');
    completeButton.addEventListener('click', function() {
        const taskToUpdate = phaseAllTasks.tasks.find(t => t.id === taskId);
        if (taskToUpdate) {
            taskToUpdate.completed = !taskToUpdate.completed;
            this.classList.toggle('completed');
            this.textContent = taskToUpdate.completed ? 'Mark as Incomplete' : 'Mark as Complete';
            // Later: Update this in Firestore via API & sync with PhaseTaskListScreen display
            console.log(`Task ${taskId} completion toggled to ${taskToUpdate.completed} from details screen.`);
            // Also update the global allTasks object so the list screen reflects change
            const globalTask = allTasks[phaseKey].tasks.find(t => t.id === taskId);
            if(globalTask) globalTask.completed = taskToUpdate.completed;
        }
    });
}
