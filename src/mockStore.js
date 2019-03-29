import { createStore, none } from '@ushiboy/cyclone';

function defaultUpdate(state) {
  return [state, none()];
}

function processAction(action, extraArgument) {
  if (typeof action === 'function') {
    action = action(extraArgument);
  }
  if (action instanceof Promise) {
    return action;
  } else {
    return Promise.resolve(action);
  }
}

export function createMockStore(initState) {
  const actions = [];
  const update = defaultUpdate;
  let extraArgument;

  let store = createStore(initState, update);
  let originDispatch = store.dispatch;
  const overrideDispatch = action => {
    return processAction(action, extraArgument).then(action => {
      actions.push(action);
      return originDispatch(action);
    });
  };
  // override!
  store.dispatch = overrideDispatch;

  const mockApi = {
    dispatch(action) {
      return store.dispatch(action);
    },

    subscribe(listener) {
      return store.subscribe(listener);
    },

    unsubscribe(listener) {
      store.unsubscribe(listener);
    },

    getState() {
      return store.getState();
    },

    getActions() {
      return actions;
    },

    clearActions() {
      actions.splice(0);
    }
  };

  return {
    ...mockApi,
    withExtraArgument(extra) {
      store = createStore(initState, update, extra);
      originDispatch = store.dispatch;
      store.dispatch = overrideDispatch;
      extraArgument = extra;
      return mockApi;
    }
  };
}
