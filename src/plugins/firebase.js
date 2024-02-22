import firebase from 'firebase/app'
import 'firebase/firebase-messaging'
import env from '../services/env'

// firebase config goes here
const config = {
  appId: env.firebaseAppId,
  projectId: env.firebaseProjectId,
  apiKey: env.firebaseApiKey,
  messagingSenderId: env.firebaseMessagingSenderId,
}

// firebase init goes here
firebase.initializeApp(config)

// firebase utils goes here

// date issue fix according to firebase goes here

// firebase collections goes here

export default firebase
