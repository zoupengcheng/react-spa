/*
 * Description: UCM6100 WebGUI
 * Copyright (C) 2016 Grandstream Networks, Inc.
 *
 */

import $ from 'jquery'
import { message } from 'antd'
import { browserHistory } from 'react-router'

let UCMGUI = function() {}

UCMGUI.prototype = {
    initConfig: {
        paths: {
            baseServerURl: '/cgi'
        },
        errorCodes: {
            "-77": "LANG5239", // CGICODE_BACKUP_LOST_CONFERENCE
            "-75": "LANG5062", // CGICODE_BACKUP_LOST_CONFERENCE
            "-74": "LANG5061", // CGICODE_BACKUP_LOST_EXTENSION
            "-73": "LANG2313", // CGICODE_BACKUP_NET_MODE_ERR
            "-72": "LANG1658", // CGICODE_BACKUP_LOST_FXO_NUM
            "-71": "LANG4829", // username doesn't exist
            "-68": "LANG4757", // Login_Restriction
            "-66": "LANG4464", // GOOGLE_CODE
            "-65": "LANG4453", // CGICODE_DOWNLOAD_ZC_TEMPLATE_LIST_FAILED
            "-64": "LANG4144", // CGICODE_UPDATE_ZC_MODEL_FAILED
            "-63": "LANG4383", // FAX_SENDING
            "-62": "LANG4383", // FAX_SENDING
            "-61": "LANG4308", // 
            "-60": "LANG4307", // USER_SENDING_FAX
            "-59": "LANG4306", // SEND_FAX_MEMBER
            "-58": "LANG4221", // GOOGLE_CALENDAR
            "-57": "LANG4196", // CGICODE_FORGET_PASSWORD_NOEMAIL
            "-56": "LANG4194", // CGICODE_FORGET_PASSWORD_NOEMAIL
            "-51": "LANG920", // CGICODE_ANOTHER_TASK_IS_RUNNING
            "-50": "LANG3964", // CGICODE_COMMAND_CONTAINS_SENSITIVE_CHARACTERS
            "-49": "LANG2146", // CGICODE_FILE_EXISTED
            "-48": "LANG3870", // CGICODE_FILESYSTEM_READ_ONLY
            "-47": "LANG914", // "CGICODE_NO_PERMISSION"
            "-46": "LANG3468", // "CGICODE_EXCLUSIVE_FILE_OPERATION"
            "-45": "LANG3468", // "CGICODE_EXCLUSIVE_CMD_OPERATION"
            "-44": "LANG3467", // "CGICODE_CONSTRAINT_UNIQUE"
            "-43": "LANG3466", // "CGICODE_CONSTRAINT_FOREIGNKEY"
            "-42": "LANG3465", // "CGICODE_REOPERATION"
            "-41": "LANG3464", // "CGICODE_TOO_MUCH_USER_LOGINING"
            "-40": "LANG3212", // "CGICODE_SFTP_CONNETION_FAILED"
            "-39": "LANG3211", // "CGICODE_SFTP_PUT_FAILED"
            "-38": "LANG3210", // "CGICODE_SFTP_MKDIR_FAILED"
            "-37": "LANG3209", // "CGICODE_WRONG_ACCOUNT_OR_PASSWORD"
            "-36": "LANG3208", // "CGICODE_NO_SERVER_ADDRESS"
            "-35": "LANG3070", // "CGICODE_ROUTE_BAD_IFACE"
            "-34": "LANG3069", // "CGICODE_ROUTE_BAD_DEST"
            "-33": "LANG3068", // "CGICODE_ROUTE_DEL_CMD_ERR"
            "-32": "LANG3067", // "CGICODE_ROUTE_DEL_GW_CONFLICT"
            "-31": "LANG3066", // "CGICODE_ROUTE_DEL_DB_ERR"
            "-30": "LANG3065", // "CGICODE_ROUTE_BAD_GW"
            "-29": "LANG3064", // "CGICODE_ROUTE_SVIP_CONFLICT"
            "-28": "LANG3063", // "CGICODE_ROUTE_BAD_MASK"
            "-27": "LANG3062", // "CGICODE_ROUTE_ADD_ERR"
            "-26": "LANG2982", // "CGICODE_DB_GET_ERR"
            "-25": "LANG2981", // "CGICODE_DB_UPDATE_ERR"
            "-24": "LANG2980", // "CGICODE_DB_OP_ERR"
            "-23": "LANG2979", // "CGICODE_MOD_NOT_MATCH"
            "-22": "LANG2978", // "CGICODE_DIR_NOT_EXIST"
            "-21": "LANG968", // "CGICODE_DISK_FULL"
            "-20": "LANG2977", // "CGICODE_FILE_INVALID"
            "-19": "LANG2976", // "CGICODE_UNSUPPORT"
            "-18": "LANG2975", // "CGICODE_NO_SUCH_TARGET"
            "-17": "LANG2974", // "CGICODE_TARGET_IS_REQURIED"
            "-16": "LANG2973", // "CGICODE_NO_SUCH_KEY"
            "-15": "LANG2972", // "CGICODE_INVALID_VALUE"
            "-14": "LANG2971", // "CGICODE_TSHOOT_RUNNING"
            "-13": "LANG2970", // "CGICODE_TSHOOT_INVALID"
            "-12": "LANG2969", // "CGICODE_TSHOOT_INVALID_FILTER"
            "-11": "LANG2968", // "CGICODE_FILE_ISNT_EXIST"
            "-9": "LANG909", // "CGICODE_ERROR"
            "-8": "LANG2967", // "CGICODE_TIMEOUT"
            "-7": "LANG2966", // "CGICODE_CONNECTION_CLOSED"
            "-6": "LANG2965", // "CGICODE_COOKIE_ERROR"
            "-5": "LANG2983", // "CGICODE_NEED_AUTH"
            "-1": "LANG962", // "CGICODE_INVALID_PARAM"
            "1": "LANG912", // CGICODE_FILE_OP_UNKNOWN_TYPE
            "2": "LANG913", // CGICODE_FILE_OP_ERR_NORMAL
            "3": "LANG914", // CGICODE_FILE_OP_NOT_PERMITTED
            "4": "LANG915", // CGICODE_FILE_OP_TOO_LARGE
            "5": "LANG2984", // CGICODE_FILE_OP_ERR_PROCESSING
            "6": "LANG2985" // CGICODE_FILE_OP_ERR_PRE_CHECK
        }
    },
    makeSyncRequest: function(params) { // for making synchronus requests
        // usage ::  UCMGUI.makeSyncRequest ( { action :'getconfig', filename: 'something.conf' } ) // no need for call back function
        var s = $.ajax({
            type: 'POST',
            url: this.initConfig.paths.baseServerURl,
            data: params,
            async: false
        })

        return s.responseText
    },
    errorHandler: function(data, callback, formatMessage) {
        var bool = true

        if (typeof data === "object") {
            var status = data.status

            if (status && status !== 0) {
                // if (callback && typeof callback == "function") {
                //  callback.call()
                // }
                if (status === -5 || status === -6 || status === -7 || status === -8) {
                    message.destroy()

                    // TODO: Need Logout First 
                    browserHistory.push('/login')
                } else {
                    message.destroy()
                    message.error(formatMessage({ id: (this.initConfig.errorCodes[status] || 'LANG916') }))

                    setTimeout(function() {
                        if (callback && typeof callback === "function") {
                            callback.call()
                        }
                    }, 0)
                }

                bool = false
            } else if ((status === undefined || status === null || status === "") && status !== 0) {
                message.error(JSON.stringify(data))

                setTimeout(function() {
                        if (callback && typeof callback === "function") {
                            callback.call()
                        }
                    }, 0)

                bool = false
            }
        } else if (typeof data === 'number') {
            if (data === 0) {
                return bool
            } else {
                message.destroy()
                message.error(formatMessage({ id: (this.initConfig.errorCodes[data] || 'LANG916') }))

                setTimeout(function() {
                    if (callback && typeof callback === "function") {
                        callback.call()
                    }
                }, 0)

                bool = false
            }
        } else {
            message.destroy()
            message.error(data)

            setTimeout(function() {
                if (callback && typeof callback === "function") {
                    callback.call()
                }
            }, 0)

            bool = false
        }

        return bool
    }
}

module.exports = new UCMGUI()
