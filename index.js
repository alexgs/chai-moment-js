let moment = require( 'moment' );
let _ = require( 'lodash' );    // TODO Only require necessary modules

const BEFORE = 'before';
const MOMENT = 'moment';

let ensureMoment = function( date ) {
    return moment.isMoment( date ) ? date : moment( date )
};

let errorMessages = {
    getBadDate: function( value ) {
        return `AssertionError: expected ${value} to be a Date or Moment, but `
            + `it is a ${typeof value}: expected false to be true`
    },

    getChainableError: function( name ) {
        return 'Chainable property "' + name + '" can only be used in a chain, '
            + 'NOT to check a value';
    },

    getComparisonError: function( actual, expected, comparisonPhrase ) {
        let format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
        let act = ensureMoment( actual ).format( format );
        let exp = ensureMoment( expected ).format( format );

        return [
            `expected ${act} to be ${comparisonPhrase} ${exp}`,
            `expected ${act} to not be ${comparisonPhrase} ${exp}`,
            act,
            exp
        ];
    }
};

let namespace = function( name ) {
    const ns = 'moment';
    return ns + '.' + name;
};

let chainableError = function( name ) {
    return function() {
        throw new Error( errorMessages.getChainableError( name ) );
    }
};

module.exports = function( chai, utils ) {
    let Assertion = chai.Assertion;

    Assertion.addChainableMethod( BEFORE, chainableError( BEFORE ), function() {
        utils.flag( this, namespace( BEFORE ), true );
    } );

    Assertion.addMethod( MOMENT, function( timestamp, accuracy ) {
        // Do this check independent of `this` so it is not affect by flags
        new Assertion(
            moment.isDate( timestamp ) || moment.isMoment( timestamp ),
            errorMessages.getBadDate( timestamp )
        ).is.true();

        // Make sure that we have Moment objects
        let obj = ensureMoment( this._obj );
        timestamp = ensureMoment( timestamp );

        // Determine the comparator function and message based on flags
        let comparatorFn = obj.isSame.bind( obj );        // default comparator
        let comparatorMsg = 'the same as';
        if ( utils.flag( this, namespace( BEFORE ) ) ) {
            comparatorFn = obj.isBefore.bind( obj );
            comparatorMsg = 'before';
        }

        // Create a curried comparison function, to reduce redundancy
        let compareThisTo = null;
        if ( accuracy ) {
            compareThisTo = _.curry( comparatorFn, 2 )( _, accuracy );
        } else {
            compareThisTo = _.curry( comparatorFn, 1 );
        }

        // Do the comparison
        let [ positive, negative, actual, expected ] = errorMessages
            .getComparisonError( obj, timestamp, comparatorMsg );
        this.assert( compareThisTo( timestamp ), positive, negative, expected, actual, true );
    } );
};

module.exports.messages = errorMessages;
