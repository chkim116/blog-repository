// Observable는 구현하지 않았다.

export type EmptyObject = {};

export type CombinedState<S> = EmptyObject & S;

export type ExtendState<State, Extension> = [Extension] extends [never]
	? State
	: State & Extension;

/**
 * State는 Combined가 된다.
 * 이는 createStore의 4번째 arg가 필요하다.
 */
export type PreloadedState<S> = Required<S> extends EmptyObject
	? S extends CombinedState<infer S1>
		? { [K in keyof S1]?: S1[K] extends object ? PreloadedState<S1[K]> : S1[K] }
		: S
	: {
			[K in keyof S]: S[K] extends string | number | boolean | symbol
				? S[K]
				: PreloadedState<S[K]>;
	  };

export interface Action<T = any> {
	type: T;
}

export interface AnyAction extends Action {
	[extraProps: string]: any;
}

/**
 * dispatch는 type 값을 필수로 받는 한편,
 * AnyAction interface를 통해 extraProps를 사용자가 마음껏 지정할 수 있도록 하였다.
 */
export interface Dispatch<A extends Action = AnyAction> {
	<T extends A>(action: T, ...extraArgs: any[]): T;
}

export interface Unsubscribe {
	(): void;
}

/**
 * store
 */
export interface Store<S = any, A extends Action = AnyAction> {
	dispatch: Dispatch<A>;
	getState(): S;
	subscribe(listener: () => void): Unsubscribe;
}
