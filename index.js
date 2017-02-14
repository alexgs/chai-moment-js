let moment = require( 'moment' );
let _ = require( 'lodash' );    // TODO Only require necessary modules

const BEFORE = 'before';
const MOMENT = 'moment';

let errorMessages = {
    getBadDate: function( value ) {
        return `AssertionError: expected ${value} to be a Date or Moment, but it is a ${typeof value}: expected false to be true`
    }
};

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

    Assertion.addMethod( MOMENT, function( timestamp, accuracy ) {
        // Do this check independent of `this` so it is not affect by flags
        new Assertion(
            moment.isDate( timestamp ) || moment.isMoment( timestamp ),
            errorMessages.getBadDate( timestamp )
        ).to.be.true();

        let obj = moment.isMoment( this._obj ) ? this._obj : moment( this._obj );
        timestamp = moment.isMoment( timestamp ) ? timestamp : moment( timestamp );

        // Create a curried comparison function, to reduce redundancy
        let compare = null;
        if ( accuracy ) {
            compare = _.curry( obj.isSame.bind( obj ), 1 )( _, accuracy );
        } else {
            compare = _.curry( obj.isSame.bind( obj ), 1 );
        }

        // Do the comparison
        this.assert(
            compare( timestamp ),
            'expected #{exp} to be the same as {#act}',
            'expected #{exp} to not be the same as {#act}',
            obj,
            timestamp
        );
    } );
};

module.exports.messages = errorMessages;
