import React, { Component } from 'react'
import Stylesheet from './DynamicStylesheet'

const iconSets = {
  md: require('react-icons/lib/md'),
  fa: require('react-icons/lib/fa'),
}


export function formatIconName (name, iconset = 'Md') {
  const firstLetter = name[0].toUpperCase()
  const body = name.substr(1)

  const clean = text =>
    text.replace(/(?:[^\w]+(\w))/g, (_, c) => c.toUpperCase())

  return iconset[0].toUpperCase() +
         iconset[1].toLowerCase() +
         firstLetter +
         clean(body)
}

function resolveIcon (props, attrs={}) {
  const name    = props.icon
  const iconset = props.iconset || 'Md'

  if (!name)
    return null

  const iconName  = formatIconName(name, iconset)
  const iconGroup = iconSets[iconset.toLowerCase()]

  if (process.env.NODE_ENV === 'development') {
    console.groupCollapsed("resolved icon", iconset, name)
    console.info("group", iconset)
    console.info("icon", name)
    console.info("iconName", iconName)
    console.info("iconGroup", iconGroup)
    console.info("IconComponent", iconGroup && iconGroup[iconName])
    console.groupEnd()
  }

  if (!iconGroup)
    return null

  const IconComponent = iconGroup[iconName]
  if (IconComponent)
    return <IconComponent { ...attrs } />

  throw new ReferenceError(
    `Invalid value for the icon prop (${name || 'undefined'} ≈ ${iconName}).` +
    `See https://material.io/icons/ for a list of valid icon names.`)
}


export default (ExtendedComponent) =>

  class Host extends Component {

    static get defaultProps () {
      return {
        toolbar: {
          itemBackgroundColorHover: 'transparent',
          itemBackgroundColor: 'transparent',
          height: 80,
          gutter: 1,
          items: null,
        }
      }
    }

    constructor (props) {
      super(props)
      this.renderToolbarItem = this.renderToolbarItem.bind(this)

      this.state = {
        activeItem: null,
        params: '',
      }
    }

    componentWillMount () {
      this.css = decorateStyle(this.props)
    }

    componentWillUnmount () {
      this.css.detach()
    }

    render () {
      const { toolbar, items, ...props } = this.props

      return <div className={ this.css.selector.container }>
        <section className={ this.css.selector.terms }>
          <ExtendedComponent {...props} />
        </section>

        { items &&
          <aside className={ this.css.selector.toolbar }>
            { items.map(this.renderToolbarItem) }
          </aside>
        }

        { this.renderModal() }

      </div>
    }

    proxyDispatch (cmd) {
      return (...params) => this.props.runShellCommand([ cmd, ...params ].join(' '))
    }

    // eslint-disable-next-line class-methods-use-this
    renderToolbarItem (item, key) {

      const icon = resolveIcon(item, {
        className: this.css.selector.toolbarItemIcon
      })

      let handleClick

      if (item.promptParams)
        handleClick = () => this.setState({ activeItem: key })
      else 
        handleClick = this.proxyDispatch(item.command)

      return <button
        key={ key }
        className={ this.css.selector.toolbarItem }
        onClick={ () => {
          console.log(key, item)
          handleClick()
         } }>

        { icon }
        { item.children }

      </button>
    }

    renderModal () {
      if (this.state.activeItem === null)
        return null

      const activeItem = this.props.items[this.state.activeItem]
      const handleSubmit = (e) => {
        e.preventDefault()
        const command = this.proxyDispatch(activeItem.command)
        const params = this.state.params.trim().split(' ')
        this.setState({ params: '', activeItem: null }, () => command(params))
        return false
      }

      return <aside className={ this.css.selector.modal }>
        <form onSubmit={ handleSubmit }>
          <span>{ activeItem.command }</span>
          <input 
            value={ this.state.params }
            onChange={ (e) => this.setState({ params: e.target.value })}
          />
          <button type='submit'>Run</button>
        </form>
      </aside>
    }

  }


const transition = [
  'color 300ms',
  'background-color 300ms',
  'border-color 300ms',
  'box-shadow 300ms',
  'opacity 300ms',
].join(', ')

const decorateStyle = props => Stylesheet.apply({

  '.container': {
    flexFlow: 'column',
    position: 'relative',
    display:  'flex',
    height:   '100%',
  },

  '.terms': {
    position: 'relative',
    flex: '1 1',
  },

  '.modal': {
    position:   'absolute',
    display:    'flex',
    zIndex:     2000,
    height:     `80px`,
    width:      `70%`,
    left:       '50%',
    top:        '50%',
    transform:  `translate(-50%, -50%)`,
  },

  '.toolbar': {
    position: 'relative',
    display:  'flex',
    zIndex:   100,
    height:   `${props.toolbar.height}px`,
    margin:   `0 0 -${props.toolbar.gutter}px`,
  },

  '.toolbarItem': {
    margin:           0,
    flexGrow:         1,
    display:          'flex',
    justifyContent:   'center',
    alignItems:       'center',
    border:           'none',
    appearance:       'none',
    minWidth:         `${props.toolbar.height}px`,
    marginRight:      `${props.toolbar.gutter}px`,
    fontSize:         `${props.toolbar.itemTextSize}em`,
    color:            props.toolbar.itemTextColor,
    backgroundColor:  props.toolbar.itemBackgroundColor,
    textTransform:    'uppercase',
    letterSpacing:    '2px',
    opacity: 0.6,
    transition,
  },

  '.toolbarItemIcon': {
    width: '2em',
    height: 'auto',
    padding: '0 0.6em 0 0',
  },

  'button.toolbarItem:hover, button.toolbarItem:focus': {
    color: props.toolbar.itemTextColorHover,
    opacity: 1,
    cursor: 'pointer',
    backgroundColor: props.toolbar.itemBackgroundColorHover + ' !important',
  },

  'button.toolbarItem:focus': {
    outline: 'none',
  },
})
