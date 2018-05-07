/*global describe, it */
'use strict';
var assert = require('assert');
var parseURLOrFile = require('../src/parse-url-or-file');

describe('parse-url-or-file', function () {
  it('regular HTTP URL', function () {
    var url = 'http://openfin.co/index.html';
    assert.equal(parseURLOrFile(url), url);
  });
  it('secure HTTPS URL', function () {
    var url = 'https://openfin.co/index.html';
    assert.equal(parseURLOrFile(url), url);
  });
  it('local file URL', function () {
    var url = 'file:///usr/local/openfin/index.html';
    assert.equal(parseURLOrFile(url), url);
  });
  it('regular local file', function () {
    var url = 'index.html',
        expect = 'file://' + process.cwd() + '/index.html';
    assert.equal(parseURLOrFile(url), expect);
  });
  it('relative local file', function () {
    var url = './index.html',
        expect = 'file://' + process.cwd() + '/./index.html';
    assert.equal(parseURLOrFile(url), expect);
  });
  it('absolute local file', function () {
    var url = '/usr/local/openfin/index.html',
        expect = 'file://' + url;
    assert.equal(parseURLOrFile(url), expect);
  });
  it('Windows absolute path', function () {
    var url = 'C:\\openfin\\index.html',
        expect = 'file://' + url;
    assert.equal(parseURLOrFile(url), expect);
  });
});
