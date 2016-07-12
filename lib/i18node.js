var path = require('path');
var Mustache = require('mustache');
var _ = require('lodash');

function I18Node(_options) {
  var options = _options || {};

  this.locales = options.locales || ['en'];
  this.defaultLocale = options.defaultLocale || 'en';
  this.defaultGender = options.defaultGender || 'neutral';
  this.path = options.path || path.join(process.cwd(), '/locales');

  this._loadLocales();
}

I18Node.prototype = {
  setLocale: function setLocale(locale) {
    this.defaultLocale = locale;
  },

  getLocale: function getLocale() {
    return this.defaultLocale;
  },

  setGender: function setLocale(gender) {
    this.defaultGender = gender;
  },

  getGender: function getLocale() {
    return this.defaultGender;
  },

  hasLocale: function hasLocale(locale) {
    return this.locales.indexOf(locale) > -1;
  },

  i18n: function i18n() {
    var currentLocale = this.defaultLocale;
    var currentGender = this.defaultGender;

    switch(arguments.length) {
    case 0:
      return '';

    case 1:
      return this._translate(arguments[0], { locale: currentLocale, num: 1, gender: currentGender });

    case 2:
    default:
      if(_.isNumber(arguments[1])) {
        return this._translate(arguments[0], { locale: currentLocale, num: arguments[1], gender: currentGender });
      }

      if(_.isObject(arguments[1]) && !_.isArray(arguments[1])) {
        arguments[1].locale = arguments[1].locale || currentLocale;
        arguments[1].gender = arguments[1].gender || currentGender;
        arguments[1].num = (typeof arguments[1].num !== 'undefined' ? arguments[1].num : 1);

        return this._translate(arguments[0], arguments[1]);
      }

      throw new Error('Invalid data argument type passed as second parameter of I18Node#i18n.');
    }
  },

  _loadLocales: function _loadLocales() {
    this._localesData = {};

    this.locales.forEach(function(locale) {
      this._localesData[locale] = require(path.join(this.path, locale + '.json'));
    }.bind(this));
  },

  _translate: function _translate(_term, data) {
    var term = this._getTermInLocale(_term, data.locale.toLowerCase());

    if(!term) {
      return _term;
    }

    if(_.isString(term)) {
      return this._renderTerm(term, data);
    }

    if(data.num === 1) {
      term = term['1'] || term;
    } else {
      term = term['' + data.num] || term.n || term;
    }

    if(_.isObject(term)) {
      term = term[data.gender] || term[this.defaultGender];
    }

    if(!term) {
      return _term;
    }

    return this._renderTerm(term, data);
  },

  _renderTerm: function _renderTerm(term, data) {
    return Mustache.render(term, data);
  },

  _getTermInLocale: function _getTermInLocale(term, locale) {

    var matchedLocale = _.find([
      locale,
      this._localeWithoutTerritory(locale, '-'),
      this._localeWithoutTerritory(locale, '_'),
      this.defaultLocale
    ], function(l) {
      return this._localesData[l] && this._localesData[l][term];
    }.bind(this));

    if(matchedLocale) {
      return this._localesData[matchedLocale][term];
    }

    return false;
  },

  _localeWithoutTerritory: function _localeWithoutTerritory(locale, separator) {
    return locale.split(separator)[0];
  }
};

module.exports = I18Node;
