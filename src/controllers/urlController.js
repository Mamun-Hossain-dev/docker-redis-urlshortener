const { isValidUrl, isValidAlias } = require('../utils/validators')

function createUrlController(urlService, baseUrl) {
  function createViewModel(overrides = {}) {
    return {
      baseUrl,
      shortUrl: null,
      error: null,
      urlInput: '',
      aliasInput: '',
      recentLinks: [],
      ...overrides,
    }
  }

  async function renderHome(req, res) {
    try {
      const recentLinks = await urlService.getRecentLinks()
      return res.render('index', createViewModel({ recentLinks }))
    } catch {
      return res.status(500).render('index', createViewModel({
        error: 'Server error while loading links.',
      }))
    }
  }

  async function shortenUrl(req, res) {
    const urlInput = (req.body.url || '').trim()
    const aliasInput = (req.body.alias || '').trim()

    if (!isValidUrl(urlInput)) {
      return res.status(400).render('index', createViewModel({
        error: 'Please enter a valid http/https URL.',
        urlInput,
        aliasInput,
        recentLinks: await urlService.getRecentLinks(),
      }))
    }

    if (aliasInput && !isValidAlias(aliasInput)) {
      return res.status(400).render('index', createViewModel({
        error: 'Custom alias must be 4-32 chars and only letters, numbers, "_" or "-".',
        urlInput,
        aliasInput,
        recentLinks: await urlService.getRecentLinks(),
      }))
    }

    try {
      const shortCode = await urlService.createShortUrl(urlInput, aliasInput)
      return res.render('index', createViewModel({
        shortUrl: `${baseUrl}/${shortCode}`,
        urlInput,
        aliasInput,
        recentLinks: await urlService.getRecentLinks(),
      }))
    } catch (error) {
      const isDuplicate = error.code === '23505'
      return res.status(isDuplicate ? 400 : 500).render('index', createViewModel({
        error: isDuplicate
          ? 'This custom alias is already taken. Try another one.'
          : 'Could not shorten URL. Please try again.',
        urlInput,
        aliasInput,
        recentLinks: await urlService.getRecentLinks(),
      }))
    }
  }

  async function redirectShortUrl(req, res) {
    try {
      const originalUrl = await urlService.resolveShortCode(req.params.code)
      if (!originalUrl) {
        return res.status(404).send('Short URL not found.')
      }
      return res.redirect(originalUrl)
    } catch {
      return res.status(500).send('Server error.')
    }
  }

  return {
    renderHome,
    shortenUrl,
    redirectShortUrl,
  }
}

module.exports = { createUrlController }
