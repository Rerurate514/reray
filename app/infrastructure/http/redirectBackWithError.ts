export function redirectBackWithError(requestUrl: string, referer: string | undefined, key: string, message: string) {
  const url = new URL(referer ?? '/my-schedule', requestUrl)
  url.searchParams.set(key, message)
  return Response.redirect(url.toString(), 303)
}
