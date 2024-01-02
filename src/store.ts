type Watchers = WeakMap<
	object,
	Record<PropertyKey, ((next: any, prev: any) => void)[]>
>;

const watch: Store['watch'] = function(this: Watchers, parent, key, notify) {
	let value = parent[key];
	Object.defineProperty(parent, key, {
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
	keyWatchers.push(notify);

	const unwatch = () => {
		const index = keyWatchers ? keyWatchers.indexOf(notify) : -1;

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

declare class Store<S = unknown> {
	constructor(state: S)
	watch: <P extends object, K extends keyof Omit<P, 'watch'>>(
		parent: P,
		key: K,
		notify: (next: P[K], prev: P[K]) => void
	) => () => void;
}

function Store<S = unknown>(this: Store<S>, state: S) {
	const watchers: Watchers = new WeakMap();

	Object.assign(this, state !== null && typeof state === 'object' ? state : { state });
	Object.defineProperties(this, {
		watch: { value: watch.bind(watchers) }
	});
}

export const store = <S>(state: S) => {
	return new Store<S>(state) as Store<S> & (S extends object ? S : { state: S });
}

export { Store };
