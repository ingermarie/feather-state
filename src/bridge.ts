export type IRender = {
	refs: Record<string, Element | undefined>;
	unmount: (callback: () => void) => void;
};

declare global {
	interface Window {
		__featherCurrentRender__?: IRender;
	}
}
