"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

var _assign = _interopRequireDefault(require("@babel/runtime/core-js/object/assign"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _entries = _interopRequireDefault(require("@babel/runtime/core-js/object/entries"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var render = require('./render').default;

var _require = require('./utils'),
    getConfigurationInterface = _require.getConfigurationInterface;

var defaultConfig = function defaultConfig(_ref) {
  var foregroundColor = _ref.foregroundColor,
      colors = _ref.colors;
  return {
    itemTextColor: foregroundColor,
    itemTextColorHover: colors.lightWhite,
    itemBackgroundColor: 'transparent',
    itemBackgroundColorHover: colors.lightBlack,
    itemGutter: 1,
    height: 80,
    items: {}
  };
};

function run(command, uid) {
  Window.exec(command, uid);
}

var ToolbarItem =
/*#__PURE__*/
function () {
  function ToolbarItem(item) {
    (0, _classCallCheck2.default)(this, ToolbarItem);
    this.children = item.text;
    this.action = item.action;
    this.icon = item.icon || null;
    this.iconset = item.iconset || 'md';
  }

  (0, _createClass2.default)(ToolbarItem, [{
    key: "command",
    get: function get() {
      if (typeof this.action === 'string') return this.action; // FIXME

      if (typeof this.action === 'function') return 'should run: ' + this.action.name;
    }
  }]);
  return ToolbarItem;
}();

function resolveToolbarItems(data) {
  var items;
  if ((0, _typeof2.default)(data) === 'object') items = (data instanceof Array ? data : (0, _entries.default)(data).map(function (_ref2) {
    var _ref3 = (0, _slicedToArray2.default)(_ref2, 2),
        text = _ref3[0],
        action = _ref3[1];

    return {
      key: key,
      action: action
    };
  })).map(function (item) {
    return new ToolbarItem(item);
  });
  return items;
}

exports.decorateConfig = function (config) {
  var toolbar = (0, _assign.default)({}, defaultConfig(config), config.toolbar || {});
  var finalConf = (0, _assign.default)({}, config, {
    toolbar: toolbar
  });
  console.log(finalConf);
  return finalConf;
};

exports.mapTermsState = function mapTermsState(state, map) {
  var toolbar = {};
  var conf = (0, _assign.default)({}, defaultConfig(map), config.getConfig().toolbar || {});
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator2.default)((0, _keys.default)(conf).filter(function (key) {
      return key !== 'items';
    })), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _key2 = _step.value;
      toolbar[_key2] = conf[_key2];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var props = (0, _assign.default)({}, map, {
    toolbar: toolbar,
    items: resolveToolbarItems(conf.items)
  });
  return props;
};

exports.mapTermsDispatch = function (dispatch, map) {
  return (0, _assign.default)({}, map, {
    runShellCommand: function runShellCommand(cmd) {
      return run(cmd);
    }
  });
};

exports.decorateTerms = function (ComponentClass, _ref4) {
  var React = _ref4.React;
  return render(ComponentClass, React);
};

exports.middleware = function (store) {
  return function (next) {
    return function (action) {
      if (!Window.state) Object.defineProperty(Window, 'state', {
        get: store.getState
      });
      next(action);
    };
  };
};

exports.onWindow = function (win) {
  return win.rpc.on('execute commands', function (_ref5) {
    var uid = _ref5.uid,
        cmd = _ref5.cmd;
    return win.sessions.get(uid).write(cmd.toString() + '\r');
  });
};

function waitFor(object, key, fn) {
  if (key in object) fn(object[key]);else setTimeout(function () {
    return waitFor(object, key, fn);
  }, 10);
}

var Window = new (
/*#__PURE__*/
function () {
  function _class() {
    (0, _classCallCheck2.default)(this, _class);
  }

  (0, _createClass2.default)(_class, [{
    key: "exec",
    value: function exec(cmd, uid) {
      uid = uid || this.uid;
      console.log(this, 'executing command', cmd);
      this.rpc.emit('execute commands', {
        uid: uid,
        cmd: cmd
      });
    }
  }, {
    key: "uid",
    get: function get() {
      return this.state.sessions.activeUid;
    }
  }]);
  return _class;
}())();

exports.onRendererWindow = function (win) {
  var onRpc = function onRpc(eventName) {
    return function (rpc) {
      return rpc.on(eventName, function () {
        return Window.rpc = rpc;
      });
    };
  };

  waitFor(win, 'rpc', onRpc('session add'));
};