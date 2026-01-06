import axios from 'axios'
import * as cheerio from 'cheerio'

export interface OgpData {
  title: string | null
  description: string | null
  siteName: string | null
  url: string
}

export async function fetchOgp(url: string): Promise<OgpData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
      timeout: 10000,
      maxRedirects: 5,
    })

    const $ = cheerio.load(response.data)

    // Get OGP data
    const ogTitle = $('meta[property="og:title"]').attr('content')
    const ogDescription = $('meta[property="og:description"]').attr('content')
    const ogSiteName = $('meta[property="og:site_name"]').attr('content')

    // Fallbacks
    const title = ogTitle || $('title').text() || null
    const description = ogDescription || $('meta[name="description"]').attr('content') || null
    const siteName = ogSiteName || null

    return {
      title,
      description,
      siteName,
      url,
    }
  } catch (error) {
    console.error('OGP fetch error:', error)
    return {
      title: null,
      description: null,
      siteName: null,
      url,
    }
  }
}
