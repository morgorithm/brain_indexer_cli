export const Auth = {
  checkAuth: async () => {
    try {
      const res = await fetch('admin/login/', {
        method: 'POST',
        body: JSON.stringify({
          name: 'admin',
          password: '1',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return res
    } catch (e) {
      throw e
    }
  },
}

export const CATEGORY = {
  getCategories: async () => {
    try {
      const res = await fetch('app/category/')
      return await res.json()
    } catch (e) {
      throw e
    }
  },

  createCategory: async (category) => {
    try {
      const res = await fetch('app/category/', {
        method: 'POST',
        body: JSON.stringify(category),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': getCSRFToken(),
        },
      })

      if (!res.ok) {
        throw new Error('Failed to create category')
      }
    } catch (e) {
      throw e
    }
  },
}

export const CARD = {
  createCard: async (card) => {
    try {
      const res = await fetch('app/card/', {
        method: 'POST',
        body: JSON.stringify(card),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': getCSRFToken(),
        },
      })

      if (!res.ok) {
        throw new Error('Failed to create card')
      }
    } catch (e) {
      throw e
    }
  },
}

function getCSRFToken() {
  const name = 'csrftoken'
  let csrfToken = null

  if (document.cookie) {
    let cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim()

      if (cookie.substring(0, name.length + 1) === name + '=') {
        csrfToken = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }

  return csrfToken
}
