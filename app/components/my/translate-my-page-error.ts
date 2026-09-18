export function translateMyPageError(message: string) {
  if (message === 'Authentication required') {
    return 'ログイン後に操作してください。'
  }

  if (message === 'Slot is not assigned to current user') {
    return 'この枠は現在のログインユーザーではキャンセルできません。ページを再読み込みしてログイン状態を確認してください。'
  }

  if (message.startsWith('Only the assigned user')) {
    return '記事を編集できるのは、この枠の担当者だけです。'
  }

  if (message === 'Article URL is already registered') {
    return 'このURLはすでに別の担当枠に登録されています。'
  }

  if (message === 'Display name is required') {
    return '表示名を入力してください。'
  }

  return '操作に失敗しました。ページを再読み込みしてもう一度試してください。'
}
