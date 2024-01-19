type Watchers = WeakMap<
	object,
	Record<PropertyKey, ((next: any, prev: any) => void)[]>
>;

const watch: IStore['watch'] = function(this: Watchers, parent, key, callback) {
	let value = parent[key];
	Object.defineProperty(parent, key, {
		configurable: true,
		enumerable: true,
		set: (newValue) => {
			const refWatchers = this.get(parent);
			const keyWatchers = refWatchers?.[key];
			const previousValue = value;
			if (newValue === previousValue) return;

			value = newValue;
			keyWatchers?.forEach((w) => w(newValue, previousValue));
		},
		get: () => {
			return value;
		}
	});

	// Watch
	let refWatchers = this.get(parent);
	let keyWatchers = refWatchers?.[key];

	if (!refWatchers) {
		refWatchers = {};
		this.set(parent, refWatchers);
	}
	if (!keyWatchers) {
		keyWatchers = [];
		refWatchers[key] = keyWatchers;
	}
	keyWatchers.push(callback);

	const unwatch = () => {
		const index = keyWatchers ? keyWatchers.indexOf(callback) : -1;

		if (index !== -1) {
			keyWatchers?.splice(index, 1);
		}
		if (refWatchers && !keyWatchers?.length) {
			delete refWatchers[key];
		}
		if (refWatchers && !Object.keys(refWatchers).length) {
			this.delete(parent);
		}
	};
	if (typeof window !== 'undefined' && typeof window.__featherCurrentRender__?.unmount === 'function') {
		window.__featherCurrentRender__.unmount(unwatch);
	}
	return unwatch;
};

declare class IStore<S = unknown> {
	constructor(state: S);
	/**
	 * Watch for shallow mutations
	 * @param parent - Parent object of `key`
	 * @param key - Key of `parent` to watch
	 * @param callback - Callback to call when `parent[key]` changes
	 * @returns {() => void} - Unwatch function
	 * @example
	 * import { store } from 'feather-state';
	 *
	 * const { watch, ...state } = store({
	 * 	greeting: 'Hello, World!'
	 * });
	 *
	 * const unwatch = watch(state, 'greeting', (next, prev) => {
	 * 	console.log(next, prev);
	 * });
	 */
	watch: <P extends object, K extends Exclude<keyof P, keyof IStore>>(
		parent: P,
		key: K,
		callback: (next: P[K], prev: P[K]) => void
	) => () => void;;
}

function Store<S = unknown>(this: Store<S>, state: S) {
	const watchers: Watchers = new WeakMap();

	Object.assign(this, state !== null && !Array.isArray(state) && typeof state === 'object' ? state : { state });
	Object.defineProperties(this, {
		watch: { value: watch.bind(watchers) }
	});
}

/**
 * Create a new instance of `Store`
 * @param state {(undefined|null|boolean|number|string|array|object)} - State value
 * @returns {Store}
 * @example
 * import { store } from 'feather-state';
 *
 * const greetingStore = store({
 * 	greeting: 'Hello, World!'
 * });
 */
export const store = <S>(state: S) => {
	return new (Store<S> as any)(state) as { [K in keyof Store<S>]: Store<S>[K] };
}

export type Store<S = unknown> = (S extends object ? S : { state: S }) & IStore<S>;
