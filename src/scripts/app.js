import { sayHello } from './view'

class App {
  constructor() {
    console.log('test')
  }

  init() {
    const set = new Set([1, 2, 3, 4, 5])
    sayHello(set)
  }
}

const app = new App()
app.init()
