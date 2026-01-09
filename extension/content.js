// Content script to extract page info and OGP data

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    const pageInfo = extractPageInfo()
    sendResponse(pageInfo)
  }
  return true
})

function extractPageInfo() {
  const info = {
    url: window.location.href,
    title: null,
    description: null,
    image: null,
    siteName: null
  }

  // Try OGP tags first
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDescription = document.querySelector('meta[property="og:description"]')
  const ogImage = document.querySelector('meta[property="og:image"]')
  const ogSiteName = document.querySelector('meta[property="og:site_name"]')

  // Try Twitter cards as fallback
  const twitterTitle = document.querySelector('meta[name="twitter:title"]')
  const twitterDescription = document.querySelector('meta[name="twitter:description"]')
  const twitterImage = document.querySelector('meta[name="twitter:image"]')

  // Standard meta tags
  const metaDescription = document.querySelector('meta[name="description"]')

  // Title (priority: OG > Twitter > document title)
  info.title = ogTitle?.content || twitterTitle?.content || document.title || null

  // Description (priority: OG > Twitter > meta description)
  info.description = ogDescription?.content || twitterDescription?.content || metaDescription?.content || null

  // Image (priority: OG > Twitter)
  let imageUrl = ogImage?.content || twitterImage?.content || null
  if (imageUrl && !imageUrl.startsWith('http')) {
    // Make relative URLs absolute
    try {
      imageUrl = new URL(imageUrl, window.location.origin).href
    } catch (e) {
      imageUrl = null
    }
  }
  info.image = imageUrl

  // Site name
  info.siteName = ogSiteName?.content || null

  return info
}
