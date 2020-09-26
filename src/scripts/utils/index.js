export const UTIL = {
  serializeForm: (form) => {
    const formData = new FormData(form)
    return Object.fromEntries(formData.entries())
  },
  getFormData: (form) => {
    return new FormData(form)
  },
  getCSRFToken: () => {
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
  },
  isDjangoLoggedIn: async () => {
    const res = await fetch('app/checkLogin')

    if (!res.ok) {
      alert(res.statusText)
    } else {
      if (res.redirected) {
        window.location.href = await res.url
      }
    }
  },
}
