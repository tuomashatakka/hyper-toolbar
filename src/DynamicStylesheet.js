
const reduceStyleAttributes = (content, indent) =>
  Object
    .keys(content)
    .map((attr) => `${indent}${cleanAttribute(attr)}: ${content[attr]};`)
    .join('\n')

const stylesheet = (sel, content, indent='') => `
${indent}${sel} {
${reduceStyleAttributes(content, indent + '  ')}
${indent}}\n`


function cleanAttribute (attr) {
  return attr.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
}

function resolveSelector (key) {
  if (/^\w+$/.test(key))
    return '.' + key
  return key
}

function flattenStyles (css) {
  let output = []
  for (let key in css)
    output.push(stylesheet(resolveSelector(key), css[key]))
  return output.join('\n')
}

export default class DynamicStylesheet {

  constructor (css) {
    this.rules   = css
    this.element = document.createElement('style')
    this.element.setAttribute('class', `toolbar-stylesheet-${getNextIdentifier()}`)
  }

  static apply (css) {
    const stylesht = new DynamicStylesheet(css)
    stylesht.attach()
    return stylesht
  }

  get selector () {
    return new Proxy(this.rules, {
      get: (rules, rule) => rule
    })
  }

  attach () {
    this.content = flattenStyles(this.rules)
    document.body.appendChild(this.element)
  }

  detach () {
    this.element.remove()
    this.content = ''
  }

  set content (content) {
    this.element.textContent = content
  }
}


let id = 0
const getNextIdentifier = () => ++id
