let moment = require( 'moment' );

const BEFORE = 'before';
const MOMENT = 'moment';

let namespace = function( name ) {
    const ns = 'moment';
    return ns + '.' + name;
};

let methodErrorFactory = function( name ) {
    return function methodError() {
        throw new Error( 'Chainable method "' + name + '" can only be used in '
            + 'a chain, NOT to check a value' );
    }
};

module.exports = function( chai, utils ) {
    let Assertion = chai.Assertion;

    Assertion.addChainableMethod( BEFORE, methodErrorFactory( BEFORE ), function() {
        utils.flag( this, namespace( BEFORE ), true );
    } );

    Assertion.addMethod( MOMENT, function( timestamp ) {
        this.assert(
            moment.isDate( timestamp ) || moment.isMoment( timestamp ),
            'expected #{this} to be a Date or Moment, but it is #{act}',
            'this should not be used $F119',
            null,
            typeof timestamp
        );
    } );
};
