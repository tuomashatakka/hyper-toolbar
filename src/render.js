import React, { Component } from 'react'
import Stylesheet from './DynamicStylesheet'

const iconSets = {
  md: require('react-icons/lib/md'),
  fa: require('react-icons/lib/fa'),
}


export function formatIconName(name, iconset = 'Md') {
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

  console.info("resolving icon for", props)
  console.info("resolved icon/set", name, iconset)

  if (!name)
    return null

  let iconName  = formatIconName(name, iconset)
  let iconGroup = iconSets[iconset.toLowerCase()]
  console.info("resolved iconName, iconGroup", iconName, iconGroup)

  if (!iconGroup)
    return null

  let IconComponent = iconGroup[iconName]
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
    }

    componentWillMount () {
      this.css = decorateStyle(this.props)
      window.csss = this.css
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

      </div>
    }

    proxyDispatch (cmd) {
      return () => this.props.runShellCommand(cmd)
    }

    // eslint-disable-next-line class-methods-use-this
    renderToolbarItem (item) {

      const icon = resolveIcon(item, {
        className: this.css.selector.toolbarItemIcon
      })

      return <button
        className={ this.css.selector.toolbarItem }
        onClick={ this.proxyDispatch(item.command) }>

        { icon }
        { item.children }

      </button>
    }

  }


const transition = [
  'color 300ms',
  'background-color 300ms',
  'border-color 300ms',
  'box-shadow 300ms',
].join(', ')

const decorateStyle = props => Stylesheet.apply({

  container: {
    flexFlow: 'column',
    position: 'relative',
    display:  'flex',
    height:   '100%',
  },

  terms: {
    position: 'relative',
    flex: '1 1',
  },

  toolbar: {
    position: 'relative',
    display:  'flex',
    zIndex:   100,
    height:   `${props.toolbar.height}px`,
    margin:   `0 0 -${props.toolbar.gutter}px`,
  },

  toolbarItem: {
    margin:           0,
    flexGrow:         1,
    display:          'flex',
    justifyContent:   'center',
    alignItems:       'center',
    border:           'none',
    appearance:       'none',
    minWidth:         `${props.toolbar.height}px`,
    marginRight:      `${props.toolbar.gutter}px`,
    color:            props.toolbar.itemTextColor,
    backgroundColor:  props.toolbar.itemBackgroundColor,
    textTransform:    'uppercase',
    letterSpacing:    '2px',
    transition,
  },

  toolbarItemIcon: {
    width: '3em',
    height: 'auto',
    padding: '0 0.6em',
  },

  'button:focus': {
    outline: 'none',
  },
  'button:hover': {
    color: props.toolbar.itemTextColorHover,
    cursor: 'pointer',
    backgroundColor: props.toolbar.itemBackgroundColorHover,
  },
})
