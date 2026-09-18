import { FirebaseError } from 'firebase/app'

export function translateFirebaseError(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return 'ログインに失敗しました'
  }

  if (error.code === 'auth/account-exists-with-different-credential') {
    return '同じメールアドレスの別ログイン方法が既に使われています。'
  }

  if (error.code === 'auth/unauthorized-domain') {
    return 'このドメインが Firebase Auth で許可されていません。'
  }

  if (error.code === 'auth/operation-not-allowed') {
    return 'Firebase Auth でログインプロバイダが有効になっていません。'
  }

  if (error.code === 'auth/popup-closed-by-user') {
    return 'ログイン画面が閉じられました。'
  }

  return `ログインに失敗しました: ${error.code}`
}
