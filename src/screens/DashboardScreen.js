// src/screens/DashboardScreen.js
function renderDashboardScreen() {
    const root = document.getElementById('root');
    root.innerHTML = `
        <div class="dashboard-screen" id="dashboardScreen">
            <header class="dashboard-header">
                <h2>Hello,</h2> {/* Personalized name will be added later */}
            </header>
            <div class="dashboard-cards-container">
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
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const targetScreen = card.dataset.targetScreen;
            console.log('Navigating to:', targetScreen);
            // Actual navigation will be implemented using loadScreen or a similar mechanism
            // For now, it's a placeholder:
                // alert('Navigating to ' + targetScreen + ' (not yet implemented).');
                loadScreen(targetScreen, { transition: 'slide-in' });
        });
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
        // Simulate logout
        console.log("Logging out...");
        // In a real app: Firebase signOut() then loadScreen('welcome');
        loadScreen('welcome');
    });
}
