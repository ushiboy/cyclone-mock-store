const assert = require('power-assert');
import { createMockStore } from './mockStore.js';

describe('createMockStore', function() {
  const initState = () => ({
    count: 0
  });

  context('default update', () => {
    let store;
    beforeEach(() => {
      store = createMockStore()(initState());
    });
    describe('dispatch', () => {
      it('should push action history', () => {
        store.dispatch({ type: 'increment' });
        const actions = store.getActions();
        assert(actions.length === 1);
        const [a] = actions;
        assert(a.type === 'increment');
      });
    });
  });
});
