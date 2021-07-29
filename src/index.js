const render = require('./render').default
const { getConfigurationInterface } = require('./utils')


const defaultConfig = ({ foregroundColor, colors }) => ({
  itemTextSize:             1,
  itemTextColor:            foregroundColor,
  itemTextColorHover:       colors.lightWhite,
  itemBackgroundColor:      'transparent',
  itemBackgroundColorHover: colors.lightBlack,
  gutter:                   1,
  height:                   80,
  items:                    {},
})


function run (command, uid) {
  Window.exec(command, uid)
}


class ToolbarItem {

  constructor (item) {
    this.children = item.text
    this.action   = item.action
    this.icon     = item.icon || null
    this.iconset  = item.iconset || 'md'
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
    items = (data instanceof Array
      ? data : Object.entries(data).map(([ text, action ]) => ({ key, action })))
      .map((item) => new ToolbarItem(item))

  return items
}


exports.decorateConfig = (config) => {
  const toolbar = Object.assign({}, defaultConfig(config), config.toolbar || {})
  const finalConf = Object.assign({}, config, { toolbar })
  console.log(finalConf)
  return finalConf
}


exports.mapTermsState = function mapTermsState (state, map) {
  let toolbar = {}
  let conf = Object.assign({}, defaultConfig(map), config.getConfig().toolbar || {})

  for (const key of Object.keys(conf).filter(key => key !== 'items'))
    toolbar[key] = conf[key]

  const props = Object.assign({}, map, {
    toolbar,
    items: resolveToolbarItems(conf.items),
  })
  return props
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
