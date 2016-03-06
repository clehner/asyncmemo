module.exports = function (fn /*, args... */) {
  var cache = {/* arg: result */}
  var callbacks = {/* arg: [callback] */}
  var args = [].slice.call(arguments, 1)

  return function (arg, cb) {
    if (arg in cache)
      return cb(null, cache[arg])
    if (arg in callbacks)
      return callbacks[arg].push(cb)
    var cbs = callbacks[arg] = [cb]
    fn.apply(this, args.concat(arg, function (err, result) {
      if (!err)
        cache[arg] = result
      for (var i = 0; i < cbs.length; i++)
        cbs[i](err, result)
      delete callbacks[arg]
    }))
  }
}

