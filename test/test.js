var expect = require('chai').expect;
var path = require('path');
var I18N = require('../');

describe('I18Node tests', function() {
	var i18n;

	beforeEach(function() {
		i18n = new I18N({
			locales: ['en', 'pt'],
			path: path.join(__dirname, 'locales')
		});
	});

  context('when no parameters are sent', function() {
    it('should return nothing', function() {
      expect(i18n.i18n()).to.be.equal('');
    });
  });

  context("when it doesn't have the searched term", function() {
    context('when no extra arguments are passed', function() {
      it('should return the term itself', function() {
        expect(i18n.i18n('nope')).to.be.equal('nope');
      });
    });

    context('when arguments are passed', function() {
      it('should return the term itself', function() {
        expect(i18n.i18n('nope', { num: 2 })).to.be.equal('nope');
      });
    });
  });

  context('when it has the searched term', function() {
    context("when the term don't need data", function () {
    	it('should return the correct data', function() {
    		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('World')).to.be.equal('Hello, World');
    	});
    });

    context('when term has plurals', function() {
    	it('should return term in the correct plural form', function() {
    		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', 0)).to.be.equal('Hello, Nobody');
    		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', 1)).to.be.equal('Hello, 1 Person');
    		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person')).to.be.equal('Hello, 1 Person');

    		for(var i = 2; i < 5; i++) {
    			expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', i)).to.be.equal('Hello, ' + i + ' People');
    		}
    	});
    });

    context('when locale is changed', function() {
    	it('should return the term in the selected locale', function() {
    		i18n.setLocale('pt');

    		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', 0)).to.be.equal('Olá, Ninguém');
    		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', 1)).to.be.equal('Olá, 1 Pessoa');
    		expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person')).to.be.equal('Olá, 1 Pessoa');

    		for(var i = 2; i < 5; i++) {
    			expect(i18n.i18n('Hello') + ', ' + i18n.i18n('Person', i)).to.be.equal('Olá, ' + i + ' Pessoas');
    		}
    	});
    });

    context('when gender is passed', function() {
    	it('should return the term in the selected gender', function() {
    		i18n.setLocale('pt');

    		expect(i18n.i18n('from', { gender: 'neutral' })).to.be.equal('de');
    		expect(i18n.i18n('from', { gender: 'masc' })).to.be.equal('do');
    		expect(i18n.i18n('from', { gender: 'fem' })).to.be.equal('da');
    		expect(i18n.i18n('from', { gender: 'masc', num: 2 })).to.be.equal('dos');
    		expect(i18n.i18n('from', { gender: 'fem', num: 2 })).to.be.equal('das');
    	});

      context('when gender has plural', function() {
      	it('should return the right gender in the plural form', function() {

      		expect(i18n.i18n('none')).to.be.equal('none');
      		expect(i18n.i18n('none', { gender: 'neutral' })).to.be.equal('none');
      		expect(i18n.i18n('none', { gender: 'fem' })).to.be.equal('none');
      		expect(i18n.i18n('none', { gender: 'fem', num: 2 })).to.be.equal('none');

      		i18n.setLocale('pt');

      		expect(i18n.i18n('none', { locale: 'pt' })).to.be.equal('nenhum');
      		expect(i18n.i18n('none', { gender: 'neutral', locale: 'pt', num: 2 })).to.be.equal('nenhum');
      		expect(i18n.i18n('none', { gender: 'fem', locale: 'pt' })).to.be.equal('nenhuma');
      	});
      });
    });
  });
});
