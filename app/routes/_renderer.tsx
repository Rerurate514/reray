import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

const defaultTitle = 'Reray'
const defaultDescription = 'Reray は、いつでも作れる記事リレーサービスです。'
const themeColor = '#20201d'

export default jsxRenderer(({ children, description, discordComponentEmbed, image, title, url }) => {
  const pageTitle = title ?? defaultTitle
  const pageDescription = description ?? defaultDescription

  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:site_name" content="Reray" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        {url ? <meta property="og:url" content={url} /> : null}
        {image ? <meta property="og:image" content={image.url} /> : null}
        {image ? <meta property="og:image:width" content={String(image.width)} /> : null}
        {image ? <meta property="og:image:height" content={String(image.height)} /> : null}
        {image?.alt ? <meta property="og:image:alt" content={image.alt} /> : null}
        <meta name="theme-color" content={themeColor} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {image ? <meta name="twitter:image" content={image.url} /> : null}
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        {discordComponentEmbed ? (
          <script
            id="discord:component-embed"
            type="application/json"
            dangerouslySetInnerHTML={{ __html: discordComponentEmbed }}
          />
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  )
})
