document.querySelectorAll('.copy-btn').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy')
    const initial = button.textContent

    try {
      await navigator.clipboard.writeText(value)
      button.textContent = 'Copied'
      setTimeout(() => {
        button.textContent = initial
      }, 1300)
    } catch {
      button.textContent = 'Failed'
      setTimeout(() => {
        button.textContent = initial
      }, 1300)
    }
  })
})
