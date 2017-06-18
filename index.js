'use strict';

(function (global) {
  const fetch = global.fetch || require('node-fetch');

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
        predict: String.raw`https://${host}.api.cognitive.microsoft.com/luis/v2.0/apps/${id}?subscription-key=${key}&q=%s&verbose=${verbose}`,
        reply: String.raw`https://${host}.api.cognitive.microsoft.com/luis/v2.0/apps/${id}?subscription-key=${key}&q=%s&contextid=%c&verbose=${verbose}`
      };

      if (validate(params, 'string', '')) {
        this.urls.predict += '&' + params.replace(/^&/, '');
        this.urls.reply += '&' + params.replace(/^&/, '');
      }
    }

    fetch (url) {
      return new Promise((resolve, reject) => {
        let ok, status, text;

        fetch(url).then(res => {
          ok = res.ok;
          status = res.status;
          text = res.statusText;

          return res.json();
        }).then(arg => {
          if (this.debug) {
            this.results.add([status, decodeURIComponent(url.replace(/^.*q=/, '').replace(/&.*$/, '')), arg]);
          }

          if (!ok) {
            reject(new Error(text));
          } else {
            resolve(arg);
          }
        }).catch(reject);
      });
    }

    predict (text = '') {
      return new Promise((resolve, reject) => {
        if (!validate(text, 'string', '')) {
          reject(new TypeError('text is invalid'));
        }

        this.fetch(this.urls.predict.replace('%s', encodeURIComponent(text))).then(resolve, reject);
      });
    }

    reply (text = '', context = '', set = '') {
      return new Promise((resolve, reject) => {
        if (!validate(text, 'string', '')) {
          reject(new TypeError('text is invalid'));
        } else if (!validate(context, 'string', '')) {
          reject(new TypeError('context is invalid'));
        }

        let url = this.urls.predict.replace('%s', encodeURIComponent(text)).replace('%c', encodeURIComponent(context));

        if (validate(set, 'string', '')) {
          url += '&forceset=' + encodeURIComponent(set);
        }

        this.fetch(url).then(resolve, reject);
      });
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
      if (!validate(i[0], i[2], i[3])) {
        throw new TypeError(i[1] + ' is invalid');
      }
    });

    return new NClark(id, key, verbose, debug, host, params);
  }

  // CommonJS, AMD, script tag
  if (typeof exports !== 'undefined') {
    module.exports = factory;
  } else if (typeof define === 'function' && define.amd !== undefined) {
    define(() => factory);
  } else {
    global.nClark = factory;
  }
}(typeof window !== 'undefined' ? window : global));
