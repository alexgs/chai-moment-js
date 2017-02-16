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
            let m1 = moment( '2016-10-13' ).toDate();
            let m2 = moment( '2016-10-13' );
            let m3 = moment( '2008-01-20' );
            let m4 = new Date( 1487070166773 );
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

    context( 'has a method `betweenMoments` that', function() {

        it( 'throws if not supplied with two Date or Moment arguments', function() {
            let badDates = [ '2011-12-23', 14, { foo: '2016-11-27' } ];
            let now = moment( Date.now() );

            badDates.forEach( function( value ) {
                expect( function() {
                    expect( 0 ).is.betweenMoments( value, now );
                } ).to.throw( Error, chaiMoment.messages.getBadDate( value ) );
            } );

            badDates.forEach( function( value ) {
                expect( function() {
                    expect( 0 ).is.betweenMoments( now, value );
                } ).to.throw( Error, chaiMoment.messages.getBadDate( value ) );
            } );
        } );

        it( 'determines if the test date is between two supplied dates', function() {
            let start = moment( 1487156500000 );
            let end   = moment( 1487156600000 );
            let m1    = moment( 1487156550000 );
            let m2    = moment( 1487156450000 );
            let m3    = moment( 1487156650000 );

            // Test basic *pass*
            expect( m1 ).is.betweenMoments( start, end );

            // Test basic *fail*
            expect( function() {
                expect( m2 ).is.betweenMoments( start, end );
            } ).to.throw( Error, chaiMoment.messages.getBetweenError( m2, start, end ) );

            expect( function() {
                expect( m3 ).is.betweenMoments( start, end );
            } ).to.throw( Error, chaiMoment.messages.getBetweenError( m3, start, end ) );

            // Test *pass* with specificity
            let m4   = moment( 1487156501900 );
            let end1 = moment( 1487156502500 );
            expect( m4 ).is.betweenMoments( start, end1, 'second' );

            // Test *fail* with specificity
            let end2 = moment( 1487156501999 );
            expect( m4 ).is.betweenMoments( start, end2 );
            expect( function() {
                expect( m4 ).is.betweenMoments( start, end2, 'second' );
            } ).to.throw( Error, chaiMoment.messages.getBetweenError( m4, start, end2 ) );
            expect( m4 ).is.not.betweenMoments( start, end2, 'second' );

            // Test *pass* with specificity and inclusivity
            expect( m4 ).is.betweenMoments( start, end2, 'second', '[]' );

            // Test *pass* with inclusivity
            expect( start ).is.betweenMoments( start, end, null, '[]' );

        } );

        it( 'throws if a flag is set', function() {
            let start = moment( 1487156500000 );
            let m1    = moment( 1487156550000 );
            let end   = moment( 1487156600000 );

            expect( function() {
                expect( m1 ).is.after.betweenMoments( start, end );
            } ).to.throw( Error, chaiMoment.messages.noFlagsForBetween );
            expect( function() {
                expect( m1 ).is.before.betweenMoments( start, end );
            } ).to.throw( Error, chaiMoment.messages.noFlagsForBetween );
            expect( function() {
                expect( m1 ).is.sameOrAfter.betweenMoments( start, end );
            } ).to.throw( Error, chaiMoment.messages.noFlagsForBetween );
            expect( function() {
                expect( m1 ).is.sameOrBefore.betweenMoments( start, end );
            } ).to.throw( Error, chaiMoment.messages.noFlagsForBetween );
        } );
    } );

    context( 'has a chainable method `after` that', function() {

        it( 'throws an error if it is used to check a value', function() {
            let m1 = moment( '2016-12-31' );
            let m2 = moment( '2017-01-01' );
            expect( function() {
                expect( m2 ).is.after( m1 );
            } ).to.throw( Error, chaiMoment.messages.getChainableError( 'after' ) );
        } );

        it( 'returns true if the target date is the after the specified date', function() {
            let m1 = moment( '2017-03-02 08:18:01-0500' ).toDate();
            let m2 = moment( '2017-03-02 08:18:45-0500' ).toDate();

            // Test *pass* condition
            expect( m2 ).is.after.moment( m1 );
            expect( m2 ).is.not.after.moment( m1, 'minute' );
            expect( m2 ).is.same.moment( m1, 'minute' );

            // Test *fail* condition
            expect( function() {
                expect( m1 ).is.after.moment( m2 );
            } ).to.throw( Error, chaiMoment.messages.getComparisonError( m2, m1, 'after' ) );
        } );
    } );

    context( 'has a chainable method `before` that', function() {

        it( 'throws an error if it is used to check a value', function() {
            let m1 = moment( '2016-12-31' );
            let m2 = moment( '2017-01-01' );
            expect( function() {
                expect( m1 ).is.before( m2 );
            } ).to.throw( Error, chaiMoment.messages.getChainableError( 'before' ) );
        } );

        it( 'returns true if target date is before the specified date', function() {
            let m1 = moment( '2016-12-31' );
            let m2 = moment( '2017-01-01' );
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

    context( 'has a chainable method `sameOrAfter` that', function() {

        it( 'throws an error if it is used to check a value', function() {
            let m1 = moment( '2016-12-31' );
            let m2 = moment( '2017-01-01' );
            expect( function() {
                expect( m1 ).is.sameOrAfter( m1 );
            } ).to.throw( Error, chaiMoment.messages.getChainableError( 'sameOrAfter' ) );
        } );

        it( 'returns true if the target date is the same as or after the specified date' );
    } );

    context( 'has a chainable method `sameOrBefore` that', function() {

        it( 'throws an error if it is used to check a value', function() {
            let m1 = moment( '2016-12-31' );
            let m2 = moment( '2017-01-01' );
            expect( function() {
                expect( m2 ).is.sameOrBefore( m2 );
            } ).to.throw( Error, chaiMoment.messages.getChainableError( 'sameOrBefore' ) );
        } );

        it( 'returns true if the target date is the same as or before the specified date', function() {
            let m1 = moment( '2017-03-02 08:18:01-0500' ).toDate();
            let m2 = moment( '2017-03-02 08:18:45-0500' ).toDate();

            // Test *pass* condition
            expect( m1 ).is.sameOrBefore.moment( m2 );
            expect( m1 ).is.before.moment( m2 );
            expect( m1 ).is.not.before.moment( m2, 'minute' );
            expect( m1 ).is.sameOrBefore.moment( m2, 'minute' );

            // Test *fail* condition
            expect( function() {
                expect( m2 ).is.sameOrBefore.moment( m1 );
            } ).to.throw( Error, chaiMoment.messages.getComparisonError( m2, m1, 'same or before' ) );
        } );

    } );

} );
