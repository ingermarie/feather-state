type IStore<S = unknown> = Store<S> & {
	watchers: WeakMap<
		object,
		Record<PropertyKey, ((next: any, prev: any) => void)[]>
	>;
};

type BStore = {
	watch: <P extends object, K extends keyof Omit<P, keyof BStore>>(
		parent: P,
		key: K,
		notify: (next: P[K], prev: P[K]) => void
	) => () => void;
};

export type Store<S = unknown> = BStore & (S extends object ? S : { state: S });

const watch: Store['watch'] = function(this: IStore, parent, key, notify) {
	let internalValue = parent[key];
	Object.defineProperty(parent, key, {
		set: (value) => {
			const refWatchers = this.watchers.get(parent);
			const keyWatchers = refWatchers?.[key];
			const previousValue = internalValue;
			if (value === previousValue) return;

			internalValue = value;
			keyWatchers?.forEach((w) => w(value, previousValue));
		},
		get: () => {
			return internalValue;
		}
	});

	// Watch
	let refWatchers = this.watchers.get(parent);
	let keyWatchers = refWatchers?.[key];

	if (!refWatchers) {
		refWatchers = {};
		this.watchers.set(parent, refWatchers);
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
			this.watchers.delete(parent);
		}
	};
	if (typeof window !== 'undefined' && typeof window.__featherCurrentRender__?.unmount === 'function') {
		window.__featherCurrentRender__.unmount(unwatch);
	}
	return unwatch;
};

export const store = <S>(state: S): Store<S> => {
	const watchers: IStore['watchers'] = new WeakMap();
	const storeApi = state !== null && typeof state === 'object' ? state : { state };

	Object.defineProperties(storeApi, {
		watchers: { value: watchers },
		watch: { value: watch.bind(storeApi) }
	});

	return storeApi as Store<S>;
};
