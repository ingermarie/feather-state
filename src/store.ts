type Store<S = unknown> = {
	watchers: WeakMap<
		object,
		Record<PropertyKey, ((next: any, prev: any) => void)[]>
	>;
	watch: <R extends object, K extends keyof R>(
		ref: R,
		key: K,
		notify: (next: R[K], prev: R[K]) => void
	) => () => void;
} & (S extends object ? S : { state: S });

function store<S>(state: S): Store<S> {
	const watchers: Store['watchers'] = new WeakMap();

	const watch: Store['watch'] = (ref, key, notify) => {
		let internalValue = ref[key];
		Object.defineProperty(ref, key, {
			set: (value) => {
				const refWatchers = watchers.get(ref);
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
		let refWatchers = watchers.get(ref);
		let keyWatchers = refWatchers?.[key];

		if (!refWatchers) {
			refWatchers = {};
			watchers.set(ref, refWatchers);
		}
		if (!keyWatchers) {
			keyWatchers = [];
			refWatchers[key] = keyWatchers;
		}
		const length = keyWatchers.push(notify);
		const index = length - 1;

		// Unwatch
		return () => {
			const refWatchers = watchers.get(ref);
			const keyWatchers = refWatchers?.[key];
			if (!refWatchers) return;

			keyWatchers?.splice(index, 1);

			if (!keyWatchers?.length) {
				delete refWatchers[key];
			}
			if (!Object.keys(refWatchers).length) {
				watchers.delete(ref);
			}
		};
	};

	const storeApi = {} as Store<S>;

	Object.defineProperties(storeApi, {
		watchers: { value: watchers },
		watch: { value: watch },
	});

	if (state !== null && typeof state === 'object') {
		Object.assign(storeApi, state);
	} else {
		Object.assign(storeApi, { state });
	}
	return storeApi;
}

export { Store, store };
