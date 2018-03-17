"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _getPrototypeOf = _interopRequireDefault(require("@babel/runtime/core-js/object/get-prototype-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

module.exports =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(HostComponent, _Component);

  function HostComponent() {
    (0, _classCallCheck2.default)(this, HostComponent);
    return (0, _possibleConstructorReturn2.default)(this, (HostComponent.__proto__ || (0, _getPrototypeOf.default)(HostComponent)).apply(this, arguments));
  }

  (0, _createClass2.default)(HostComponent, [{
    key: "render",
    value: function render() {
      return _react.default.createElement("div", null, "asd");
    }
  }]);
  return HostComponent;
}(_react.Component);