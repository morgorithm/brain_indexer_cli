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
        if (!category.total) {
          checkboxList += /* html */ `
          <li>
            <input type="checkbox" name="${category.name}" disabled category-id="${category.id}" />
            <span>${category.name}</span>
            <span class="align-center">${category.total}</span>
          </li>
        `
        } else {
          checkboxList += /* html */ `
          <li>
            <input type="checkbox" name="${category.name}" category-id="${category.id}" />
            <span>${category.name}</span>
            <span class="align-center">${category.total}</span>
          </li>
        `
        }
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

      const lastestCategories = JSON.parse(localStorage.getItem('latest.categories')) || []
      const checkboxes = Array.from(this.contentElement.querySelectorAll('input[type=checkbox]'))
      checkboxes.forEach((checkbox) => {
        checkbox.onchange = (e) => {
          if (e.currentTarget.name === 'checkall') {
            checkboxes.forEach((cb) => (cb.checked = e.currentTarget.checked && !cb.disabled))
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
        <form id="category-search-form">
          <fieldset>
            <legend>Category</legend>
            
            <label>
              <span>Search</span>
              <input id="category" type="search" />
            </label>
          </fieldset>
        </form>

        <form id="category-selector"></form>

        <span id="category-create-msg" style="display: none;"></span>
        
        <form id="card-mgt-form">
          <fieldset>
            <legend>Card</legend>
            
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

    const cardMgrForm = this.contentElement.querySelector('form#card-mgt-form')
    cardMgrForm.onsubmit = this.saveCard.bind(this)
    const searchInput = this.contentElement.querySelector('input#category')
    searchInput.oninput = (e) => {
      if (searchInput.value) {
        const reg = new RegExp(searchInput.value)
        this.renderCategorySelector(
          categories.filter((category) => reg.test(category.name)),
          searchInput.value
        )
      } else {
        this.renderCategorySelector(categories)
      }
    }
    searchInput.onkeypress = (e) => {
      if (e.key === 'Enter' && e.currentTarget.value && this.categoryCreatable) {
        this.saveCategory(e.currentTarget.value)
      }
    }

    this.renderCategorySelector(categories)
    this.footerCtrl.showHomeButton()
  }

  renderCategorySelector(categories, serachKeyword) {
    const categorySelector = this.contentElement.querySelector('form#category-selector')
    categorySelector.innerHTML = ''

    if (categories?.length) {
      categorySelector.style.display = 'grid'
      this.hideCreateCategoryMsg()
      categories.forEach((c) => {
        categorySelector.innerHTML += /* html */ `
          <label>
            <input type="radio" name="category" value="${c.id}" />
            <span category-id="${c.id}">${c.name}</span>
            <button class="edit-btn" category-id="${c.id}">✍️</button>
            <button class="delete-btn" category-name="${c.name}" category-id="${c.id}">⛔️</button>
          </label>
        `
      })
      Array.from(categorySelector.querySelectorAll('button.delete-btn')).forEach(
        (button) => (button.onclick = this.deleteCategory.bind(this))
      )
      Array.from(categorySelector.querySelectorAll('button.edit-btn')).forEach(
        (button) => (button.onclick = this.editCategory.bind(this))
      )
    } else {
      categorySelector.style.display = 'none'
      this.showCreateCategoryMsg(serachKeyword)
    }
  }

  async deleteCategory(e) {
    e.preventDefault()
    const button = e.currentTarget
    const categoryName = button.getAttribute('category-name')
    const categoryId = button.getAttribute('category-id')
    const isConfirm = confirm(`Are you sure to delete '${categoryName}' category?`)
    if (isConfirm) {
      await CATEGORY.deleteCategory(categoryId)
      this.showCards()
    }
  }

  async editCategory(e) {
    e.preventDefault()
    const button = e.currentTarget
    const listElement = button.parentElement

    const span = listElement.querySelector('span')
    const categoryId = span.getAttribute('category-id')
    const categoryName = span.innerText

    const input = document.createElement('input')
    input.setAttribute('category-id', categoryId)
    input.value = categoryName

    while (listElement.childElementCount) {
      listElement.removeChild(listElement.firstElementChild)
    }

    input.onkeypress = async (e) => {
      if (e.key === 'Enter') {
        if (input.value !== categoryName) {
          await CATEGORY.updateCategory(categoryId, { name: input.value })
        }
        this.showCards()
      }
    }
    input.onblur = async () => {
      if (input.value !== categoryName) {
        await CATEGORY.updateCategory(categoryId, { name: input.value })
      }
      this.showCards()
    }
    listElement.appendChild(input)
    input.select()
  }

  showCreateCategoryMsg(serachKeyword) {
    const msg = this.contentElement.querySelector('span#category-create-msg')
    msg.innerHTML = /* html */ `Press 'Enter' to create <span class="keyword">'${serachKeyword}'</span>`
    msg.style.display = 'inline'
    this.categoryCreatable = true
  }

  hideCreateCategoryMsg() {
    this.contentElement.querySelector('span#category-create-msg').style.display = 'none'
    this.categoryCreatable = false
  }

  async showTrain() {
    const checkedCheckBoxes = Array.from(this.contentElement.querySelectorAll('input[type=checkbox]')).filter(
      (cb) => cb.name !== 'checkall' && cb.checked
    )

    let categoryNames
    let categories

    if (checkedCheckBoxes?.length) {
      categories = checkedCheckBoxes.map((cb) => {
        return {
          id: Number(cb.getAttribute('category-id')),
          name: cb.name,
        }
      })

      localStorage.setItem('latest.categories', JSON.stringify(categories))
      categoryNames = categories.map((c) => c.name)
    } else {
      categories = JSON.parse(localStorage.getItem('latest.categories'))
      categoryNames = categories.map((c) => c.name)
    }

    if (!categoryNames?.length) {
      location.hash = ''
      alert('No categories selected')
    } else {
      this.clearContent()
      this.footerCtrl.showTrainButtons(this.showTrain.bind(this))

      const card = await CARD.getRandomCard(categoryNames)
      const category = categories.find((c) => c.id === card.category)

      const cardInfo = /* html */ `
        <div id="card-info">
          <span class="category">${category.name}</span>
          <span class="card">${card.name}</span>
        </div>

        <div id="card-description">
          <textarea id="description" value="${card.description}" readonly></textarea>
        </div>
      `

      this.contentElement.innerHTML = cardInfo

      const cardInfoElement = this.contentElement.querySelector('div#card-info')
      const cardDescElement = this.contentElement.querySelector('textarea#description')
      cardInfoElement.onclick = () => (cardDescElement.value = card.description)
    }
  }

  async saveCategory(name) {
    try {
      await CATEGORY.createCategory({ name })
      this.showCards()
    } catch (e) {
      alert(e.message)
    }
  }

  async saveCard(e) {
    try {
      e.preventDefault()
      const category = UTIL.serializeForm(this.contentElement.querySelector('form#category-selector'))
      if (!category.category) throw new Error('No category selected')
      const card = UTIL.serializeForm(e.currentTarget)
      await CARD.createCard({
        ...card,
        ...category,
      })
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
