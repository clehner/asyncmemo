var asyncMemo = require('.')
var test = require('tape')

var i = 0
var get = asyncMemo(function (foo, bar, arg, cb) {
  setTimeout(function () {
    cb(i == 3, [foo, bar, arg, i++].join('-'))
  }, 10)
}, 'foo', 'bar')

test('memoize values', function (t) {
  get('thing', function (err, result) {
    t.error(err, 'thing')
    t.equal(result, 'foo-bar-thing-0')

    get('thing', function (err, result) {
      t.error(err, 'thing 2')
      t.equal(result, 'foo-bar-thing-0')

      get('pasta', function (err, result) {
        t.error(err, 'pasta')
        t.equal(result, 'foo-bar-pasta-1')

        get('pasta', function (err, result) {
          t.error(err, 'pasta 2')
          t.equal(result, 'foo-bar-pasta-1')

          get('more', function (err, result) {
            t.error(err, 'more')
            t.equal(result, 'foo-bar-more-2')
            t.end()
          })
        })
      })
    })
  })
})

test('don\'t cache results asynchronously with errors', function (t) {
  get('blah', function (err, result) {
    t.ok(err, 'error')
    setImmediate(function () {
      get('blah', function (err, result) {
        t.error(err, 'blah')
        t.equal(result, 'foo-bar-blah-4')
        t.end()
      })
    })
  })
})

test('handle concurrent requests', function (t) {
  t.plan(4)
  get('one', function (err, result) {
    t.error(err, 'one')
    t.equal(result, 'foo-bar-one-5')
  })
  get('one', function (err, result) {
    t.error(err, 'one 2')
    t.equal(result, 'foo-bar-one-5')
  })
})
