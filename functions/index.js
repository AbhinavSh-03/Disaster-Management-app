const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin SDK
initializeApp();

const db = getFirestore();

// Cloud Function to create a notification when a new incident is reported
exports.sendNotificationOnIncident = onDocumentCreated("incidents/{incidentId}", async (event) => {
  const incident = event.data.data();

  if (!incident || !incident.userId) {
    console.log("Invalid incident data");
    return;
  }

  const notification = {
    title: "New Incident Reported",
    message: `Your incident "${incident.title}" has been submitted.`,
    timestamp: new Date(),
    userId: incident.userId,
    read: false,
  };

  try {
    await db.collection("notifications").add(notification);
    console.log("Notification created successfully");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
});
