'use strict';

var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  ketch = require('../guts/ketch'),
  childProcess = require('child-process-promise');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

describe('ketch', function () {

  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create('ketch');
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should expose pseudoclass Ketch', function () {
    expect(ketch.Ketch).to.be.a('function');
  });

  it('exports a constructor', function () {
    var cmd;
    expect(ketch).to.be.a('function');
    cmd = ketch();
    expect(cmd).to.be.an('object');
    expect(cmd.constructor).to.equal(ketch.Ketch);
  });

  it('can be called with Function.prototype.apply()', function () {
    expect(function () {
      ketch.apply(['foo', 'bar', 'baz']);
    }).not.to.throw();
  });

  describe('constructor', function () {
    it('should call Ketch.parseArgs()', function () {
      sandbox.stub(ketch.Ketch, 'parseArgs');
      ketch('foo');
      expect(ketch.Ketch.parseArgs).to.have.been.calledOnce;
      expect(ketch.Ketch.parseArgs).to.have.been.calledWith('foo');
    });

    it('should set property cmd', function () {
      var cmd = ketch('foo');
      expect(cmd.cmd).to.eql(['foo']);
    });
  });

  describe('append()', function () {
    it('should be chainable', function () {
      var cmd = ketch('foo');
      expect(cmd.append()).to.equal(cmd);
    });

    it('should append to the command', function () {
      var cmd = ketch('foo').append('bar');
      expect(cmd.cmd).to.eql(['foo', 'bar']);
    });

    it('push() should be its alias', function () {
      expect(ketch('foo').append).to.equal(ketch('bar').push);
    });
  });

  describe('prepend()', function () {
    it('should be chainable', function () {
      var cmd = ketch('foo');
      expect(cmd.prepend()).to.equal(cmd);
    });

    it('should prepend to the command', function () {
      var cmd = ketch('foo').prepend('bar');
      expect(cmd.cmd).to.eql(['bar', 'foo']);
    });

    it('unshift() should be its alias', function () {
      expect(ketch('foo').prepend).to.equal(ketch('bar').unshift);
    });
  });

  describe('toString()', function () {
    it('should return the entire command joined by a space', function () {
      expect(ketch('foo', 'bar', 'baz').toString()).to.equal('foo bar baz');
    });
  });

  describe('pop()', function () {
    it('should pass through to cmd property', function () {
      var cmd = ketch('foo');
      sandbox.stub(cmd.cmd, 'pop');
      expect(cmd.pop()).to.equal(cmd);
      expect(cmd.cmd.pop).to.have.been.calledOnce;
    });
  });

  describe('shift()', function () {
    it('should pass through to cmd property', function () {
      var cmd = ketch('foo');
      sandbox.stub(cmd.cmd, 'shift');
      expect(cmd.shift()).to.equal(cmd);
      expect(cmd.cmd.shift).to.have.been.calledOnce;
    });
  });

  describe('splice()', function () {
    it('should pass through to cmd property', function () {
      var cmd = ketch('foo');
      sandbox.stub(cmd.cmd, 'splice');
      expect(cmd.splice(0, 0, 'bar')).to.equal(cmd);
      expect(cmd.cmd.splice).to.have.been.calledOnce;
      expect(cmd.cmd.splice).to.have.been.calledWith(0, 0, 'bar');
    });
  });

  describe('get()', function () {
    it('should return an array ready to apply against an execution function', function () {
      expect(ketch('foo', 'bar', 'baz').get()).to.eql(['foo', ['bar', 'baz']]);
    });
  });

  describe('clear()', function () {
    it('should be chainable', function () {
      var cmd = ketch();
      expect(cmd.clear()).to.equal(cmd);
    });

    it('should set the length of the cmd property to 0', function () {
      expect(ketch('foo', 'bar').clear().cmd.length).to.equal(0);
    });
  });

  describe('opt()', function () {
    it('should add options to the command', function () {
      var cmd = ketch();
      expect(cmd.push('foo').opt('bar', 'v').toString()).to.equal('foo --bar -v');
    });
  });

  describe('exec()', function () {

    var Promise = require('bluebird');

    it('should call child-process-promise.exec()', function () {
      sandbox.stub(childProcess, 'exec').returns(Promise.resolve({
        stdout: 'bar',
        stderr: 'baz'
      }));
      return expect(ketch('foo').exec()).to.eventually.be.fulfilled
        .then(function () {
          expect(childProcess.exec).to.have.been.called;
          expect(childProcess.exec).to.have.been.calledWith('foo');
        });
    });

    it('should resolve with stdout and stderr', function () {
      sandbox.stub(childProcess, 'exec').returns(Promise.resolve({
        stdout: 'bar',
        stderr: 'baz'
      }));
      return expect(ketch('foo').exec()).to.eventually.be.fulfilled
        .then(function (result) {
          var stdout = result.stdout,
            stderr = result.stderr;
          expect(stdout).to.equal('bar');
          expect(stderr).to.equal('baz');
        });
    });

    it('should reject with err', function () {
      sandbox.stub(childProcess, 'exec').returns(Promise.reject('omg'));
      return expect(ketch('foo').exec()).to.eventually.be.rejectedWith('omg');
    });
  });
});
