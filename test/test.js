'use strict';

var chai = require('chai');

chai.expect();
chai.should();

var expect = chai.expect;

var I18N = require('../'),
	i18n = new I18N({
		locales: ['en', 'pt']
	});


describe('I18Node tests', function() {

    it('Should return nothing when no parameters are sent', function() {
    	expect(i18n.i18n()).to.be.eql('');
    });

    it('Should return "Hello, World"', function() {
    	expect(i18n.i18n('Hello') + ', ' + i18n.i18n('World')).to.be.eql('Hello, World');
    });

    it('Should return "Hello, Nobody", then "Hello, Person", then "Hello, n People"', function() {
		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', 0)).to.be.eql('Hello, Nobody');
		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', 1)).to.be.eql('Hello, 1 Person');
		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person')).to.be.eql('Hello, 1 Person');

    	for(var i = 2; i < 5; i++) {
    		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', i)).to.be.eql('Hello, ' + i + ' People');
    	}
    });

    it('Should return "Olá, Ninguém", then "Olá, Pessoa", then "Olá, n Pessoas" in portuguese', function() {
    	i18n.setLocale('pt');

		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', 0)).to.be.eql('Olá, Ninguém');
		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', 1)).to.be.eql('Olá, 1 Pessoa');
		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person')).to.be.eql('Olá, 1 Pessoa');

    	for(var i = 2; i < 5; i++) {
    		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', i)).to.be.eql('Olá, ' + i + ' Pessoas');
    	}

    	i18n.setLocale('en');
    });

    it('Should return the right gender', function() {
    	i18n.setLocale('pt');

		expect(i18n.i18n('from', { gender: 'neutral' })).to.be.eql('de');
		expect(i18n.i18n('from', { gender: 'masc' })).to.be.eql('do');
		expect(i18n.i18n('from', { gender: 'fem' })).to.be.eql('da');
		expect(i18n.i18n('from', { gender: 'masc', num: 2 })).to.be.eql('dos');
		expect(i18n.i18n('from', { gender: 'fem', num: 2 })).to.be.eql('das');


    	i18n.setLocale('en');
    });

    it('Should return the right gender #2', function() {

        expect(i18n.i18n('none')).to.be.eql('none');
        expect(i18n.i18n('none', { gender: 'neutral' })).to.be.eql('none');
        expect(i18n.i18n('none', { gender: 'fem' })).to.be.eql('none');
        expect(i18n.i18n('none', { gender: 'fem', num: 2 })).to.be.eql('none');

        i18n.setLocale('pt');

        expect(i18n.i18n('none', { locale: 'pt' })).to.be.eql('nenhum');
        expect(i18n.i18n('none', { gender: 'neutral', locale: 'pt', num: 2 })).to.be.eql('nenhum');
        expect(i18n.i18n('none', { gender: 'fem', locale: 'pt' })).to.be.eql('nenhuma');

        i18n.setLocale('en');
    });

});