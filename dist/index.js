"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _assign = _interopRequireDefault(require("@babel/runtime/core-js/object/assign"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _entries = _interopRequireDefault(require("@babel/runtime/core-js/object/entries"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

// const ToolbarPlugin = require('../dist/ToolbarPlugin').default
var render = require('../dist/render').default;

var _require = require('../dist/utils'),
    runShell = _require.runShell,
    getConfigurationInterface = _require.getConfigurationInterface; // function getPlugin () {
//   return plugin || (plugin = new ToolbarPlugin())
// }
//
// function clearPlugin () {
//   if (plugin.dispose)
//     plugin.dispose()
//   if (plugin)
//     plugin = null
// }


var ToolbarItem =
/*#__PURE__*/
function () {
  function ToolbarItem(text, action) {
    (0, _classCallCheck2.default)(this, ToolbarItem);
    this.clickHandler = action;
    this.children = text;
  }

  (0, _createClass2.default)(ToolbarItem, [{
    key: "command",
    get: function get() {
      if (typeof this.clickHandler === 'string') return this.clickHandler;
      if (typeof this.clickHandler === 'function') return 'should run: ' + this.clickHandler.name;
    }
  }]);
  return ToolbarItem;
}();

function resolveToolbarItems(data) {
  var items;
  if ((0, _typeof2.default)(data) === 'object') if (data instanceof Array) items = data;else items = (0, _entries.default)(data).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        children = _ref2[0],
        onClick = _ref2[1];

    return {
      children: children,
      onClick: onClick
    };
  });
  return items.map(function (item) {
    return new ToolbarItem(item.children || item.text || item.content, item.callback || item.action || item.onClick);
  });
}

var defaultConfig = {
  toolbarItemBackgroundColorHover: '#4c23f1',
  toolbarItemBackgroundColor: 'rgba(98, 83, 161, 0.17)',
  toolbarHeight: 80,
  toolbarItems: [],
  itemGutter: 1
};

exports.decorateConfig = function (config) {
  return (0, _assign.default)({}, defaultConfig, config);
};

exports.mapTermsState = function mapTermsState(state, map) {
  var conf = getConfigurationInterface().getConfig();
  var toolbarItems = resolveToolbarItems(conf.toolbarItems || defaultConfig.toolbarItems);
  var toolbarItemBackgroundColor = conf.toolbarItemBackgroundColor,
      toolbarItemBackgroundColorHover = conf.toolbarItemBackgroundColorHover;
  console.log(conf, map);
  return (0, _assign.default)({}, map, {
    toolbarItems: toolbarItems,
    toolbarItemBackgroundColor: toolbarItemBackgroundColor,
    toolbarItemBackgroundColorHover: toolbarItemBackgroundColorHover
  });
};

exports.mapTermsDispatch = function (dispatch, map) {
  return (0, _assign.default)({}, map, {
    runShell: function runShell(cmd) {
      return dispatch(runShellCommand(cmd));
    }
  });
};

exports.decorateTerms = function (ComponentClass, _ref3) {
  var React = _ref3.React;
  return render(ComponentClass, React);
};