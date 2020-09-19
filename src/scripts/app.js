import '../assets/styles/shared-style.css'

import { Content } from './content'

class App {
  constructor() {
    this.contentCtrl = new Content()
  }

  init() {
    this.contentCtrl.init()
  }
}

window.onload = () => {
  const app = new App()
  app.init()
}
