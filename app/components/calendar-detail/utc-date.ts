export function getUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`).getUTCDate()
}

export function getUtcWeekday(date: string) {
  return new Date(`${date}T00:00:00.000Z`).getUTCDay()
}
