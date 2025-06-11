// src/screens/DashboardScreen.js
// No direct Firebase import needed here if app.js handles signOut and user state

export function renderDashboardScreen(container) {
    const user = window.getCurrentUser(); // Get user from global state set by app.js
    const userName = user ? (user.displayName || user.email) : "";

    container.innerHTML = `
        <div class="dashboard-screen" id="dashboardScreen">
            <header class="dashboard-header">
                <h2>Hello, ${userName ? userName : 'Guest'}</h2>
            </header>
            <div class="dashboard-cards-container">
                {/* Cards are assumed to be the same as before */}
                <div class="dashboard-card" data-target-screen="phase1Tasks">
                    <div class="card-icon icon-calendar-sunrise"></div>
                    <h3>Phase 1: The First Few Days</h3>
                    <p>Immediate Priorities</p>
                </div>
                <div class="dashboard-card" data-target-screen="phase2Tasks">
                    <div class="card-icon icon-document-pen"></div>
                    <h3>Phase 2: The First Two Weeks</h3>
                    <p>Key Administrative Tasks</p>
                </div>
                <div class="dashboard-card" data-target-screen="phase3Tasks">
                    <div class="card-icon icon-house-bank"></div>
                    <h3>Phase 3: The Following Months</h3>
                    <p>Settling the Estate</p>
                </div>
                <div class="dashboard-card" data-target-screen="selfCareHub">
                    <div class="card-icon icon-heart-people"></div>
                    <h3>Caring for Yourself & Your Family</h3>
                    <p>Support and Grief Resources</p>
                </div>
            </div>
            <button class="back-button" id="logoutButton" style="margin-top: 30px;">Logout (Back to Welcome)</button>
        </div>
    `;

    // Event Listeners for cards
    const dashboardScreenElement = container.firstChild; // dashboard-screen div

    // Event Listeners for cards
    dashboardScreenElement.querySelectorAll('.dashboard-card').forEach(card => {
        card.addEventListener('click', function() {
            const targetScreen = this.dataset.targetScreen;
            window.loadScreen(targetScreen, { transition: 'slide-in' });
        });
    });

    dashboardScreenElement.querySelector('#logoutButton').addEventListener('click', () => {
        if (typeof window.appSignOut === 'function') {
            window.appSignOut(); // Call global signOut function from app.js
        }
    });

    // Apply fade-in animation
    // Ensure dashboardScreenElement is not null before accessing style
    if (dashboardScreenElement) {
        dashboardScreenElement.style.opacity = 0;
        dashboardScreenElement.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
    }
}
