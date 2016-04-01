'use strict';

const privateMaps = new WeakMap();

class EventEmitter {
	constructor() {
		const privateMap = new Map();
		privateMap.set('events', new Map());

		privateMaps.set(this, privateMap);
	}

	on(eventName, listener) {
		const events = privateMaps.get(this).get('events')
		const listeners = events.get(eventName);

		if (!listeners) {
			events.set(eventName, new Set());
			return this.on(eventName, listener);
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

	off(eventName, listener) {
		const events = privateMaps.get(this).get('events')
		const argsCount = arguments.length;
		var listeners;
		var keys;

		if (argsCount > 0) {
			listeners = events.get(eventName);

			if (!listeners) {
				return this;
			}
		}

		switch(argsCount) {
			case 1:
				listeners.forEach(listener => this.off(eventName, listener));
				return this;

			case 0:
				keys = events.keys();

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
		const events = privateMaps.get(this).get('events')
		const argsArray = Array.from(arguments);
		const eventName = argsArray[0];
		const listenerArgs = argsArray.slice(1);

		const listeners = events.get(eventName);

		if (!listeners) {
			return this;
		}

		listeners.forEach(listener => listener.apply(this, listenerArgs));

		return this;
	}

	countListeners (eventName) {
		const events = privateMaps.get(this).get('events')
		const listeners = events.get(eventName);
		return listeners ? listeners.size : 0;
	}

	hasListener (eventName, listener) {
		const events = privateMaps.get(this).get('events')
		const listeners = events.get(eventName);
		return listeners ? listeners.has(listener) : false;
	}
}

const EEPrototype = EventEmitter.prototype;

EEPrototype.addListener = EEPrototype.on;
EEPrototype.removeListener = EEPrototype.off;

module.exports = EventEmitter;
