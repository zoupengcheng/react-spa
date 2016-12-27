import {message} from 'antd'

const classSet = require('./class-set')
const validator = require('./validator')
const Message = message

const SP = {
    classSet: classSet,
    validator: validator,
    message: Message
}

module.exports = SP
