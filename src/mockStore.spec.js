const assert = require('power-assert');
import { createMockStore } from './mockStore.js';

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
});
