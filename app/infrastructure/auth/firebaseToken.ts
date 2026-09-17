import { createRemoteJWKSet, jwtVerify } from 'jose'

const firebaseJwks = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'))

export type VerifiedFirebaseToken = {
  uid: string
  name?: string
  picture?: string
  email?: string
}

export async function verifyFirebaseIdToken(idToken: string, projectId: string): Promise<VerifiedFirebaseToken> {
  const { payload } = await jwtVerify(idToken, firebaseJwks, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  })

  if (!payload.sub) {
    throw new Error('Firebase token does not include subject')
  }

  return {
    uid: payload.sub,
    name: typeof payload.name === 'string' ? payload.name : undefined,
    picture: typeof payload.picture === 'string' ? payload.picture : undefined,
    email: typeof payload.email === 'string' ? payload.email : undefined,
  }
}
