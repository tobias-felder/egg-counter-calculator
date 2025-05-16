const admin = require('firebase-admin');
const serviceAccount = require('./fertility-wellness-tracker-firebase-adminsdk-fbsvc-3aac4eb80a.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupDatabase() {
  try {
    // Create a test user document with proper fields
    await db.collection('users').doc('test-user').set({
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      subscriptionStatus: 'free', // free, basic, premium
      settings: {
        notifications: true,
        emailNotifications: true,
        reminderTime: '09:00'
      }
    });

    // Create a test tracking document
    await db.collection('tracking').doc('test-tracking').set({
      userId: 'test-user',
      cycleStartDate: admin.firestore.Timestamp.fromDate(new Date()),
      cycleLength: 28,
      periodLength: 5,
      symptoms: ['cramps', 'headache'],
      notes: 'Test tracking entry',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create a test subscription document
    await db.collection('subscriptions').doc('test-subscription').set({
      userId: 'test-user',
      plan: 'premium',
      status: 'active',
      startDate: admin.firestore.Timestamp.fromDate(new Date()),
      endDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Successfully created test documents in all collections!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 