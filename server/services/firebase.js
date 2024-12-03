const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

const initializeFirebase = () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
    return admin;
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
};

module.exports = initializeFirebase(); 