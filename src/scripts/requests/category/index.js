import { UTIL } from '../../utils'

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
          'X-CSRFTOKEN': UTIL.getCSRFToken(),
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
