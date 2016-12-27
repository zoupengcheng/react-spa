function classSet (classNames) {
    if (typeof classNames === 'object') {
        return Object.keys(classNames).filter(function (className) {
            return classNames[className]
        }).join(' ')
    } else {
        return Array.prototype.join.call(arguments, ' ')
    }
}

// 解析 'a b c' 为
// [a, b, c]
classSet.parse = function (classes) {
    return classes.split(/\s+/g)
}

module.exports = classSet
