module.exports = function (fn /*, args... */) {
  var cache = {/* arg: result */}
  var callbacks = {/* arg: [callback] */}
  var args = [].slice.call(arguments, 1)

  return function (arg, cb) {
    if (arg in cache)
      return cb.call(this, null, cache[arg])
    if (arg in callbacks)
      return callbacks[arg].push([this, cb])
    var cbs = callbacks[arg] = [[this, cb]]
    fn.apply(this, args.concat(arg, function (err, result) {
      if (!err)
        cache[arg] = result
      while (cbs.length) {
        cb = cbs.shift()
        cb[1].call(cb[0], err, result)
      }
      delete callbacks[arg]
    }))
  }
}

