const w = Symbol('window-reference')

export default class ToolbarPlugin {


  constructor () {
    this[w] = null
  }

  set window (value) {
    this[w] = value
  }

  get window () {
    return this[w]
  }
}
