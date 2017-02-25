# Chai MomentJS

**Chai MomentJS** is a plugin for the [Chai][1] assertion library that provides date/time comparisons. It is a wrapper for some of the query functions in the [MomentJS][2] date library. Use **Chai MomentJS** to write fluent BDD/TDD tests and get useful error messages.

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
let chaiMoment = require( 'chai-moment-js' );

chai.use( chaiMoment );
let expect = chai.expect;
```

### Test Methods

**Chai MomentJS** provides two methods that can used to compare dates: `moment` and `betweenMoments`.

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
expect( m1 ).is.same.moment( m0 );              // => false
expect( m1 ).is.same.moment( m0, 'second' );    // => true
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

These flags change the behavior of the `moment` comparison function. This allows you to write fluent TDD/BDD statements like `expect( fileDate ).is.before.moment( myDate )`.

Don't combine flags. That's bad, like crossing-the-streams bad.

#### before

The **before** flag tells **Chai MomentJS** to use MomentJS's [`isBefore`][6] query function.

```javascript
let m0 = moment( 1487070166000 );
let m1 = moment( 1487070166773 );
expect( m0 ).is.before.moment( m1 );            // => true
expect( m0 ).is.before.moment( m1, 'second' );  // => false
```

[6]: https://momentjs.com/docs/#/query/is-before/

#### after

The **after** flag tells **Chai MomentJS** to use MomentJS's [`isAfter`][7] query function.

```javascript
let m0 = moment( 1487070166000 );
let m1 = moment( 1487070166773 );
expect( m1 ).is.after.moment( m0 );             // => true
expect( m1 ).is.after.moment( m0, 'second' );   // => false
```

[7]: https://momentjs.com/docs/#/query/is-after/

#### sameOrBefore

The **sameOrBefore** flag tells **Chai MomentJS** to use MomentJS's [`isSameOrBefore`][8] query function.

```javascript
let m0 = moment( 1487070166000 );
let m1 = moment( 1487070166773 );
expect( m0 ).is.sameOrBefore.moment( m1 );              // => true
expect( m0 ).is.sameOrBefore.moment( m1, 'second' );    // => true
```

[8]: https://momentjs.com/docs/#/query/is-same-or-before/

#### sameOrAfter

The **sameOrAfter** flag tells **Chai MomentJS** to use MomentJS's [`isSameOrAfter`][9] query function.

```javascript
let m0 = moment( 1487070166000 );
let m1 = moment( 1487070166773 );
expect( m1 ).is.sameOrAfter.moment( m0 );               // => true
expect( m1 ).is.sameOrAfter.moment( m0, 'second' );     // => true
```

[9]: https://momentjs.com/docs/#/query/is-same-or-after/

## Thanks

Thanks to:

- @mguterl for [chai-datetime][3], which inspired this plugin.
- @fastfrwrd for [chai-moment][10], which I didn't know about until I got a name collision upon running `npm publish`!

[3]: https://github.com/mguterl/chai-datetime
[10]: https://www.npmjs.com/package/chai-moment

## License

The content of this repository is licensed under the [3-Clause BSD license][4]. Please see the enclosed [license file][5] for specific terms.

[4]: https://opensource.org/licenses/BSD-3-Clause
[5]: https://github.com/philgs/chai-moment/blob/release/LICENSE.md
