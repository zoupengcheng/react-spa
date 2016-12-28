import cookie from 'react-cookie'

module.exports = {
    login: {
        "subscribe": [{
            "type": "request",
            "message": {
                "transactionid": "123456789zxa",
                "action": "login",
                "username": cookie.load("username"),
                "cookie": cookie.load("session-identify")
            }
        }],
        "unsubscribe": []
    },
    logout: [{
        "type": "request",
        "message": {
            "transactionid": "123456789zxb",
            "action": "logout"
        }
    }],
    dashboard: {
        "subscribe": [{
            "type": "request",
            "message": {
                "transactionid": "123456789zxc",
                "action": "subscribe",
                "eventnames": ["InterfaceStatus"]
            }
        }],
        "unsubscribe": []
    },
    extension: {
        "subscribe": [{
            "type": "request",
            "message": {
                "transactionid": "123456789zxc",
                "action": "subscribe", 
                "eventnames": ["ExtensionStatus"]
            }
        }],
        "unsubscribe": []
    }
}
