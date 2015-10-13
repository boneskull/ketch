/**
 * @file ketch.js
 * @description *Ketch helps you execute, one way or another.*
 *
 * @license MIT
 * @author [Christopher Hiller](http://boneskull.github.io)
 * @copyright Copyright 2014, Christopher Hiller
 */

/**
 * @description
 * [![NPM](https://nodei.co/npm/ketch.png?compact=true)](https://nodei.co/npm/ketch/)
 * [![Code
 *   Climate](https://codeclimate.com/github/boneskull/ketch/badges/gpa.svg)](https://codeclimate.com/github/boneskull/ketch)
 *   [![Test
 *   Coverage](https://codeclimate.com/github/boneskull/ketch/badges/coverage.svg)](https://codeclimate.com/github/boneskull/ketch)
 *
 * Use this module to easily build commands for passing to
 *   [child_process](http://nodejs.org/api/child_process.html) functions.
 *
 * When called as a function, this module will return a new `Ketch` instance.
 *
 * ## Installation
 *
 * ```sh
 * npm install ketch
 * ```
 *
 * @module ketch
 * @example
 * var ketch = require('ketch');
 *
 * // what branch am I on?
 * ketch('git')
 *   .prepend('/usr/bin/env')
 *   .push('symbolic-ref')
 *   .opt('quiet', 'short')
 *   .push('HEAD')
 *   .exec()
 *   // returns stdout, stderr as array
 *   .done(function(output) {
 *      console.log(output[0].trim());
 *   }, function(err) {
 *      throw err;
 *   });
 *
 * // use a callback instead
 * ketch('git')
 *   .prepend('/usr/bin/env')
 *   .push('symbolic-ref')
 *   .opt('quiet', 'short')
 *   .push('HEAD')
 *   .exec(function(err, stdout, stderr) {
 *     if (err) {
 *       throw err;
 *     }
 *     console.log(stdout.trim());
 *   });
 *
 */

'use strict';

var childProcess = require('child-process-promise'),
  ketch,
  Ketch;

/**
 * @description Provides chainable functions to easily build and execute a
 *   command.
 * @property {String} last_err Last error, if present
 * @property {String} last_stdout Last stdout value, if present
 * @property {String} last_stderr Last stderr value, if present
 * @property {String} last_exec_cmd Last command run with
 *   `child_process.exec()`
 * @property {String} last_spawn_cmd Last command run with
 *   `child_process.spawn()`
 * @class
 */
Ketch = function Ketch() {

  /**
   * @description Internal array representation of this command.
   * @type {Array}
   */
  this.cmd = Ketch.parseArgs.apply(null, arguments);
};

/**
 * @description Parse function arguments into an array.  `arguments` may be one
 *   of:
 *
 * - an array
 * - a space-separated string
 * - one or more strings (*not* separated by space)
 *
 * @returns {Array} Command as an array
 */
Ketch.parseArgs = function parseArgs() {
  if (Array.isArray(arguments[0])) {
    return arguments[0];
  }
  else if (arguments.length > 1) {
    return Array.prototype.slice.apply(arguments);
  }
  else if (arguments.length) {
    return arguments[0].split(' ');
  }
  else {
    return [];
  }
};

/**
 * @description Append an argument to this command.  *Alias: `push()`*
 * @returns {Ketch} Ketch instance
 */
Ketch.prototype.append = function append() {
  this.cmd =
    this.cmd.concat.apply(this.cmd, Ketch.parseArgs.apply(null, arguments));
  return this;
};
Ketch.prototype.push = Ketch.prototype.append;

/**
 * @description Prepend an argument to this command.  *Alias: `unshift()`*
 * @returns {Ketch} Ketch instance
 */
Ketch.prototype.prepend = function prepend() {
  this.cmd = Ketch.parseArgs.apply(null, arguments).concat(this.cmd);
  return this;
};
Ketch.prototype.unshift = Ketch.prototype.prepend;

/**
 * @description Sugar function to append one or more options to the command.
 * @example
 * ketch('git').opt('q', 'short') // becomes "git -q --short"
 * @returns {Ketch} Ketch instance
 */
Ketch.prototype.opt = function opt() {
  return this.append(Ketch.parseArgs.apply(null, arguments)
    .map(function(option) {
      return option.length > 1 ? '--' + option : '-' + option;
    }));
};

/**
 * @description Returns current command as a space-separated string.
 * @returns {String} String representation of this command
 */
Ketch.prototype.toString = function toString() {
  return this.cmd.join(' ');
};

