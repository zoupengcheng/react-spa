/*
 * Description: UCM6100 WebGUI
 * Copyright (C) 2016 Grandstream Networks, Inc.
 *
 */

import $ from 'jquery'
import { message } from 'antd'
import {FormattedMessage} from 'react-intl'
import { browserHistory } from 'react-router'
import _ from 'underscore'

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
        let s = $.ajax({
            type: 'POST',
            url: this.initConfig.paths.baseServerURl,
            data: params,
            async: false
        })

        return s.responseText
    },
    errorHandler: function(data, callback, formatMessage) {
        let bool = true

        if (typeof data === "object") {
            let status = data.status

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
    },
    isExist: {
        getList: function(type) {
            let response = [],
                responseDataHead = {
                    getAccountList: "extension",
                    getSIPAccountList: "extension",
                    getNumberList: "number",
                    getIVRNameList: "ivr_name",
                    getUserNameList: "user_name",
                    getVMgroupNameList: "vmgroup_name",
                    getRinggroupNameList: "ringgroup_name",
                    getPageNameList: "page_name",
                    getConferenceList: "extension",
                    getVoicemailList: "extension",
                    getMohNameList: "moh_name",
                    getPaginggroupNameList: "paginggroup_name",
                    getQueueNameList: "queue_name",
                    getDISANameList: "display_name",
                    getDahdiList: "dahdi",
                    getTrunkList: "trunks",
                    getOutboundRouteList: "outbound_routes",
                    getAnalogTrunkNameList: "analog_trunks",
                    getToneZoneSettings: "tonezone_settings",
                    getAnalogTrunkChanList: "analog_trunk_chans",
                    getPickupgroupNameList: "pickupgroup_name",
                    getFaxNameList: "fax_name",
                    getLanguage: "languages",
                    getQueueList: 'queues',
                    getRinggroupList: 'ringgroups',
                    getPaginggroupList: 'paginggroups',
                    getVMgroupList: 'vmgroups',
                    getFaxList: 'fax',
                    getDISAList: 'disa',
                    getIVRList: 'ivr',
                    getEventListNameList: "uri",
                    listPhonebookDn: "ldap_phonebooks",
                    getExtensionGroupList: "extension_groups",
                    getExtensionGroupNameList: "group_name",
                    getPrivilege: "privilege",
                    getOpermodeSettings: "opermode_settings",
                    getZeroConfigSettings: "",
                    getZeroconfigExtension: "extension",
                    getZeroConfigModel: "zc_models",
                    getEmailSettings: "email_settings",
                    getDirectoryList: 'directorys',
                    getDirectoryNameList: 'name',
                    getSLATrunkNameList: 'trunk_name',
                    getOutrtFailoverTrunkIdList: 'failover_a_trunk_index',
                    getCallbackNameList: "name",
                    getCallbackList: 'callback',
                    listTimeConditionOfficeTime: 'time_conditions_officetime',
                    listTimeConditionHoliday: 'time_conditions_holiday'
                }

            $.ajax({
                type: "post",
                url: "../cgi",
                data: {
                    action: type
                },
                async: false,
                error: function(jqXHR, textStatus, errorThrown) {
                },
                success: function(data) {
                    let bool = UCMGUI.prototype.errorHandler(data)

                    if (bool) {
                        if (responseDataHead[type]) {
                            let list = data.response[responseDataHead[type]]

                            if (list && !_.isEmpty(list)) {
                                response = list
                            }
                        } else {
                            response = data.response
                        }
                    }
                }
            })

            return response
        },
        getRange: function(type) {
            let response = []

            $.ajax({
                type: "post",
                url: "../cgi",
                data: {
                    "action": "getExtenPrefSettings"
                },
                async: false,
                error: function(jqXHR, textStatus, errorThrown) {
                    // top.dialog.dialogMessage({
                    //     type: 'error',
                    //     content: errorThrown
                    // })
                },
                success: function(data) {
                    let bool = UCMGUI.prototype.errorHandler(data)

                    if (bool) {
                        let extensionPrefSettings = data.response.extension_pref_settings

                        if (extensionPrefSettings && extensionPrefSettings !== {}) {
                            if (type === 'extension') {
                                let ueStart = extensionPrefSettings.ue_start,
                                    ueEnd = extensionPrefSettings.ue_end

                                response = [(ueStart ? parseInt(ueStart) : undefined), (ueEnd ? parseInt(ueEnd) : undefined)]
                            } else if (type === 'conference') {
                                let mmStart = extensionPrefSettings.mm_start,
                                    mmEnd = extensionPrefSettings.mm_end

                                response = [(mmStart ? parseInt(mmStart) : undefined), (mmEnd ? parseInt(mmEnd) : undefined)]
                            } else if (type === 'ivr') {
                                let vmeStart = extensionPrefSettings.vme_start,
                                    vmeEnd = extensionPrefSettings.vme_end

                                response = [(vmeStart ? parseInt(vmeStart) : undefined), (vmeEnd ? parseInt(vmeEnd) : undefined)]
                            } else if (type === 'vmgroup') {
                                let vmgStart = extensionPrefSettings.vmg_start,
                                    vmgEnd = extensionPrefSettings.vmg_end

                                response = [(vmgStart ? parseInt(vmgStart) : undefined), (vmgEnd ? parseInt(vmgEnd) : undefined)]
                            } else if (type === 'ringgroup') {
                                let rgeStart = extensionPrefSettings.rge_start,
                                    rgeEnd = extensionPrefSettings.rge_end

                                response = [(rgeStart ? parseInt(rgeStart) : undefined), (rgeEnd ? parseInt(rgeEnd) : undefined)]
                            } else if (type === 'queue') {
                                let rgeStart = extensionPrefSettings.qe_start,
                                    rgeEnd = extensionPrefSettings.qe_end

                                response = [(rgeStart ? parseInt(rgeStart) : undefined), (rgeEnd ? parseInt(rgeEnd) : undefined)]
                            } else if (type === 'fax') {
                                let rgeStart = extensionPrefSettings.fax_start,
                                    rgeEnd = extensionPrefSettings.fax_end

                                response = [(rgeStart ? parseInt(rgeStart) : undefined), (rgeEnd ? parseInt(rgeEnd) : undefined)]
                            } else if (type === 'directory') {
                                let dirStart = extensionPrefSettings.directory_start,
                                    dirEnd = extensionPrefSettings.directory_end

                                response = [(dirStart ? parseInt(dirStart) : undefined), (dirEnd ? parseInt(dirEnd) : undefined)]
                            }

                            response.push(extensionPrefSettings.disable_extension_ranges, extensionPrefSettings.rand_password, extensionPrefSettings.weak_password)
                        }
                    }
                }
            })

            return response
        },
        askExtensionRange: function(ext, start, end, disabled, extEnd) {
            let res = 0

            if (!ext || !/^([0-9]\d+)$/.test(ext)) {
                return true
            }

            if (disabled === 'yes') {
                return true
            }

            if (!start || !end) {
                return true
            }

            let nExt = Number(ext)
            let nExtEnd = Number(extEnd)

            if (nExt < start || nExt > end || nExtEnd > end) {
                let str = <FormattedMessage
                        id="LANG2132"
                        defaultMessage={'<b>{0}</b> is not in preferred range <b>[{1},{2}]</b>.<br />Do you want to go to \"<b>General</b>\" page to manage extension preference?'}
                        values={{0: ext, 1: start, 2: end}}
                    />

                if (nExtEnd > end) {
                    str = <FormattedMessage
                        id="welcome"
                        defaultMessage={'<b>{0}</b> is not in preferred range <b>[{1},{2}]</b>.<br />Do you want to go to \"<b>General</b>\" page to manage extension preference?'}
                        values={{0: nExtEnd, 1: start, 2: end}}
                    />
                }
                top.dialog.dialogConfirm({
                    confirmStr: str,
                    buttons: {
                        ok: function() {
                            top.frames['frameContainer'].module.jumpMenu('preferences.html')
                        },
                        cancel: function() {
                            top.dialog.container.show()
                            top.dialog.shadeDiv.show()
                        }
                    }
                })
                return false
            }
            return true
        }
    }
}

module.exports = new UCMGUI()
