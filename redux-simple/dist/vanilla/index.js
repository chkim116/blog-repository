import createStore from './redux/createStore.js';
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
const store = createStore(counter);
const value = document.getElementById('value');
const plusBtn = document.getElementById('plus-btn');
const minusBtn = document.getElementById('minus-btn');
function render() {
    value.innerHTML = store.getState().toString();
}
function setEventListeners() {
    plusBtn.addEventListener('click', () => {
        store.dispatch({ type: 'INCREMENT' });
    });
    minusBtn.addEventListener('click', () => {
        store.dispatch({ type: 'DECREMENT' });
    });
}
// subscribe는 dispatch때 마다 일어난다.
store.subscribe(render);
setEventListeners();
