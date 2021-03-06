"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfigurationInterface = getConfigurationInterface;
exports.runShell = runShell;

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function getConfigurationInterface() {
  if ((typeof window === "undefined" ? "undefined" : (0, _typeof2.default)(window)) === 'object' && window.config) return window.config;

  var elc = require('electron');

  var app = elc.remote ? elc.remote.app : {};
  return app.config || {
    getConfig: function getConfig() {
      return {};
    }
  };
} // eslint-disable-next-line


function runShell(command) {
  var _command$replace$trim = command.replace(/\s+/, ' ').trim().split(' '),
      _command$replace$trim2 = (0, _toArray2.default)(_command$replace$trim),
      cmd = _command$replace$trim2[0],
      args = _command$replace$trim2.slice(1);

  return require('child_process').spawn(cmd, args);
}

Object.defineProperty(module.exports, 'configuration', {
  get: function get() {
    return getConfigurationInterface().getConfig();
  }
});