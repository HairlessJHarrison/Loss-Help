// src/screens/LoginScreen.js
import { auth } from '../services/firebaseConfig.js'; // Import the auth instance
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; // Import auth functions

export function renderLoginScreen(container) {
    container.innerHTML = `
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
                <p id="loginErrorMessage" style="color: red; margin-top: 10px; min-height: 1.2em;"></p>
                <div class="login-links">
                    <a href="#" id="createAccountLink">Create Account</a>
                    <a href="#" id="forgotPassword">Forgot Password?</a>
                </div>
                <button class="back-button" id="backToWelcome">Back to Welcome</button>
            </div>
        </div>
    `;

    const loginScreenElement = container.firstChild; // Assuming the screen is the first child
    const performLoginButton = loginScreenElement.querySelector('#performLogin');
    const backToWelcomeButton = loginScreenElement.querySelector('#backToWelcome');
    const loginEmailInput = loginScreenElement.querySelector('#loginEmail');
    const loginPasswordInput = loginScreenElement.querySelector('#loginPassword');
    const createAccountLink = loginScreenElement.querySelector('#createAccountLink');
    const forgotPasswordLink = loginScreenElement.querySelector('#forgotPassword');
    const loginErrorMessage = loginScreenElement.querySelector('#loginErrorMessage');

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginErrorMessage.textContent = ''; // Clear previous errors
        alert('Forgot Password functionality not yet implemented.');
    });

    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginErrorMessage.textContent = ''; // Clear previous errors
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        if (!email || !password) {
            loginErrorMessage.textContent = 'Please enter email and password to create an account.';
            return;
        }
        if (password.length < 6) {
            loginErrorMessage.textContent = 'Password should be at least 6 characters.';
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Account created successfully:', userCredential.user);
                loginErrorMessage.textContent = 'Account created! Please login.';
                loginEmailInput.value = ''; // Clear fields
                loginPasswordInput.value = '';
            })
            .catch((error) => {
                console.error("Error creating account:", error);
                loginErrorMessage.textContent = error.message;
            });
    });

    performLoginButton.addEventListener('click', () => {
        loginErrorMessage.textContent = ''; // Clear previous errors
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        if (!email || !password) {
            loginErrorMessage.textContent = 'Please enter both email and password.';
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Login successful:', userCredential.user);
                // Navigation to dashboard will be handled by onAuthStateChanged in app.js
                // No direct navigation call here.
            })
            .catch((error) => {
                console.error("Error signing in:", error);
                loginErrorMessage.textContent = error.message;
            });
    });

    backToWelcomeButton.addEventListener('click', () => {
        window.loadScreen('welcome');
    });
}
