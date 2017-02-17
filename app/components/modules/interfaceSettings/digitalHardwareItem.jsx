'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Transfer, Tabs, Modal } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import BasicSettings from "./basicSettings"
import AdvanceSettings from "./advanceSettings"
import _ from 'underscore'
import Title from '../../../views/title'
const TabPane = Tabs.TabPane
import Validator from "../../api/validator"
const baseServerURl = api.apiHost

global.groupInfo = {}
global.originSpanType = ''
global.bchanTotalChans = ""
global.oldDigitalGroupName = ""
global.oldGroupName = ""
global.oldSingnaling = ""
global.oldFraming = ""
global.oldCoding = ""
global.digitalHardwareSettingsAction = {}
global.groupIndex = ""
global.oldHardhdlc = ""
global.otherArr = []
global.lastOtherArr = []
global.allGroupArr = []

class DigitalHardwareItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hardhdlcOpts: [],
            priSettingsInfo: {},
            refs: {}
        }
    }
    componentDidMount() {
        this._loadDigitalList()
    }
    componentWillUnmount() {
    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        const form = this.props.form

        // form.validateFieldsAndScroll((err, values) => {
        //     let me = this
        //     let refs = me.state.refs

        //     for (let key in values) {
        //         if (values.hasOwnProperty(key)) {
        //             let divKey = refs["div_" + key]
        //             if (divKey && 
        //                divKey.props &&
        //                 ((divKey.props.className &&
        //                 divKey.props.className.indexOf("hidden") === -1) ||
        //                 typeof divKey.props.className === "undefined")) {
        //                 if (!err || (err && typeof err[key] === "undefined")) {
        //                     action[key] = UCMGUI.transCheckboxVal(values[key])   
        //                 } else {
        //                     return
        //                 }
        //             }
        //         }
        //     }

        //     console.log('Received values of form: ', values)
        //     message.loading(formatMessage({ id: "LANG826" }), 0)

        //     $.ajax({
        //         url: api.apiHost,
        //         method: "post",
        //         data: action,
        //         type: 'json',
        //         error: function(e) {
        //             message.error(e.statusText)
        //         },
        //         success: function(data) {
        //             let bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

        //             if (bool) {
        //                 message.destroy()
        //                 message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
        //             }
        //         }.bind(this)
        //     })
        // })

        let signallingVal = form.getFieldValue("signalling"),
            hardhdlcVal = form.getFieldValue("hardhdlc") || this.state.priSettingsInfo.hardhdlc

        if (signallingVal === "ss7") {
            if (global.ss7Settings[0]) {
                this._updateDigitalHardwareSettings()
            } else {
                this._addDigitalHardwareSS7Settings()
            }
        } else if (signallingVal === "mfcr2") {
            if (global.mfcR2Settings[0]) {
                this._updateDigitalHardwareSettings()
            } else {
                this._addDigitalHardwareR2Settings()
            }
        } else {
            this._updateDigitalHardwareSettings()
        }
    }
    _addDigitalHardwareSS7Settings = () => {
        let action = {}
        action["action"] = "addDigitalHardwareSS7Settings"
        action["span"] = this.props.params.span

        $.ajax({
            type: "post",
            url: baseServerURl,
            data: action,
            async: false,
            error: function(jqXHR, textStatus, errorThrown) {
                this._updateDigitalHardwareSettings()
            }.bind(this),
            success: function(data) {
                this._updateDigitalHardwareSettings()
            }.bind(this)
        })
    }
    _addDigitalHardwareR2Settings =() => {
        let action = {}
        action["action"] = "addDigitalHardwareR2Settings"
        action["span"] = this.props.params.span

        $.ajax({
            type: "post",
            url: baseServerURl,
            data: action,
            async: false,
            error: function(jqXHR, textStatus, errorThrown) {
                this._updateDigitalHardwareSettings()
            }.bind(this),
            success: function(data) {
                this._updateDigitalHardwareSettings()
            }.bind(this)
        })
    }
    _updateDigitalHardwareSettings = () => {
        const { formatMessage } = this.props.intl
        const form = this.props.form
        const me = this

        let spanTypeVal = form.getFieldValue("span_type"),
            params = ["clock", "lbo", "rxgain", "signalling", "span_type", "txgain", "codec", "coding",
                "nsf", "priindication", "resetinterval", "switchtype", "hardhdlc", "priplaylocalrbt", "em_rxwink", "emoutbandcalldialdelay"
            ],
            ss7NotSend = ["nsf", "priindication", "resetinterval", "switchtype"],
            action = {},
            signallingVal = $("#signalling").val()

        if (!this._isChangeSignallingForDataTrunk()) {
            message.error(formatMessage({ id: "LANG3978"}, { 0: form.getFieldValue("hardhdlc") }))
            return false
        }
        let resetGroups = (action, noNeedDialog) => {
            if (action && action['group'] && action['group'].length > 0) {
                $.ajax({
                    type: "post",
                    url: baseServerURl,
                    async: false,
                    data: {
                        action: "updateAllDigitalGroup",
                        group: JSON.stringify(action)
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        message.error(errorThrown)
                    },
                    success: function(data) {
                        let bool = UCMGUI.errorHandler(data)

                        if (bool) {
                            if (me._isModifyGroupChanneOfDataTrunk("updateDigitalHardware")) {
                                Modal.confirm({
                                    title: 'Confirm',
                                    content: formatMessage({ id: "LANG927" }),
                                    okText: formatMessage({id: "LANG727"}),
                                    cancelText: formatMessage({id: "LANG726"}),
                                    onOk: this._applyChangeAndReboot,
                                    onCancel: () => {
                                        browserHistory.push('/pbx-settings/interfaceSettings/')
                                    }
                                })
                            } else if (!noNeedDialog) {
                                message.success(<span dangerouslySetInnerHTML=
                                        {{ __html: formatMessage({ id: "LANG4782" }) }}
                                    ></span>)
                            } 
                            browserHistory.push('/pbx-settings/interfaceSettings/')
                        }
                    }
                })
            } else {
                return
            }
        }

        let digitalGroupInfo = [],
            hardhdlc = Number($("#hardhdlc").val()),
            totalGroupChanArr = [],
            usedChannelArr = [],
            arr = [],
            actionObj = {},
            originSpanType = global.originSpanType

        if (originSpanType === "E1") {
            digitalGroupInfo = global.digitalGroupE1
        } else if (originSpanType === "T1") {
            digitalGroupInfo = global.digitalGroupT1
        } else if (originSpanType === "J1") {
            digitalGroupInfo = global.digitalGroupJ1
        }

        let totalChannelArr = this._getTotalChannelArr(spanTypeVal, hardhdlc)
        for (let i = 0; i < digitalGroupInfo.length; i++) {
            let obj = {},
                digitalGroupInfoIndex = digitalGroupInfo[i],
                digitalGroupName = digitalGroupInfoIndex.group_name,
                digitalGroupIndex = digitalGroupInfoIndex.group_index,
                digitalGroupChannel = digitalGroupInfoIndex.channel,
                originChannelLength = this._getTotalNum(digitalGroupChannel ? digitalGroupChannel.split(",") : [])

            if (originSpanType.toLowerCase() === digitalGroupInfoIndex.spanType) {
                digitalGroupChannel = this._getChannel(originChannelLength, totalChannelArr)
                usedChannelArr.push(digitalGroupChannel)
                obj["channel"] = digitalGroupChannel
            }

            obj["group_name"] = digitalGroupName
            obj["group_index"] = digitalGroupIndex
            arr.push(obj)
            totalGroupChanArr.push(digitalGroupInfoIndex.channel)
        }
        let totalGroupChan = this._getTotalArr(totalGroupChanArr)

        if ((originSpanType === 'E1') && (spanTypeVal === "T1" || spanTypeVal === "J1") && Number(totalGroupChan[totalGroupChan.length - 1]) > 24) {
            if (!(totalGroupChan.length === 24 && hardhdlc === 0)) {
                message.error(formatMessage({ id: "LANG2783" }))
                return false
            }
        }
        actionObj["group"] = arr

        let digitalHardwareSettingsAction = function() {
            let actions = {},
                signallingVal = form.getFieldValue("signalling")

            if (spanTypeVal !== "E1") {
                actions["crc"] = "none"
            } else {
                actions["crc"] = form.getFieldValue("crc")
            }

            actions['framing'] = form.getFieldValue("framing")

            actions["bchan"] = me._getBchan(global.bchanTotalChans)
            actions["action"] = "updateDigitalHardwareSettings"

            // for (let i = 0, length = params.length; i < length; i++) {
            //     let paramsIndex = params[i],
            //         paramsEle = $("#" + params[i]),
            //         paramsEleDom = paramsEle.get(0),
            //         signalling = $("#signalling").val()

            //     if ((paramsEle.is(":hidden") && paramsEle.closest(".prioptions").length === 0) || (signalling === "ss7" && ss7NotSend.indexOf(paramsIndex) !== -1)) {
            //         continue
            //     }
            //     if ((paramsEle.is(":disabled")) || (signalling === "ss7" && ss7NotSend.indexOf(paramsIndex) !== -1)) {
            //         continue
            //     }
            //     if (paramsEleDom.type === "checkbox") {
            //         actions[params[i]] = (paramsEleDom.checked === true) ? "yes" : "no"
            //     } else {
            //         actions[params[i]] = paramsEle.val()
            //     }
            // }
            actions = _.extend(actions, form.getFieldsValue(params))

            if (signallingVal === "mfcr2") {
                actions["hardhdlc"] = "16"
            } else if (signallingVal === "em" || signallingVal === "em_w") {
                actions["hardhdlc"] = "0"
            } else if (signallingVal.indexOf('pri') > -1) {
                actions["pri_timer_t310"] = form.getFieldValue("pri_timer_t310")
            }
            return actions
        }

        let updateDigitalHardware = () => {
            _.map(digitalHardwareSettingsAction, function(item, index) {
                if (action[item] === true) {
                    action[item] = "yes"
                } else if (action[item] === false) {
                    action[item] = "no"
                }
            })
            $.ajax({
                type: "post",
                url: baseServerURl,
                data: digitalHardwareSettingsAction,
                error: function(jqXHR, textStatus, errorThrown) {
                    message.error(errorThrown)
                },
                success: function(data) {
                    const bool = UCMGUI.errorHandler(data, null, formatMessage)

                    if (bool) {
                        resetGroups(actionObj)
                    }
                }
            })
        }
        let updateDigitalR2Hardware = () => {
            let fieldsObj = form.getFieldValue(),
                actions = {}

            actions["mfcr2_variant"] = form.getFieldValue("mfcr2_variant")
            actions["mfcr2_get_ani_first"] = form.getFieldValue("mfcr2_get_ani_first")
            actions["mfcr2_category"] = form.getFieldValue("mfcr2_category")
            actions["mfcr2_play_local_rbt"] = form.getFieldValue("mfcr2_play_local_rbt")

            let R2AdvancedParams = ["mfcr2_mfback_timeout", "mfcr2_metering_pulse_timeout", "mfcr2_allow_collect_calls", 
                                    "mfcr2_double_answer", "mfcr2_double_answer_timeout", "mfcr2_accept_on_offer", "networkindicator", 
                                    "mfcr2_charge_calls"]
            actions = _.extend(actions, form.getFieldsValue(R2AdvancedParams))

            actions["mf_advanced_settings"] = form.getFieldValue("mf_advanced_settings")

            if (form.getFieldValue("mf_advanced_settings")) {
                let otherR2AdvancedParams = ["mf_ga_tones__request_next_dnis_digit", "mf_ga_tones__request_dnis_minus_1",
                                        "mf_ga_tones__request_dnis_minus_2", "mf_ga_tones__request_dnis_minus_3", "mf_ga_tones__request_all_dnis_again",
                                        "mf_ga_tones__request_next_ani_digit", "mf_ga_tones__request_category", "mf_ga_tones__request_category_and_change_to_gc",
                                        "mf_ga_tones__request_change_to_g2", "mf_ga_tones__address_complete_charge_setup", "mf_ga_tones__network_congestion",
                                        "mf_gb_tones__accept_call_with_charge", "mf_gb_tones__accept_call_no_charge", "mf_gb_tones__busy_number", "mf_gb_tones__network_congestion",
                                        "mf_gb_tones__unallocated_number", "mf_gb_tones__line_out_of_order", "mf_gb_tones__special_info_tone", "mf_gb_tones__reject_collect_call",
                                        "mf_gb_tones__number_changed", "mf_gc_tones__request_next_ani_digit", "mf_gc_tones__request_change_to_g2", "mf_gc_tones__request_next_dnis_digit_and_change_to_ga",
                                        "mf_g1_tones__no_more_dnis_available", "mf_g1_tones__no_more_ani_available", "mf_g1_tones__caller_ani_is_restricted",
                                        "mf_g2_tones__national_subscriber", "mf_g2_tones__national_priority_subscriber", "mf_g2_tones__international_subscriber",
                                        "mf_g2_tones__international_priority_subscriber", "mf_g2_tones__collect_call", "timers__mf_back_cycle", "timers__mf_fwd_safety",
                                        "timers__r2_seize", "timers__r2_answer", "timers__r2_metering_pulse", "timers__r2_double_answer", "timers__r2_answer_delay",
                                        "timers__cas_persistence_check", "timers__dtmf_start_dial", "mf_threshold"]

                actions = _.extend(actions, form.getFieldsValue(otherR2AdvancedParams))
            }

            actions["action"] = "updateDigitalHardwareR2Settings"
            actions["span"] = this.props.params.span
            actions["mfcr2_max_ani"] = 32
            actions["mfcr2_max_dnis"] = 32

            if (this.state.refs.mfcr2_get_ani_first && this.state.refs.mfcr2_get_ani_first.props.disabled) {
                actions["mfcr2_get_ani_first"] = "no"
            }
            if (this.state.refs.mfcr2_skip_category && this.state.refs.mfcr2_skip_category.props.disabled) {
                actions["mfcr2_skip_category"] = "no"
            }

            if (form.getFieldValue("mfcr2_variant") === "br") {
                actions["mfcr2_forced_release"] = $("#mfcr2_forced_release").is(":checked") ? "yes" : "no"
            } else {
                actions["mfcr2_forced_release"] = "no"
            }

            if (form.getFieldValue("mfcr2_double_answer")) {
                actions["mfcr2_double_answer_timeout"] = form.getFieldValue("mfcr2_double_answer_timeout")
            } else {
                actions["mfcr2_double_answer_timeout"] = "-1"
            }

            if (action["mfcr2_mfback_timeout"] === "") {
                actions["mfcr2_mfback_timeout"] = "-1"
            }
            if (action["mfcr2_metering_pulse_timeout"] === "") {
                actions["mfcr2_metering_pulse_timeout"] = "-1"
            }
            if (action["mfcr2_double_answer_timeout"] === "") {
                actions["mfcr2_double_answer_timeout"] = "-1"
            }

            _.map(actions, function(item, index) {
                if (action[item] === true) {
                    action[item] = "yes"
                } else if (action[item] === false) {
                    action[item] = "no"
                }
            })

            $.ajax({
                type: "post",
                url: baseServerURl,
                data: actions,
                error: function(jqXHR, textStatus, errorThrown) {
                    message.error(errorThrown)
                },
                success: function(data) {
                    const bool = UCMGUI.errorHandler(data, null, formatMessage)

                    if (bool) {
                        if ((this.state.refs.otherR2Advanced && this.state.refs.otherR2Advanced.props.className === "display-block") && form.getFieldValue("signalling") === "mfcr2") {
                            resetGroups(actionObj, "noNeedDialog")
                        } else {
                            resetGroups(actionObj)
                        }
                    }
                }
            })
        }

        if (signallingVal === "ss7") {
            digitalHardwareSettingsAction = digitalHardwareSettingsAction()
            action["action"] = "updateDigitalHardwareSS7Settings"
            action["sigchan"] = form.getFieldValue("hardhdlc")
            action["span"] = me.props.params.span
            action["ss7type"] = form.getFieldValue("ss7type")
            action["pointcode"] = form.getFieldValue("pointcode")
            action["defaultdpc"] = form.getFieldValue("defaultdpc")
            action["cicbeginswith"] = form.getFieldValue("cicbeginswith")
            action["networkindicator"] = form.getFieldValue("networkindicator")
            action["sigchan_assign_cic"] = form.getFieldValue("sigchan_assign_cic")
        } else if (signallingVal === "mfcr2") {
            action = digitalHardwareSettingsAction()
            action["codec"] = "alaw"
        } else {
            action = digitalHardwareSettingsAction()
            action["facilityenable"] = form.getFieldValue("facilityenable") ? 'yes' : 'no'
            action["priexclusive"] = form.getFieldValue("priexclusive") ? 'yes' : 'no'
            action["overlapdial"] = form.getFieldValue("overlapdial")
        }

        if (signallingVal === "ss7") {
            action["ss7_called_nai"] = form.getFieldValue("ss7_called_nai")
            action["ss7_calling_nai"] = form.getFieldValue("ss7_calling_nai")
            action["ss7_internationalprefix"] = form.getFieldValue("internationalprefix")
            action["ss7_nationalprefix"] = form.getFieldValue("nationalprefix")
            action["ss7_subscriberprefix"] = form.getFieldValue("subscriberprefix")
            action["ss7_unknownprefix"] = form.getFieldValue("unknownprefix")
        } else if (signallingVal !== "mfcr2") {
            action["pridialplan"] = form.getFieldValue("pridialplan")
            action["prilocaldialplan"] = form.getFieldValue("prilocaldialplan")
            action["internationalprefix"] = form.getFieldValue("internationalprefix")
            action["nationalprefix"] = form.getFieldValue("nationalprefix")
            action["localprefix"] = form.getFieldValue("localprefix")
            action["privateprefix"] = form.getFieldValue("privateprefix")
            action["unknownprefix"] = form.getFieldValue("unknownprefix")
        }

        _.map(action, function(item, index) {
            if (action[item] === true) {
                action[item] = "yes"
            } else if (action[item] === false) {
                action[item] = "no"
            }
        })
        $.ajax({
            type: "post",
            url: baseServerURl,
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {
                message.destory()
                message.error(errorThrown)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    if (signallingVal === "ss7") {
                        updateDigitalHardware()
                    } else if (signallingVal === "mfcr2") {
                        updateDigitalR2Hardware()
                    } else {
                        resetGroups(actionObj)
                    }
                }
            }
        })
    }
    _applyChangeAndReboot = () => {
        const { formatMessage } = this.props.intl

        message.loading(formatMessage({
            id: "LANG832"
        }), 0)

        UCMGUI.loginFunction.confirmReboot()
    }
    _isChangeSignallingForDataTrunk = () => {
        const form = this.props.form

        let fieldsObj = form.getFieldsValue(),
            dataTrunkChannelList = global.dataTrunkChannelList

        let signallingVal = fieldsObj.signalling,
            hardhdlc = fieldsObj.hardhdlc || global.priSettings.hardhdlc,
            dataTrunkChannelListArr = dataTrunkChannelList.toString().split(","),
            totalArr = this._getTotalArr(dataTrunkChannelListArr)

        if (totalArr.indexOf(hardhdlc) !== -1) {
            return false
        } else {
            return true
        }
    }
    _isModifyGroupChanneOfDataTrunk = (type) => {
        const form = this.props.form

        let digitalGroup = global.digitalGroup,
            flag = false,
            dataTrunkChannelObj = global.dataTrunkChannelObj,
            groupInfo = this.props.params.span,
            groupInfoGroupIndex = "",
            groupInfoSpan = "",
            spanType = "",
            hardhdlc = -1

        if (type === "updateDigitalHardware") {
            spanType = form.getFieldValue("span_type")
            hardhdlc = form.getFieldValue("hardhdlc")
            groupInfoSpan = groupInfo
        } else {
            spanType = groupInfo.spanType
            hardhdlc = Number(groupInfo.hardhdlc)
            groupInfoSpan = groupInfo.span
            groupInfoGroupIndex = groupInfo.group_index
        }

        let totalChannelArr = this._getTotalChannelArr(spanType, hardhdlc)

        for (let i = 0; i < digitalGroup.length; i++) {
            let digitalGroupIndex = digitalGroup[i],
                channel = digitalGroupIndex.channel,
                groupIndex = digitalGroupIndex.group_index,
                originChannelLength = this._getTotalNum(channel ? channel.split(",") : [])

            if ((groupInfoSpan === digitalGroupIndex.span) && (groupInfoGroupIndex === groupIndex)) {
                let currentChannelLength = Number(form.getFieldValue("channel"))

                channel = this._getChannel(currentChannelLength, totalChannelArr)
            } else if (groupInfoSpan === digitalGroupIndex.span) {
                channel = this._getChannel(originChannelLength, totalChannelArr)
            }
            if (!_.isEmpty(dataTrunkChannelObj)) {
                for (let prop in dataTrunkChannelObj) {
                    if (dataTrunkChannelObj.hasOwnProperty(prop)) {
                        let dataTrunkChannelObjProp = dataTrunkChannelObj[prop],
                            propGroupIndex = Number(dataTrunkChannelObjProp["group_index"]),
                            propChannel = dataTrunkChannelObjProp["channel"]

                        if ((propGroupIndex === groupIndex) && (propChannel !== channel)) {
                            flag = true
                            break
                        }
                    }
                }
            }
            if (flag) {
                break
            }
        }
        return flag
    }
    _loadDigitalList = () => {
        const { formatMessage } = this.props.intl
        const form = this.props.form

        let priSettings = global.priSettings,
            ss7Settings = global.ss7Settings[0],
            mfcR2Settings = global.mfcR2Settings[0],
            priSettingsInfo = {}

        for (let i = 0; i < priSettings.length; i++) {
            let priSettingsIndex = priSettings[i]

            if (priSettingsIndex.span === Number(this.props.params.span)) {
                priSettingsInfo = priSettingsIndex

                form.setFieldsValue({
                   span_type: priSettingsInfo.span_type
                })

                global.originSpanType = priSettingsInfo.span_type
                global.oldDigitalGroupName = priSettingsInfo.digital_group_name
                global.oldSingnaling = priSettingsInfo.signalling
                global.oldFraming = priSettingsInfo.framing
                global.oldCoding = priSettingsInfo.coding
                global.oldHardhdlc = priSettingsInfo.hardhdlc
            }
        }

        let totleChans = this._getTotalChans(),
            opts = [],
            dataTrunkChansArr = this._getDataTrunkChansArr(),
            allChansArr = this._getTotalArr(dataTrunkChansArr)

        if ((allChansArr.length + 1) >= totleChans) {
            opts = [{
                text: formatMessage({ id: "LANG133" }),
                val: "0"
            }]
        }
        for (let i = 1; i <= totleChans; i++) {
            opts.push({
                val: i
            })
        }

        if (ss7Settings) {
            for (let key in ss7Settings) {
                if (ss7Settings.hasOwnProperty(key)) {
                    priSettingsInfo[key] = ss7Settings[key]
                }
            }
        }
        if (mfcR2Settings) {
            for (let key in mfcR2Settings) {
                if (mfcR2Settings.hasOwnProperty(key)) {
                    priSettingsInfo[key] = mfcR2Settings[key]
                }
            }
        }

        if (priSettingsInfo.mfcr2_category === "collect_call" && priSettingsInfo.mfcr2_variant !== "br") {
            priSettingsInfo.mfcr2_category = "national_subscriber"
        }
        this.setState({
            hardhdlcOpts: opts,
            priSettingsInfo: priSettingsInfo
        })

        form.setFieldsValue({
           switchtype: priSettingsInfo.switchtype
        })
    }
    _getTotalNum(arr) {
        let num = 0

        for (let k = 0; k < arr.length; k++) {
            let index = arr[k]
            if (/-/.test(index)) {
                let first = index.match(/^\d+/)
                let last = index.match(/\d+$/)
                if (first && last) {
                    first = Number(first[0])
                    last = Number(last[0])
                    num += (last - first + 1)
                }
            } else {
                num += 1
            }
        }
        return num
    }
    _getChannel = (length, arr) => {
        let curentChansArr = arr.splice(0, length)
        let str = this._getChannelRange(curentChansArr)
        let strArr = str.split(",")

        return this._getGroupChannel(strArr).toString()
    }
    _getChannelRange = (arr) => {
        let str = ""

        for (let i = 0; i < arr.length; i++) {
            let before = Number(arr[i])
            let after = Number(arr[i + 1])

            if ((before + 1) !== after) {
                str += (before + ",")
            } else {
                str += (before + "-")
            }
        }
        return str
    }
    _getGroupChannel = (arr) => {
        let lastArr = []
        for (let i = 0; i < arr.length; i++) {
            let strArrIndex = arr[i]
            if (/-/.test(strArrIndex)) {
                let first = strArrIndex.match(/^\d+/)
                let last = strArrIndex.match(/\d+$/)
                if (first && last) {
                    lastArr.push(first[0] + "-" + last[0])
                }
            } else if (strArrIndex) {
                lastArr.push(strArrIndex)
            }
        }
        return lastArr
    }
    _getOtherArr = (arr, hardhdlc) => {
        let totalChansLen = this._getTotalChans(),
            otherArr = []
        for (let l = 1; l <= totalChansLen; l++) {
            let index = arr[l]
            if (arr.indexOf(String(l)) === -1) {
                if (l !== hardhdlc) {
                    otherArr.push(l)
                }
            }
        }
        return otherArr
    }
    _getTotalArr = (arr) => {
        let totalArr = []

        for (let i = 0; i < arr.length; i++) {
            let index = arr[i],
                indexArr = []

            if (/,/.test(index)) {
                indexArr = index.split(",")
            }
            if (indexArr.length === 0) {
                totalArr = totalArr.concat(this._getEndTotalArr(index))
            } else {
                for (let j = 0; j < indexArr.length; j++) {
                    let indexArrIndex = indexArr[j]
                    totalArr = totalArr.concat(this._getEndTotalArr(indexArrIndex))
                }
            }
        }
        return totalArr
    }
    _getEndTotalArr = (str) => {
        let endTotalArr = []

        if (/-/.test(str)) {
            let match = str.match(/(\d+)-(\d+)/)
            if (match[1] && match[2]) {
                let matchFirst = Number(match[1])
                let matchSecon = Number(match[2])

                for (let j = 0; j < (matchSecon - matchFirst + 1); j++) {
                    endTotalArr.push(String(matchFirst + j))
                }
            }
        } else if (str) {
            endTotalArr.push(str)
        }
        return endTotalArr
    }
    _getDataTrunkChansArr = () => {
        let dataTrunkChannelObj = global.dataTrunkChannelObj,
            allChansRangeStr = ""

        for (let prop in dataTrunkChannelObj) {
            if (dataTrunkChannelObj.hasOwnProperty(prop)) {
                allChansRangeStr += dataTrunkChannelObj[prop]["channel"] + ","
            }
        }
        allChansRangeStr = allChansRangeStr.replace(/,$/, "")
        return allChansRangeStr.split(",")
    }
    _getTotalChans = () => {
        let totleChans = 31,
            priSettingsInfo = global.priSettings

        for (let i = 0; i < priSettingsInfo.length; i++) {
            let priSettingsInfoIndex = priSettingsInfo[i],
                spanType = priSettingsInfoIndex.span_type

            if (spanType.toLowerCase() === "t1" || spanType.toLowerCase() === "j1") {
                totleChans = 24
            }
        }
        return totleChans
    }
    _getTotalChannelArr = (spanTypes, hardhdlcs) => {
        let totalChannelLen = 0,
            totalChannelArr = [],
            spanType = spanTypes.toLowerCase(),
            hardhdlc = Number(hardhdlcs)

        if (spanType === "e1") {
            totalChannelLen = 31
        } else if (spanType === "t1" || spanType === "j1") {
            totalChannelLen = 24
        }

        for (let j = 1; j <= totalChannelLen; j++) {
            if (hardhdlc !== j) {
                totalChannelArr.push(j)
            }
        }
        return totalChannelArr
    }
    _getBchan = (bchanTotalChans) => {
        let hardhdlc = Number($("#hardhdlc").val()),
            signallingVal = $("#signalling").val(),
            dataTrunkChansArr = this._getDataTrunkChansArr(),
            totalArr = this._getTotalArr(dataTrunkChansArr)

        if (signallingVal === "mfcr2") {
            hardhdlc = 16
        } else if (signallingVal === "em" || signallingVal === "em_w") {
            hardhdlc = 0
        }
        let otherArr = this._getOtherArr(totalArr, hardhdlc),
            channelRangeArr = this._getChannelRange(otherArr).split(","),
            groupChannel = this._getGroupChannel(channelRangeArr).toString()

        if (groupChannel) {
            return groupChannel
        } else {
            return 0
        }
    }
    _getRefs = (refs) => {
        this.setState({
            refs: _.extend(this.state.refs, refs)
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG3096"})
        })

        let headerTitle = formatMessage({
            id: "LANG3096"
        })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ headerTitle } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay='display-block' 
                />
                <Form>
                    <Tabs defaultActiveKey="1" onChange={this._onChange}>
                        <TabPane tab={formatMessage({id: "LANG2217"})} key="1">
                            <BasicSettings 
                                form={ this.props.form }
                                priSettingsInfo={ this.state.priSettingsInfo }
                                getRefs={ this._getRefs.bind(this) }
                            />
                        </TabPane>
                        <TabPane tab={formatMessage({id: "LANG542"})} key="2">
                            <AdvanceSettings 
                                form={ this.props.form }
                                priSettingsInfo={ this.state.priSettingsInfo }
                                getRefs={ this._getRefs.bind(this) }
                                hardhdlcOpts={ this.state.hardhdlcOpts }
                            />
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

DigitalHardwareItem.propTypes = {
}

export default Form.create()(injectIntl(DigitalHardwareItem))