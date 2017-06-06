'use strict';

(function (global) {
  const fetch = global.fetch || require('node-fetch'),
    host = 'https://westus.api.cognitive.microsoft.com';

  class NClark {
    constructor (id, key) {
      this.id = id;
      this.key = key;
      this.urls = {
        predict: String.raw`${host}/luis/v2.0/apps/${this.id}?subscription-key=${this.key}&q=%s&verbose=true`,
        reply: String.raw`${host}/luis/v2.0/apps/${this.id}?subscription-key=${this.id}&q=%s&contextid=%s&verbose=true`
      };
    }
  }

  function validate (arg, type, not) {
    return typeof arg !== type || arg === not;
  }

  function factory (id = '', key = '') {
    if (!validate(id, 'string', '')) {
      throw new TypeError('"id" is invalid');
    }

    if (!validate(key, 'string', '')) {
      throw new TypeError('"key" is invalid');
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
