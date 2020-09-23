export class Footer {
  constructor() {
    this.footerElement = document.querySelector('div#footer')
  }

  showMainButtons() {
    const movetToCardMgtButton = this.buttonFactory(
      {
        click: () => (location.hash = 'cards'),
      },
      'New card'
    )
    const moveToTrainingButton = this.buttonFactory(
      {
        click: () => (location.hash = 'train'),
      },
      'Train'
    )

    const buttonContainer = this.buttonContainerFactory()
    buttonContainer.appendChild(movetToCardMgtButton)
    buttonContainer.appendChild(moveToTrainingButton)
    this.footerElement.innerHTML = ''
    this.footerElement.append(buttonContainer)
  }

  showTrainButtons(handler) {
    const goNextButtton = this.buttonFactory({ click: handler }, 'Next')
    const moveHomeButton = this.buttonFactory({ click: () => (location.hash = '') }, 'Home')

    const buttonContainer = this.buttonContainerFactory()
    buttonContainer.appendChild(goNextButtton)
    buttonContainer.appendChild(moveHomeButton)
    this.footerElement.innerHTML = ''
    this.footerElement.append(buttonContainer)
  }

  showHomeButton() {
    const moveHomeButton = this.buttonFactory(
      {
        click: () => (location.hash = ''),
      },
      'Home'
    )

    const buttonContainer = this.buttonContainerFactory()
    buttonContainer.appendChild(moveHomeButton)
    this.footerElement.innerHTML = ''
    this.footerElement.append(buttonContainer)
  }

  buttonContainerFactory() {
    const buttonContainer = document.createElement('div')
    buttonContainer.id = 'button-container'
    return buttonContainer
  }

  buttonFactory(handler, text, type) {
    const button = document.createElement('button')
    button.innerText = text

    for (const evt in handler) {
      button.addEventListener(evt, handler[evt])
    }

    if (type) {
      button.classList.add(type)
    }

    return button
  }
}
