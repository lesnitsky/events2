const sinon = require('sinon');

const EventEmitter = require('../');

var e;
var listener, listener2, listener3;

beforeEach(() => {
  e = new EventEmitter();
  listener = sinon.spy();
  listener2 = sinon.spy();
  listener3 = sinon.spy();
});

describe('#on', () => {
  it('adds new listener', () => {
    e.on('event', listener);
    e.emit('event');
    e.emit('event');

    listener.should.have.been.calledTwice;
  });

  it('emits "newListener"', (done) => {
    e.on('newListener', function (eventName, _listener) {
      eventName.should.equal('event');
      _listener.should.equal(listener);
      this._events.get('event').size.should.equal(0);
      done();
    });

    e.on('event', listener);
  });
});

describe('#addListener', () => {
  it('is an alias for #on', () => {
    e.addListener.should.equal(e.on);
  });
});

describe('#once', () => {
  it('removes listener after first call', () => {
    e.once('event', listener);
    e.emit('event');
    e.emit('event');

    listener.should.have.been.calledOnce;
    e._events.get('event').size.should.equal(0);
  });
});

describe('#off', () => {
  beforeEach(() => {
    e.on('event', listener);
    e.on('event', listener2);
    e.on('event', listener3);
  });

  it('emits "removeListener" for every removed listener', (done) => {
    const pendingListeners = new Set([listener, listener2, listener3]);
    const iterator = pendingListeners.values();
    var nextListener = iterator.next().value;

    e.on('removeListener', function (eventName, listener) {
      eventName.should.equal(eventName);
      listener.should.equal(nextListener);

      const next = iterator.next();

      if (next.done) {
        return done();
      }

      nextListener = next.value;
    });

    e.off('event', listener);
    e.off('event', listener2);
    e.off('event', listener3);
  });

  it('removes specified listener', () => {
    e.off('event', listener);

    const eventsSet = e._events.get('event');
    eventsSet.has(listener).should.equal(false);
    eventsSet.size.should.equal(2);
  });

  it('removes all listeners of specified event', () => {
    e.off('event');

    e._events.get('event').size.should.equal(0);
  });

  it('removes all listeners', () => {
    e.off('event');
    e._events.get('event').size.should.equal(0);
  });
});

describe('#removeListener', () => {
  it('is an alias for #off', () => {
    e.removeListener.should.equal(e.off);
  });
});

describe('#removeAllListeners', () => {
  it('is an alias for #off', () => {
    sinon.spy(e, 'off');
    e.removeAllListeners('event', listener);
    e.off.should.have.been.called;
    e.off.should.have.been.calledOn(e);
  });

  it('ignores passed arguments', () => {
    sinon.spy(e, 'off');
    e.removeAllListeners('event', listener);
    e.off.should.have.been.calledWith();
  });
});

describe('#emit', () => {
  it('calls listeners of specified event', () => {
    e.on('event', listener);
    e.on('event', listener2);

    e.emit('event');
    listener.should.have.been.called;
    listener2.should.have.been.called;
  });

  it('passes correct arguments to listeners', () => {
    e.on('event', listener);
    e.on('event', listener2);

    e.emit('event', 13, 42);
    listener.should.have.been.calledWith(13, 42);
    listener2.should.have.been.calledWith(13, 42);
  });

  it('calls listeners in context of emitter', () => {
    e.on('event', listener);
    e.emit('event', 13, 42);

    listener.should.have.been.calledOn(e);
  });

  it('returns true if event has listeners', () => {
    e.on('event', listener);
    const hasListeners = e.emit('event');

    hasListeners.should.equal(true);
  });

  it('returns false if event has no listeners', () => {
    const hasListeners = e.emit('event');

    hasListeners.should.equal(false);
  });
});
