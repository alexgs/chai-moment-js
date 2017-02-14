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
            let badDates = [ '2011-12-23', 14, { foo: '2016-11-27' } ];
            badDates.forEach( function( value ) {
                expect( function() {
                    expect( 0 ).is.moment( value );
                } ).to.throw( Error, chaiMoment.messages.getBadDate( value ) );
            } );
        } );

        it( 'performs an is-same comparison if no flag is set', function() {
            let m1 = moment( '2016-10-13' );
            let m2 = moment( '2016-10-13' );
            let m3 = moment( '2008-01-20' );
            let m4 = moment( 1487070166773 );
            let m5 = moment( 1487070166000 );

            // Test "pass" condition
            expect( m1 ).is.moment( m2 );
            expect( m2 ).is.not.moment( m3 );
            expect( m4 ).is.not.moment( m5 );

            // Test "fail" condition
            expect( function() {
                expect( m4 ).is.moment( m5 );
            } ).to.throw( Error, chaiMoment.messages.getComparisonError( m4, m5, 'the same as' ) );
        } );

        it( 'accepts an optional second parameter to control the specificity of the comparison', function() {
            let m4 = moment( 1487070166773 );
            let m5 = moment( 1487070166000 );
            let m6 = moment( '2017-02-14T06:02:00.000-05:00' );
            let m7 = moment( '2017-02-14T06:00:00.000-05:00' );
            let m8 = moment( '2017-02-14T16:00:00.000-05:00' );
            let m9 = moment( '2017-02-13' );
            let m10 = moment( '2017-09-13' );

            // Valid options are in the [MomentJS documentation][1]
            // [1]: https://momentjs.com/docs/#/manipulating/start-of/
            expect( m4 ).is.moment( m5, 'second' );
            expect( m4 ).is.moment( m6, 'minute' );
            expect( m4 ).is.moment( m7, 'hour' );
            expect( m4 ).is.moment( m8, 'day' );
            expect( m4 ).is.moment( m9, 'month' );
            expect( m4 ).is.moment( m10, 'year' );
        } );

    } );

    context( 'has a chainable method `before` that', function() {
        it( 'throws an error if it is used to check a value' );

        it( 'returns true if target date is before the specified date', function() {
            let m1 = moment( '2016-12-31' );
            let m2 = moment( '2017-01-01' );
            let m3 = undefined;
            let m4 = moment( 1487070166773 );
            let m5 = moment( 1487070166000 );

            // Test "pass" condition
            expect( m1 ).is.before.moment( m2 );
            expect( m5 ).is.before.moment( m4 );

            // Test "fail" condition
            expect( function() {
                expect( m5 ).is.not.before.moment( m4 );
            } ).to.throw( Error, chaiMoment.messages.getComparisonError( m5, m4, 'before' ) );

            // Test "specificity" parameter
            expect( m5 ).is.same.moment( m4, 'second' );
            expect( m5 ).is.not.before.moment( m4, 'second' );
        } );
    } );
} );
