import firebase from "firebase";

//Firebase configuration, specifies the database and provides an apiKey
const firebaseConfig = {
  apiKey: "AIzaSyA6LPH3154I3LAHtgBTZYyLEP7JAuPvg2k",
  authDomain: "recipely-8c1d4.firebaseapp.com",
  projectId: "recipely-8c1d4",
  storageBucket: "recipely-8c1d4.appspot.com",
  messagingSenderId: "413880662627",
  appId: "1:413880662627:web:037cb6c9c724625d789656"
};


const firebaseApp = firebase.initializeApp(firebaseConfig)
//connections to Firestore, Firebase auth and cloud storage
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

//exportet to be used in the rest of the code
export { db, auth, provider, storage }
