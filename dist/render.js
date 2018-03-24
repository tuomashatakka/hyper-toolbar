"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _getPrototypeOf = _interopRequireDefault(require("@babel/runtime/core-js/object/get-prototype-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _react = _interopRequireWildcard(require("react"));

var _DynamicStylesheet = _interopRequireDefault(require("./DynamicStylesheet"));

var _default = function _default(ExtendedComponent) {
  return (
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits2.default)(Host, _Component);
      (0, _createClass2.default)(Host, null, [{
        key: "defaultProps",
        get: function get() {
          return {
            toolbar: {
              itemBackgroundColorHover: 'transparent',
              itemBackgroundColor: 'transparent',
              height: 80,
              gutter: 1,
              items: null
            }
          };
        }
      }]);

      function Host(props) {
        var _this;

        (0, _classCallCheck2.default)(this, Host);
        _this = (0, _possibleConstructorReturn2.default)(this, (Host.__proto__ || (0, _getPrototypeOf.default)(Host)).call(this, props));
        _this.renderToolbarItem = _this.renderToolbarItem.bind((0, _assertThisInitialized2.default)(_this));
        return _this;
      }

      (0, _createClass2.default)(Host, [{
        key: "componentWillMount",
        value: function componentWillMount() {
          this.css = decorateStyle(this.props);
          window.csss = this.css;
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.css.detach();
        }
      }, {
        key: "render",
        value: function render() {
          var _props = this.props,
              toolbar = _props.toolbar,
              items = _props.items,
              props = (0, _objectWithoutProperties2.default)(_props, ["toolbar", "items"]);
          return _react.default.createElement("div", {
            className: this.css.selector.container
          }, _react.default.createElement("section", {
            className: this.css.selector.terms
          }, _react.default.createElement(ExtendedComponent, props)), items && _react.default.createElement("aside", {
            className: this.css.selector.toolbar
          }, items.map(this.renderToolbarItem)));
        }
      }, {
        key: "proxyDispatch",
        value: function proxyDispatch(cmd) {
          var _this2 = this;

          return function () {
            return _this2.props.runShellCommand(cmd);
          };
        } // eslint-disable-next-line class-methods-use-this

      }, {
        key: "renderToolbarItem",
        value: function renderToolbarItem(item) {
          return _react.default.createElement("button", {
            className: this.css.selector.toolbarItem,
            onClick: this.proxyDispatch(item.command)
          }, item.children);
        }
      }]);
      return Host;
    }(_react.Component)
  );
};

exports.default = _default;
var transition = ['color 300ms', 'background-color 300ms', 'border-color 300ms', 'box-shadow 300ms'].join(', ');

var decorateStyle = function decorateStyle(props) {
  return _DynamicStylesheet.default.apply({
    container: {
      flexFlow: 'column',
      position: 'relative',
      display: 'flex',
      height: '100%'
    },
    terms: {
      position: 'relative',
      flex: '1 1'
    },
    toolbar: {
      position: 'relative',
      display: 'flex',
      zIndex: 100,
      height: "".concat(props.toolbar.height, "px"),
      margin: "0 0 -".concat(props.toolbar.gutter, "px")
    },
    toolbarItem: {
      margin: 0,
      flexGrow: 1,
      border: 'none',
      appearance: 'none',
      minWidth: "".concat(props.toolbar.height, "px"),
      marginRight: "".concat(props.toolbar.gutter, "px"),
      color: props.toolbar.itemTextColor,
      backgroundColor: props.toolbar.itemBackgroundColor,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      transition: transition
    },
    'button:focus': {
      outline: 'none'
    },
    'button:hover': {
      color: props.toolbar.itemTextColorHover,
      cursor: 'pointer',
      backgroundColor: props.toolbar.itemBackgroundColorHover
    }
  });
};