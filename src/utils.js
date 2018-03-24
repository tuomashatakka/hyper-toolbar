
export function getConfigurationInterface () {
  console.log("Resolving config", window.config)
  if (typeof window === 'object' && window.config)
    return window.config

  const elc = require('electron')
  const app = elc.remote ? elc.remote.app : {}

  return app.config || { getConfig: () => ({}) }
}

// eslint-disable-next-line
export function runShell (command) {
  const [ cmd, ...args ] = command.replace(/\s+/, ' ').trim().split(' ')
  return require('child_process').spawn(cmd, args)
}


Object.defineProperty(module.exports, 'configuration', {
  get: () => getConfigurationInterface().getConfig()
})
