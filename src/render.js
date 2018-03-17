import React, { Component } from 'react'
import Stylesheet from './DynamicStylesheet'


export default (ExtendedComponent) =>

  class Host extends Component {

    static get defaultProps () {
      return {
        itemBackgroundColor: 'crimson',
        toolbarItems:  null,
        toolbarHeight: 80,
        itemGutter:    1,
      }
    }

    constructor (props) {
      super (props)
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
      const { toolbarItems, ...props } = this.props

      return <div className={ this.css.selector.container }>
        <section className={ this.css.selector.terms }>
          <ExtendedComponent {...props} />
        </section>

        { toolbarItems &&
          <aside className={ this.css.selector.toolbar }>
            { toolbarItems.map(this.renderToolbarItem) }
          </aside>
        }

      </div>
    }

    // eslint-disable-next-line class-methods-use-this
    renderToolbarItem (item) {
      return <button
        className={ this.css.selector.toolbarItem }
        onClick={ item.onClick }>
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
    flex: '1 1',
  },

  toolbar: {
    position: 'relative',
    display:  'flex',
    height:   `${props.toolbarHeight}px`,
    zIndex:   100,
  },

  toolbarItem: {
    margin:           0,
    flexGrow:         1,
    border:           'none',
    appearance:       'none',
    minWidth:         `${props.toolbarHeight}px`,
    marginRight:      `${props.itemGutter}px`,
    backgroundColor:  props.itemBackgroundColor,
    textTransform:    'uppercase',
    letterSpacing:    '2px',
    transition,
  },

  'button:focus': {
    outline: 'none',
  },
  'button:hover': {
    cursor: 'pointer',
    color: 'white',
    backgroundColor: '#4c23f1'
  },
})
