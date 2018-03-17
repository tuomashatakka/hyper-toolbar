const fs       = require('fs')
const path     = require('path')
const babel    = require('@babel/core')

const basepath = __dirname + '/..'
const options  = {
  extends: basepath + '/.babelrc'
}
const srcPath = basepath + '/src'


function recurseDirectory (dir) {
  const entries = fs.readdirSync(dir)

  return entries
    .map(name => srcPath + '/' + name)
    .map(entry => {
      const stats = fs.statSync(entry)
      if (stats.isDirectory())
        return recurseDirectory()
      else if (stats.isFile())
        return [ transpile(entry) ]
    })
    .reduce((arr, entry) => arr.concat(entry), [])
}

async function transpile (filepath) {
  return new Promise((resolve, reject) =>
    babel.transformFile(filepath, (err, result) =>
      err ? reject(err) : resolve(result)
    ))
}

async function output (transpilation) {

  const { code, options } = await transpilation
  const filename = options.filename.replace(/\/src\//, '/dist/')
  fs.writeFileSync(filename, code, 'utf8')
  return filename
}


const result = recurseDirectory(srcPath)
  .map(output)

Promise.all(result)
