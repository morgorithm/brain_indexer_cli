export class Header {
  constructor() {
    this.titleElement = document.querySelector('h1#title')
  }

  setTitle(title) {
    this.titleElement.innerText = title
  }
}
