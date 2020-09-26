export class Header {
  constructor() {
    this.titleElement = document.querySelector('h1#title')
    this.navigatorElement = document.querySelector('div#navigator')
    this.moveToAdmBtn = this.navigatorElement.querySelector('button#move-adm-btn')
    this.moveToAdmBtn.onclick = () => (location.href = 'admin')
  }

  setTitle(title) {
    this.titleElement.innerText = title
  }
}
