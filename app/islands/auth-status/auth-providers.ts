import { GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth'

export type AuthProviderName = 'google' | 'github'

export function createAuthProvider(providerName: AuthProviderName) {
  switch (providerName) {
    case 'google':
      return new GoogleAuthProvider()
    case 'github':
      return new GithubAuthProvider()
  }
}
