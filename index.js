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
