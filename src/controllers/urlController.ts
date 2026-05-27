import type { Request, Response } from 'express'
import { isValidAlias, isValidUrl } from '../utils/validators'
import type { UrlService } from '../services/urlService'

interface ViewModel {
  baseUrl: string
  shortUrl: string | null
  error: string | null
  urlInput: string
  aliasInput: string
  recentLinks: Array<{
    short_code: string
    original_url: string
    created_at: Date
    click_count: number
  }>
}

export interface UrlController {
  renderHome: (req: Request, res: Response) => Promise<void>
  shortenUrl: (req: Request, res: Response) => Promise<void>
  redirectShortUrl: (req: Request, res: Response) => Promise<void>
}

export function createUrlController(urlService: UrlService, baseUrl: string): UrlController {
  function createViewModel(overrides: Partial<ViewModel> = {}): ViewModel {
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

  async function renderHome(_req: Request, res: Response): Promise<void> {
    try {
      const recentLinks = await urlService.getRecentLinks()
      res.render('index', createViewModel({ recentLinks }))
      return
    } catch {
      res.status(500).render('index', createViewModel({
        error: 'Server error while loading links.',
      }))
      return
    }
  }

  async function shortenUrl(req: Request, res: Response): Promise<void> {
    const urlInput = (req.body.url || '').trim()
    const aliasInput = (req.body.alias || '').trim()

    if (!isValidUrl(urlInput)) {
      res.status(400).render('index', createViewModel({
        error: 'Please enter a valid http/https URL.',
        urlInput,
        aliasInput,
        recentLinks: await urlService.getRecentLinks(),
      }))
      return
    }

    if (aliasInput && !isValidAlias(aliasInput)) {
      res.status(400).render('index', createViewModel({
        error: 'Custom alias must be 4-32 chars and only letters, numbers, "_" or "-".',
        urlInput,
        aliasInput,
        recentLinks: await urlService.getRecentLinks(),
      }))
      return
    }

    try {
      const shortCode = await urlService.createShortUrl(urlInput, aliasInput)
      res.render('index', createViewModel({
        shortUrl: `${baseUrl}/${shortCode}`,
        urlInput,
        aliasInput,
        recentLinks: await urlService.getRecentLinks(),
      }))
      return
    } catch (error: unknown) {
      const isDuplicate = (error as { code?: string }).code === '23505'
      res.status(isDuplicate ? 400 : 500).render('index', createViewModel({
        error: isDuplicate
          ? 'This custom alias is already taken. Try another one.'
          : 'Could not shorten URL. Please try again.',
        urlInput,
        aliasInput,
        recentLinks: await urlService.getRecentLinks(),
      }))
      return
    }
  }

  async function redirectShortUrl(req: Request, res: Response): Promise<void> {
    try {
      const codeParam = req.params.code
      const code = Array.isArray(codeParam) ? codeParam[0] : codeParam
      const originalUrl = await urlService.resolveShortCode(code)
      if (!originalUrl) {
        res.status(404).send('Short URL not found.')
        return
      }
      res.redirect(originalUrl)
      return
    } catch {
      res.status(500).send('Server error.')
      return
    }
  }

  return {
    renderHome,
    shortenUrl,
    redirectShortUrl,
  }
}
