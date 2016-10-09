'use strict';

const DEFAULT_MAX_LISTENERS = 10;

class EventEmitter {
	constructor() {
		this._events = new Map();
    this._maxListeners = EventEmitter.defaultMaxListeners;
	}

	on(eventName, listener) {
		const listeners = this._events.get(eventName);

		if (!listeners) {
			this._events.set(eventName, new Set());
			return this.on(eventName, listener);
		}

		this.emit('newListener', eventName, listener);
		listeners.add(listener);

    if(listeners.size > this._maxListeners) {
      console.warn(`Warning: Possible EventEmitter memory leak detected. ${listeners.size} ${eventName} listeners added. Use emitter.setMaxListeners() to increase limit`);
    }

		return this;
	}

	once(eventName, listener) {
		function onceListenerWrapper() {
			listener.apply(this, arguments);
			this.off(eventName, onceListenerWrapper);
		}

		return this.on(eventName, onceListenerWrapper);
	}

	off(eventName, listener) {
		const argsCount = arguments.length;
		var listeners;
		var keys;

		if (argsCount > 0) {
			listeners = this._events.get(eventName);

			if (!listeners) {
				return this;
			}
		}

		switch(argsCount) {
			case 1:
				listeners.forEach(listener => this.off(eventName, listener));
				return this;

			case 0:
				keys = this._events.keys();

				for (let eventName of keys) {
					this.off(eventName);
				}

				return this;
		}

		if (eventName !== 'removeListener') {
			this.emit('removeListener', eventName, listener);
			listeners.delete(listener);
		}

		return this;
	}

	removeAllListeners() {
		return this.off();
	}

	emit() {
    const argsArray = Array.from(arguments);
    const eventName = argsArray[0];
    const listenerArgs = argsArray.slice(1);

		const listeners = this._events.get(eventName);

		if (!listeners || listeners.length === 0) {
			return false;
		}

		listeners.forEach(listener => listener.apply(this, listenerArgs));

		return true;
	}

  eventNames() {
    return Array.from(this._events.keys());
  }

  getMaxListeners() {
    return this._maxListeners;
  }

  setMaxListeners(n) {
    this._maxListeners = n;
    return this;
  }
}

const EEPrototype = EventEmitter.prototype;

EEPrototype.addListener = EEPrototype.on;
EEPrototype.removeListener = EEPrototype.off;
EventEmitter.defaultMaxListeners = DEFAULT_MAX_LISTENERS;

module.exports = EventEmitter;
