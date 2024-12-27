# Feather State
![gzip](https://img.shields.io/badge/gzip-468_bytes-green)
![license](https://img.shields.io/badge/license-ISC-blue)
![version](https://img.shields.io/badge/npm-v1.1.13-blue)

✨ A feather light state framework ✨ 468 bytes minified and gzipped - no dependencies

Companion frameworks:
- [feather-render](https://www.npmjs.com/package/feather-render)
- [feather-state-react](https://www.npmjs.com/package/feather-state-react)

Live examples:
- [Feather To-Do app](https://codesandbox.io/p/devbox/feather-to-do-app-k5ss8j)
- [Feather To-Do app (inline)](https://codesandbox.io/p/devbox/feather-to-do-inline-4zt7ls)

[![coffee](https://img.shields.io/badge/Buy_me_a_coffee%3F_❤️-634832)](https://www.paypal.com/paypalme/featherframework)

## Getting started
### Package
```
npm i feather-state
```

### ...or inline
```html
<head>
  <script src="feather-state.min.js"></script>
</head>
<body>
  <script>
    const { store } = window.__feather__ || {};
  </script>
</body>
```

## Index
Usage
- [Basic syntax](#basic-syntax)

Documentation
- [`store()`](#store)

Examples
- [Object values](#object-values)
- [Primitive values](#primitive-values)

## Usage
### Basic syntax
```ts
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
### `store()`
```ts
const { watch, state } = store(null);
const { watch, state } = store(undefined);
const { watch, state } = store(true);
const { watch, state } = store(0);
const { watch, state } = store('Hello, World!');
const { watch, state } = store(['Item 1', 'Item 2']);
const { watch, ...state } = store({ key: 'value' });
```
#### Parameters
- `state` - value

#### Return values
- `state` | `...state` - value
- `watch()` - watch for shallow mutations

### `store().watch()`
```ts
const unwatch = watch(parent, 'key', (next, prev) => {
  console.log(next, prev);
});
```
#### Parameters
- `parent` - parent object of watched value
- `key` - key of watched value
- `callback()` - function called when value changes

#### Return value
- `unwatch()` - function to unwatch value

## Examples
### Object values
```ts
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

### Primitive values
```ts
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
- Find more performant way of unwatching values
- Cleaner way of referencing values in watcher parameters
- Get even tinier in size
