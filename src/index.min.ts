import { Store, store } from './store';
import './bridge';

declare global {
	interface Window {
		__feather__?: { store: <S>(state: S) => Store<S> };
	}
}

window.__feather__ = {
	...(window.__feather__ || {}),
	store,
};
