/**
 * Attempt to copy text to clipboard.
 * Uses the modern async Clipboard API when available in a secure context,
 * otherwise falls back to the legacy textarea + execCommand approach.
 */
async function copyToClipboard(text) {
  // Try the modern async Clipboard API first (works on localhost & HTTPS)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to fallback
    }
  }

  // Fallback: create a temporary off-screen textarea
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  textarea.style.left = '-9999px'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)

  try {
    textarea.focus()
    textarea.select()
    const success = document.execCommand('copy')
    return success
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

document.querySelectorAll('.copy-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy')
    const initial = button.textContent

    const ok = await copyToClipboard(value)
    button.textContent = ok ? 'Copied' : 'Failed'
    setTimeout(() => {
      button.textContent = initial
    }, 1300)
  })
})
