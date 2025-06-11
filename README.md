# Grief Support Application Development Plan

This document outlines the development plan for the Grief Support Application.

## Core Design Philosophy
The app's design should be clean, calm, and minimalist. Use a soft color palette (e.g., muted blues, greens, and greys), plenty of white space, and gentle, rounded typography. Avoid sharp edges and jarring notifications. The goal is to reduce overwhelm, not add to it.

## Development Steps

1.  **Create a README.md file.** (This step)
2.  **Define API Structure.**
    *   Identify data models (e.g., User, Checklist, Task, SelfCareTopic).
    *   Define API endpoints for CRUD operations related to these models (e.g., `GET /checklist/{phase}`, `POST /task/{taskId}/complete`, `GET /user/{userId}/progress`).
    *   Specify request/response formats (likely JSON).
3.  **Set up the basic project structure.** This will include creating the main application file, folders for components, screens, assets, and potentially a separate folder for API/backend logic if not using a BaaS like Firebase Functions directly for all API needs.
4.  **Firebase Project Setup Plan.**
    *   Outline steps to create a new Firebase project.
    *   Plan for Firestore Database setup for storing user data, checklists, and progress.
    *   Plan for Firebase Authentication setup (for user login).
    *   Consider Firebase Functions for implementing the defined API endpoints.
    *   Consider Firebase Hosting for deploying the frontend application.
5.  **Implement Screen 1: The Welcome Screen.**
    *   Create the UI elements as described: full-screen image, app name, heading, paragraph, and three option buttons.
    *   Implement the functionality for the "Download a Checklist" button (this might involve an API call to a function that generates and emails a checklist).
    *   Set up navigation for options 2 and 3 to proceed to a login screen.
6.  **Implement Login Screen.**
    *   Basic UI for email/password login.
    *   Integrate with Firebase Authentication.
    *   On successful login, navigate to the Main Dashboard.
7.  **Implement Screen 2: Main Dashboard.**
    *   Create the UI with a greeting and four tappable cards.
    *   Data for cards (phases) might be fetched from Firestore.
    *   Set up navigation from each card.
8.  **Implement Screen 3: Phase Task List Screen (Generic).**
    *   Fetch tasks for the selected phase from Firestore.
    *   Display tasks with checkboxes.
    *   Implement checkbox functionality (update task status in Firestore via API call).
    *   Navigation to Task Detail.
9.  **Implement Screen 4: Task Detail Screen (Generic).**
    *   Fetch task details from Firestore.
    *   Display task information.
    *   "Mark as Complete" button updates status in Firestore via API.
10. **Implement Screen 5: Self-Care & Family Support Hub.**
    *   Fetch self-care topics from Firestore.
    *   Display topics as cards.
    *   Navigation to Support Content.
11. **Implement Screen 6: Support Content Screen (Generic).**
    *   Fetch content for the selected topic from Firestore.
    *   Display content.
12. **Styling and Theming.** Apply the specified design philosophy.
13. **Firebase Deployment.**
    *   Set up Firebase CLI.
    *   Deploy Firestore rules.
    *   Deploy Firebase Functions (API).
    *   Deploy the web application to Firebase Hosting.
14. **Review and Refine.** Test all functionality, including API calls and data persistence in Firebase.
15. **Submit the application.**

## API Structure Definition

### Data Models

1.  **User:**
    *   `userId`: String (Unique ID, likely from Firebase Auth)
    *   `email`: String
    *   `name`: String (Optional)
    *   `createdAt`: Timestamp

2.  **ChecklistPhase:** (Represents the main cards on the dashboard)
    *   `phaseId`: String (e.g., "phase1-first-few-days")
    *   `title`: String (e.g., "Phase 1: The First Few Days")
    *   `description`: String (e.g., "Immediate Priorities")
    *   `icon`: String (Identifier for a line-art icon)
    *   `order`: Number (For sorting)

3.  **Task:**
    *   `taskId`: String (Unique ID)
    *   `phaseId`: String (Foreign key to ChecklistPhase)
    *   `title`: String (e.g., "Official Pronouncement of Death")
    *   `description`: String (Detailed explanation for Screen 4)
    *   `actionableSteps`: Array of Strings (For Screen 4)
    *   `importantNote`: String (For Screen 4)
    *   `isComplete`: Boolean
    *   `userId`: String (To track completion per user)
    *   `order`: Number (For sorting within a phase)

