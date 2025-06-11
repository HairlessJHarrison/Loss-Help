// firebase/functions/index.js
const functions = require("firebase-functions");
// const admin = require("firebase-admin"); // Uncomment if you need admin SDK features
// admin.initializeApp(); // Uncomment if you need admin SDK features

/**
 * HTTPS Callable function to simulate sending a checklist email.
 * @param {object} data - Data passed from the client. Expected: { email: string }
 * @param {functions.https.CallableContext} context - Context of the function call.
 * @returns {Promise<object>} - A promise that resolves with a result object.
 */
exports.sendChecklistEmail = functions.https.onCall(async (data, context) => {
  const email = data.email;

  // Basic validation
  if (!email || !email.includes('@')) {
    functions.logger.error("Validation failed: Invalid email provided.", email);
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a valid "email" argument.'
    );
  }

  functions.logger.info(`Simulating email send to: ${email}`);

  // Simulate sending email (in a real app, integrate with an email service here)
  // For example, using Nodemailer with an SMTP service, or an API like SendGrid.
  // await sendEmailActual(email, "Your Checklist", "Here is your checklist...");

  // Return a success response
  return {
    success: true,
    message: `Checklist simulation: Email would be sent to ${email}`
  };
});

// Example of another callable function (can be removed if not needed)
// exports.helloWorld = functions.https.onCall((data, context) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   return { message: "Hello from Firebase Cloud Functions!" };
// });
