import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const requiredEnv = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]

const missingEnv = requiredEnv.filter((k) => !import.meta.env[k])
const looksLikePlaceholder =
  String(import.meta.env.VITE_FIREBASE_API_KEY || '').toUpperCase().includes('YOUR_') ||
  String(import.meta.env.VITE_FIREBASE_API_KEY || '').toUpperCase().includes('REPLACE_')

export const firebaseConfigError =
  missingEnv.length > 0 || looksLikePlaceholder
    ? {
        message:
          'Firebase is not configured. Add Vite env vars in a .env file (see .env.example).',
        missingEnv,
      }
    : null

export const isFirebaseConfigured = !firebaseConfigError

export const firebaseConfig = isFirebaseConfigured
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    }
  : null

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

export async function initAnalytics() {
  if (!app) return null
  if (!import.meta.env.PROD) return null
  if (!(await isSupported())) return null
  return getAnalytics(app)
}

