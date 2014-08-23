'use strict';

var ketch = require('..');

// what branch am I on?
ketch('git')
  .prepend('/usr/bin/env')
  .push('symbolic-ref')
  .opt('quiet', 'short')
  .push('HEAD')
  .debug()
  .exec()
  // returns stdout, stderr
  .done(function(output) {
     console.log(output[0].trim());
  }, function(err) {
     throw err;
  });

// what branch am I on?
ketch('git')
  .prepend('/usr/bin/env')
  .push('symbolic-ref')
  .opt('quiet', 'short')
  .push('HEAD')
  .push('FOOT')
  .pop() // oops
  .debug()
  .exec(function(err, stdout) {
    if (err) {
      throw err;
    }
    console.log(stdout.trim());
  });
