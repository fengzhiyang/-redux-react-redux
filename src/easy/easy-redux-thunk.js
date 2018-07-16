export const thunk = ({ dispatch, getState }) => next => action => { 
    // if (typeof action === 'function') {
    //     return action(dispatch,getState)
    // }
    if (Array.isArray(action)) {
        return action.forEach(v=>dispatch(v))
     }
    return next(action)
}