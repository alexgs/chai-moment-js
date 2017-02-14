let moment = require( 'moment' );
let _ = require( 'lodash' );    // TODO Only require necessary modules

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

    Assertion.addMethod( MOMENT, function( timestamp, accuracy ) {
        this.assert(
            moment.isDate( timestamp ) || moment.isMoment( timestamp ),
            'expected #{exp} to be a Date or Moment, but it is #{act}',
            'this should not be used $F119',
            timestamp,
            typeof timestamp
        );

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
