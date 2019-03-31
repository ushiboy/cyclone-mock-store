const assert = require('power-assert');
import { createMockStore } from './mockStore.js';

describe('createMockStore', function() {
  describe('mockDispatcher', () => {
    const { mockDispatcher } = createMockStore();

    let store;
    beforeEach(() => {
      store = mockDispatcher();
    });
    describe('dispatch', () => {
      context('without extra argument', () => {
        it('should push action history', async () => {
          await store.dispatch({ type: 'increment' });
          await store.dispatch(Promise.resolve({ type: 'decrement' }));
          const actions = store.getActions();
          assert(actions.length === 2);
          const [a1, a2] = actions;
          assert(a1.type === 'increment');
          assert(a2.type === 'decrement');
        });
      });
      context('with extra argument', () => {
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
        beforeEach(() => {
          store = mockDispatcher({
            greet
          });
          return store.dispatch(tweet());
        });
        it('should push action history', () => {
          const actions = store.getActions();
          assert(actions.length === 1);
          const [a] = actions;
          assert(a.type === 'greet');
        });
        it('use extra argument', () => {
          const actions = store.getActions();
          const [a] = actions;
          assert(a.payload.message === greet());
        });
      });
    });
    describe('getState', () => {
      it('should throws the error "Not Implemented."', () => {
        try {
          const state = store.getState();
          assert.fail();
        } catch (e) {
          assert(e.message === 'Not Implemented.');
        }
      });
    });
    describe('subscribe', () => {
      it('should throws the error "Not Implemented."', () => {
        try {
          store.subscribe();
          assert.fail();
        } catch (e) {
          assert(e.message === 'Not Implemented.');
        }
      });
    });
    describe('unsubscribe', () => {
      it('should throws the error "Not Implemented."', () => {
        try {
          store.unsubscribe();
          assert.fail();
        } catch (e) {
          assert(e.message === 'Not Implemented.');
        }
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
});
