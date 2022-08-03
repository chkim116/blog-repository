/**
 * 리덕스의 스토어를 생성한다.
 * enhancer는 생략하였다.
 */
export default function createStore(reducer, preloadedState) {
    let currentReducer = reducer;
    let currentState = preloadedState;
    let currentListeners = [];
    let nextListeners = currentListeners;
    let isDispatching = false;
    /**
     * 현재 Listeners를 얕게 복사한다.
     */
    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice();
        }
    }
    /**
     * 현재 State를 읽어온다.
     */
    function getState() {
        if (isDispatching) {
            throw new Error('reducer is executing');
        }
        return currentState;
    }
    /**
     * dispatch가 일어날 시 subscribe을 발동한다.
     */
    function subscribe(listener) {
        let isSubscribed = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);
        return function unsubscribe() {
            if (!isSubscribed) {
                return;
            }
            if (isDispatching) {
                throw new Error('reducer is executing');
            }
            isSubscribed = false;
            ensureCanMutateNextListeners();
            const index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
            currentListeners = null;
        };
    }
    /**
     * state를 변경하는 함수
     * 현재의 state를 reducer가 return한 값으로 변경한다.
     */
    function dispatch(action) {
        if (typeof action.type === 'undefined') {
            throw new Error('Actions may not have an undefined "type" property.');
        }
        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.');
        }
        try {
            isDispatching = true;
            currentState = currentReducer(currentState, action);
        }
        finally {
            isDispatching = false;
        }
        const listeners = (currentListeners = nextListeners);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
        return action;
    }
    const store = {
        dispatch,
        getState,
        subscribe,
    };
    return store;
}
