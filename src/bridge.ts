export type IRender = {
	unmount?: (callback: () => void) => void;
};

declare global {
	interface Window {
		__featherCurrentRender__?: null | IRender;
	}
}
