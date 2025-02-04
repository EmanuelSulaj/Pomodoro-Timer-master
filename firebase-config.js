// Remove any imports since we're using the CDN version
const firebaseConfig = {
    apiKey: "AIzaSyAJ47oAhXxL2x6gKpLUVw99-8bBO429Hz8",
    authDomain: "pomodoro-timer-af0b2.firebaseapp.com",
    databaseURL: "https://pomodoro-timer-af0b2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pomodoro-timer-af0b2",
    storageBucket: "pomodoro-timer-af0b2.firebasestorage.app",
    messagingSenderId: "746972035526",
    appId: "1:746972035526:web:7adbe400b9a5ddc70f1ac7",
    measurementId: "G-RN1ES031EZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const database = firebase.database();

console.log('Firebase initialized');