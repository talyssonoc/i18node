# I18node

TL;DR: It's an i18n package for Node.js, with support to plurals and genders

[![Build Status](https://travis-ci.org/talyssonoc/i18node.svg?branch=master)](https://travis-ci.org/talyssonoc/i18node) [![Dependency manager](https://david-dm.org/talyssonoc/i18node.png)](https://david-dm.org/talyssonoc/i18node)

```sh
	$ npm install i18node
```

## Usage:

```js
	var I18Node = require('i18node');
	
	var options = {
		locales: ['en', 'pt'],
		defaultLocale: 'en',
		defaultGender: 'masc',
		path: './locales'
	};

	var i18n = new I18Node(options);

	i18n.i18n('person'); //person
	i18n.i18n('person', 2); //couple
	i18n.i18n('person', 3); //people
	i18n.i18n('person', { num: 2 }); //couple
	i18n.i18n('hello world', { num: 2, greeting: 'hi'}); //hi worlds
	i18n.i18n('hello world', { greeting: 'olá', locale: 'pt'}); //olá mundo
	i18n.i18n('nidorino', { num: 2 }); //nidorinos
	i18n.i18n('nidorino', { gender: 'masc' }); //nidorino
	i18n.i18n('nidorino', { num: 2, gender: 'fem' }); //nidorinas
	i18n.i18n('none', { gender: 'neutral', locale: 'pt' }); //nenhum

```

And let's say that, inside `./locales` folder we have the files:

`en.json`:

```json
	{
		"person": {
			"1": "person",
			"2": "couple",
			"n": "people"
		},
		"hello word": {
			"1": "{{greeting}} world",
			"n": "{{greeting}} worlds"
		},
		"nidorino": {
			"1" : {
				"masc": "nidorino",
				"fem": "nidorina"
			},
			"n" : {
				"masc": "nidorinos",
				"fem": "nidorinas"
			}
		},
		"none": "none"
	}
```

`pt.json`:

```json
	{
		"person": {
			"1": "pessoa",
			"2": "casal",
			"n": "pessoas"
		},
		"hello word": {
			"1": "{{greeting}} mundo",
			"n": "{{greeting}} mundos"
		},
		"none": {
			"neutral": "nenhum",
			"fem": "nenhuma"
		}
	}
```

## Options

* `locales`: Array of locale names. Default: ['en'])
* `defaultLocale`: Default: 'en'
* `defaultGender`: Default: 'neutral'
* `path`: Path for the locales folder. Default: './locals'

## API

* `setLocale(locale)`: Set the default locale
* `getLocale()`: Return the current default locale
* `setGender(gender)`: Set the default gender
* `getGender()`: Return the current default gender
* `hasLocale(locale)`: Return if the passed locale is supported
* `i18n(term, data)`: Return the internationalized term, using the given data