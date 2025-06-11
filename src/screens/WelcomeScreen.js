// src/screens/WelcomeScreen.js
function renderWelcomeScreen() {
    const root = document.getElementById('root');
    root.innerHTML = `
        <div class="welcome-screen" id="welcomeScreen">
            <div class="app-name">GriefSupportApp</div>
            <h1 class="welcome-heading">I am so sorry for your loss.</h1>
            <p class="welcome-paragraph">
                This is an incredibly difficult time. There is no right or wrong way to feel.
                We're here to help you navigate the next steps in a way that feels right for you.
                You are not alone.
            </p>
            <div class="options-container">
                <button class="option-button" id="downloadChecklist">Download a Checklist</button>
                <button class="option-button" id="guidedChecklist">Guided Checklist with Support</button>
                <button class="option-button" id="fullSupport">Full Support</button>
            </div>
        </div>
        <div id="emailModal" class="modal">
            <div class="modal-content">
                <h3>Download Checklist</h3>
                <p>Enter your email to receive a printable checklist template.</p>
                <input type="email" id="emailInput" placeholder="your.email@example.com" />
                <button id="sendEmailButton">Send</button>
                <button id="cancelEmailButton" class="cancel">Cancel</button>
            </div>
        </div>
    `;

    // Event Listeners
    const downloadButton = document.getElementById('downloadChecklist');
    const guidedButton = document.getElementById('guidedChecklist');
    const fullSupportButton = document.getElementById('fullSupport');
    const emailModal = document.getElementById('emailModal');
    const sendEmailButton = document.getElementById('sendEmailButton');
    const cancelEmailButton = document.getElementById('cancelEmailButton');
    const emailInput = document.getElementById('emailInput');

    downloadButton.addEventListener('click', () => {
        emailModal.style.display = 'flex';
    });

    cancelEmailButton.addEventListener('click', () => {
        emailModal.style.display = 'none';
    });

    sendEmailButton.addEventListener('click', () => {
        const email = emailInput.value;
        if (email && email.includes('@')) { // Basic email validation
            console.log('Email submitted:', email);
            // Here, you would typically call an API to send the email.
            // POST /userActions/sendChecklistEmail with { email }
            alert('Checklist will be sent to ' + email + ' (simulation).');
            emailModal.style.display = 'none';
            emailInput.value = ''; // Clear input
        } else {
            alert('Please enter a valid email address.');
        }
    });

    function navigateToNextScreen(option) {
        console.log(option + ' chosen. Navigating to login/dashboard (simulation)...');
        const welcomeScreenElement = document.getElementById('welcomeScreen');
        welcomeScreenElement.classList.add('fade-out');
        // Simulate loading next screen after fade
        setTimeout(() => {
                loadScreen('login'); // MODIFIED LINE
            }, 1000);
    }

    guidedButton.addEventListener('click', () => {
        navigateToNextScreen('Guided Checklist');
    });

    fullSupportButton.addEventListener('click', () => {
        navigateToNextScreen('Full Support');
    });
}

// Expose the function to be called from app.js or index.html
// For now, directly call if app.js is simple
// In a more structured app, app.js would manage screen rendering.
