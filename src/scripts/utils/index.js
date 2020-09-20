export const UTIL = {
  serializeForm: (form) => {
    const formData = new FormData(form)
    return Object.fromEntries(formData.entries())
  },
  getFormData: (form) => {
    return new FormData(form)
  },
}
