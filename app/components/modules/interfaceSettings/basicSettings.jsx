'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class BasicSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            div_mfcr2ForcedRelease_style: "hidden",
            mfcr2SkipCategoryChecked: false,
            mfcr2GetAniFirstChecked: false,
            framingOpts: [],
            hardhdlcOpts: [],
            codingOpts: [],
            crcOpts: [],
            signallingOpts: [{
                val: "pri_net",
                text: "PRI_NET"
            }, {
                val: "pri_cpe",
                text: "PRI_CPE"
            }, {
                val: "ss7",
                text: "SS7"
            }, {
                val: "mfcr2",
                text: "MFC/R2"
            }],
            div_crc_style: "display-block",
            collectCall: false,
            div_hardhdlc_style: "display-block",
            firstSpanTypeLoad: true,
            firstSignallingLoad: true,
            firstMfcr2VariantLoad: true
        }
    }
    componentWillMount() { 
    }
    componentDidMount() {
        this.props.getRefs(this.refs)
        this._initVal()
    }
    componentDidUpdate() {
        let priSettingsInfo = this.props.priSettingsInfo
        const form = this.props.form

        let me = this,
            spanType = priSettingsInfo.span_type,
            signalling = priSettingsInfo.signalling,
            mfcr2Variant = priSettingsInfo.mfcr2_variant

        if (this.state.firstSpanTypeLoad && this.state.firstSignallingLoad && spanType && signalling) {
            me._onChangeSpanType(spanType)
            form.setFieldsValue({
                span_type: spanType
            })
            me._onChangeSignalling(signalling)
            form.setFieldsValue({
                signalling: signalling
            })
            
            me.setState({
                firstSpanTypeLoad: false,
                firstSignallingLoad: false
            })
        }
        if (this.state.firstMfcr2VariantLoad && mfcr2Variant) {
            me._onChangeMfcr2Variant(mfcr2Variant)
            form.setFieldsValue({
                mfcr2_variant: mfcr2Variant
            })
            
            me.setState({
                firstMfcr2VariantLoad: false
            })
        } 
    }
    _initVal = () => {
        const form = this.props.form

        if (form.getFieldValue("mfcr2_variant") === "br") {
            this.setState({ 
                div_mfcr2ForcedRelease_style: "display-block",
                hardhdlcOpts: this.props.hardhdlcOpts
            })
        } else {
            this.setState({ 
                div_mfcr2ForcedRelease_style: "hidden",
                hardhdlcOpts: this.props.hardhdlcOpts
            })
        }
    }
    _onChangeMfcr2GetAniFirst = (e) => {
        this.setState({
            mfcr2GetAniFirstChecked: e.target.checked
        })
    }
    _onChangeSignalling = (value) => {
        const form = this.props.form
        const { formatMessage } = this.props.intl

        let hardhdlcEle = this.refs.hardhdlc,
            // opts = hardhdlcEle.children(),
            // noneOpt = hardhdlcEle.children().filter("[value=0]"),
            flag = true,
            oldCoding = global.oldCoding,
            oldSingnaling = global.oldSingnaling

        if (value === "ss7") {
            let totleChans = this.props.getTotalChans(),
                dataTrunkChansArr = this.props.getDataTrunkChansArr(),
                allChansArr = this.props.getTotalArr(dataTrunkChansArr)
            
            this.setState({
                div_hardhdlc_style: "display-block"
            })

            // if ((allChansArr.length + 1) >= totleChans && noneOpt.length == 0) {
            //     hardhdlcEle.prepend("<option value='0'>" + $P.lang("LANG133") + "</option>");
            // } else if ((allChansArr.length + 1) < totleChans) {
            //     noneOpt.remove()
            // }
            // for (let i = 0; i < opts.length; i++) {
            //     let index = opts[i]
            //     index.disabled = false
            // }

            let ss7Settings = global.ss7Settings[0]
            if (ss7Settings) {
                form.setFieldsValue({
                    ss7_called_nai: ss7Settings["ss7_called_nai"],
                    ss7_calling_nai: ss7Settings["ss7_calling_nai"],
                    internationalprefix: ss7Settings["ss7_internationalprefix"],
                    nationalprefix: ss7Settings["ss7_nationalprefix"],
                    subscriberprefix: ss7Settings["ss7_subscriberprefix"],
                    unknownprefix: ss7Settings["ss7_unknownprefix"]
                })
            }

            let showEles = ["div_ss7Options", "div_callerIdPrefix", "div_SS7dialplan", "div_codec", "div_subscriberprefix", "div_lbo", "div_rtx"],
                hideEles = ["div_mfcR2", "div_priT310", "div_switchtype", "div_localprefix", "div_privateprefix", "div_special", "div_pridialplan", 
                            "div_channel", "div_R2Advanced", "otherAdvanced_btn", "div_priPlayLocalRbt", "div_mfcr2PlayLocaRbt", "div_em_immediate", 
                            "div_em_w_outgoing"],
                showElesObj = {},
                hideElesObj = {}

            showEles.map(function(it) {
                showElesObj[it + "_style"] = "display-block"
            })
            hideEles.map(function(it) {
                hideElesObj[it + "_style"] = "hidden"
            })

            showElesObj = _.extend(showElesObj, hideElesObj)
            // this.setState(showElesObj)
            this.props.getSonState(showElesObj)
        } else if (value === "mfcr2") {
            let showEles = ["div_mfcR2", "div_channel", "div_R2Advanced", "otherAdvanced_btn", "div_mfcr2PlayLocaRbt", "div_lbo", "div_rtx"],
                hideEles = ["div_hardhdlc", "div_special", "div_priT310", "div_ss7Options", "div_switchtype", "div_callerIdPrefix", "div_pridialplan", 
                            "div_SS7dialplan", "div_codec", "div_priPlayLocalRbt", "div_em_immediate", "div_em_w_outgoing"],
                showElesObj = {},
                hideElesObj = {}

            showEles.map(function(it) {
                showElesObj[it + "_style"] = "display-block"
            })
            hideEles.map(function(it) {
                hideElesObj[it + "_style"] = "hidden"
            })

            showElesObj = _.extend(showElesObj, hideElesObj)
            // this.setState(showElesObj)
            this.props.getSonState(showElesObj)
        } else if (value === "em" || value === "em_w") {
            let showEles = ["div_em_immediate"],
                hideEles = [],
                showElesObj = {},
                hideElesObj = {}

            if (value === "em_w") {
                showEles.push("div_em_w_outgoing")
            } else {
                hideEles.push("div_em_w_outgoing")
            }
            flag = false
            hideEles.push(["div_hardhdlc", "div_mfcR2", "div_priT310", "div_ss7Options", "div_lbo", "div_R2Advanced", "otherAdvanced_btn", 
                            "div_subscriberprefix", "div_priPlayLocalRbt", "div_mfcr2PlayLocaRbt", "div_SS7dialplan", "div_callerIdPrefix",
                            "div_switchtype", "div_pridialplan", "div_special"])
            
            showEles.map(function(it) {
                showElesObj[it + "_style"] = "display-block"
            })
            hideEles.map(function(it) {
                hideElesObj[it + "_style"] = "hidden"
            })

            showElesObj = _.extend(showElesObj, hideElesObj)
            // this.setState(showElesObj)
            this.props.getSonState(showElesObj)
        } else {
            let totleChans = this.props.getTotalChans(),
                dataTrunkChansArr = this.props.getDataTrunkChansArr(),
                allChansArr = this.props.getTotalArr(dataTrunkChansArr)

            this.setState({
                div_hardhdlc_style: "display-block"
            })

            // if ((allChansArr.length + 1) >= totleChans && noneOpt.length == 0) {
            //     hardhdlcEle.prepend("<option value='0'>" + $P.lang("LANG133") + "</option>");
            // } else if ((allChansArr.length + 1) < totleChans) {
            //     noneOpt.remove();
            // }
            // for (let i = 0; i < opts.length; i++) {
            //     let index = opts[i];
            //     index.disabled = false;
            // }

            let showEles = ["div_switchtype", "div_priT310", "div_localprefix", "div_privateprefix", "div_special", "div_channel", 
                            "div_callerIdPrefix", "div_pridialplan", "div_codec", "div_priPlayLocalRbt", "div_lbo", "div_rtx"],
                hideEles = ["div_mfcR2", "div_ss7Options", "div_R2Advanced", "otherAdvanced_btn", "div_subscriberprefix", 
                            "div_SS7dialplan", "div_mfcr2PlayLocaRbt", "div_em_immediate", "div_em_w_outgoing"],
                showElesObj = {},
                hideElesObj = {},
                spanTypeVal = form.getFieldValue("span_type")
            
            if (spanTypeVal === "E1") {
                showEles.push("div_crc")
            }
            if (spanTypeVal === "T1" || spanTypeVal === "J1") {
                hideEles.push("div_crc")
            }

            showEles.map(function(it) {
                showElesObj[it + "_style"] = "display-block"
            })
            hideEles.map(function(it) {
                hideElesObj[it + "_style"] = "hidden"
            })

            showElesObj = _.extend(showElesObj, hideElesObj)
            // this.setState(showElesObj)
            this.props.getSonState(showElesObj)
        }
        let spanTypeVal = form.getFieldValue("span_type")

        if (spanTypeVal === "E1") {
            let framingOpts = []

            // if (hardhdlcEle.children().filter("[value=" + oldHardhdlc + "]").length != 0) {
            //     hardhdlcEle.val(oldHardhdlc);
            // } else {
            //     hardhdlcEle.val(16);
            // }

            if (value === 'mfcr2') {
                framingOpts = [{
                    val: "cas"
                }]
            } else {
                framingOpts = [{
                    val: "ccs"
                }]
            }

            this.setState({
                framingOpts: framingOpts
            })
        }
        if ((spanTypeVal === "T1" || spanTypeVal === "J1") && flag) {
            // if (hardhdlcEle.children().filter("[value=" + oldHardhdlc + "]").length != 0) {
            //     hardhdlcEle.val(oldHardhdlc)
            // } else {
            //     hardhdlcEle.val(24)
            // }
        }

        form.setFieldsValue({
            coding: oldCoding
        })

        if (value === "mfcr2") {
            form.setFieldsValue({
                hardhdlc: "16"
            })
        } else if (value === "em" || value === "em_w") {
            form.setFieldsValue({
                hardhdlc: "0"
            })
        }

        if (spanTypeVal === "T1" || spanTypeVal === "J1") {
            if (oldCoding === "hdb3") {
                form.setFieldsValue({
                    coding: "b8zs"
                })
            }
        } else {
            if (oldCoding === "b8zs") {
                form.setFieldsValue({
                    coding: "hdb3"
                })
            }
        }
        oldSingnaling = value
    }
    _onChangeFraming = (val) => {
        global.oldFraming = val
    }
    _onChangeMfcr2Variant = (val) => {
        const form = this.props.form
        
        if (val === "ve") {
            form.setFieldsValue({
               mfcr2_get_ani_first: true
            })
        }

        if (val === "br") {
            this.setState({
                collectCall: false,  
                div_mfcr2ForcedRelease_style: "display-block"
            })
        } else {
            if (form.getFieldValue("mfcr2_category") === "collect_call") {
                form.setFieldsValue({
                    mfcr2_category: "national_subscriber"
                })
            }
            this.setState({
                collectCall: true, 
                div_mfcr2ForcedRelease__style: "hidden"
            })
        }
        let mfcR2Settings = global.mfcR2Settings[0]

        if (val === "ve") {
            form.setFieldsValue({
                mfcr2_get_ani_first: true
            })
        }

        if (mfcR2Settings) {
            if (form.getFieldValue("mfcr2_variant") === mfcR2Settings.mfcr2_variant) {
                let mfcr2GetAniFirstVal = (mfcR2Settings.mfcr2_get_ani_first === "yes") ? true : false,
                    mfcr2AllowCollectCallsVal = (mfcR2Settings.mfcr2_allow_collect_calls === "yes") ? true : false,
                    mfcr2DoubleAnswerVal = (mfcR2Settings.mfcr2_double_answer === "yes") ? true : false,
                    mfcr2AcceptOnOfferVal = (mfcR2Settings.mfcr2_accept_on_offer === "yes") ? true : false,
                    mfcr2SkipCategoryVal = (mfcR2Settings.mfcr2_skip_category === "yes") ? true : false,
                    mfcr2ChargeCallsVal = (mfcR2Settings.mfcr2_charge_calls === "yes") ? true : false,
                    mfAdvancedSettingsVal = (mfcR2Settings.mf_advanced_settings === "yes") ? true : false

                form.setFieldsValue({
                    mfcr2_get_ani_first: mfcr2GetAniFirstVal,
                    mfcr2_category: mfcR2Settings.mfcr2_category,
                    mfcr2_allow_collect_calls: mfcr2AllowCollectCallsVal,
                    mfcr2_double_answer: mfcr2DoubleAnswerVal,
                    mfcr2_accept_on_offer: mfcr2AcceptOnOfferVal,
                    mfcr2_skip_category: mfcr2SkipCategoryVal,
                    mfcr2_charge_calls: mfcr2ChargeCallsVal,
                    mfcr2_mfback_timeout: mfcR2Settings.mfcr2_mfback_timeout,
                    mfcr2_metering_pulse_timeout: mfcR2Settings.mfcr2_metering_pulse_timeout,
                    mf_advanced_settings: mfAdvancedSettingsVal
                })
            } else {
                form.setFieldsValue({
                    mf_advanced_settings: false
                })
            }
        }
        // $("#advanced_area").text(":" + $(this).find("option:selected").text())
    }
    _onChangeSpanType = (val) => {
        const form = this.props.form
        const { formatMessage } = this.props.intl

        let oldSingnaling = global.oldSingnaling,
            oldCoding = global.oldCoding,
            bchanTotalChans = global.bchanTotalChans,
            oldHardhdlc = global.oldHardhdlc,
            oldFraming = global.oldFraming

        let hardhdlcEle = this.refs.div_hardhdlc,
            signalling = form.getFieldValue('signalling'),
            opts = []

        if (val === "E1") {
            bchanTotalChans = 31

            let framingOpts = []
            if (signalling === 'mfcr2') {
                framingOpts = [{
                    val: "cas"
                }]
            } else {
                framingOpts = [{
                    val: "ccs"
                }]
            }

            let hardhdlcOpts = [],
                dataTrunkChansArr = this.props.getDataTrunkChansArr(),
                allChansArr = this.props.getTotalArr(dataTrunkChansArr)

            if (((allChansArr.length + 1) === bchanTotalChans) || (allChansArr.length === bchanTotalChans)) {
                hardhdlcOpts = [{
                    text: formatMessage({ id: "LANG133" }),
                    val: "0"
                }]
            }
            for (let i = 1; i <= bchanTotalChans; i++) {
                hardhdlcOpts.push({
                    val: i
                })
            }

            let codingOpts = [{
                    val: "hdb3",
                    text: "HDB3"
                }, {
                    val: "ami",
                    text: "AMI"
                }],

                crcOpts = [{
                    text: "None",
                    val: "none"
                }, {
                    val: "crc4",
                    text: "CRC4"
                }],

                signallingOpts = [{
                    val: "pri_net",
                    text: "PRI_NET"
                }, {
                    val: "pri_cpe",
                    text: "PRI_CPE"
                }, {
                    val: "ss7",
                    text: "SS7"
                }, {
                    val: "mfcr2",
                    text: "MFC/R2"
                }]

            form.setFieldsValue({
               hardhdlc: oldHardhdlc,
               switchtype: "euroisdn"
            })

            this.setState({
                framingOpts: framingOpts,
                hardhdlcOpts: hardhdlcOpts,
                codingOpts: codingOpts,
                crcOpts: crcOpts,
                signallingOpts: signallingOpts,
                div_crc_style: "display-block"
            })
        } else if (val === "T1" || val === "J1") {
            bchanTotalChans = 24

            let framingOpts = [{
                val: "esf"
            }, {
                val: 'd4'
            }]

            if (hardhdlcEle.props.children.props.children.length > 25) {
                let hardhdlcOpts = []
                let dataTrunkChansArr = this.props.getDataTrunkChansArr(),
                    allChansArr = this.props.getTotalArr(dataTrunkChansArr)

                if ((allChansArr.length + 1) === bchanTotalChans) {
                    hardhdlcOpts = [{
                        text: formatMessage({ id: "LANG133" }),
                        val: "0"
                    }]
                }
                for (let i = 1; i <= bchanTotalChans; i++) {
                    hardhdlcOpts.push({
                        val: i
                    })
                }
                this.setState({
                    hardhdlcOpts: hardhdlcOpts
                })
                form.setFieldsValue({
                   hardhdlc: oldHardhdlc
                })
            }

            let codingOpts = [{
                val: "b8zs",
                text: "B8ZS"
            }, {
                val: "ami",
                text: "AMI"
            }]

            let crcOpts = [{
                val: "none"
            }]

            let signallingOpts = [{
                val: "pri_net",
                text: "PRI_NET"
            }, {
                val: "pri_cpe",
                text: "PRI_CPE"
            }, {
                val: "ss7",
                text: "SS7"
            }, {
                val: "em",
                text: "E&M Immediate"
            }, {
                val: "em_w",
                text: "E&M Wink"
            }]

            if (val === "J1") {
                signallingOpts.length = 3
            }

            this.setState({
                framingOpts: framingOpts,
                codingOpts: codingOpts,
                crcOpts: crcOpts,
                signallingOpts: signallingOpts,
                div_crc_style: "hidden"
            })

            form.setFieldsValue({
                switchtype: "national"
            })

            let hardhdlc = form.getFieldValue("hardhdlc")

            if ((Number(hardhdlc) > 24)) {
                message.error(formatMessage({ id: "LANG3968" }))
            }
        }
        if (!this.props.isChangeSignallingForDataTrunk()) {
            message.error(formatMessage({ id: "LANG3978" }, { 0: form.getFieldValue("hardhdlc") }))
        }
        if (oldSingnaling) {
            let isExsit = _.find(this.refs.div_signalling.props.children.props.children, function(it) {
                let key = it.key
                return oldSingnaling === key
            })
            if (typeof isExsit !== "undefined") {
                form.setFieldsValue({
                    signalling: "pri_net"
                })
            } else {
                form.setFieldsValue({
                    signalling: oldSingnaling
                })
            }
        }
        form.setFieldsValue({
            coding: oldCoding
        })

        if (val === "T1" || val === "J1") {
            if (oldSingnaling === "mfcr2") {
                form.setFieldsValue({
                    signalling: "pri_cpe"
                })
            }

            if (oldFraming && oldFraming !== 'ccs' && oldFraming !== 'cas') {
                form.setFieldsValue({
                    framing: oldFraming
                })
            }
        }

        if (val === "E1") {
            if (oldSingnaling === "em" || oldSingnaling === "em_w") {
                form.setFieldsValue({
                    signalling: "pri_cpe"
                })
            }
        }
    }
    _onChangeSs7type = (val) => {
        // if ($(this).val() == "itu") {
        //     $P("#pointcode, #defaultdpc", document).rules("remove", "customCallback1");
        //     $P("#pointcode", document).rules("add", {
        //         digits: true,
        //         range: [0, 16383],
        //         customCallback3: [$P.lang("LANG3263").format($P.lang("LANG3257"), $P.lang("LANG3259")),
        //             function() {
        //                 return $("#pointcode").val() != $("#defaultdpc").val();
        //             }
        //         ]
        //     });
        //     $P("#defaultdpc", document).rules("add", {
        //         digits: true,
        //         range: [0, 16383],
        //         customCallback3: [$P.lang("LANG3263").format($P.lang("LANG3259"), $P.lang("LANG3257")),
        //             function() {
        //                 return $("#defaultdpc").val() != $("#pointcode").val();
        //             }
        //         ]
        //     });
        //     $P("#pointcode, #defaultdpc", document).valid();
        // } else {
        //     $P("#pointcode", document).rules("remove", "digits range");
        //     $P("#defaultdpc", document).rules("remove", "digits range");
        //     $P("#pointcode", document).rules("add", {
        //         customCallback1: [$P.lang("LANG3459").format(0, 16777215, 0, 255),
        //             function(val, ele) {
        //                 return (/^\d+$/.test(val) && (0 <= Number(val) && Number(val) <= 16777215)) || /^([0-9]|([0-9]\d)|(0\d{2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\-(([0-9])|([0-9]\d)|(0\d{2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\-(([0-9])|([0-9]\d)|(0\d{2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/.test(val);
        //             }
        //         ],
        //         customCallback3: [$P.lang("LANG3263").format($P.lang("LANG3257"), $P.lang("LANG3259")),
        //             function() {
        //                 return $("#pointcode").val() != $("#defaultdpc").val();
        //             }
        //         ]
        //     });
        //     $P("#defaultdpc", document).rules("add", {
        //         customCallback1: [$P.lang("LANG3459").format(0, 16777215, 0, 255),
        //             function(val, ele) {
        //                 if (val) {
        //                     return (/^\d+$/.test(val) && (0 <= Number(val) && Number(val) <= 16777215)) || /^([0-9]|([0-9]\d)|(0\d{2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\-(([0-9])|([0-9]\d)|(0\d{2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\-(([0-9])|([0-9]\d)|(0\d{2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/.test(val);
        //                 } else {
        //                     return true;
        //                 }
        //             }
        //         ],
        //         customCallback3: [$P.lang("LANG3263").format($P.lang("LANG3259"), $P.lang("LANG3257")),
        //             function() {
        //                 return $("#defaultdpc").val() != $("#pointcode").val();
        //             }
        //         ]
        //     })
        // }
    }
    _onChangeMfcr2SkipCategory = (e) => {
        this.setState({
            mfcr2SkipCategoryChecked: e.target.checked
        })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        let hardhdlcOpts = this.props.hardhdlcOpts,
            parentState = this.props.parentState

        if (this.state.hardhdlcOpts.length !== 0) {
            hardhdlcOpts = this.state.hardhdlcOpts
        }

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        
        let priSettingsInfo = this.props.priSettingsInfo,
            mfcr2GeAniFirstValue = false,
            mfcr2SkipCategoryVal = false

        if (priSettingsInfo.mfcr2_get_ani_first === "yes") {
            mfcr2GeAniFirstValue = true 
        } else if (this.state.mfcr2SkipCategoryChecked) {
            mfcr2GeAniFirstValue = false
        }

        if (priSettingsInfo.mfcr2_skip_category === "yes") {
            mfcr2SkipCategoryVal = true 
        } else if (this.state.mfcr2GetAniFirstChecked) {
            mfcr2SkipCategoryVal = false
        }

        return (
            <div className="content">
                <div className="ant-form">
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3130" />}>
                                        <span>{formatMessage({id: "LANG3129"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('span_type', {
                                    rules: [],
                                    initialValue: priSettingsInfo.span_type ? priSettingsInfo.span_type : "E1"
                                })(
                                    <Select onChange={ this._onChangeSpanType } >
                                        <Option value="E1">E1</Option>
                                        <Option value="T1">T1</Option>
                                        <Option value="J1">J1</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3126" />}>
                                        <span>{formatMessage({id: "LANG3125"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('clock', {
                                    rules: [],
                                    initialValue: priSettingsInfo.clock ? String(priSettingsInfo.clock) : "0"
                                })(
                                    <Select>
                                        <Option value="0">{ formatMessage({ id: "LANG3127"}) }</Option>
                                        <Option value="1">{ formatMessage({ id: "LANG3128"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                ref="div_signalling"
                                className={ parentState.div_signalling_style }
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3108" />}>
                                        <span>{formatMessage({id: "LANG3107"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('signalling', {
                                    rules: [],
                                    initialValue: priSettingsInfo.signalling ? priSettingsInfo.signalling : "pri_net"
                                })(
                                    <Select onChange= { this._onChangeSignalling }>
                                    {
                                        this.state.signallingOpts.map(function(it) {
                                            const text = it.text
                                            const value = String(it.val)

                                            return <Option key={ value } value={ value }>
                                                   { text ? text : value }
                                                </Option>
                                        })
                                    }
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                ref="div_hardhdlc"
                                className={ this.state.div_hardhdlc_style }
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3134" />}>
                                        <span>{formatMessage({id: "LANG3133"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('hardhdlc', {
                                    rules: [],
                                    initialValue: priSettingsInfo.hardhdlc
                                })(
                                    <Select>
                                    {
                                        hardhdlcOpts.map(function(it) {
                                            const text = it.text
                                            const value = String(it.val)

                                            return <Option key={ value } value={ value }>
                                                   { text ? text : value }
                                                </Option>
                                        })
                                    }
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <div ref="div_ss7Options" className={ parentState.div_ss7Options_style }>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3256" />}>
                                            <span>{formatMessage({id: "LANG3255"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ss7type', {
                                        rules: [],
                                        initialValue: priSettingsInfo.ss7type ? priSettingsInfo.ss7type : "itu"
                                    })(
                                        <Select onChange={ this._onChangeSs7type } >
                                            <Option value="itu">ITU</Option>
                                            <Option value="ansi">ANSI</Option>
                                            <Option value="china">CHINA</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3258" />}>
                                            <span>{formatMessage({id: "LANG3257"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('pointcode', {
                                        rules: [],
                                        initialValue: priSettingsInfo.pointcode ? priSettingsInfo.pointcode : ""
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3260" />}>
                                            <span>{formatMessage({id: "LANG3259"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('defaultdpc', {
                                        rules: [],
                                        initialValue: priSettingsInfo.defaultdpc ? priSettingsInfo.pointcode : ""
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG4088" />}>
                                            <span>{formatMessage({id: "LANG4070"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('cicbeginswith', {
                                        rules: [],
                                        initialValue: priSettingsInfo.cicbeginswith ? priSettingsInfo.cicbeginswith : ""
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG4111" />}>
                                            <span>{formatMessage({id: "LANG4110"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('sigchan_assign_cic', {
                                        rules: [],
                                        initialValue: priSettingsInfo.sigchan_assign_cic ? String(priSettingsInfo.sigchan_assign_cic) : "0"
                                    })(
                                        <Select>
                                            <Option value="0">{ formatMessage({ id: "LANG137"}) }</Option>
                                            <Option value="1">{ formatMessage({ id: "LANG136"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3316" />}>
                                            <span>{formatMessage({id: "LANG3315"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_skip_category', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: mfcr2SkipCategoryVal
                                    })(
                                        <Checkbox onChange={ this._onChangeMfcr2SkipCategory } disabled={ this.state.mfcr2GetAniFirstChecked } />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div ref="div_mfcR2" className={ parentState.div_mfcR2_style }>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3291" /> }>
                                            <span>{formatMessage({id: "LANG3290"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_variant', {
                                        rules: [],
                                        initialValue: priSettingsInfo.mfcr2_variant ? priSettingsInfo.mfcr2_variant : "ar"
                                    })(
                                        <Select onChange={ this._onChangeMfcr2Variant }>
                                            <Option value="ar">{ formatMessage({ id: "LANG284"}) }</Option>
                                            <Option value="br">{ formatMessage({ id: "LANG307"}) }</Option>
                                            <Option value="cn">{ formatMessage({ id: "LANG324"}) }</Option>
                                            <Option value="cz">{ formatMessage({ id: "LANG332"}) }</Option>
                                            <Option value="co">{ formatMessage({ id: "LANG325"}) }</Option>
                                            <Option value="ec">{ formatMessage({ id: "LANG341"}) }</Option>
                                            <Option value="id">{ formatMessage({ id: "LANG379"}) }</Option>
                                            <Option value="itu">ITU</Option>
                                            <Option value="mx">{ formatMessage({ id: "LANG437"}) }</Option>
                                            <Option value="ph">{ formatMessage({ id: "LANG458"}) }</Option>
                                            <Option value="ve">{ formatMessage({ id: "LANG528"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref="div_mfcr2ForcedRelease"
                                    className={ this.state.div_mfcr2ForcedRelease_style }
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3318" />}>
                                            <span>{formatMessage({id: "LANG3317"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_forced_release', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: priSettingsInfo.mfcr2_forced_release === "yes" ? true : false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3299" />}>
                                            <span>{formatMessage({id: "LANG3298"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_category', {
                                        rules: [],
                                        initialValue: priSettingsInfo.mfcr2_category ? priSettingsInfo.mfcr2_category : "national_subscriber"
                                    })(
                                        <Select>
                                            <Option value="national_subscriber">{ formatMessage({ id: "LANG3300"}) }</Option>
                                            <Option value="national_priority_subscriber">{ formatMessage({ id: "LANG3301"}) }</Option>
                                            <Option value="international_subscriber">{ formatMessage({ id: "LANG3302"}) }</Option>
                                            <Option value="international_priority_subscriber">{ formatMessage({ id: "LANG3303"}) }</Option>
                                            <Option value="collect_call" disabled={ this.state.collectCall}>{ formatMessage({ id: "LANG3304"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3293" /> }>
                                            <span>{ formatMessage({id: "LANG3292"}) }</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_get_ani_first', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: mfcr2GeAniFirstValue
                                    })(
                                        <Checkbox onChange= { this._onChangeMfcr2GetAniFirst } disabled={ this.state.mfcr2SkipCategoryChecked } />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                ref="div_lbo"
                                className={ parentState.div_lbo_style }
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3104" />}>
                                        <span>{formatMessage({id: "LANG3103"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('lbo', {
                                    rules: [],
                                    initialValue: priSettingsInfo.lbo ? String(priSettingsInfo.lbo) : "0"
                                })(
                                    <Select>
                                        <Option value="0" >{ formatMessage({ id: "LANG3154"}) }</Option>
                                        <Option value="1" >{ formatMessage({ id: "LANG3155"}) }</Option>
                                        <Option value="2" >{ formatMessage({ id: "LANG3156"}) }</Option>
                                        <Option value="3" >{ formatMessage({ id: "LANG3157"}) }</Option>
                                        <Option value="4" >{ formatMessage({ id: "LANG3158"}) }</Option>
                                        <Option value="5" >{ formatMessage({ id: "LANG3159"}) }</Option>
                                        <Option value="6" >{ formatMessage({ id: "LANG3160"}) }</Option>
                                        <Option value="7" >{ formatMessage({ id: "LANG3161"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3100" />}>
                                        <span>{formatMessage({id: "LANG3099"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('coding', {
                                    rules: [],
                                    initialValue: priSettingsInfo.coding
                                })(
                                    <Select>
                                    {   
                                        this.state.codingOpts.map(function(it) {
                                            const text = it.text
                                            const value = String(it.val)

                                            return <Option key={ value } value={ value }>
                                                   { text ? text : value }
                                                </Option>
                                        })
                                    }
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <div ref="div_rtx" className={ parentState.div_rtx_style }>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3163" />}>
                                            <span>{formatMessage({id: "LANG1113"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('rxgain', {
                                        rules: [],
                                        initialValue: priSettingsInfo.rxgain ? String(priSettingsInfo.rxgain) : "12"
                                    })(
                                        <Select>
                                            <Option value="12" >12</Option>
                                            <Option value="11" >11</Option>
                                            <Option value="10" >10</Option>
                                            <Option value="9" >9</Option>
                                            <Option value="8" >8</Option>
                                            <Option value="7" >7</Option>
                                            <Option value="6" >6</Option>
                                            <Option value="5" >5</Option>
                                            <Option value="4" >4</Option>
                                            <Option value="3" >3</Option>
                                            <Option value="2" >2</Option>
                                            <Option value="1" >1</Option>
                                            <Option value="0" >0</Option>
                                            <Option value="-1" >-1</Option>
                                            <Option value="-2" >-2</Option>
                                            <Option value="-3" >-3</Option>
                                            <Option value="-4" >-4</Option>
                                            <Option value="-5" >-5</Option>
                                            <Option value="-6">-6</Option>
                                            <Option value="-7" >-7</Option>
                                            <Option value="-8" >-8</Option>
                                            <Option value="-9" >-9</Option>
                                            <Option value="-10" >-10</Option>
                                            <Option value="-11" >-11</Option>
                                            <Option value="-12" >-12</Option>
                                            <Option value="-13" >-13</Option>
                                            <Option value="-14" >-14</Option>
                                            <Option value="-15" >-15</Option>
                                            <Option value="-16" >-16</Option>
                                            <Option value="-17" >-17</Option>
                                            <Option value="-18" >-18</Option>
                                            <Option value="-19" >-19</Option>
                                            <Option value="-20" >-20</Option>
                                            <Option value="-21" >-21</Option>
                                            <Option value="-22" >-22</Option>
                                            <Option value="-23" >-23</Option>
                                            <Option value="-24" >-24</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3164" />}>
                                            <span>{formatMessage({id: "LANG1115"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('txgain', {
                                        rules: [],
                                        initialValue: priSettingsInfo.txgain ? String(priSettingsInfo.txgain) : "12"
                                    })(
                                        <Select>
                                            <Option value="12" >12</Option>
                                            <Option value="11" >11</Option>
                                            <Option value="10" >10</Option>
                                            <Option value="9" >9</Option>
                                            <Option value="8" >8</Option>
                                            <Option value="7" >7</Option>
                                            <Option value="6" >6</Option>
                                            <Option value="5" >5</Option>
                                            <Option value="4" >4</Option>
                                            <Option value="3" >3</Option>
                                            <Option value="2" >2</Option>
                                            <Option value="1" >1</Option>
                                            <Option value="0" >0</Option>
                                            <Option value="-1" >-1</Option>
                                            <Option value="-2" >-2</Option>
                                            <Option value="-3" >-3</Option>
                                            <Option value="-4" >-4</Option>
                                            <Option value="-5" >-5</Option>
                                            <Option value="-6" >-6</Option>
                                            <Option value="-7" >-7</Option>
                                            <Option value="-8" >-8</Option>
                                            <Option value="-9" >-9</Option>
                                            <Option value="-10" >-10</Option>
                                            <Option value="-11" >-11</Option>
                                            <Option value="-12" >-12</Option>
                                            <Option value="-13" >-13</Option>
                                            <Option value="-14" >-14</Option>
                                            <Option value="-15" >-15</Option>
                                            <Option value="-16" >-16</Option>
                                            <Option value="-17" >-17</Option>
                                            <Option value="-18" >-18</Option>
                                            <Option value="-19" >-19</Option>
                                            <Option value="-20" >-20</Option>
                                            <Option value="-21" >-21</Option>
                                            <Option value="-22" >-22</Option>
                                            <Option value="-23" >-23</Option>
                                            <Option value="-24" >-24</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                ref="div_codec"
                                className={ parentState.div_codec_style }
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3106" />}>
                                        <span>{ formatMessage({id: "LANG3105"}) }</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('codec', {
                                    rules: [],
                                    initialValue: priSettingsInfo.codec ? priSettingsInfo.codec : "default"
                                })(
                                    <Select>
                                        <Option value="default">{ formatMessage({id: "LANG257"}) }</Option>
                                        <Option value="alaw">alaw</Option>
                                        <Option value="ulaw">ulaw</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                ref="div_priPlayLocalRbt"
                                className={ parentState.div_priPlayLocalRbt_style }
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3492" /> }>
                                            <span>{ formatMessage({id: "LANG3491"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('priplaylocalrbt', {
                                    valuePropName: 'checked',
                                    initialValue: priSettingsInfo.priplaylocalrbt === "yes" ? true : false
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                ref="div_mfcr2PlayLocaRbt"
                                className={ parentState.div_mfcr2PlayLocaRbt_style }
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3492" /> }>
                                            <span>{ formatMessage({id: "LANG3491"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('mfcr2_play_local_rbt', {
                                    valuePropName: 'checked',
                                    initialValue: priSettingsInfo.mfcr2_play_local_rbt === "yes" ? true : false
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                className="hidden"
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3132" /> }>
                                            <span>{ formatMessage({id: "LANG3131"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                <span ref="bchan">{ priSettingsInfo.bchan }</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                ref="div_priPlayLocalRbt"
                                className={ this.state.priPlayLocalRbtDiv_style }
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3098" /> }>
                                            <span>{ formatMessage({id: "LANG3097"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('framing', {
                                    initialValue: priSettingsInfo.framing
                                })(
                                    <Select onChange={ this._onChangeFraming }>
                                    {
                                        this.state.framingOpts.map(function(it) {
                                            const text = it.text
                                            const value = String(it.val)

                                            return <Option key={ value } value={ value }>
                                                   { text ? text : value }
                                                </Option>
                                        })
                                    }
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                ref="div_crc"
                                className={ parentState.div_crc_style }
                                className={ this.state.div_crc_style }
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3102" />}>
                                        <span>{formatMessage({id: "LANG3101"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('crc', {
                                    rules: [],
                                    initialValue: priSettingsInfo.crc
                                })(
                                    <Select>
                                    {   
                                        this.state.crcOpts.map(function(it) {
                                            const text = it.text
                                            const value = String(it.val)

                                            return <Option key={ value } value={ value }>
                                                   { text ? text : value }
                                                </Option>
                                        })
                                    }
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>   
                </div>
            </div>
        )
    }
}

export default injectIntl(BasicSettings)