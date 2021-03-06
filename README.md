# ketch

> Ketch helps you execute, one way or another.

[![NPM](https://nodei.co/npm/ketch.png?compact=true)](https://nodei.co/npm/ketch/)
[![Code Climate](https://codeclimate.com/github/boneskull/ketch/badges/gpa.svg)](https://codeclimate.com/github/boneskull/ketch) [![Test Coverage](https://codeclimate.com/github/boneskull/ketch/badges/coverage.svg)](https://codeclimate.com/github/boneskull/ketch)

## Overview

Use this module to easily build commands for passing to [child_process](http://nodejs.org/api/child_process.html) functions.

When called as a function, this module will return a new `Ketch` instance.

## Installation

```sh
npm install ketch
```



**Example:**
```js
var ketch = require('ketch');

// what branch am I on?
ketch('git')
  .prepend('/usr/bin/env')
  .push('symbolic-ref')
  .opt('quiet', 'short')
  .push('HEAD')
  .exec()
  // returns stdout, stderr as array
  .done(function(output) {
     console.log(output[0].trim());
  }, function(err) {
     throw err;
  });

// use a callback instead
ketch('git')
  .prepend('/usr/bin/env')
  .push('symbolic-ref')
  .opt('quiet', 'short')
  .push('HEAD')
  .exec(function(err, stdout, stderr) {
    if (err) {
      throw err;
    }
    console.log(stdout.trim());
  });
```

* * *

## Class: Ketch
Provides chainable functions to easily build and execute a command.

**last_err**: `String` , Last error, if present  
**last_stdout**: `String` , Last stdout value, if present  
**last_stderr**: `String` , Last stderr value, if present  
**last_exec_cmd**: `String` , Last command run with `child_process.exec()`  
**last_execFile_cmd**: `String` , Last command run with `child_process.execFile()`  
**last_fork_cmd**: `String` , Last command run with `child_process.fork()`  
**last_spawn_cmd**: `String` , Last command run with `child_process.spawn()`  
**cmd**: `Array` , Internal array representation of this command.  
### ketch.Ketch.parseArgs() 

Parse function arguments into an array.  `arguments` may be one of:

- an array
- a space-separated string
- one or more strings (*not* separated by space)

**Returns**: `Array`, Command as an array

### ketch.Ketch.append() 

Append an argument or arguments to this command.  *Alias: `push()`*

**Returns**: `Ketch`, Ketch instance

### ketch.Ketch.prepend() 

Prepend an argument or arguments to this command.  *Alias: `unshift()`*

**Returns**: `Ketch`, Ketch instance

### ketch.Ketch.opt() 

Sugar function to append one or more options to the command.

**Returns**: `Ketch`, Ketch instance

**Example**:
```js
ketch('git').opt('q', 'short') // becomes "git -q --short"
```

### ketch.Ketch.toString() 

Returns current command as a space-separated string.

**Returns**: `String`, String representation of this command

### ketch.Ketch.pop() 

Pops the last argument off of the command.  Does not return it.  If you need that, use `ketch('foo').cmd.pop()`

**Returns**: `Ketch`, Ketch instance

### ketch.Ketch.shift() 

Shifts the first argument off of the command.  Does not return it.  If you need that, use `ketch('foo').cmd.shift()`

**Returns**: `Ketch`, Ketch instance

### ketch.Ketch.splice() 

Splice the command.

**Returns**: `Ketch`, Ketch instance

### ketch.Ketch.serialize() 

"Serialize" this command into command/arguments array format, suitable for passing to `execFile` or `fork`.  *Aliases: `get()`, `toJSON`*

**Returns**: `Array`, Array where first item is a string, second is array of commands

### ketch.Ketch.exec(options, callback) 

Wrapper around `child_process.exec()`.  Returns a promise, or

**Parameters**

**options**: `Object`, Options for `child_process.exec()`

**callback**: `function`, If present, will execute as NodeJS-style callback; otherwise will return a Promise.

**Returns**: `ChildProcess | Promise`, `ChildProcess` instance if `callback` is specified, otherwise a `Promise`.

### ketch.Ketch.execFile(options, callback) 

Wrapper around `child_process.execFile()`.  Returns a promise, or

**Parameters**

**options**: `Object`, Options for `child_process.execFile()`

**callback**: `function`, If present, will execute as NodeJS-style callback; otherwise will return a Promise.

**Returns**: `ChildProcess | Promise`, `ChildProcess` instance if `callback` is specified, otherwise a `Promise`.

### ketch.Ketch.fork(options, callback) 

Wrapper around `child_process.fork()`.  Returns a promise, or

**Parameters**

**options**: `Object`, Options for `child_process.fork()`

**callback**: `function`, If present, will execute as NodeJS-style callback; otherwise will return a Promise.

**Returns**: `ChildProcess | Promise`, `ChildProcess` instance if `callback` is specified, otherwise a `Promise`.

### ketch.Ketch.spawn(options, callback) 

Wrapper around `child_process.spawn()`.  Returns a promise, or

**Parameters**

**options**: `Object`, Options for `child_process.spawn()`

**callback**: `function`, If present, will execute as NodeJS-style callback; otherwise will return a Promise.

**Returns**: `ChildProcess | Promise`, `ChildProcess` instance if `callback` is specified, otherwise a `Promise`.

### ketch.Ketch.clear() 

Obliterates the current command.  *Alias: `reset()`*

**Returns**: `Ketch`, Ketch instance

### ketch.Ketch.debug() 

Debugging function to log the current command to console.  Chainable, for your pleasure.

**Returns**: `Ketch`, Ketch instance

### ketch.Ketch.tap()

"Tap" into the chain.  

**Parameters**

**callback**: `function`, Which will be passed the `Ketch` instance.

**Returns**: `Ketch`, Ketch instance

## License 

© 2014-2015, [Christopher Hiller](https://boneskull.com).  Licensed MIT.
