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
}
