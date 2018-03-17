"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _symbol = _interopRequireDefault(require("@babel/runtime/core-js/symbol"));

var w = (0, _symbol.default)('window-reference');

var ToolbarPlugin =
/*#__PURE__*/
function () {
  function ToolbarPlugin() {
    (0, _classCallCheck2.default)(this, ToolbarPlugin);
    this[w] = null;
  }

  (0, _createClass2.default)(ToolbarPlugin, [{
    key: "window",
    set: function set(value) {
      this[w] = value;
    },
    get: function get() {
      return this[w];
    }
  }]);
  return ToolbarPlugin;
}();

exports.default = ToolbarPlugin;