'use strict';

(function (global) {
  const fetch = global.fetch || require('node-fetch'),
    host = 'https://westus.api.cognitive.microsoft.com';

  function validate (arg, type, not) {
    return typeof arg === type && arg !== not;
  }

  class NClark {
    constructor (id, key, verbose) {
      this.id = id;
      this.key = key;
      this.urls = {
        predict: String.raw`${host}/luis/v2.0/apps/${this.id}?subscription-key=${this.key}&q=%s&verbose=${verbose}`,
        reply: String.raw`${host}/luis/v2.0/apps/${this.id}?subscription-key=${this.id}&q=%s&contextid=%c&verbose=${verbose}`
      };
    }

    fetch (url) {
      let ok, text;

      return fetch(url).then(res => {
        ok = res.ok;
        text = res.statusText;

        return res.json();
      }).then(arg => {
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

  function factory (id = '', key = '', verbose = true) {
    if (!validate(id, 'string', '')) {
      throw new TypeError('"id" is invalid');
    }

    if (!validate(key, 'string', '')) {
      throw new TypeError('"key" is invalid');
    }

    if (!validate(verbose, 'boolean', null)) {
      throw new TypeError('"verbose" is invalid');
    }

    return new NClark(id, key);
  }

  // CommonJS, AMD, script tag
  if (typeof exports !== 'undefined') {
    module.exports = factory;
  } else if (typeof define === 'function' && define.amd) {
    define(() => {
      return factory;
    });
  } else {
    global.nClark = factory;
  }
}(typeof window !== 'undefined' ? window : global));
