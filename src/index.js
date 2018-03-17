// const ToolbarPlugin = require('../dist/ToolbarPlugin').default
const render = require('../dist/render').default
const { runShell, configuration } = require('../dist/utils')

// function getPlugin () {
//   return plugin || (plugin = new ToolbarPlugin())
// }
//
// function clearPlugin () {
//   if (plugin.dispose)
//     plugin.dispose()
//   if (plugin)
//     plugin = null
// }

class ToolbarItem {
  constructor (text, action) {
    this.clickHandler = action
    this.children     = text
  }

  get onClick () {
    if (typeof this.clickHandler === 'string')
      return () => runShell(this.clickHandler)
    if (typeof this.clickHandler === 'function')
      return this.clickHandler
  }
}

const defaultConfig = {
  toolbarItems: [
    new ToolbarItem('Pressme', () => alert("Paska xd"))
  ],
}

exports.decorateConfig = function decorateConfig (config) {
  config = Object.assign({}, defaultConfig, config)
  return config
}

exports.mapTermsState = function mapTermsState (state, map) {
  const toolbarItems = configuration.toolbarItems || defaultConfig.toolbarItems
  return Object.assign({}, map, { toolbarItems })
}

exports.decorateTerms = function decorateHyper (ComponentClass, { React }) {
  return render(ComponentClass, React)
}
