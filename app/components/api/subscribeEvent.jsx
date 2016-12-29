import cookie from 'react-cookie'

module.exports = {
    login: {
        "type": "request",
        "message": {
            "transactionid": "123456789zxa",
            "action": "login",
            "username": cookie.load("username"),
            "cookie": cookie.load("session-identify")
        }
    },
    logout: {
        "type": "request",
        "message": {
            "transactionid": "123456789zxb",
            "action": "logout"
        }
    },
    dashboard: {
        "subscribe": [{
            "type": "request",
            "message": {
                "transactionid": "123456789zxc",
                "action": "subscribe",
                "eventnames": ["TrunkStatus", "InterfaceStatus", "ResourceUsageStatus", "EquipmentCapacityStatus"]
            }
        }],
        "unsubscribe": [{
            "type": "request",
            "message": {
                "transactionid": "123456789zxc",
                "action": "unsubscribe",
                "eventnames": ["TrunkStatus", "InterfaceStatus", "ResourceUsageStatus", "EquipmentCapacityStatus"]
            }
        }]
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
