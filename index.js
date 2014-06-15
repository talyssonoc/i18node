var Mustache = require('mustache'),
	path = require('path'),
	_ = require('lodash');

var I18Node = function I18Node(options) {
	options = options || {};

	this.locales = options.locales || ['en'];
	this.defaultLocale = options.defaultLocale || 'en';
	this.defaultGender = options.defaultGender || 'neutral';
	this.path = options.path || path.join(process.cwd(), '/locales');

	this._loadLocales();
};

I18Node.prototype = {
	setLocale: function setLocale(newLocale) {
		this.defaultLocale = newLocale;
	},

	getLocale: function getLocale () {
		return this.defaultLocale;
	},

	setGender: function setLocale(newGender) {
		this.defaultGender = newGender;
	},

	getGender: function getLocale () {
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
				if(_.isObject(arguments[1])) {

					arguments[1].locale = arguments[1].locale || currentLocale;
					arguments[1].gender = arguments[1].gender || currentGender;
					arguments[1].num = (typeof arguments[1].num !== 'undefined' ? arguments[1].num : 1);

					return this._translate(arguments[0], arguments[1]);
				}

				return this._translate(arguments[0], { locale: currentLocale, num: 1, gender: currentGender });
		}
	},

	_loadLocales: function _loadLocales() {
		var _locale,
			locale;

		this._localesData = {};

		for(_locale in this.locales) {
			locale = this.locales[_locale];

			try {
				this._localesData[locale] = require(path.join(this.path, locale + '.json'));
			}
			catch(e) {
				console.error(e);
				process.exit();
			}
		}
	},

	_translate: function _translate(term, data) {
		if(this.locales.indexOf(data.locale) === -1) {
			data.locale = this.defaultLocale
		}

		term = this._localesData[data.locale][term] || this._localesData[this.defaultLocale][term] || term;

		if(typeof term === 'undefined') {
			return '';
		}

		if(_.isString(term)) {
			return Mustache.render(term, data);
		}

		//Get the number
		if(_.isObject(term)) {
			if(data.num === 1) {
				term = term['1'] || term;
			}
			else {
				term = term['' + data.num] || term['n'] || term;
			}

			//Get the gender
			if(_.isObject(term)) {
				term = term[data.gender] || term[this.defaultGender];
			}

			return Mustache.render(term, data);
		}
		return '';
	}
};


module.exports = I18Node;