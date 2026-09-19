export function translateCalendarActionError(message: string) {
  if (message === 'Authentication required') {
    return 'ログイン後に操作してください。'
  }

  if (message === 'Slot is not assigned to current user') {
    return 'この枠は現在のログインユーザーではキャンセルできません。ページを再読み込みしてログイン状態を確認してください。'
  }

  if (message === 'Slot is already taken') {
    return 'この枠はすでに参加済みです。ページを再読み込みしてください。'
  }

  if (message === 'Slot is already empty') {
    return 'この枠はすでに空き枠です。ページを再読み込みしてください。'
  }

  if (message === 'Slot not found') {
    return '対象の枠が見つかりませんでした。'
  }

  if (message.startsWith('Only the assigned user')) {
    return '記事を編集できるのは、この枠の担当者だけです。'
  }

  if (message.startsWith('Only the owner')) {
    return 'この操作ができるのはリレーの作成者だけです。'
  }

  if (message === 'Title is required') {
    return 'タイトルを入力してください。'
  }

  if (message.startsWith('Tag must be')) {
    return 'タグは1つ24文字以内で入力してください。'
  }

  return '操作に失敗しました。ページを再読み込みしてもう一度試してください。'
}
