let moment = require( 'moment' );
let _ = require( 'lodash' );    // TODO Only require necessary modules

const AFTER = 'after';
const BEFORE = 'before';
const BETWEEN = 'betweenMoments';
const MOMENT = 'moment';
const SAME_OR_AFTER = 'sameOrAfter';
const SAME_OR_BEFORE = 'sameOrBefore';

let ensureMoment = function( date ) {
    return moment.isMoment( date ) ? date : moment( date )
};

let errorMessages = {
    getBadDate: function( value ) {
        return `AssertionError: expected ${value} to be a Date or Moment, but `
            + `it is a ${typeof value}: expected false to be true`
    },

    getBetweenError: function( actual, start, end ) {
        let format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
        actual = ensureMoment( actual ).format( format );
        start = ensureMoment( start ).format( format );
        end = ensureMoment( end ).format( format );

        return [
            `expected ${actual} to be between ${start} and ${end}`,
            `expected ${actual} to not be between ${start} and ${end}`,
            actual,
            start + ' <---> ' + end
        ];
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
    },

    noFlagsForBetween: 'No flags can be used with the `betweenMoments` comparison.'
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

    Assertion.addChainableMethod( AFTER, chainableError( AFTER ), function() {

    } );

    Assertion.addChainableMethod( BEFORE, chainableError( BEFORE ), function() {
        utils.flag( this, namespace( BEFORE ), true );
    } );

    Assertion.addChainableMethod( SAME_OR_AFTER, chainableError( SAME_OR_AFTER ), function() {

    } );

    Assertion.addChainableMethod( SAME_OR_BEFORE, chainableError( SAME_OR_BEFORE ), function() {
        utils.flag( this, namespace( SAME_OR_BEFORE ), true );
    } );

    Assertion.addMethod( BETWEEN, function( start, end, accuracy, inclusivity ) {
        // I said, NO FLAGS ALLOWED!
        if ( utils.flag( this, namespace( AFTER ) )
          || utils.flag( this, namespace( BEFORE ) )
          || utils.flag( this, namespace( SAME_OR_AFTER ) )
          || utils.flag( this, namespace( SAME_OR_BEFORE ) ) ) {
            throw new Error( errorMessages.noFlagsForBetween );
        }

        // Do this check independent of `this` so it is not affect by flags
        new Assertion(
            moment.isDate( start ) || moment.isMoment( start ),
            errorMessages.getBadDate( start )
        ).is.true();
        new Assertion(
            moment.isDate( end ) || moment.isMoment( end ),
            errorMessages.getBadDate( end )
        ).is.true();

        // Make sure that we have Moment objects
        let obj = ensureMoment( this._obj );
        start = ensureMoment( start );
        end = ensureMoment( end );

        // Use a curried function, so we don't type the args to `this.assert` every time
        let compareThisTo = null;
        if ( inclusivity ) {
            compareThisTo = _.curry( obj.isBetween.bind( obj ), 4 )( _, _, accuracy, inclusivity );
        } else if ( accuracy ) {
            compareThisTo = _.curry( obj.isBetween.bind( obj ), 3 )( _, _, accuracy );
        } else {
            compareThisTo = _.curry( obj.isBetween.bind( obj ), 2 )( _, _ );
        }

        // Do the comparison
        let [ positive, negative, actual, expected ] = errorMessages
            .getBetweenError( obj, start, end );
        this.assert( compareThisTo( start, end )
            , positive, negative, expected, actual, true );
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
        if ( utils.flag( this, namespace( SAME_OR_BEFORE ) ) ) {
            comparatorFn = obj.isSameOrBefore.bind( obj );
            comparatorMsg = 'same or before';
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
