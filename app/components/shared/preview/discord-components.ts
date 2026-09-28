export type DiscordComponent = Record<string, unknown>;

/**
 * Discord のリンクプレビューで使われる Components V2 のペイロードを組み立てる。
 * 実際に Discord 側が読むのは `<script id="discord:component-embed">` の中身。
 */
export function discordContainer({
  accentColor,
  components,
}: {
  accentColor: number;
  components: DiscordComponent[];
}): DiscordComponent {
  return { type: 17, accent_color: accentColor, components };
}

export function discordSection({
  accessory,
  content,
}: {
  accessory?: DiscordComponent;
  content: string;
}): DiscordComponent {
  return {
    type: 9,
    components: [discordTextDisplay(content)],
    ...(accessory ? { accessory } : {}),
  };
}

export function discordTextDisplay(content: string): DiscordComponent {
  return { type: 10, content };
}

export function discordSeparator(spacing = 1): DiscordComponent {
  return { type: 14, spacing };
}

export function discordActionRow(
  buttons: DiscordComponent[],
): DiscordComponent {
  return { type: 1, components: buttons };
}

export function discordLinkButton({
  label,
  url,
}: {
  label: string;
  url: string;
}): DiscordComponent {
  return { type: 2, style: 5, url, label };
}

export function discordMediaGallery(url: string): DiscordComponent {
  return { type: 12, items: [{ media: { url } }] };
}

export function serializeDiscordComponentEmbed(
  container: DiscordComponent,
): string {
  return JSON.stringify({ component: container })
    .replace(/<\//g, "<\\/")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
