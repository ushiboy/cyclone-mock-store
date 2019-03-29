const assert = require('power-assert');
import { createMockStore } from './mockStore.js';
import sinon from 'sinon';
import { none } from '@ushiboy/cyclone';

describe('createMockStore', function() {
  const initState = () => ({
    count: 0
  });

  context('default update', () => {
    let store;
    beforeEach(() => {
      store = createMockStore(initState());
    });
    describe('dispatch', () => {
      it('should push action history', async () => {
        await store.dispatch({ type: 'increment' });
        const actions = store.getActions();
        assert(actions.length === 1);
        const [a] = actions;
        assert(a.type === 'increment');
      });
    });
    describe('getState', () => {
      it('should return the state of store', () => {
        const state = store.getState();
        assert(state.count === 0);
      });
    });
    describe('getActions', () => {
      it('should return action histories', async () => {
        await store.dispatch({ type: 'increment' });
        await store.dispatch({ type: 'decrement' });
        const actions = store.getActions();
        assert(actions.length === 2);
        const [a1, a2] = actions;
        assert(a1.type === 'increment');
        assert(a2.type === 'decrement');
      });
    });
    describe('clearActions', () => {
      it('should clear action histories', async () => {
        await store.dispatch({ type: 'increment' });
        await store.dispatch({ type: 'decrement' });
        assert(store.getActions().length === 2);
        store.clearActions();
        const actions = store.getActions();
        assert(store.getActions().length === 0);
      });
    });
  });

  context('custom update', () => {
    let store;
    const update = (state, action) => {
      switch (action.type) {
        case 'increment': {
          return [
            {
              count: state.count + 1
            },
            none()
          ];
        }
        case 'decrement': {
          return [
            {
              count: state.count - 1
            },
            none()
          ];
        }
        default: {
          return [state, none()];
        }
      }
    };
    beforeEach(() => {
      store = createMockStore(initState(), update);
    });
    describe('dispatch', () => {
      it('should push action history', async () => {
        await store.dispatch({ type: 'increment' });
        await store.dispatch(Promise.resolve({ type: 'decrement' }));
        await store.dispatch(() => Promise.resolve({ type: 'decrement' }));
        const actions = store.getActions();
        assert(actions.length === 3);
        const [a1, a2, a3] = actions;
        assert(a1.type === 'increment');
        assert(a2.type === 'decrement');
        assert(a3.type === 'decrement');
      });
    });
    describe('getState', () => {
      it('should return the state of store', () => {
        const state = store.getState();
        assert(state.count === 0);
      });
    });
    describe('subscribe()', () => {
      it('should subscribe for store changed', async () => {
        const spy = sinon.spy();
        store.subscribe(spy);
        await store.dispatch({ type: 'increment' });
        assert(spy.calledOnce);
      });
      it('should return unsubscriber', async () => {
        const spy = sinon.spy();
        const unsubscriber = store.subscribe(spy);
        assert(unsubscriber != null);
      });
      describe('unsubscriber', () => {
        it('should unsubscribe for store', async () => {
          const spy = sinon.spy();
          const unsubscriber = store.subscribe(spy);
          await store.dispatch({ type: 'increment' });
          assert(spy.calledOnce);
          unsubscriber();
          await store.dispatch({ type: 'increment' });
          assert(spy.calledOnce);
        });
      });
    });
    describe('unsubscribe()', () => {
      it('should unsubscribe for store', async () => {
        const spy = sinon.spy();
        store.subscribe(spy);
        store.unsubscribe(spy);
        await store.dispatch({ type: 'increment' });
        assert(spy.notCalled);
      });
    });
    describe('getActions', () => {
      it('should return action histories', async () => {
        await store.dispatch({ type: 'increment' });
        await store.dispatch({ type: 'decrement' });
        const actions = store.getActions();
        assert(actions.length === 2);
        const [a1, a2] = actions;
        assert(a1.type === 'increment');
        assert(a2.type === 'decrement');
      });
    });
    describe('clearActions', () => {
      it('should clear action histories', async () => {
        await store.dispatch({ type: 'increment' });
        await store.dispatch({ type: 'decrement' });
        assert(store.getActions().length === 2);
        store.clearActions();
        const actions = store.getActions();
        assert(store.getActions().length === 0);
      });
    });
  });

  describe('withExtraArgument', () => {
    let store;

    const initState = () => ({
      message: ''
    });

    const tweet = () => {
      return ({ greet }) => {
        return {
          type: 'greet',
          payload: {
            message: greet()
          }
        };
      };
    };

    const greet = () => {
      return 'test';
    };

    const update = (state, action) => {
      switch (action.type) {
        case 'greet': {
          return [
            {
              message: action.payload.message
            },
            none()
          ];
        }
        default: {
          return [state, none()];
        }
      }
    };
    beforeEach(() => {
      store = createMockStore(initState(), update).withExtraArgument({
        greet
      });
    });
    describe('dispatch', () => {
      it('should push action history', async () => {
        await store.dispatch(tweet());
        const actions = store.getActions();
        assert(actions.length === 1);
        const [a] = actions;
        assert(a.type === 'greet');
        assert(a.payload.message === greet());
      });
    });
    describe('getState', () => {
      it('should return the state of store', () => {
        const state = store.getState();
        assert(state.message === '');
      });
    });
    describe('getActions', () => {
      it('should return action histories', async () => {
        await store.dispatch({ type: 'foo' });
        await store.dispatch({ type: 'baz' });
        const actions = store.getActions();
        assert(actions.length === 2);
        const [a1, a2] = actions;
        assert(a1.type === 'foo');
        assert(a2.type === 'baz');
      });
    });
    describe('clearActions', () => {
      it('should clear action histories', async () => {
        await store.dispatch({ type: 'foo' });
        await store.dispatch({ type: 'baz' });
        assert(store.getActions().length === 2);
        store.clearActions();
        const actions = store.getActions();
        assert(store.getActions().length === 0);
      });
    });
  });
});
