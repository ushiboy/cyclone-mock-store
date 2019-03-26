import { createStore, none } from '@ushiboy/cyclone';

function defaultUpdate(state) {
  return [state, none()];
}

const NoneActionType = none().type;

function isNoneAction(action) {
  return !(action instanceof Promise) || action.type === NoneActionType;
}

export function createMockStore(initState, update = defaultUpdate) {
  const actions = [];

  const store = createStore(initState, (state, action) => {
    const [nextState, nextAction] = update(state, action);
    if (Array.isArray(nextAction)) {
      actions.push(...nextAction);
    } else if (nextAction != null && !isNoneAction(nextAction)) {
      actions.push(nextAction);
    }
    return [nextState, nextAction];
  });

  return {
    async dispatch(action) {
      actions.push(action);
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
}
