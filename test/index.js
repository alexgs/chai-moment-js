let chai = require( 'chai' );
let chaiMoment = require( '../index' );
let dirtyChai = require( 'dirty-chai' );
let moment = require( 'moment' );
// let path = require( 'path' );
// let _ = require( 'lodash' );

chai.use( chaiMoment );
chai.use( dirtyChai );
let expect = chai.expect;

describe( 'chai-moment', function() {
    // --- Some Examples ---
    // let time = moment( '1975-10-17' );
    // expect( time ).is.before.moment( Date.now() );
    // expect( time ).is.sameOrBefore.moment( Date.now() );
    // expect( time ).is.same.moment( time );
    // expect( time ).is.betweenMoments( time );

    context( 'has a method `moment` that', function() {
        it( 'fails if it is not supplied with a Date or Moment object', function() {
            expect( function() {
                expect( 0 ).is.moment( 'some string' );
            } ).to.throw( Error, 'AssertionError: expected \'some string\' to '
                + 'be a Date or Moment, but it is \'string\'' );
        } );

        it( 'performs an is-same comparison if no flag is set', function() {
            let m1 = moment( '2005-08-13' );
            let m2 = moment( '2005-08-13' );
            let m3 = moment( '2008-01-20' );
            let m4 = moment( 1487070166773 );
            let m5 = moment( 1487070166000 );

            // Test "pass" condition
            // expect( m1 ).is.moment( m2 );
            expect( m4 ).is.not.moment( m5 );
            // expect( m4 ).is.moment( m5, 'second' );

            // Test "fail" condition
        } );

        it( 'accepts an optional second parameter to control the specificity of the comparison' );

    } );

    context( 'has a chainable method `before` that', function() {
        it( 'throws an error if it is used to check a value' );
    } );
} );
