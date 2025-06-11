// src/screens/WelcomeScreen.js
import { functions } from '../services/firebaseConfig.js'; // Import the functions instance
import { httpsCallable } from "firebase/functions"; // Import httpsCallable

export function renderWelcomeScreen(container) { // Added export, added container argument
    container.innerHTML = `
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
                <p id="emailStatusMessage" style="margin-top:10px; min-height:1.2em;"></p>
                <button id="sendEmailButton">Send</button>
                <button id="cancelEmailButton" class="cancel">Cancel</button>
            </div>
        </div>
    `;

    // Event Listeners - ensure they are queried from the container or document if IDs are unique
    const welcomeScreenElement = container.firstChild; // Assuming the screen is the first child
    const downloadButton = welcomeScreenElement.querySelector('#downloadChecklist');
    const guidedButton = welcomeScreenElement.querySelector('#guidedChecklist');
    const fullSupportButton = welcomeScreenElement.querySelector('#fullSupport');

    // Modal elements are outside welcomeScreenElement if modal is sibling in container
    // However, if modal is inside welcomeScreenElement (as per current HTML structure), query from there.
    // Let's assume modal is a direct child of 'container' for wider accessibility if needed,
    // or ensure unique IDs if it's inside welcomeScreenElement.
    // Based on current HTML, modal is sibling to welcome-screen, so query from container.
    const emailModal = container.querySelector('#emailModal');
    const sendEmailButton = container.querySelector('#sendEmailButton');
    const cancelEmailButton = container.querySelector('#cancelEmailButton');
    const emailInput = container.querySelector('#emailInput');
    const emailStatusMessage = container.querySelector('#emailStatusMessage');


    downloadButton.addEventListener('click', () => {
        const user = window.getCurrentUser();
        if (user && user.email) {
            emailInput.value = user.email; // Pre-fill if user is logged in
        } else {
            emailInput.value = ''; // Clear if no user or no email
        }
        emailStatusMessage.textContent = ''; // Clear previous messages
        emailModal.style.display = 'flex';
    });

    cancelEmailButton.addEventListener('click', () => {
        emailModal.style.display = 'none';
    });

    sendEmailButton.addEventListener('click', async () => {
        const email = emailInput.value;
        emailStatusMessage.textContent = ''; // Clear previous messages

        if (email && email.includes('@')) {
            sendEmailButton.disabled = true;
            emailStatusMessage.textContent = 'Sending...';
            try {
                const sendChecklistEmailFunction = httpsCallable(functions, 'sendChecklistEmail');
                const result = await sendChecklistEmailFunction({ email: email });

                console.log('Cloud function result:', result.data);
                emailStatusMessage.style.color = 'green';
                emailStatusMessage.textContent = result.data.message;
                // Optionally close modal after a delay
                setTimeout(() => {
                    emailModal.style.display = 'none';
                    emailInput.value = '';
                }, 3000);

            } catch (error) {
                console.error('Error calling sendChecklistEmail function:', error);
                emailStatusMessage.style.color = 'red';
                emailStatusMessage.textContent = 'Error: ' + error.message;
            } finally {
                sendEmailButton.disabled = false;
            }
        } else {
            emailStatusMessage.style.color = 'red';
            emailStatusMessage.textContent = 'Please enter a valid email address.';
        }
    });

    function navigateToApp(option) {
        console.log(option + ' chosen.');
        const user = window.getCurrentUser();
        if (user) {
            window.loadScreen('dashboard'); // If user logged in, go to dashboard
        } else {
            window.loadScreen('login'); // Else, go to login
        }
    }
    guidedButton.addEventListener('click', () => navigateToApp('Guided Checklist'));
    fullSupportButton.addEventListener('click', () => navigateToApp('Full Support'));
}

// Removed direct calls and DOMContentLoaded listener
