/*
 * Description: UCM6100 WebGUI
 * Copyright (C) 2016 Grandstream Networks, Inc.
 *
 */

let Validator = function() {}

Validator.prototype = {
    initConfig: {
        // required: function(param, element, result) {
        //     var text = ''

        //     if (result === 1) {
        //         text = "LANG2818"
        //     } else {
        //         text = "LANG2150");
        //     }

        //     return text
        // },
        remote: "LANG2151",
        email: "LANG2152",
        url: "LANG2153",
        date: "LANG2154",
        dateISO: "LANG2155",
        number: "LANG2156",
        digits: "LANG2157",
        creditcard: "LANG2158",
        equalTo: "LANG2159",
        maxlength: "LANG2160",
        minlength: "LANG2161",
        rangelength: "LANG2162",
        range: "LANG2147",
        max: "LANG2163",
        min: "LANG2164",
        smaller: "LANG2165",
        bigger: "LANG2142",
        ipDns: "LANG2166",
        ipv4withcidr: "LANG2166",
        privateIpv4withcidr: "LANG5236",
        host: "LANG2167",
        urlWithoutProtocol: "LANG2167",
        selectItemMin: "LANG2168",
        selectItemMax: "LANG2169",
        extensionExists: "LANG2126",
        extensionRange: "LANG2170",
        numeric_pound_star: "LANG2171",
        notEqualTo: "LANG2172",
        dialpattern: "LANG2167",
        dialpattern_additional: "LANG2167",
        keyboradNoSpace: "LANG2173",
        keyboradNoSpaceSem: "LANG2174",
        keyboradNoSpaceSem1: "LANG2643",
        outgoingRuleNameExists: "LANG2137",
        stripMax: "LANG2391",
        domain: "LANG2167",
        custom_tz: "LANG2167",
        mask: "LANG2175",
        preip: "LANG2176",
        mac: "LANG2177",
        voicemenuExists: "LANG2178",
        numberOrExtension: "LANG3842",
        phoneNumberOrExtension: "LANG2179",
        callerid: "LANG2290",
        checkSameNetworkSegment: "LANG2176",
        authid: "LANG2489",
        specialauthid: "LANG4445",
        specialauthid1: "LANG4463",
        checkAlphanumericPw: "LANG2635",
        checkNumericPw: "LANG2636",
        identical: "LANG2637",
        versionNum: "LANG4148",
        minValue: "LANG2164",
        calleridSip: "LANG5031",
        specialStr: "LANG5140"
    },
    digits: function(data, value, callback, formatMessage) {
        if (!value || (value && /^\d+$/i.test(value))) {
            callback()
        } else {
            callback(formatMessage({id: "LANG2157"}))
        }
    },
    digitalAndQuote: function(data, value, callback, formatMessage) {
        if (!value || (value && /^\d+(,\d+)*(,)?$/i.test(value))) {
            callback()
        } else {
            callback(formatMessage({id: "LANG3822"}))
        }
    },
    range: function(data, value, callback, formatMessage, min, max) {
        if (value && (value > max || value < min)) {
            callback(formatMessage({id: "LANG2147"}, {0: min + '', 1: max + ''}))
        } else {
            callback()
        }
    },
    required: function(data, value, callback, formatMessage, associate, otherInputValue) {
        if (associate) {
            if ((otherInputValue && !value)) {
                callback(formatMessage({id: "LANG2150"}))
            } else {
                callback()
            }
        } else {
            if (!value || !value.length) {
                callback(formatMessage({id: "LANG2150"}))
            } else {
                callback()
            }
        }
    },
    maxlength: function(data, value, callback, formatMessage, maxlength) {
        if (value && maxlength && value.length > maxlength) {
            callback(formatMessage({id: "LANG2160"}, {0: maxlength}))
        } else {
            callback()
        }
    },
    minlength: function(data, value, callback, formatMessage, minlength) {
        if (value && minlength && value.length < minlength) {
            callback(formatMessage({id: "LANG2161"}, {0: minlength}))
        } else {
            callback()
        }
    },
    notEqualTo: function(data, value, callback, formatMessage, otherInputValue, otherInputLabel) {
        if (value && otherInputValue && (value === otherInputValue)) {
            callback(formatMessage({id: "LANG2172"}, {0: otherInputLabel}))
        } else {
            callback()
        }
    },
    letterswithbasicpunc: function(data, value, callback, formatMessage) {
        if (value && !/^[a-zA-Z0-9\-.,()'"\s]+$/i.test(value)) {
            callback(formatMessage({id: "LANG2183"}))
        } else {
            callback()
        }
    },
    alphanumeric: function(data, value, callback, formatMessage) {
        if (value && !/^\w+$/i.test(value)) {
            callback(formatMessage({id: "LANG2184"}))
        } else {
            callback()
        }
    },
    specialhost: function(data, value, callback, formatMessage, errMsg) {
        if (!value || /^((([hH][Tt][Tt][Pp][Ss])|(([Tt][Ff]|[Ff]|[Hh][Tt])[Tt][Pp])):\/\/)?(((([a-z]|\d|-|\.|~|[A-Z])|(%[\da-f]{2})|[\-\.])*)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[A-Z])|(([a-z]|\d|[A-Z])([a-z]|\d|-|\.|~|[A-Z])*([a-z]|\d|[A-Z])))\.)+(([a-z]|[A-Z])|(([a-z]|[A-Z])([a-z]|\d|-|\.|~|[A-Z])*([a-z]|[A-Z]|\d)))\.?)(:\d*)?)$/.test(value) ||
            (/^\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\]?$/.test(value) && ((value.contains("[") && value.contains("]")) || (!value.contains("[") && !value.contains("]")))) ||
            /^\[((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\](\:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(value)) {
            callback()
        } else {
            callback(formatMessage({id: "LANG2167"}, {0: errMsg}))
        }
    },
    specialIpAddress: function(data, value, callback, formatMessage) {
        if (!value || /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/i.test(value) ||
            (/^\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\]?$/.test(value) && ((value.contains("[") && value.contains("]")) || (!value.contains("[") && !value.contains("]")))) ||
            /^\[((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\](\:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(value)) {
            callback()
        } else {
            callback(formatMessage({id: "LANG2195"}))
        }
    },
    ipAddress: function(data, value, callback, formatMessage) {
        if (!value || /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/i.test(value) ||
            (/^\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\]?$/.test(value) &&
            ((value.contains("[") && value.contains("]")) || (!value.contains("[") && !value.contains("]"))))) {
            callback()
        } else {
            callback(formatMessage({id: "LANG2195"}))
        }
    },
    ipAddressPort: function(data, value, callback, formatMessage) {
        if (!value || (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])(\:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/i.test(value) ||
            (/^\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\]?$/.test(value) && ((value.contains("[") && value.contains("]")) || (!value.contains("[") && !value.contains("]")))) ||
            /^\[((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\](\:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(value))) {
            callback()
        } else {
            callback(formatMessage({id: "LANG2195"}))
        }
    },
    ipv4Address: function(data, value, callback, formatMessage) {
        const reg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([1-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/

        if (value && !reg.test(value)) {
            callback(formatMessage({id: "LANG2195"}))
        } else {
            callback()
        }
    },
    ipv6: function(data, value, callback, formatMessage) {
        const reg = /^\[?([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\]$|^\[:((:[0-9a-fA-F]{1,4}){1,6}|:)\]$|^\[[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:)\]$|^\[([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:)\]$|^\[([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:)\]$|^\[([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:)\]$|^\[([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?\]$|^\[([0-9a-fA-F]{1,4}:){6}:\]?$/

        if (value && !reg.test(value)) {
            callback(formatMessage({id: "LANG2196"}))
        } else {
            callback()
        }
    },
    ipv4Dns: function(data, value, callback, formatMessage, msg) {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

        if (value && !reg.test(value) || value === "0.0.0.0") {
            callback(formatMessage({id: "LANG2166"}, {0: msg}))
        } else {
            callback()
        }
    },
    ipv6Dns: function(data, value, callback, formatMessage, msg) {
        const reg = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^:((:[0-9a-fA-F]{1,4}){1,6}|:)$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:)$|^([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:)$|^([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:)$|^([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:)$|^([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?$|^([0-9a-fA-F]{1,4}:){6}:$/

        if (value && !reg.test(value)) {
            callback(formatMessage({id: "LANG2166"}, {0: msg}))
        } else {
            callback()
        }
    },
    mask: function(data, value, callback, formatMessage) {
        const reg = /^(((254|252|248|240|224|192|128|0)\.0\.0\.0)|(255\.(254|252|248|240|224|192|128|0)\.0\.0)|(255\.255\.(254|252|248|240|224|192|128|0)\.0)|(255\.255\.255\.(254|252|248|240|224|192|128|0)))$/

        if (value && !reg.test(value)) {
            callback(formatMessage({id: "LANG2175"}))
        } else {
            callback()
        }
    },
    letterDigitUndHyphen: function(data, value, callback, formatMessage) {
        if (value && !/^[a-zA-Z0-9_\-]+$/.test(value)) {
            callback(formatMessage({id: "LANG2200"}))
        } else {
            callback()
        }
    },
    numeric_pound_star: function(data, value, callback, formatMessage) {
        if (value && !/^[0-9#\*]+$/i.test(value)) {
            callback(formatMessage({id: "LANG2171"}))
        } else {
            callback()
        }
    },
    smallerTime: function(data, value, callback, formatMessage, thisLabel, otherInputValue, otherInputLabel) {
        if (value && otherInputValue) {
            if (value._d.getTime() > otherInputValue._d.getTime()) {
                callback(formatMessage({id: "LANG2165"}, {
                        0: thisLabel,
                        1: otherInputLabel
                    }))
            } else {
                callback()
            }
        } else {
            callback()
        }
    },
    biggerTime: function(data, value, callback, formatMessage, thisLabel, otherInputValue, otherInputLabel) {
        if (value && otherInputValue) {
            if (value._d.getTime() < otherInputValue._d.getTime()) {
                callback(formatMessage({id: "LANG2142"}, {
                        0: thisLabel,
                        1: otherInputLabel
                    }))
            } else {
                callback()
            }
        } else {
            callback()
        }
    },
    calleridSip: function(data, value, callback, formatMessage) {
        if (value && !/^([a-zA-Z0-9_\+\*#\-\.]*)$/.test(value)) {
            callback(formatMessage({id: "LANG5031"}))
        } else {
            callback()
        }
    },
    specailCalleridSip: function(data, value, callback, formatMessage) {
        if (value && !/^([a-zA-Z0-9_\+\*#\-\.<>]*)$/.test(value) && ((value.contains("<") && value.contains(">") && /\>$/.test(value)) || (!value.contains("<") && !value.contains(">")))) {
            callback(formatMessage({id: "LANG5375"}))
        } else {
            callback()
        }
    },
    cidName: function(data, value, callback, formatMessage) {
        if (value && !/^[^"@:;)(,]*$/.test(value)) {
            callback(formatMessage({id: "LANG3198"}))
        } else {
            callback()
        }
    },
    keyboradNoSpace: function(data, value, callback, formatMessage) {
        if (value && !/^([a-zA-Z0-9,\.\/<>\?;':"\[\]\\\{\}\|`~!@#\$%\^&\*\(\)\-_=\+]*)$/.test(value)) {
            callback(formatMessage({id: "LANG2173"}))
        } else {
            callback()
        }
    },
    keyboradNoSpaceSpecial: function(data, value, callback, formatMessage) {
        if (value && !/^([a-zA-Z0-9,\.\/<>\?;':\[\]\\\{\}\|~!@#\$%\^&\*\(\)\-_=\+]*)$/.test(value)) {
            callback(formatMessage({id: "LANG5212"}))
        } else {
            callback()
        }
    },
    keyboradNoSpacesemicolon: function(data, value, callback, formatMessage) {
        if (value && !/^([a-zA-Z0-9~!@#\$%\^\*]*)$/.test(value)) {
            callback(formatMessage({id: "LANG4475"}))
        } else {
            callback()
        }
    },
    keyboradNoSpacesemicolon1: function(data, value, callback, formatMessage) {
        if (value && !/^([a-zA-Z0-9~!+@%\*]*)$/.test(value)) {
            callback(formatMessage({id: "LANG2643"}))
        } else {
            callback()
        }
    },
    authid: function(data, value, callback, formatMessage) {
        if (value && !/^([a-zA-Z0-9\.'\|`~!#\$%\^&\*\-_\+]*)$/.test(value)) {
            callback(formatMessage({id: "LANG2489"}))
        } else {
            callback()
        }
    },
    specialauthid: function(data, value, callback, formatMessage) {
        if (value && !/^([a-zA-Z0-9,\.\/':\?~!\$\&\*\(\)\-_=\+]*)$/.test(value)) {
            callback(formatMessage({id: "LANG4445"}))
        } else {
            callback()
        }
    },
    specialauthid1: function(data, value, callback, formatMessage) {
        if (value && !/^([a-zA-Z0-9\.\|`~!#\$%\^\*\-_\+\@]*)$/.test(value)) {
            callback(formatMessage({id: "LANG4463"}))
        } else {
            callback()
        }
    },
    noSpaces: function(data, value, callback, formatMessage) {
        if (value && /\s/g.test(value)) {
            callback(formatMessage({id: "LANG2818"}))
        } else {
            callback()
        }
    },
    noSpacesInFrontAndEnd: function(data, value, callback, formatMessage) {
        if (value && /^\s+|\s+$/g.test(value)) {
            callback(formatMessage({id: "LANG4113"}))
        } else {
            callback()
        }
    },
    alphanumericStarPlusPound: function(data, value, callback, formatMessage) {
        if (value && !/^[a-zA-Z0-9#\*\+]+$/g.test(value)) {
            callback(formatMessage({id: "LANG3842"}))
        } else {
            callback()
        }
    },
    alphanumericUndDotAt: function(data, value, callback, formatMessage) {
        if (value && !/^[a-zA-Z_0-9@.]+$/i.test(value)) {
            callback(formatMessage({id: "LANG4537"}))
        } else {
            callback()
        }
    },
    alphanumericUnd: function(data, value, callback, formatMessage) {
        if (value && !/^[a-zA-Z_0-9]+$/i.test(value)) {
            callback(formatMessage({id: "LANG2203"}))
        } else {
            callback()
        }
    },
    gain: function(data, value, callback, formatMessage, param) {
        if (value && /^(-|\+)?[0-9]*\.?[0-9]*$/i.test(value) && parseFloat(value) >= parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1])) {
            callback(formatMessage({id: "LANG2206"}))
        } else {
            callback()
        }
    },
    email: function(data, value, callback, formatMessage, param) {
        if (value && !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@(([-a-zA-Z0-9])+\.)+([a-zA-Z]{2,4})+$/i.test(value)) {
            callback(formatMessage({id: "LANG2152"}))
        } else {
            callback()
        }
    },
    phoneNumberOrExtension: function(data, value, callback, formatMessage, param) {
        if (value && !/^([a-zA-Z0-9#\*\-\+]*)$/i.test(value)) {
            callback(formatMessage({id: "LANG2179"}))
        } else {
            callback()
        }
    },
    host: function(data, value, callback, formatMessage, param) {
        if (!value || /^((https?|ftp|news):\/\/)?((([a-zA-Z0-9]([a-zA-Z0-9\-]*[\.])+([a-zA-Z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel))|((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])))(\:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?)(\/[a-zA-Z0-9_\-\.~]+)*(\/([a-zA-Z0-9_\-\.]*)(\?[a-zA-Z0-9+_\-\.%=&]*)?)?(#[a-zA-Z][a-zA-Z0-9_]*)?$/.test(value) ||
            (/^((https?|ftp|news):\/\/)?\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\]?(\/([a-zA-Z0-9_\-\.]*)(\?[a-zA-Z0-9+_\-\.%=&]*)?)?(#[a-zA-Z][a-zA-Z0-9_]*)?$/.test(value) && ((value.contains("[") && value.contains("]")) || (!value.contains("[") && !value.contains("]")))) ||
            /^((https?|ftp|news):\/\/)?\[((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\](\:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?(\/([a-zA-Z0-9_\-\.]*)(\?[a-zA-Z0-9+_\-\.%=&]*)?)?(#[a-zA-Z][a-zA-Z0-9_]*)?$/.test(value)) {
            callback()
        } else {
            callback(formatMessage({id: "LANG2167"}, {0: formatMessage({id: param})}))
        }
    },
    ipv4withcidr: function(data, value, callback, formatMessage, param) {
        if (!value || /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])){3}(\/([1-9]|[12]\d|3[0-2]?))?$/i.test(value) ||
            (/^\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))(\/([1-9]|[1-9]\d|1[0-1]\d|12[0-8]?))?\]?$/.test(value) && ((value.match(/\[/) && value.match(/\]/)) || (!value.match(/\[/) && !value.match(/\]/)))) ||
            /^\[((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))(\/([1-9]|[1-9]\d|1[0-1]\d|12[0-8]?))?\](\:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(value)) {
            callback()
        } else {
            callback(formatMessage({id: "LANG2195"}))
        }
    },
    pppoeSecret: function(data, value, callback, formatMessage, param) {
        if (value && !/^[^`|^"]*$/g.test(value)) {
            callback(formatMessage({id: "LANG2996"}))
        } else {
            callback()
        }
    },
    urlWithoutProtocol: function(data, value, callback, formatMessage, param) {
        if (!value || /^(((([a-z]|\d|-|\.|_|~|[A-Z])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[A-Z])|(([a-z]|\d|[A-Z])([a-z]|\d|-|\.|_|~|[A-Z])*([a-z]|\d|[A-Z])))\.)+(([a-z]|[A-Z])|(([a-z]|[A-Z])([a-z]|\d|-|\.|_|~|[A-Z])*([a-z]|[A-Z])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[A-Z])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[A-Z])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[A-Z])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[A-Z])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/.test(value) ||
            (/^\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\]?$/.test(value) && ((value.contains("[") && value.contains("]")) || (!value.contains("[") && !value.contains("]")))) ||
            /^\[((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\](\:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(value)) {
            callback()
        } else {
            callback(formatMessage({id: "LANG2167"}, {0: formatMessage({id: param})}))
        }
    },
    specialStr: function(data, value, callback, formatMessage) {
        if (value && !/^[^#]*$/i.test(value)) {
            callback(formatMessage({id: "LANG5140"}))
        } else {
            callback()
        }
    },
    ipDnsSpecial: function(data, value, callback, formatMessage) {
        if (!value || /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/.test(value) ||
            /^((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))$/.test(value)) {
            callback()
        } else {
            callback(formatMessage({id: "LANG5140"}))
        }
    }
}

module.exports = new Validator()
