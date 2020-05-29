"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatIconName = formatIconName;
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

var iconSets = {
  md: require('react-icons/lib/md'),
  fa: require('react-icons/lib/fa')
};

function formatIconName(name) {
  var iconset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Md';
  var firstLetter = name[0].toUpperCase();
  var body = name.substr(1);

  var clean = function clean(text) {
    return text.replace(/(?:[^\w]+(\w))/g, function (_, c) {
      return c.toUpperCase();
    });
  };

  return iconset[0].toUpperCase() + iconset[1].toLowerCase() + firstLetter + clean(body);
}

function resolveIcon(props) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var name = props.icon;
  var iconset = props.iconset || 'Md';
  if (!name) return null;
  var iconName = formatIconName(name, iconset);
  var iconGroup = iconSets[iconset.toLowerCase()];

  if (process.env.NODE_ENV === 'development') {
    console.groupCollapsed("resolved icon", iconset, name);
    console.info("group", iconset);
    console.info("icon", name);
    console.info("iconName", iconName);
    console.info("iconGroup", iconGroup);
    console.info("IconComponent", iconGroup && iconGroup[iconName]);
    console.groupEnd();
  }

  if (!iconGroup) return null;
  var IconComponent = iconGroup[iconName];
  if (IconComponent) return _react.default.createElement(IconComponent, attrs);
  throw new ReferenceError("Invalid value for the icon prop (".concat(name || 'undefined', " \u2248 ").concat(iconName, ").") + "See https://material.io/icons/ for a list of valid icon names.");
}

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
          var icon = resolveIcon(item, {
            className: this.css.selector.toolbarItemIcon
          });
          return _react.default.createElement("button", {
            className: this.css.selector.toolbarItem,
            onClick: this.proxyDispatch(item.command)
          }, icon, item.children);
        }
      }]);
      return Host;
    }(_react.Component)
  );
};

exports.default = _default;
var transition = ['color 300ms', 'background-color 300ms', 'border-color 300ms', 'box-shadow 300ms', 'opacity 300ms'].join(', ');

var decorateStyle = function decorateStyle(props) {
  return _DynamicStylesheet.default.apply({
    '.container': {
      flexFlow: 'column',
      position: 'relative',
      display: 'flex',
      height: '100%'
    },
    '.terms': {
      position: 'relative',
      flex: '1 1'
    },
    '.toolbar': {
      position: 'relative',
      display: 'flex',
      zIndex: 100,
      height: "".concat(props.toolbar.height, "px"),
      margin: "0 0 -".concat(props.toolbar.gutter, "px")
    },
    '.toolbarItem': {
      margin: 0,
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
      appearance: 'none',
      minWidth: "".concat(props.toolbar.height, "px"),
      marginRight: "".concat(props.toolbar.gutter, "px"),
      color: props.toolbar.itemTextColor,
      backgroundColor: props.toolbar.itemBackgroundColor,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      opacity: 0.6,
      transition: transition
    },
    '.toolbarItemIcon': {
      width: '4em',
      height: 'auto',
      padding: '0 0.6em 0 0'
    },
    'button.toolbarItem:hover, button.toolbarItem:focus': {
      color: props.toolbar.itemTextColorHover,
      opacity: 1,
      cursor: 'pointer',
      backgroundColor: props.toolbar.itemBackgroundColorHover + ' !important'
    },
    'button.toolbarItem:focus': {
      outline: 'none'
    }
  });
};