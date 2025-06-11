// src/screens/SelfCareHubScreen.js

// Dummy data for self-care topics
const selfCareTopics = [
    { id: "sc1", title: "Acknowledging Your Grief", illustration: "illustration-heart", detailsScreen: "supportContentGrief" },
    { id: "sc2", title: "Accepting Help from Others", illustration: "illustration-hands", detailsScreen: "supportContentHelp" },
    { id: "sc3", title: "Supporting Your Children Through Loss", illustration: "illustration-family", detailsScreen: "supportContentChildren" },
    { id: "sc4", title: "Being Patient with the Process", illustration: "illustration-path", detailsScreen: "supportContentPatience" }
];

export function renderSelfCareHubScreen(container, transitionType) { // Added export, container default removed
    let cardsHtml = '';
    selfCareTopics.forEach(topic => {
        cardsHtml += `
            <div class="self-care-card" data-topic-id="${topic.id}" data-details-screen="${topic.detailsScreen}">
                <div class="card-illustration ${topic.illustration}"></div>
                <h3>${topic.title}</h3>
            </div>
        `;
    });

    const screenContainerId = 'selfCareHubScreen';
    // If the container is the root, we create the screen element.
    // If the container is a pre-made slide-in div, we populate it.
    let screenElement;
    if (container.id === 'root') {
        container.innerHTML = `<div class="self-care-hub-screen" id="${screenContainerId}"></div>`;
        screenElement = container.firstChild;
    } else {
        // Assuming container is already the .self-care-hub-screen or a slide-in div
        container.innerHTML = ''; // Clear it first
        container.id = screenContainerId; // Ensure it has the ID
        container.classList.add('self-care-hub-screen'); // Ensure it has the class
        screenElement = container;
    }

    screenElement.innerHTML = `
        <header class="hub-header">
            <div class="back-button-main-dashboard">
                <a href="#" class="back-button-icon" id="backToDashboardFromHub">&lt;</a>
            </div>
            <h2>Caring for Yourself & Your Family</h2>
            <p class="subtitle">This is more than a list of tasks. Be kind to yourself through this process.</p>
        </header>
        <div class="self-care-cards-container">
            ${cardsHtml}
        </div>
    `;


    if (transitionType === 'slide-in' && screenElement.classList.contains('screen-slide-in')) {
        // screenElement should ALREADY have screen-slide-in if container was prepared by app.js
        void screenElement.offsetWidth; // Trigger reflow
        screenElement.classList.add('active');
    } else if (transitionType === 'slide-in' && screenElement.id ==='root') {
        // This case should ideally not happen if app.js prepares the container for slide-in
        console.warn("SelfCareHubScreen trying to slide in but rendered directly in root.");
    }


    // Event Listeners
    screenElement.querySelector('#backToDashboardFromHub').addEventListener('click', (e) => {
        e.preventDefault();
        if (screenElement.classList.contains('screen-slide-in') && screenElement.classList.contains('active')) {
            screenElement.classList.remove('active');
            setTimeout(() => {
                screenElement.remove(); // Remove the slide-in div itself
                window.loadScreen('dashboard'); // Use window.loadScreen
            }, 500);
        } else {
            window.loadScreen('dashboard'); // Use window.loadScreen
        }
    });

    screenElement.querySelectorAll('.self-care-card').forEach(card => {
        card.addEventListener('click', function() {
            const detailsScreen = this.dataset.detailsScreen;
            const topicId = this.dataset.topicId;
            console.log('Navigating to support content:', detailsScreen, 'for topic ID:', topicId);
            window.loadScreen(detailsScreen, { topicId: topicId, transition: 'slide-in' }); // Use window.loadScreen
        });
    });
}
