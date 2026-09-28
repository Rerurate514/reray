export function createDateRangeText(
  startDate: string | null,
  endDate: string | null,
) {
  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }

  return startDate ?? endDate ?? null;
}

export function createDiscordField(label: string, value: string) {
  return `**${label}**\n${value}`;
}

export function trimUtf8(value: string, maxBytes: number) {
  const encoder = new TextEncoder();

  if (encoder.encode(value).length <= maxBytes) {
    return value;
  }

  let result = "";

  for (const char of value) {
    const next = `${result}${char}`;
    if (encoder.encode(`${next}…`).length > maxBytes) {
      return `${result}…`;
    }
    result = next;
  }

  return result;
}

export function escapeDiscordMarkdown(value: string) {
  return value.replace(/([\\`*_{}[\]()#+\-.!|>])/g, "\\$1");
}
