export type PublicFirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  appId: string
}

type FirebaseEnv = {
  FIREBASE_PROJECT_ID?: string
  PUBLIC_FIREBASE_API_KEY?: string
  PUBLIC_FIREBASE_AUTH_DOMAIN?: string
  PUBLIC_FIREBASE_PROJECT_ID?: string
  PUBLIC_FIREBASE_APP_ID?: string
}

export function getFirebaseProjectId(env: FirebaseEnv) {
  return env.FIREBASE_PROJECT_ID ?? env.PUBLIC_FIREBASE_PROJECT_ID ?? import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID
}

export function getPublicFirebaseConfig(env: {
  FIREBASE_PROJECT_ID?: string
  PUBLIC_FIREBASE_API_KEY?: string
  PUBLIC_FIREBASE_AUTH_DOMAIN?: string
  PUBLIC_FIREBASE_PROJECT_ID?: string
  PUBLIC_FIREBASE_APP_ID?: string
}): PublicFirebaseConfig | null {
  const viteEnv = import.meta.env
  const apiKey = env.PUBLIC_FIREBASE_API_KEY ?? viteEnv.VITE_PUBLIC_FIREBASE_API_KEY
  const appId = env.PUBLIC_FIREBASE_APP_ID ?? viteEnv.VITE_PUBLIC_FIREBASE_APP_ID
  const projectId = getFirebaseProjectId(env)
  const authDomain = env.PUBLIC_FIREBASE_AUTH_DOMAIN ?? viteEnv.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN ?? (projectId ? `${projectId}.firebaseapp.com` : undefined)

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null
  }

  return {
    apiKey,
    authDomain,
    projectId,
    appId,
  }
}
