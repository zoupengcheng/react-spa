module.exports = {
    name: function (val) {
        return /^[\u4e00-\u9fa5]{1,10}[·.]{0,1}[\u4e00-\u9fa5]{1,10}$/.test(val)
    },
    username: function (val) {
        return /^[a-zA-Z][\w+]{3,16}$/.test(val)
    },
    password: function (val) {
        return /^[@A-Za-z0-9!#$%^&*.~]{6,22}$/.test(val)
    },
    phone: function (val) {
        return /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(val)
    },
    tel: function (val) {
        return /^\d{3}-\d{7,8}|\d{4}-\d{7,8}|(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(val)
    },
    date: function (val) {
        return /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/.test(val)
    },
    email: function (val) {
        return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(val)
    },
    minLength: function (val, length) {
        return val.length >= length
    },
    maxLength: function (val, length) {
        return val.length <= length
    },
    equal: function (val1, val2) {
        return val1 === val2
    },
    required: function (val) {
        return val.length > 0
    },
    region: function (val) {
        return val !== 'fail'
    },
    regex: function (val, reg) {
        var re
        re = new RegExp(reg)
        return re.test(val)
    }
}
