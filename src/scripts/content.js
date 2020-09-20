import { CARD, CATEGORY } from './requests'
import { ERRORS, ROUTES } from '../constants'

import { Footer } from './footer'
import { UTIL } from './utils'

export class Content {
  constructor() {
    this.contentElement = document.querySelector('div#content')
    this.footerCtrl = new Footer()
    window.onhashchange = this.routeChanged.bind(this)
  }

  async init() {
    this.routeHandler(location.hash)
  }

  async showMain() {
    this.clearContent()
    const categories = await CATEGORY.getCategories()

    if (categories?.length) {
      let checkboxList = ''
      categories.forEach((category) => {
        checkboxList += /* html */ `
          <li>
            <input type="checkbox" name="${category.name}" />
            <span>${category.name}</span>
            <span class="align-center">${category.total}</span>
          </li>
        `
      })

      this.contentElement.innerHTML = /* html */ `
        <div id="main">
          <ul id="category-list">
            <li class="header">
              <input type="checkbox" name="checkall" />
              <span>Category</span>
              <span>Total cards</span>
            </li>
            ${checkboxList}
          </ul>
        </div>
      `

      const lastestCategories =
        JSON.parse(localStorage.getItem('latest.categories')) || []
      const checkboxes = Array.from(
        this.contentElement.querySelectorAll('input[type=checkbox]')
      )
      checkboxes.forEach((checkbox) => {
        checkbox.onchange = (e) => {
          if (e.currentTarget.name === 'checkall') {
            checkboxes.forEach((cb) => (cb.checked = e.currentTarget.checked))
          }
        }

        if (lastestCategories.indexOf(checkbox.name) >= 0) {
          checkbox.checked = true
        }
      })
    } else {
      this.contentElement.innerHTML = /* html */ `
        <div id="no-card-msg-box">
          <h3>You don't have any cards yet!</h3>
          <span>Please add your card list by clicking below 'Cards' button</span>
        </div>
      `
    }
    this.footerCtrl.showMainButtons()
  }

  async showCards() {
    this.clearContent()
    const categories = await CATEGORY.getCategories()

    this.contentElement.innerHTML = /* html */ `
      <div id="card-management">
        <form id="category-mgt-form">
          <fieldset>
            <legend>Category</legend>

            <label>
              <span>Name</span>
              <input name="name" placeholder="Category name" required />
            </label>

            <button>Save</button>
          </fieldset>
        </form>

        <form id="card-mgt-form">
          <fieldset>
            <legend>Card</legend>

            <label>
              <span>Category</span>
              <select id="category-selector" name="category">
              </select>
            </label>

            <label>
              <span>Name</span>
              <input name="name" placeholder="Card name" required />
            </label>

            <label class="textarea-field">
              <span>Description</span>
              <textarea name="description" placeholder="Detail description about this card" required></textarea>
            </label>

            <button>Save</button>
          </fieldset>
        </form>
      </div>
    `

    const categoryMgtForm = this.contentElement.querySelector(
      'form#category-mgt-form'
    )
    categoryMgtForm.onsubmit = this.saveCategory.bind(this)

    const cardMgrForm = this.contentElement.querySelector('form#card-mgt-form')
    cardMgrForm.onsubmit = this.saveCard.bind(this)

    const categorySelector = this.contentElement.querySelector(
      'select#category-selector'
    )
    categories.forEach((category) =>
      categorySelector.add(new Option(category.name, category.id))
    )

    this.footerCtrl.showBackButton()
  }

  showTrain() {
    const checkedCheckBoxes = Array.from(
      this.contentElement.querySelectorAll('input[type=checkbox]')
    ).filter((cb) => cb.name !== 'checkall' && cb.checked)

    if (!checkedCheckBoxes?.length) {
      location.hash = ''
      alert('No categories selected')
    } else {
      const lastestCategories = checkedCheckBoxes.map((cb) => cb.name)
      localStorage.setItem(
        'latest.categories',
        JSON.stringify(lastestCategories)
      )

      this.clearContent()
      this.footerCtrl.showTrainButtons()

      console.log('Call random card by category')
    }
  }

  async saveCategory(e) {
    try {
      e.preventDefault()
      const category = UTIL.serializeForm(e.currentTarget)
      await CATEGORY.createCategory(category)
      this.showCards()
    } catch (e) {
      alert(e.message)
    }
  }

  async saveCard(e) {
    try {
      e.preventDefault()
      const card = UTIL.serializeForm(e.currentTarget)
      await CARD.createCard(card)
      this.showCards()
    } catch (e) {
      alert(e.message)
    }
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

  clearContent() {
    this.contentElement.innerHTML = ''
    this.footerCtrl.footerElement.innerHTML = ''
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
