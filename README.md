# events2

ES2015 implementation of nodejs EventEmitter

## Why?

ES2015 is awesome, so why not?

 * highly readable
 * `class` instead of constructor `function EventEmitter`
 * `Map()` instead of `{}` as events storage
 * `Set()` instead of array as event listeners storage
 * `Array.from(arguments)` instead of `[].slice.call`

## What's different from core EventEmitter?

 * `emitter.off([eventName, listener])` method

   This is an alias for core `emitter.removeListener` AND `emitter.removeAllListeners`. Removes all listeners, or those of the specified event, or specified listener.
 * no `defaultMaxListeners` limit
 * as a result – no `getMaxListners()`/`setMaxListeners()`
 * no `listeners()` and `listenersCount()`


## Notes

As event listeners storage is a `Set()`, if you'll call `emitter.on` for the same event and listener twice, listener will be called only once (listener will be called as many times as it wa added in nodejs core EventEmitter, but I can't see any real use case for this behaviour, please let me know if you rely on this functionality)
