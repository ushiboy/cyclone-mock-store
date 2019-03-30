export function createMockStore(initState) {
  const actions = [];
  const listeners = new Set();
  let extraArgument;

  const mockApi = {
    dispatch(action) {
      return processAction(action, extraArgument).then(action => {
        actions.push(action);
      });
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    unsubscribe(listener) {
      listeners.delete(listener);
    },

    getState() {
      return initState;
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
      extraArgument = extra;
      return mockApi;
    }
  };
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
