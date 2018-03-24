// const ToolbarPlugin = require('../dist/ToolbarPlugin').default
const render = require('../dist/render').default
const { getConfigurationInterface } = require('../dist/utils')

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


function run (command, uid) {
  Window.exec(command, uid)
}


class ToolbarItem {

  constructor (key, action) {
    this.children = key
    this.action = action
  }

  get command () {
    if (typeof this.action === 'string')
      return this.action

    // FIXME
    if (typeof this.action === 'function')
      return 'should run: ' + this.action.name
  }

}


function resolveToolbarItems (data) {
  let items

  if (typeof data === 'object')
    if (data instanceof Array)
      items = data
    else
      items = Object
        .entries(data)
        .map(([ key, action ]) =>
        new ToolbarItem(key, action))

  return items
}


const defaultConfig = {
  toolbarItemBackgroundColorHover: '#4c23f1',
  toolbarItemBackgroundColor:      'rgba(98, 83, 161, 0.17)',
  toolbarHeight:                   80,
  toolbarItems:                    [],
  itemGutter:                      1,
}


exports.decorateConfig = (config) =>
  Object.assign({}, defaultConfig, config)


exports.mapTermsState = function mapTermsState (state, map) {
  const conf = getConfigurationInterface().getConfig()
  const toolbarItems = resolveToolbarItems(conf.toolbarItems || defaultConfig.toolbarItems)
  const { toolbarItemBackgroundColor, toolbarItemBackgroundColorHover } = conf

  return Object.assign({}, map, {
    toolbarItems,
    toolbarItemBackgroundColor,
    toolbarItemBackgroundColorHover
  })
}


exports.mapTermsDispatch = (dispatch, map) => Object.assign({}, map, {
  runShellCommand: cmd => run(cmd)
})


exports.decorateTerms = (ComponentClass, { React }) =>
  render(ComponentClass, React)


exports.middleware = (store) => (next) => (action) => {
  if (!Window.state)
    Object.defineProperty(Window, 'state', { get: store.getState })
  next(action)
}


exports.onWindow = win =>
  win.rpc.on('execute commands', ({ uid, cmd }) => win
    .sessions
    .get(uid)
    .write(cmd.toString() + '\r'))


function waitFor (object, key, fn) {
  if (key in object) fn(object[key])
  else setTimeout(() => waitFor(object, key, fn), 10)
}


const Window = new class {

  get uid () {
    return this.state.sessions.activeUid
  }

  exec (cmd, uid) {
    uid = uid || this.uid
    console.log(this, 'executing command', cmd)
    this.rpc.emit('execute commands', { uid, cmd })
  }

}()

exports.onRendererWindow = win => {
  const onRpc = (eventName) => rpc => rpc.on(eventName, () => Window.rpc = rpc)
  waitFor(win, 'rpc', onRpc('session add'))
}
