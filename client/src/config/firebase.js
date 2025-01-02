import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBXg4_hh6aqURWf-5HKoh_h9y17Q6YJOMQ",
  authDomain: "my-fsd.firebaseapp.com",
  databaseURL: "https://my-fsd-default-rtdb.firebaseio.com",
  projectId: "my-fsd",
  storageBucket: "my-fsd.firebasestorage.app",
  messagingSenderId: "440139987602",
  appId: "1:440139987602:web:72049a95c4aca4eac7c44b",
  measurementId: "G-JKXTX6S71T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);

export { auth, rtdb, storage };
export default app; 


