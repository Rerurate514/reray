export function translateCreateError(message: string) {
  if (message === 'Authentication required') {
    return 'ログイン後にリレーを作成してください。'
  }

  if (message === 'Invalid date range') {
    return '開始日と終了日を確認してください。'
  }

  if (message === 'No slots generated') {
    return '指定された期間では枠を作成できませんでした。'
  }

  if (message === 'Title is required') {
    return 'タイトルを入力してください。'
  }

  if (message === 'Title must be 120 characters or fewer') {
    return 'タイトルは120文字以内で入力してください。'
  }

  if (message === 'Description must be 2000 characters or fewer') {
    return '説明は2000文字以内で入力してください。'
  }

  if (message.startsWith('Too many slots')) {
    return '枠が多すぎます。期間を短くしてください（最大366枠）。'
  }

  if (message.startsWith('Tag must be')) {
    return 'タグは1つ24文字以内で入力してください。'
  }

  return 'リレーの作成に失敗しました。期間を短くするか、もう一度試してください。'
}
