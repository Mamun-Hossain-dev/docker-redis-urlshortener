function isValidUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function isValidAlias(value) {
  return /^[a-zA-Z0-9_-]{4,32}$/.test(value)
}

module.exports = { isValidUrl, isValidAlias }
