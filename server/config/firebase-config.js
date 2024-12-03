const admin = require('firebase-admin');
const serviceAccount = require('./keys/serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://my-fsd-default-rtdb.firebaseio.com'
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

module.exports = admin; 






