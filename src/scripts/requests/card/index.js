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
    console.log('Target categories are', categories)
    console.log('Dev code')

    try {
      const res = await fetch('app/card/4')

      if (!res.ok) {
        throw new Error('Faield to get random card')
      } else {
        return await res.json()
      }
    } catch (e) {
      throw e
    }
  },
}
