export type PublicFirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  appId: string
}

export function getPublicFirebaseConfig(env: {
  PUBLIC_FIREBASE_API_KEY?: string
  PUBLIC_FIREBASE_AUTH_DOMAIN?: string
  PUBLIC_FIREBASE_PROJECT_ID?: string
  PUBLIC_FIREBASE_APP_ID?: string
}): PublicFirebaseConfig | null {
  if (!env.PUBLIC_FIREBASE_API_KEY || !env.PUBLIC_FIREBASE_AUTH_DOMAIN || !env.PUBLIC_FIREBASE_PROJECT_ID || !env.PUBLIC_FIREBASE_APP_ID) {
    return null
  }

  return {
    apiKey: env.PUBLIC_FIREBASE_API_KEY,
    authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
    appId: env.PUBLIC_FIREBASE_APP_ID,
  }
}
