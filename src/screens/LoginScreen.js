// src/screens/LoginScreen.js
function renderLoginScreen() {
    const root = document.getElementById('root');
    root.innerHTML = `
        <div class="login-screen" id="loginScreen">
            <div class="login-container">
                <h2>Login</h2>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="loginEmail" placeholder="your.email@example.com" required>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="loginPassword" placeholder="Your password" required>
                </div>
                <button class="login-button" id="performLogin">Login</button>
                <div class="login-links">
                    <a href="#" id="forgotPassword">Forgot Password?</a>
                    <a href="#" id="createAccount">Create Account</a>
                </div>
                <button class="back-button" id="backToWelcome">Back to Welcome</button>
            </div>
        </div>
    `;

    // Event Listeners
    const performLoginButton = document.getElementById('performLogin');
    const backToWelcomeButton = document.getElementById('backToWelcome');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');

    // Placeholder links
    document.getElementById('forgotPassword').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Forgot Password functionality not yet implemented.');
    });
    document.getElementById('createAccount').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Create Account functionality not yet implemented. Will integrate with Firebase Auth.');
    });


    performLoginButton.addEventListener('click', () => {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        // Simulate login
        console.log('Attempting login with:', email);
        // Later, this will be:
        // signInWithEmailAndPassword(auth, email, password)
        //   .then((userCredential) => { /* loadScreen('dashboard'); */ })
        //   .catch((error) => { alert(error.message); });

        alert('Login successful (simulation)! Navigating to dashboard.');
        // Perform fade out and load next screen
        const loginScreenElement = document.getElementById('loginScreen');
        loginScreenElement.classList.add('fade-out'); // Assuming fade-out is globally available
        setTimeout(() => {
            loadScreen('dashboard'); // Navigate to dashboard
        }, 1000); // Match CSS transition time
    });

    backToWelcomeButton.addEventListener('click', () => {
        const loginScreenElement = document.getElementById('loginScreen');
        loginScreenElement.classList.add('fade-out');
         setTimeout(() => {
            loadScreen('welcome'); // Navigate back to welcome screen
        }, 1000);
    });
}
