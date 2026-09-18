export async function fetchArticleTitle(url: string) {
  if (!canFetchArticleTitle(url)) {
    return null
  }

  const response = await fetch(url, {
    headers: {
      accept: 'text/html,application/xhtml+xml',
      'user-agent': 'Reray article title fetcher',
    },
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    return null
  }

  const html = await response.text()
  const title = extractTitle(html)
  return title ? decodeHtmlEntities(title).trim().replace(/\s+/g, ' ') : null
}

export function canFetchArticleTitle(url: string) {
  const { hostname } = new URL(url)
  const host = hostname.replace(/^www\./, '')

  return (
    host === 'zenn.dev' ||
    host === 'qiita.com' ||
    host === 'note.com' ||
    host === 'dev.to' ||
    host === 'medium.com' ||
    host === 'speakerdeck.com' ||
    host === 'github.com' ||
    host === 'gist.github.com' ||
    host === 'adventar.org' ||
    host === 'connpass.com' ||
    host.endsWith('.hatenablog.com') ||
    host.endsWith('.substack.com')
  )
}

function extractTitle(html: string) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? null
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
}
