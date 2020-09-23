import { UTIL } from '../../utils'

export const CARD = {
  createCard: async (card) => {
    try {
      const res = await fetch('app/card/', {
        method: 'POST',
        body: JSON.stringify(card),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': UTIL.getCSRFToken(),
        },
      })

      if (!res.ok) {
        throw new Error('Failed to create card')
      }
    } catch (e) {
      throw e
    }
  },

  getRandomCard: async (categories) => {
    const categoriesName = categories.map((element) => element.name)

    try {
      const res = await fetch(
        'app/random?' +
          new URLSearchParams({
            category: categoriesName,
          })
      )

      if (!res.ok) {
        throw new Error('Failed to get random card')
      } else {
        return await res.json()
      }
    } catch (e) {
      throw e
    }
  },
}
