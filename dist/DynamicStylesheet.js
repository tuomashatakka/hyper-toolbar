"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var reduceStyleAttributes = function reduceStyleAttributes(content, indent) {
  return (0, _keys.default)(content).map(function (attr) {
    return "".concat(indent).concat(cleanAttribute(attr), ": ").concat(content[attr], ";");
  }).join('\n');
};

var stylesheet = function stylesheet(sel, content) {
  var indent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return "\n".concat(indent).concat(sel, " {\n").concat(reduceStyleAttributes(content, indent + '  '), "\n").concat(indent, "}\n");
};

function cleanAttribute(attr) {
  return attr.replace(/[A-Z]/g, function (c) {
    return '-' + c.toLowerCase();
  });
}

function resolveSelector(key) {
  if (/^\w+$/.test(key)) return '.' + key;
  return key;
}

function flattenStyles(css) {
  var output = [];

  for (var key in css) {
    output.push(stylesheet(resolveSelector(key), css[key]));
  }

  return output.join('\n');
}

var DynamicStylesheet =
/*#__PURE__*/
function () {
  function DynamicStylesheet(css) {
    (0, _classCallCheck2.default)(this, DynamicStylesheet);
    this.rules = css;
    this.element = document.createElement('style');
    this.element.setAttribute('class', "toolbar-stylesheet-".concat(getNextIdentifier()));
  }

  (0, _createClass2.default)(DynamicStylesheet, [{
    key: "attach",
    value: function attach() {
      this.content = flattenStyles(this.rules);
      document.body.appendChild(this.element);
    }
  }, {
    key: "detach",
    value: function detach() {
      this.element.remove();
      this.content = '';
    }
  }, {
    key: "selector",
    get: function get() {
      return new Proxy(this.rules, {
        get: function get(rules, rule) {
          return rule;
        }
      });
    }
  }, {
    key: "content",
    set: function set(content) {
      this.element.textContent = content;
    }
  }], [{
    key: "apply",
    value: function apply(css) {
      var stylesht = new DynamicStylesheet(css);
      stylesht.attach();
      return stylesht;
    }
  }]);
  return DynamicStylesheet;
}();

exports.default = DynamicStylesheet;
var id = 0;

var getNextIdentifier = function getNextIdentifier() {
  return ++id;
};