class Store<S = unknown> {
	state: S;
	watchers: WeakMap<
		object,
		Record<PropertyKey, ((next: any, prev: any) => void)[]>
	>;
	constructor(state: S) {
		this.state = state;
		this.watchers = new WeakMap();
		this.watch = this.watch.bind(this);
	}
	watch<R extends object, K extends keyof R>(
		ref: R,
		key: K,
		notify: (next: R[K], prev: R[K]) => void,
	) {
		// Setter/Getter
		let internalValue = ref[key];
		Object.defineProperty(ref, key, {
			set: (value) => {
				const refWatchers = this.watchers.get(ref);
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
		// TODO: replace with new object on change?
		let refWatchers = this.watchers.get(ref);
		let keyWatchers = refWatchers?.[key];

		if (!refWatchers) {
			refWatchers = {};
			this.watchers.set(ref, refWatchers);
		}
		if (!keyWatchers) {
			keyWatchers = [];
			refWatchers[key] = keyWatchers;
		}
		const length = keyWatchers.push(notify);
		const index = length - 1;

		// Unwatch
		return () => {
			const refWatchers = this.watchers.get(ref);
			const keyWatchers = refWatchers?.[key];
			if (!refWatchers) return;

			keyWatchers?.splice(index, 1);

			if (!keyWatchers?.length) {
				delete refWatchers[key];
			}
			if (!Object.keys(refWatchers).length) {
				this.watchers.delete(ref);
			}
		};
	}
}

const store = <S>(data: S) => {
	return new Store<S>(data);
};

export { Store, store };
