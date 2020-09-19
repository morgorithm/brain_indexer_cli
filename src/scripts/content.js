import { ERRORS, ROUTES } from '../constants'

import { Footer } from './footer'

export class Content {
  constructor() {
    this.contentElement = document.querySelector('div#content')
    this.footerCtrl = new Footer()
    window.onhashchange = this.routeChanged.bind(this)
  }

  init() {
    this.showMain()
  }

  showMain() {
    this.contentElement.innerHTML = /* html */ `
        <h1>Hello World</h1>
      `
    this.footerCtrl.showMainButtons()
  }

  routeChanged(event) {
    const oldURL = new URL(event.oldURL)
    const newURL = new URL(event.newURL)
    const oldHash = oldURL.hash
    const newHash = newURL.hash

    if (oldHash !== newHash) {
      this.routeHandler(newHash)
    }
  }

  routeHandler(route) {
    route = route.replace(/^#/, '')

    switch (route) {
      case ROUTES.MAIN.route:
        this.showMain()
        break

      case ROUTES.CARDS.route:
        this.showCards()
        break

      case ROUTES.TRAIN.route:
        this.showTrain()
        break

      default:
        location.hash = ''
        throw new Error(ERRORS.ROUTES.FAILED_TO_FIND_ROUTE(route))
    }
  }
}
