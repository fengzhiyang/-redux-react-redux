const EASY_REDUX_INIT = '@@RASY_REDUX_INIT';

export function createStore(reducer, enhancer) {
    enhancer || enhancer(createStore)(reducer);
    let currentState = {};
    let currentListeners = [];

    function getState() { 
        return currentState
    }

    function subscribe(listener) { 
        if (typeof listener === 'function') {
            currentListeners.push(listener)
         }
    }

    function dispatch(action) {
        currentState = reducer(currentState, action);
        currentListeners.forEach(v=>v())
        return action;
    }

    dispatch({ EASY_REDUX_INIT });

    return {
        getState,
        subscribe,
        dispatch
    }
    
}
export function applyMiddleWare(...middleWares) {
    return createStore => (...args) => { 
        const store = createStore(...args);
        let dispatch = store.dispatch;
        const midApi = {
            getState: store.getState,
            dispatch:(...args)=>dispatch(...args)
        }
        let middleWareChian = middleWares.map(middleware => middleware(midApi));
        dispatch = compose(...middleWareChian)(store.dispatch)
        return {
            ...store,
            dispatch
        }
    }
}
 
export function compose(...funcs) { 
    if (funcs.length === 0) {
         return arg => arg
    }
    if (funcs.length === 1) { 
        return funcs[0]
    }
    return funcs.reduce((ret, item) => (...args) => ret(item(...args)))

}

function bindActionCreator(creator, dispatch) {
    return (...args)=>dispatch(creator(...args))
 };
export function bindActionCreators(creators, dispatch) {
    let bound = {};
    Object.keys(creators).forEach(v => {
        let creator = creators[v];
        bound[v] = bindActionCreator(creator,dispatch);
    })
    return bound
 }