import { UTIL } from '../../utils'

export const CATEGORY = {
  getCategories: async () => {
    const res = await fetch('app/category/')

    if (!res.ok) {
      alert(res.statusText)
    } else {
      return await res.json()
    }
  },

  createCategory: async (category) => {
    const res = await fetch('app/category/', {
      method: 'POST',
      body: JSON.stringify(category),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFTOKEN': UTIL.getCSRFToken(),
      },
    })

    if (!res.ok) {
      alert(res.statusText)
    }
  },

  updateCategory: async (id, category) => {
    const res = await fetch(`app/category/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(category),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFTOKEN': UTIL.getCSRFToken(),
      },
    })
    if (!res.ok) {
      alert(rese.statusText)
    }
  },

  deleteCategory: async (id) => {
    const res = await fetch(`app/category/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFTOKEN': UTIL.getCSRFToken(),
      },
    })

    if (!res.ok) {
      alert(res.statusText)
    }
  },
}