/**
 * @description Pops the last argument off of the command.  Does not return it.
 *    If you need that, use `ketch('foo').cmd.pop()`
 * @returns {Ketch} Ketch instance
 */
Ketch.prototype.pop = function pop() {
  this.cmd.pop();
  return this;
};

/**
 * @description Shifts the first argument off of the command.  Does not return
 *   it.  If you need that, use `ketch('foo').cmd.shift()`
 * @returns {Ketch} Ketch instance
 */
Ketch.prototype.shift = function shift() {
  this.cmd.shift();
  return this;
};

/**
 * @description Splice the command.
 * @returns {Ketch} Ketch instance
 */
Ketch.prototype.splice = function splice() {
  this.cmd.splice.apply(this.cmd, arguments);
  return this;
};

/**
 * @description "Serialize" this command into command/arguments array format,
 *   suitable for passing to `execFile` or `fork`.  *Aliases: `get()`,
 *   `toJSON`*
 * @returns {Array} Array where first item is a string, second is array of
 *   commands
 */
Ketch.prototype.serialize = function serialize() {
  return [this.cmd[0], this.cmd.slice(1)];
};
Ketch.prototype.get = Ketch.prototype.serialize;
Ketch.prototype.toJSON = Ketch.prototype.serialize;

/**
 * @description Wrapper around `child_process.exec()`.  Returns a promise, or
 * @param {Object} [options] Options for `child_process.exec()`
 * @param {Function} [callback] If present, will execute as NodeJS-style
 *   callback; otherwise will return a Promise.
 * @returns {(ChildProcess|Promise)} `ChildProcess` instance if `callback` is
 *   specified, otherwise a `Promise`.
 */
Ketch.prototype.exec = function exec(options, callback) {
  return this._exec('exec', [this.toString()], options, callback);
};

/**
 * @description Wrapper around `child_process.spawn()`.  Returns a promise, or
 * @param {Object} [options] Options for `child_process.spawn()`
 * @param {Function} [callback] If present, will execute as NodeJS-style
 *   callback; otherwise will return a Promise.
 * @returns {(ChildProcess|Promise)} `ChildProcess` instance if `callback` is
 *   specified, otherwise a `Promise`.
 */
Ketch.prototype.spawn = function spawn(options, callback) {
  return this._exec('spawn', this.serialize(), options, callback);
};

/**
 * @description Internal function to call `child_process` functions.
 * @param {String} fn_name One of `exec`, `execFile`, `fork` or `spawn`
 * @param {Array} args Arguments to `child_process` function
 * @param {Object} [options] Options for `child_process` function
 * @param {Function} [callback] Optional callback
 * @returns {(ChildProcess|Promise)} `ChildProcess` instance if `callback` is
 *   specified, otherwise a `Promise`.
 * @private
 */
Ketch.prototype._exec = function _exec(fn_name, args, options, callback) {
  var ketch = this;

  this['last_' + fn_name + '_cmd'] = this.toString();

  if (options) {
    args.push(options);
  }
  if (callback) {
    args.push(callback);
  }

  return childProcess[fn_name].apply(null, args)
    .then(function(result) {
      ketch.last_stdout = result.stdout;
      ketch.last_stderr = result.stderr;
      return result;
    })
    .nodeify(callback);
};

/**
 * @description Obliterates the current command.  *Alias: `reset()`*
 * @returns {Ketch} Ketch instance
 */
Ketch.prototype.clear = function clear() {
  this.cmd.length = 0;
  return this;
};
Ketch.prototype.reset = Ketch.prototype.clear;

/**
 * @description Debugging function to log the current command to console.
 * Chainable, for your pleasure.  *Alias: `tap()`*
 * @returns {Ketch} Ketch instance
 */
Ketch.prototype.debug = function debug() {
  console.log(String(this));
  return this;
};

/**
 * "Tap" into the chain.
 * @param {Function} [callback] Function to execute.  Function is passed the
 *   Ketch instance.
 * @returns {Ketch}
 */
Ketch.prototype.tap = function tap(callback) {
  callback = typeof callback === 'function' ? callback : function() {
  };
  callback(this);
  return this;
};

module.exports = (function() {
  var proxy;

  function Proxy(args) {
    return Ketch.apply(this, args);
  }

  Proxy.prototype = Ketch.prototype;

  proxy = function proxy() {
    return new Proxy(arguments);
  };
  proxy.Ketch = Ketch;
  return proxy;
})();
