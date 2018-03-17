"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _assign = _interopRequireDefault(require("@babel/runtime/core-js/object/assign"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

// const ToolbarPlugin = require('../dist/ToolbarPlugin').default
var render = require('../dist/render').default;

var _require = require('../dist/utils'),
    runShell = _require.runShell,
    configuration = _require.configuration; // function getPlugin () {
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
    key: "onClick",
    get: function get() {
      var _this = this;

      if (typeof this.clickHandler === 'string') return function () {
        return runShell(_this.clickHandler);
      };
      if (typeof this.clickHandler === 'function') return this.clickHandler;
    }
  }]);
  return ToolbarItem;
}();

var defaultConfig = {
  toolbarItems: [new ToolbarItem('Pressme', function () {
    return alert("Paska xd");
  })]
};

exports.decorateConfig = function decorateConfig(config) {
  config = (0, _assign.default)({}, defaultConfig, config);
  return config;
};

exports.mapTermsState = function mapTermsState(state, map) {
  var toolbarItems = configuration.toolbarItems || defaultConfig.toolbarItems;
  return (0, _assign.default)({}, map, {
    toolbarItems: toolbarItems
  });
};

exports.decorateTerms = function decorateHyper(ComponentClass, _ref) {
  var React = _ref.React;
  return render(ComponentClass, React);
};