4.  **UserTaskProgress:** (To link users to tasks and their completion status if tasks are global, alternative to `isComplete` directly in Task if tasks are user-specific copies)
    *   `userTaskProgressId`: String (Unique ID)
    *   `userId`: String
    *   `taskId`: String
    *   `isComplete`: Boolean
    *   `updatedAt`: Timestamp

5.  **SelfCareTopic:** (For Screen 5 cards)
    *   `topicId`: String (e.g., "acknowledging-grief")
    *   `title`: String (e.g., "Acknowledging Your Grief")
    *   `illustration`: String (Identifier for an illustration)
    *   `order`: Number

6.  **SelfCareContent:** (For Screen 6 content)
    *   `contentId`: String (Unique ID)
    *   `topicId`: String (Foreign key to SelfCareTopic)
    *   `header`: String
    *   `content`: String (Detailed text content)
    *   `illustration`: String (Identifier for top illustration)

### API Endpoints (using Firestore and Firebase Functions as backend)

*   **Authentication:** (Handled by Firebase Authentication SDKs directly on the client, but listing for completeness of user flow)
    *   `POST /users/signup` (Firebase Auth)
    *   `POST /users/login` (Firebase Auth)
    *   `POST /users/logout` (Firebase Auth)

*   **ChecklistPhases:**
    *   `GET /checklistPhases`: Retrieves all checklist phases.
        *   Response: Array of `ChecklistPhase` objects.

*   **Tasks:**
    *   `GET /phases/{phaseId}/tasks?userId={userId}`: Retrieves all tasks for a given phase, including user-specific completion status.
        *   Response: Array of `Task` objects (potentially enriched with `isComplete` status from `UserTaskProgress`).
    *   `POST /tasks/{taskId}/complete?userId={userId}`: Marks a task as complete for a user.
        *   Request Body: `{ "isComplete": true }`
        *   Response: Updated `UserTaskProgress` or `Task` object.
    *   `POST /tasks/{taskId}/uncomplete?userId={userId}`: Marks a task as incomplete for a user.
        *   Request Body: `{ "isComplete": false }`
        *   Response: Updated `UserTaskProgress` or `Task` object.

*   **SelfCareTopics:**
    *   `GET /selfCareTopics`: Retrieves all self-care topics.
        *   Response: Array of `SelfCareTopic` objects.

*   **SelfCareContent:**
    *   `GET /selfCareTopics/{topicId}/content`: Retrieves the content for a specific self-care topic.
        *   Response: `SelfCareContent` object.

