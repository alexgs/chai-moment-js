# Chai Moment

**Chai Moment** is a plugin for the [Chai][1] assertion library that provides date/time comparisons. It is a wrapper for some of the query functions in the [MomentJS][2] date library. Use **Chai Moment** to write fluent BDD/TDD tests and get useful error messages.

In other words, _don't_ do this:

```javascript
expect( moment( '2016-12-31' ).isSame( '2017-01-01' ) ).to.be.true;
// => "expected false to be true"
```

Do this instead:

```javascript
expect( moment('2016-12-31') ).is.same.moment( '2017-01-01' );
// => "expected 2016-12-31 00:00:00 to be 2017-01-01 00:00:00"
```

[1]: http://chaijs.com/
[2]: https://momentjs.com/

## Usage

Include the plugin as normal:

```javascript
let chai = require( 'chai' );
let chaiMoment = require( 'chai-moment' );

chai.use( chaiMoment );
let expect = chai.expect;
```

### Test Methods

**Chai Moment** provides two methods that can used to compare dates: `moment` and `betweenMoments`.

#### moment( date, [accuracy] )

In the default usage, `moment` is a wrapper for the MomentJS's [`isSame`][3] query function. (See "Flags" below for how to change behavior from the default.) It has one required argument, `date`, which can be either a a native JavaScript Date object or a Moment object from MomentJS. The optional argument, `accuracy`, specifies the accuracy of the comparison. You can use any of the vales recognized by MomentJS's [`startOf`][4] function, but the most common ones are:

- second
- minute
- hour
- day
- month
- year

You can use them like this:

```javascript
let m0 = moment( 1487070166000 );
let m1 = moment( 1487070166773 );
expect( m1 ).is.same.moment( m0 );               // => false
expect( m1 ).is.same.moment( m0, 'second' );     // => true
```

[3]: https://momentjs.com/docs/#/query/is-same/
[4]: https://momentjs.com/docs/#/manipulating/start-of/

#### betweenMoments( start, end, [accuracy], [inclusivity] )

This is a wrapper for MomentJS's [`isBetween`][5] query function. It requires `start` and `end` arguments, which may be either a Date or a Moment. The `accuracy` parameters functions as in the `moment` function; it will accept `null` for millisecond accuracy.

Finally, the `inclusivity` parameter determines whether to return true or false if the object-under-test matches the `start` or `end` argument. Basically, a parenthesis excludes an exact match (returns false) while a square bracket includes an exact match (returns true). The default is to exclude on exact matches.

The following table explains inclusivity in more concrete terms:

| argument | result of exact match on `start` | result of exact match on `end` |
| --- | --- | --- |
| '()' | `false` | `false` |
| '[]' | `true` | `true` |
| '(]' | `false` | `true` |
| '[)' | `true` | `false` |

The meaning of "exact match" is determined by the `accuracy` parameter.

Some examples:

```javascript
let m0 = moment( 1487070166000 );
let m1 = moment( 1487070166500 );
let m2 = moment( 1487070166773 );
expect( m1 ).is.betweenMoments( m0, m2 );                       // => true
expect( m1 ).is.betweenMoments( m0, m2, 'second' );             // => false
expect( m1 ).is.betweenMoments( m0, m2, 'second', '[]' );       // => true
expect( m0 ).is.betweenMoments( m0, m2 );                       // => false
expect( m0 ).is.betweenMoments( m0, m2, null, '[)' );           // => true
expect( m0 ).is.betweenMoments( m0, m2, null, '(]' );           // => false
expect( m2 ).is.betweenMoments( m0, m2, null, '[)' );           // => false
expect( m2 ).is.betweenMoments( m0, m2, null, '(]' );           // => true
```

[5]: https://momentjs.com/docs/#/query/is-between/

### Flags

#### before

#### after

#### sameOrBefore

#### sameOrAfter

## Thanks

Thanks to @mguterl for [chai-datetime][3], which inspired this plugin.

[3]: https://github.com/mguterl/chai-datetime

## License

The content of this repository is licensed under the [3-Clause BSD license][4]. Please see the enclosed [license file][5] for specific terms.

[4]: https://opensource.org/licenses/BSD-3-Clause
[5]: https://github.com/philgs/chai-moment/blob/master/LICENSE.md
