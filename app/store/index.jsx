'use strict'

import { createStore, applyMiddleware } from 'redux'
// import persistState, {mergeState} from 'redux-localstorage'
// import adapter from 'redux-localstorage/lib/adapters/localStorage'
// import persistState from 'redux-localstorage'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
// import io from 'socket.io-client'
import startSocket, {chatMiddleware} from '../socket'
// import {increment, setClientId, setState, setConnectionState} from '../actions'
// import remoteActionMiddleware from '../actions/remote_action_middleware'
// import {outClientViaSocketIO, inClientViaSocketIO} from 'redux-via-socket.io'
 
const loggerMiddleware = createLogger()

export default function configureStore(initialState) {
    const reducer = applyMiddleware(
        chatMiddleware
        // mergeState()
    )(rootReducer, initialState)

    // const socket = io(`${location.protocol}//${location.hostname}:7681`)
    // const storage = adapter(window.localStorage)
    // const storage = window.localStorage
    const createPersistentStore = applyMiddleware(
        thunkMiddleware,
        loggerMiddleware// ,
        // outClientViaSocketIO(socket)
        // remoteActionMiddleware(socket)
        // persistState(storage, 'state')
    )(createStore)

    const store = createPersistentStore(reducer)
    if (module.hot) {
            // Enable Webpack hot module replacement for reducers
            module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default
            store.replaceReducer(nextReducer)
        })
    }

    // initialize for incoming actions
    // inClientViaSocketIO(socket, store.dispatch)

    // socket.on('state', state =>
    //     store.dispatch(setState(state))
    // )
    // const socketStatus = [
    //     'connect',
    //     'connect_error',
    //     'connect_timeout',
    //     'reconnect',
    //     'reconnecting',
    //     'reconnect_error',
    //     'reconnect_failed'
    // ]
    // socketStatus.forEach(ev =>
    //     socket.on(ev, () => store.dispatch(setConnectionState(ev, socket.connected)))
    // )
    return store
}
