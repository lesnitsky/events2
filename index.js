'use strict';

class EventEmitter {
	constructor() {
		this._events = new Map();
	}

	on(eventName, listener) {
		const listeners = this._events.get(eventName);

		if (!listeners) {
			this._events.set(eventName, new Set());
			return this.on.apply(this, arguments);
		}

		this.emit('newListener', eventName, listener);
		listeners.add(listener);

		return this;
	}

	once(eventName, listener) {
		function onceListenerWrapper() {
			listener.apply(this, arguments);
			this.off(eventName, onceListenerWrapper);
		}

		return this.on(eventName, onceListenerWrapper);
	}

	addListener() {
		return this.on.apply(this, arguments);
	}

	off(eventName, listener) {
		this.emit('removeListener', eventName, listener);

		const argsCount = arguments.length;

		switch(argsCount) {
			case 1:
				this._events.set(eventName, new Set());
				return this;

			case 0:
				this._events = new Map();
				return this;
		}

		const listeners = this._events.get(eventName);

		if (!listeners) {
			return this;
		}

		listeners.delete(listener);
		return this;
	}

	removeListener() {
		return this.off.apply(this, arguments);
	}

	removeAllListeners() {
		return this.off();
	}

	emit() {
		const argsArray = Array.from(arguments)
		const eventName = argsArray[0];
		const listenerArgs = argsArray.slice(1);

		const listeners = this._events.get(eventName);

		if (!listeners) {
			return this;
		}

		listeners.forEach(listener => listener.apply(this, listenerArgs));

		return this;
	}
}

module.exports = EventEmitter;
