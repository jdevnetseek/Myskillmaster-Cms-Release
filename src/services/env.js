import Vue from 'vue'

const env = {
  apiUrl: process.env.VUE_APP_API_URL || 'https://baseplate-api.test/api/v1',
  firebaseAppId: process.env.VUE_APP_FIREBASE_APP_ID || '',
  firebaseProjectId: process.env.VUE_APP_FIREBASE_PROJECT_ID || '',
  firebaseApiKey: process.env.VUE_APP_FIREBASE_API_KEY || '',
  firebaseMessagingSenderId: process.env.VUE_APP_FIREBASE_SENDER_ID || '',
}

Vue.prototype.$env = env

export default env
