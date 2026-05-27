export function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidAlias(value: string): boolean {
  return /^[a-zA-Z0-9_-]{4,32}$/.test(value)
}
