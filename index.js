'use strict';

(function (global) {
  const fetch = global.fetch || require('node-fetch'),
    isJson = /application\/json/;

  function validate (arg, type, not) {
    let result = typeof arg === type;

    if (result) {
      result = arg !== not;
    }

    return result;
  }

  class NClark {
    constructor (id, key, verbose, debug, host, params) {
      this.debug = debug;
      this.results = new Set();
      this.urls = {
        predict: `https://${host}.api.cognitive.microsoft.com/luis/v2.0/apps/${id}?subscription-key=${key}&q=%s&verbose=${verbose}`,
        reply: `https://${host}.api.cognitive.microsoft.com/luis/v2.0/apps/${id}?subscription-key=${key}&q=%s&contextid=%c&verbose=${verbose}`
      };

      if (validate(params, 'string', '')) {
        this.urls.predict += `&${params.replace(/^&/, '')}`;
        this.urls.reply += `&${params.replace(/^&/, '')}`;
      }
    }

    async fetch (url) {
      const res = await fetch(url),
        result = await isJson.test(res.headers.get('content-type') || '') ? res.json() : res.text();

      if (this.debug) {
        this.results.add([res.status, decodeURIComponent(url.replace(/^.*q=/, '').replace(/&.*$/, '')), result]);
      }

      if (res.ok === false) {
        throw new Error(result || res.statusText);
      }

      return result;
    }

    async predict (text = '') {
      if (validate(text, 'string', '') === false) {
        throw new TypeError('text is invalid');
      }

      return await this.fetch(this.urls.predict.replace('%s', encodeURIComponent(text)));
    }

    async reply (text = '', context = '', set = '') {
      if (validate(text, 'string', '') === false) {
        throw new TypeError('text is invalid');
      } else if (validate(context, 'string', '') === false) {
        throw new TypeError('context is invalid');
      }

      let url = this.urls.predict.replace('%s', encodeURIComponent(text)).replace('%c', encodeURIComponent(context));

      if (validate(set, 'string', '')) {
        url += '&forceset=' + encodeURIComponent(set);
      }

      return await this.fetch(url);
    }
  }

  function factory ({id = '', key = '', host = 'westus', debug = false, verbose = true, params = ''} = {}) {
    [
      [id, 'id', 'string', ''],
      [key, 'key', 'string', ''],
      [verbose, 'verbose', 'boolean'],
      [debug, 'debug', 'boolean'],
      [host, 'host', 'string', '']
    ].forEach(i => {
      if (validate(i[0], i[2], i[3]) === false) {
        throw new TypeError(i[1] + ' is invalid');
      }
    });

    return new NClark(id, key, verbose, debug, host, params);
  }

  // CommonJS, AMD, script tag
  if (typeof exports !== 'undefined') {
    module.exports = factory;
  } else if (typeof define === 'function' && define.amd !== void 0) {
    define(() => factory);
  } else {
    global.nClark = factory;
  }
}(typeof window !== 'undefined' ? window : global));
