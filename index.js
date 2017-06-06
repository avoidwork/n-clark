'use strict';

(function (global) {
  const fetch = global.fetch || require('node-fetch'),
    host = 'https://westus.api.cognitive.microsoft.com';

  function validate (arg, type, not) {
    let fn = typeof not === 'function',
      regex = not instanceof RegExp,
      result = typeof arg === type;

    if (result) {
      if (fn) {
        result = fn(arg) !== true;
      } else if (regex) {
        result = !not.test(arg);
      } else {
        result = arg !== not;
      }
    }

    return result;
  }

  class NClark {
    constructor (id, key, verbose, debug) {
      this.debug = debug;
      this.results = new Set();
      this.urls = {
        predict: String.raw`${host}/luis/v2.0/apps/${id}?subscription-key=${key}&q=%s&verbose=${verbose}`,
        reply: String.raw`${host}/luis/v2.0/apps/${id}?subscription-key=${id}&q=%s&contextid=%c&verbose=${verbose}`
      };
    }

    fetch (url) {
      let ok, text;

      return fetch(url).then(res => {
        ok = res.ok;
        text = res.statusText;

        return res.json();
      }).then(arg => {
        if (this.debug) {
          this.results.add([status, decodeURIComponent(url.replace(/^.*q=/, '').replace(/&.*$/, '')), arg]);
        }

        if (!ok) {
          throw new Error(text);
        }

        return arg;
      });
    }

    predict (text) {
      return this.fetch(this.urls.predict.replace('%s', encodeURIComponent(text)));
    }

    reply (text, context, set = '') {
      let url = this.urls.predict.replace('%s', encodeURIComponent(text)).replace('%c', encodeURIComponent(context));

      if (validate(set, 'string', '')) {
        url += '&forceset=' + encodeURIComponent(set);
      }

      return this.fetch(url);
    }
  }

  function factory (id = '', key = '', verbose = true, debug = false) {
    if (!validate(id, 'string', '')) {
      throw new TypeError('"id" is invalid');
    }

    if (!validate(key, 'string', '')) {
      throw new TypeError('"key" is invalid');
    }

    if (!validate(verbose, 'boolean', /^(null)$/)) {
      throw new TypeError('"verbose" is invalid');
    }

    if (!validate(debug, 'boolean', /^(null)$/)) {
      throw new TypeError('"debug" is invalid');
    }

    return new NClark(id, key, verbose, debug);
  }

  // CommonJS, AMD, script tag
  if (typeof exports !== 'undefined') {
    module.exports = factory;
  } else if (typeof define === 'function' && define.amd) {
    define(() => factory);
  } else {
    global.nClark = factory;
  }
}(typeof window !== 'undefined' ? window : global));
