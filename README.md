# Cyclone-Mock-Store


[![Build Status](https://travis-ci.org/ushiboy/cyclone-mock-store.svg?branch=master)](https://travis-ci.org/ushiboy/cyclone-mock-store)

Cyclone-Mock-Store is a testing tools for [Cyclone](https://www.npmjs.com/package/@ushiboy/cyclone).

## Quick Sample

Here is an example of a test.

```javascript
const assert = require('power-assert');
import { createMockStore } from '@ushiboy/cyclone-mock-store';
const { mockDispatcher } = createMockStore();

function increment() {
  return { type: 'increment' };
}

function greet() {
  return async ({ fetchMessage }) => {
    return {
      type: 'greeting',
      payload: {
        message: await fetchMessage()
      }
    };
  };
}

describe('actions', function() {
  describe('increment', () => {
    it('should returns "increment" type of action', async () => {
      const store = mockDispatcher();
      await store.dispatch(increment());

      const [a] = store.getActions();
      assert(a.type === 'increment');
    });
  });

  describe('greet', () => {
    let store;
    beforeEach(() => {
      store = mockDispatcher({
        async fetchMessage() {
          return 'hello';
        }
      });
    });
    it('should returns "greeting" type of action', async () => {
      await store.dispatch(greet());

      const [a] = store.getActions();
      assert(a.type === 'greeting');
    });
    it('should returns payload of message', async () => {
      await store.dispatch(greet());

      const [a] = store.getActions();
      assert(a.payload.message === 'hello');
    });
  });
});
```

## API

### createMockStore

It return a `MockAPI`.

```javascript
createMockStore(): MockAPI
```

### MockAPI

It is an API that mocks the `Store`.

```
type MockAPI = {
  mockDispatcher<E, A>(extra: ?E): MockStore<E, A>
};
```

#### mockDispatcher

It create and return a `MockStore` from the extra argument.

```javascript
mockDispatcher<E, A>(extra: ?E): MockStore<E, A>
```

### MockStore

Record the actions executed.

```javascript
type MockStore<E, A> = {
  dispatch(a: A | Promise<A> | (e: E) => (A | Promise<A>)): Promise<void>,
  getActions(): Array<A>,
  clearActions(): void
};
```

#### dispatch

It execute `Action` against `MockStore`.

```javascript
dispatch(a: A | Promise<A> | (e: E) => (A | Promise<A>)): Promise<void>
```

#### getActions

It returns the recorded actions.

```javascript
getActions(): Array<A>
```

#### clearActions

It clear the recorded actions.

```javascript
clearActions(): void
```

## Change Log

### 0.1.0

Initial Cyclone-Mock-Store release.

## License

MIT
