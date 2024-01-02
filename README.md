# Feather State
![gzip](https://img.shields.io/badge/gzip-451_bytes-green)
![license](https://img.shields.io/badge/license-ISC-blue)
![version](https://img.shields.io/badge/npm-v1.1.5-blue)

✨ A feather light state framework ✨ 451 bytes minified and gzipped - no dependencies

Live examples:
- [Feather To-Do app](https://codesandbox.io/p/devbox/feather-to-do-app-k5ss8j)
- [Feather To-Do app (inline)](https://codesandbox.io/p/devbox/feather-to-do-inline-4zt7ls)

Companion frameworks:
- Render - [feather-render](https://www.npmjs.com/package/feather-render)
- State React - [feather-state-react](https://www.npmjs.com/package/feather-state-react)

[![coffee](https://img.shields.io/badge/Buy_me_a_coffee%3F_❤️-724e2c)](https://www.paypal.com/paypalme/featherframework)

## Getting started
```
npm i feather-state
```


## Usage
```typescript
import { store } from 'feather-state';

const { watch, ...state } = store({
  completeCount: 1,
  todos: [{
    title: 'Todo 1',
    done: true
  }, {
    title: 'Todo 2',
    done: false
  }]
});

watch(state, 'todos', (next, prev) => {
  console.log(next, prev);
});

function addTodo(title: string): void {
  const newTodo = {
    title: title,
    done: false
  };
  state.todos = [
    ...todoStore.todos,
    newTodo
  ];
};
```

## Documentation
See [example](##Examples) usage below.

### `store()`
```typescript
store(state) => { state, watch() } | { ...state, watch() };
```
#### Parameters
- `state` - state value

#### Return values
- `state` | `...state` - state value
- `watch()` - watch for shallow mutations

---

### `store().watch()`
```typescript
watch(parent, key, callback) => unwatch();
```
#### Parameters
- `parent` - parent object of watched value
- `key` - key of watched value
- `callback()` - function called when value changes

#### Return value
- `unwatch()` - function to unwatch value

## Examples
### Object values: e.g. `array`, `object`
Properties are assigned directly to the store object:

```typescript
const { watch, ...state } = store({
  isPlaying: true,
  playPauseAriaLabel: 'Pause'
});

watch(state, 'isPlaying', (next) => {
  if (next) {
    videoEl.play();
    state.playPauseAriaLabel = 'Pause';
  } else {
    videoEl.pause();
    state.playPauseAriaLabel = 'Play';
  }
});

const handleVisibilitychange = () => {
  if (document.visibilityState === "visible") {
    state.isPlaying = true;
  } else {
    state.isPlaying = false;
  }
};
```

### Primitive values: e.g. `string`, `number`, `boolean`
Values get stored in the `state` property:

```typescript
const { watch, ...isPlaying } = store(true);
const playPauseAriaLabel = store('Pause');

watch(isPlaying, 'state', (next) => {
  if (next) {
    videoEl.play();
    playPauseAriaLabel.state = 'Pause';
  } else {
    videoEl.pause();
    playPauseAriaLabel.state = 'Play';
  }
});

const handleVisibilitychange = () => {
  if (document.visibilityState === "visible") {
    isPlaying.state = true;
  } else {
    isPlaying.state = false;
  }
};
```

## Roadmap 🚀
- Minified version via CDN
- Find more performant way of unwatching values
- Cleaner way of referencing values in watcher parameters
- Get even tinier in size