*   **Email Checklist (Welcome Screen Option 1):**
    *   `POST /userActions/sendChecklistEmail`
        *   Request Body: `{ "email": "user@example.com" }`
        *   Response: Success/failure message.
        *   (This would be a Firebase Function that triggers an email service like SendGrid or Firebase's own email trigger extension).

### Request/Response Format
*   All request and response bodies will be in JSON format.

## Firebase Project Setup Plan

This section outlines the steps to set up the Firebase project for the Grief Support Application.

1.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click on "Add project".
    *   Enter a project name (e.g., "GriefSupportApp").
    *   Accept the Firebase terms and click "Continue".
    *   Decide whether to enable Google Analytics for this project (recommended for understanding app usage, but can be added later).
    *   Click "Create project".

2.  **Add Firebase to Your Web App:**
    *   Once the project is ready, click the web icon (`</>`) to add Firebase to your web app.
    *   Register the app with a nickname (e.g., "GriefSupportWebApp").
    *   Firebase will provide a configuration object (apiKey, authDomain, projectId, etc.). **Copy this configuration object.** It will be needed to initialize Firebase in the application's frontend code (`src/services/firebaseConfig.js` or similar).
    *   It's recommended to use Firebase Hosting for deploying the app. Follow the instructions to install the Firebase CLI if you haven't already: `npm install -g firebase-tools`.

3.  **Initialize Firebase Services in the Project:**
    *   From your local project directory, log in to Firebase using the CLI: `firebase login`.
    *   Initialize Firebase in your project: `firebase init`.
        *   Select "Firestore: Configure security rules and indexes files for Firestore".
        *   Select "Functions: Configure and deploy Cloud Functions". (Choose TypeScript or JavaScript as preferred).
        *   Select "Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys".
            *   Choose your Firebase project created in step 1.
            *   Specify `public` as the public directory (or whichever directory you intend to use for your build output if using a framework that builds to a different directory like `dist` or `build`).
            *   Configure as a single-page app (SPA): Yes (if applicable, which is likely).
            *   Set up automatic builds and deploys with GitHub: No (for now, can be set up later).
        *   Select "Storage: Configure security rules file for Cloud Storage" if direct file uploads/downloads by users are anticipated beyond what hosting provides.
    *   This `firebase init` process will create/update `firebase.json`, `.firebaserc`, and the rules files (e.g., `firestore.rules`, `storage.rules`) in your `firebase/` directory or project root. Ensure these match the structure planned (e.g., `firebase/firestore.rules`).

4.  **Configure Firestore (Database):**
    *   In the Firebase Console, go to "Firestore Database" under the "Build" menu.
    *   Click "Create database".
    *   Start in **test mode** for initial development (allows open access). **Remember to secure your rules before production.**
    *   Choose a Cloud Firestore location (e.g., `us-central`). This cannot be changed later.
    *   The `firebase/firestore.rules` file will be used to define data validation and security. Initial test rules might be:
        ```rules
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if true; // WARNING: Open access for development
            }
          }
        }
        ```
    *   Later, these rules will be refined based on the API structure to ensure users can only access/modify their own data or public data as intended.

5.  **Configure Firebase Authentication:**
    *   In the Firebase Console, go to "Authentication" under the "Build" menu.
    *   Click "Get started".
    *   Enable the "Email/Password" sign-in method. Other providers (Google, Facebook, etc.) can be added later if desired.

6.  **Configure Firebase Functions (for API):**
    *   The `firebase init functions` step should have created a `firebase/functions` directory (or `functions` in the root, adjust paths as needed).
    *   Inside this directory, you'll write the Node.js code for your API endpoints (e.g., in `index.js` or `index.ts`).
    *   Dependencies for functions are managed in `firebase/functions/package.json`.
    *   Example function stub in `firebase/functions/index.js`:
        ```javascript
        const functions = require("firebase-functions");

        // Example: helloWorld function
        // exports.helloWorld = functions.https.onRequest((request, response) => {
        //   functions.logger.info("Hello logs!", {structuredData: true});
        //   response.send("Hello from Firebase!");
        // });

        // API endpoints for checklist, tasks, etc., will be defined here.
        ```

7.  **Firebase SDK Integration in Frontend:**
    *   Install the Firebase SDK in your frontend project: `npm install firebase` (if using npm/yarn).
    *   Create a Firebase configuration file in your frontend code (e.g., `src/services/firebaseConfig.js`) and initialize Firebase with the config object from step 2.
        ```javascript
        // src/services/firebaseConfig.js
        import { initializeApp } from "firebase/app";
        import { getAuth } from "firebase/auth";
        import { getFirestore } from "firebase/firestore";
        import { getFunctions } from "firebase/functions";

        const firebaseConfig = {
          // Your Firebase config object from the Firebase console
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const functions = getFunctions(app); // Optional: for calling Cloud Functions

        export { app, auth, db, functions };
        ```

8.  **Deployment Plan:**
    *   **Functions:** Deploy from the `firebase` directory (or project root if `functions` is there) using `firebase deploy --only functions`.
    *   **Firestore Rules:** Deploy using `firebase deploy --only firestore:rules`.
    *   **Hosting:**
        *   If using a frontend framework, build your application first (e.g., `npm run build`).
        *   Ensure `firebase.json` correctly points to your build output directory (e.g., `public`, `dist`, `build`).
        *   Deploy using `firebase deploy --only hosting`.

This plan provides a roadmap for integrating Firebase into the application. Specific implementation details will follow in subsequent development steps.
