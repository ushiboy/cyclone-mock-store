export function createMockStore() {
  function mockDispatcher(extra = undefined) {
    const actions = [];

    const mockApi = {
      dispatch(action) {
        return processAction(action, extra).then(action => {
          actions.push(action);
        });
      },

      subscribe() {
        throw new Error('Not Implemented.');
      },

      unsubscribe() {
        throw new Error('Not Implemented.');
      },

      getState() {
        throw new Error('Not Implemented.');
      },

      getActions() {
        return actions;
      },

      clearActions() {
        actions.splice(0);
      }
    };
    return mockApi;
  }

  return {
    mockDispatcher
  };
}

function processAction(action, extra) {
  if (typeof action === 'function') {
    action = action(extra);
  }
  if (action instanceof Promise) {
    return action;
  } else {
    return Promise.resolve(action);
  }
}
