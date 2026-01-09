// DOM Elements
const loginForm = document.getElementById('login-form')
const addForm = document.getElementById('add-form')
const loading = document.getElementById('loading')

const serverUrlInput = document.getElementById('server-url')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('login-btn')
const loginError = document.getElementById('login-error')

const pageImage = document.getElementById('page-image')
const pageTitle = document.getElementById('page-title')
const pageUrl = document.getElementById('page-url')
const categorySelect = document.getElementById('category')
const prioritySelect = document.getElementById('priority')
const memoInput = document.getElementById('memo')
const addBtn = document.getElementById('add-btn')
const logoutBtn = document.getElementById('logout-btn')
const addError = document.getElementById('add-error')
const addSuccess = document.getElementById('add-success')

// State
let currentPageInfo = null
let categories = []

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await init()
})

async function init() {
  showSection('loading')

  const { serverUrl, token } = await chrome.storage.local.get(['serverUrl', 'token'])

  if (token && serverUrl) {
    try {
      // Verify token is still valid
      const response = await fetch(`${serverUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        await loadAddForm(serverUrl, token)
        return
      }
    } catch (e) {
      console.error('Token verification failed:', e)
    }
  }

  // Show login form
  serverUrlInput.value = serverUrl || 'http://localhost:5173'
  showSection('login-form')
}

function showSection(sectionId) {
  loginForm.classList.add('hidden')
  addForm.classList.add('hidden')
  loading.classList.add('hidden')
  document.getElementById(sectionId).classList.remove('hidden')
}

// Login
loginBtn.addEventListener('click', async () => {
  const serverUrl = serverUrlInput.value.replace(/\/$/, '')
  const email = emailInput.value
  const password = passwordInput.value

  if (!serverUrl || !email || !password) {
    showError(loginError, 'Please fill all fields')
    return
  }

  loginBtn.disabled = true
  loginBtn.textContent = 'Logging in...'
  hideError(loginError)

  try {
    const response = await fetch(`${serverUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    await chrome.storage.local.set({ serverUrl, token: data.token })
    await loadAddForm(serverUrl, data.token)
  } catch (e) {
    showError(loginError, e.message)
  } finally {
    loginBtn.disabled = false
    loginBtn.textContent = 'Login'
  }
})

// Logout
logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove(['token'])
  showSection('login-form')
})

// Load Add Form
async function loadAddForm(serverUrl, token) {
  showSection('loading')

  try {
    // Get current page info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    // Get OGP data from content script
    currentPageInfo = await chrome.tabs.sendMessage(tab.id, { action: 'getPageInfo' })

    // Display page info
    pageTitle.textContent = currentPageInfo.title || tab.title || 'Unknown'
    pageUrl.textContent = currentPageInfo.url || tab.url

    if (currentPageInfo.image) {
      pageImage.src = currentPageInfo.image
      pageImage.classList.remove('hidden')
    } else {
      pageImage.classList.add('hidden')
    }

    // Load categories
    const categoriesResponse = await fetch(`${serverUrl}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (categoriesResponse.ok) {
      const data = await categoriesResponse.json()
      categories = data.categories || []

      categorySelect.innerHTML = '<option value="">Select category</option>'
      categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = cat.id
        option.textContent = cat.name
        option.style.color = cat.color
        categorySelect.appendChild(option)
      })
    }

    showSection('add-form')
  } catch (e) {
    console.error('Failed to load add form:', e)
    // Fallback: get basic info from tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    currentPageInfo = {
      url: tab.url,
      title: tab.title,
      image: null,
      description: null,
      siteName: null
    }
    pageTitle.textContent = tab.title || 'Unknown'
    pageUrl.textContent = tab.url
    pageImage.classList.add('hidden')

    showSection('add-form')
  }
}

// Add Item
addBtn.addEventListener('click', async () => {
  const { serverUrl, token } = await chrome.storage.local.get(['serverUrl', 'token'])

  if (!serverUrl || !token) {
    showSection('login-form')
    return
  }

  addBtn.disabled = true
  addBtn.textContent = 'Adding...'
  hideError(addError)
  addSuccess.classList.add('hidden')

  try {
    const item = {
      url: currentPageInfo.url,
      name: currentPageInfo.title,
      description: currentPageInfo.description || null,
      siteName: currentPageInfo.siteName || null,
      imageUrl: currentPageInfo.image || null,
      categoryId: categorySelect.value || null,
      priority: parseInt(prioritySelect.value, 10),
      memo: memoInput.value || null
    }

    const response = await fetch(`${serverUrl}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(item)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add item')
    }

    addSuccess.textContent = 'Added to wishlist!'
    addSuccess.classList.remove('hidden')

    // Clear form
    memoInput.value = ''

    // Auto close after success
    setTimeout(() => {
      window.close()
    }, 1500)
  } catch (e) {
    showError(addError, e.message)
  } finally {
    addBtn.disabled = false
    addBtn.textContent = 'Add to Wishlist'
  }
})

// Helpers
function showError(element, message) {
  element.textContent = message
  element.classList.remove('hidden')
}

function hideError(element) {
  element.classList.add('hidden')
}
