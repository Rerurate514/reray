import { GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth'

export type AuthProviderName = 'google' | 'github'

export function createAuthProvider(providerName: AuthProviderName) {
  if (providerName === 'google') {
    return new GoogleAuthProvider()
  }

  if (providerName === 'github') {
    return new GithubAuthProvider()
  }
}
