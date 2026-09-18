import { GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth'

export type AuthProviderName = 'google' | 'github' | 'twitter'

export function createAuthProvider(providerName: AuthProviderName) {
  if (providerName === 'google') {
    return new GoogleAuthProvider()
  }

  if (providerName === 'github') {
    return new GithubAuthProvider()
  }

  return new TwitterAuthProvider()
}
