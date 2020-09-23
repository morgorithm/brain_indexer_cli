import { UTIL } from '../../utils'

export const CARD = {
  createCard: async (card) => {
    const res = await fetch('app/card/', {
      method: 'POST',
      body: JSON.stringify(card),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFTOKEN': UTIL.getCSRFToken(),
      },
    })

    if (!res.ok) {
      alert(res.statusText)
    }
  },

  getRandomCard: async (categories) => {
    const categoriesName = categories.map((element) => element.name)

    const res = await fetch(
      'app/random?' +
        new URLSearchParams({
          category: categoriesName,
        })
    )

    if (!res.ok) {
      alert(res.statusText)
    } else {
      return await res.json()
    }
  },
}
