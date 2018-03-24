import React, { Component } from 'react'
import Stylesheet from './DynamicStylesheet'


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
      return <button
        className={ this.css.selector.toolbarItem }
        onClick={ this.proxyDispatch(item.command) }>
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

  'button:focus': {
    outline: 'none',
  },
  'button:hover': {
    color: props.toolbar.itemTextColorHover,
    cursor: 'pointer',
    backgroundColor: props.toolbar.itemBackgroundColorHover,
  },
})
