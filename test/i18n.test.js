var expect = require('chai').expect;
var path = require('path');
var I18N = require('../');

describe('I18Node tests', function() {
	var i18n;
  var availableLocales = ['en', 'pt'];
  var localesPath = path.join(__dirname, 'locales');

	beforeEach(function() {
		i18n = new I18N({
			locales: availableLocales,
      defaultLocale: 'en',
      defaultGender: 'neutral',
			path: localesPath
		});
	});

  describe('#i18n', function() {
    context('when no parameters are sent', function() {
      it('should return nothing', function() {
        expect(i18n.i18n()).to.equal('');
      });
    });

    context('when second parameter is of invalid type', function() {
      it('should throw an error', function() {
        expect(function() {
          i18n.i18n('something', []);
        }).to.throw(Error);
      });
    });

    context("when it doesn't have the searched term", function() {
      context('when no extra arguments are passed', function() {
        it('should return the term itself', function() {
          expect(i18n.i18n('nope')).to.equal('nope');
        });
      });

      context('when arguments are passed', function() {
        it('should return the term itself', function() {
          expect(i18n.i18n('nope', { num: 2 })).to.equal('nope');
        });
      });
    });

    context('when the term does not require parameters', function() {
      it('should return the correct translation', function() {
        expect(i18n.i18n('dev')).to.equal('development');
      });
    });

    context('when the term require parameters', function() {
      it('should return the correct translation using the parameter', function() {
        expect(i18n.i18n('greeting', { name: 'world' })).to.equal('hello, world');
      });
    });

    context('when the term has different genders', function() {
      it('should return the translation with the correct gender', function() {
        expect(i18n.i18n('human', { gender: 'masc' })).to.equal('man');
        expect(i18n.i18n('human', { gender: 'fem' })).to.equal('woman');
        expect(i18n.i18n('human', { gender: 'neutral' })).to.equal('person');
      });

      context('when no gender is passed', function() {
        it('should use the default gender', function() {
          expect(i18n.i18n('human')).to.equal('person');
        });
      });

      context('when the term does not have the passed gender', function() {
        it('should use the default gender', function() {
          expect(i18n.i18n('human', { gender: 'cyborg' })).to.equal('person');
        });
      });
    });

    context('when the term has plural forms', function() {
      it('should return the translation with the correct plural', function() {
        expect(i18n.i18n('person', { num: 1 })).to.equal('person');
        expect(i18n.i18n('person', { num: 2 })).to.equal('couple');
      });

      context('when no number is passed', function() {
        it('should use 1 as default', function() {
          expect(i18n.i18n('person')).to.equal('person');
        });
      });

      context('when the term does not have the passed number', function() {
        context('when term has plural for n', function() {
          it('should use n as default', function() {
            expect(i18n.i18n('person', { num: 5 })).to.equal('people');
          });
        });

        context('when term has no plural for n', function() {
          it('should return the term itself', function() {
            expect(i18n.i18n('side', { num: 3 })).to.equal('side');
          });
        });
      });

      context('when number is passed directly instead of arguments object', function() {
        it('should return the translation with the correct plural', function() {
          expect(i18n.i18n('person', 1)).to.equal('person');
          expect(i18n.i18n('person', 2)).to.equal('couple');
        });
      });
    });

    context('when the term has different genders and plural forms', function() {
      context('when term has passed gender and number', function() {
        it('should return the correct translation', function() {
          expect(i18n.i18n('nidorino', { num: 1, gender: 'masc' })).to.equal('nidorino');
          expect(i18n.i18n('nidorino', { num: 1, gender: 'fem' })).to.equal('nidorina');
        });
      });

      context('when term has passed gender but not passed number', function() {
        it('should return the correct translation using n as default number', function() {
          expect(i18n.i18n('nidorino', { num: 2, gender: 'masc' })).to.equal('nidorinos');
          expect(i18n.i18n('nidorino', { num: 2, gender: 'fem' })).to.equal('nidorinas');
        });
      });

      context('when term has passed number but not passed gender', function() {
        it('should return the correct translation using the default gender', function() {
          expect(i18n.i18n('nidorino', { num: 1, gender: '?' })).to.equal('nidorino');
        });
      });

      context('when term has neither the passed number or gender', function() {
        context('when term has plural for n and translation for the default gender', function() {
          it('should return the correct translation using n as default and default gender', function() {
            expect(i18n.i18n('nidorino', { num: 2, gender: '?' })).to.equal('nidorinos');
          });
        });

        context('when term has no plural for n', function() {
          it('should return the term itself', function() {
            expect(i18n.i18n('pronoun', { num: 2, gender: '?' })).to.equal('pronoun');
          });
        });

        context('when term has no translation for default gender', function() {
          it('should return the term itself', function() {
            expect(i18n.i18n('pronoun', { num: 1, gender: '?' })).to.equal('pronoun');
          });
        });
      });
    });

    context('when using different locale', function() {
      context('when term has translation on passed locale', function() {
        it('should return the translation with the correct locale', function() {
          expect(i18n.i18n('dev', { locale: 'pt' })).to.equal('desenvolvimento');
        });
      });

      context('when term has no translation on passed locale', function() {
        context('when term has translation on passed locale without the territory', function() {
          it('should fallback to passed locale without the territory', function() {
            expect(i18n.i18n('dev', { locale: 'pt-br' })).to.equal('desenvolvimento');
            expect(i18n.i18n('dev', { locale: 'pt_br' })).to.equal('desenvolvimento');
          });
        });

        context('when term has translation neither on passed locale or passed locale without the territory', function() {
          context('when default locale has translation for the term', function() {
            it('should use default locale', function() {
              expect(i18n.i18n('dev', { locale: 'es' })).to.equal('development');
            })
          });

          context('when default locale has no translation for the term', function() {
            it('should return the term itself', function() {
              expect(i18n.i18n('nothing', { locale: 'es' })).to.equal('nothing');
            });
          });
        });
      });
    });

  });

  describe('#getLocale', function() {
    it('should return the current default locale', function() {
      expect(i18n.getLocale()).to.be.equal('en');
    });
  });

  describe('#setLocale', function() {
    it('should change the current default locale', function() {
      i18n.setLocale('pt');
      expect(i18n.getLocale()).to.be.equal('pt');
    });
  });

  describe('#getGender', function() {
    it('should return the current default gender', function() {
      expect(i18n.getGender()).to.be.equal('neutral');
    });
  });

  describe('#setGender', function() {
    it('should change the current default gender', function() {
      i18n.setGender('fem');
      expect(i18n.getGender()).to.be.equal('fem');
    });
  });

  describe('#hasLocale', function() {
    context('when instance has passed locale', function() {
      it('should return true', function() {
        expect(i18n.hasLocale('en')).to.be.ok;
      });
    });

    context('when instance does not have passed locale', function() {
      it('should return true', function() {
        expect(i18n.hasLocale('es')).to.not.be.ok;
      });
    });
  });
});
