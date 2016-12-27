import * as actions from './actions/message'
import socketjs from 'socket.js'

let socket = null

export function chatMiddleware(store) {
  return next => action => {
    if (socket && action.type === actions.ADD_MESSAGE) {
      socket.emit('message', action.message)
    }

    return next(action)
  }
}

export default function (store) {
  // make sure socket.js is supported
      if (socketjs.isSupported()) {
        // connect to the server
        let socket = socketjs.connect("192.168.124.169:7681")
        window.socket = socket
        // log messages as they arrive
        socket.receive('greeting', function(msg) {
            console.log(msg)
            store.dispatch(actions.addResponse(msg))
        })
        // log a message if we get disconnected
        socket.disconnect(function() {
          console.log('Temporarily disconnected.')
        })
        // log a message when we reconnect
        socket.reconnect(function() {
          console.log('Reconnected.')
          // whatever we return here is sent back to the server
          return 'reconnected'
        })
        // periodically send messages the server
        // var interval = setInterval(function() {
        //   socket.send('greeting', 'Hello from the client!')
        // }, 3000)
        // if the server disconnects, stop sending messages to it
        socket.close(function() {
          console.log('Connection closed.')
          // clearInterval(interval)
        })
      } else {
        // let the user know that socket.js is not supported
        alert('Your browser does not support WebSockets.')
      }
}
