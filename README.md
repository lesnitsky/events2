# events2 [![Build Status](https://travis-ci.org/R1ZZU/events2.svg?branch=master)](https://travis-ci.org/R1ZZU/events2)

ES2015 implementation of nodejs [EventEmitter](https://nodejs.org/dist/latest-v4.x/docs/api/events.html)

## Installation

```sh
npm install events2
```

### Run Tests
```sh
npm test
```

## What's different from core EventEmitter?

 * `emitter.off([eventName, listener])` method

   This is an alias for core `emitter.removeListener` AND `emitter.removeAllListeners`. Removes all listeners | all listeners of passed event | passed listener.
 * no `defaultMaxListeners` limit
 * as a result – no `getMaxListners()`/`setMaxListeners()`
 * no `listeners()` and `listenersCount()`


## Notes

As event listeners storage is a `Set()`, if you add same listener for same `'event'` repeatedly, listener will be called only once after `'event'` was emited (listener will be called as many times as it was added in nodejs core EventEmitter)
