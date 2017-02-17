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
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class BasicSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            mfcr2ForcedReleaseDivStyle: "hidden",
            mfcr2SkipCategoryChecked: false,
            mfcr2GetAniFirstChecked: false
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.props.getRefs(this.refs)
        this._initVal()
    }
    _initVal = () => {
        const form = this.props.form
        if (form.getFieldValue("mfcr2_variant") === "br") {
            this.setState({ 
                mfcr2ForcedReleaseDivStyle: "display-block"
            })
        } else {
            this.setState({ 
                mfcr2ForcedReleaseDivStyle: "hidden"
            })
        }
    }
    _onChangeMfcr2GetAniFirst = (e) => {
        this.setState({
            mfcr2GetAniFirstChecked: e.target.checked
        })
    }
    _onChangeSignalling = () => {
        // var value = $(this).val(),
        //     hardhdlcEle = $("#hardhdlc"),
        //     hardhdlcDiv = $("#hardhdlcDiv"),
        //     opts = hardhdlcEle.children(),
        //     noneOpt = hardhdlcEle.children().filter("[value=0]"),
        //     flag = true;

        // if (value == "ss7") {
        //     var totleChans = getTotalChans(),
        //         dataTrunkChansArr = this._getDataTrunkChansArr(),
        //         allChansArr = this._getTotalArr(dataTrunkChansArr);
        //     hardhdlcDiv.show();

        //     if ((allChansArr.length + 1) >= totleChans && noneOpt.length == 0) {
        //         hardhdlcEle.prepend("<option value='0'>" + $P.lang("LANG133") + "</option>");
        //     } else if ((allChansArr.length + 1) < totleChans) {
        //         noneOpt.remove();
        //     }
        //     for (var i = 0; i < opts.length; i++) {
        //         var index = opts[i];
        //         index.disabled = false;
        //     };
        //     var ss7Settings = mWindow.ss7Settings[0];
        //     if (ss7Settings) {
        //         $("#ss7_called_nai").val(ss7Settings["ss7_called_nai"]);
        //         $("#ss7_calling_nai").val(ss7Settings["ss7_calling_nai"]);
        //         $("#internationalprefix").val(ss7Settings["ss7_internationalprefix"]);
        //         $("#nationalprefix").val(ss7Settings["ss7_nationalprefix"]);
        //         $("#subscriberprefix").val(ss7Settings["ss7_subscriberprefix"]);
        //         $("#unknownprefix").val(ss7Settings["ss7_unknownprefix"]);
        //         //$("#cicbeginswith").val(ss7Settings["cicbeginswith"]);
        //         //top.Custom.init(document, $(".prioptions").get(0));
        //     }
        //     $("#ss7Options, #callerIdPrefix, #SS7dialplanDIV, #codecDiv, #subscriberprefixDiv, #lboDiv, #rtxDiv").show();
        //     $("#mfcR2Div, #priT310Div, #switchtypeDiv, #localprefixDiv, #privateprefixDiv, #specialDiv, #pridialplanDIV, #channelDiv, #R2Advanced, #otherAdvanced_btn, #priPlayLocalRbtDiv, #mfcr2PlayLocaRbtDiv, #em_immediate_div, #em_w_outgoing").hide();
        // } else if (value == "mfcr2") {
        //     hardhdlcDiv.hide();
        //     $("#mfcR2Div, #channelDiv, #R2Advanced, #otherAdvanced_btn, #mfcr2PlayLocaRbtDiv, #lboDiv, #rtxDiv").show();
        //     $("#specialDiv, #priT310Div, #ss7Options, #switchtypeDiv, #callerIdPrefix, #pridialplanDIV, #SS7dialplanDIV, #codecDiv, #priPlayLocalRbtDiv, #em_immediate_div, #em_w_outgoing").hide();
        // } else if (value == "em" || value == "em_w") {
        //     $("#em_immediate_div").show();
        //     if (value === "em_w") {
        //         $("#em_w_outgoing").show();
        //     } else {
        //         $("#em_w_outgoing").hide();
        //     }
        //     hardhdlcDiv.hide();
        //     flag = false;
        //     $("#mfcR2Div, #priT310Div, #ss7Options, #lboDiv, #R2Advanced, #otherAdvanced_btn, #subscriberprefixDiv, #priPlayLocalRbtDiv, #mfcr2PlayLocaRbtDiv, #SS7dialplanDIV, #callerIdPrefix, #switchtypeDiv, #pridialplanDIV, #specialDiv").hide();
        // } else {
        //     var totleChans = getTotalChans(),
        //         dataTrunkChansArr = this._getDataTrunkChansArr(),
        //         allChansArr = this._getTotalArr(dataTrunkChansArr);
        //     hardhdlcDiv.show();
        //     if ((allChansArr.length + 1) >= totleChans && noneOpt.length == 0) {
        //         hardhdlcEle.prepend("<option value='0'>" + $P.lang("LANG133") + "</option>");
        //     } else if ((allChansArr.length + 1) < totleChans) {
        //         noneOpt.remove();
        //     }
        //     for (var i = 0; i < opts.length; i++) {
        //         var index = opts[i];
        //         index.disabled = false;
        //     };
        //     UCMGUI.domFunction.updateDocument(priSettingsInfo, $(".prioptions").get(0));

        //     $("#mfcR2Div, #ss7Options, #R2Advanced, #otherAdvanced_btn, #subscriberprefixDiv, #SS7dialplanDIV, #mfcr2PlayLocaRbtDiv, #em_immediate_div, #em_w_outgoing").hide();
        //     $("#switchtypeDiv, #priT310Div, #localprefixDiv, #privateprefixDiv, #specialDiv, #channelDiv, #callerIdPrefix, #pridialplanDIV, #codecDiv, #priPlayLocalRbtDiv, #lboDiv, #rtxDiv").show();
        //     if ($("#span_type").val() == "E1") {
        //         $("#crcDiv").show();
        //     }
        //     if ($("#span_type").val() == "T1" || $("#span_type").val() == "J1") {
        //         $("#crcDiv").hide();
        //     }
        // }

        // if ($("#span_type").val() == "E1") {
        //     var opts;

        //     if (hardhdlcEle.children().filter("[value=" + oldHardhdlc + "]").length != 0) {
        //         hardhdlcEle.val(oldHardhdlc);
        //     } else {
        //         hardhdlcEle.val(16);
        //     }

        //     if (value === 'mfcr2') {
        //         opts = [{
        //             val: "cas"
        //         }];
        //     } else {
        //         opts = [{
        //             val: "ccs"
        //         }];
        //     }

        //     selectbox.appendOpts({
        //         el: "framing",
        //         opts: opts
        //     }, doc);

        //     opts = [];
        // }
        // if (($("#span_type").val() == "T1" || $("#span_type").val() == "J1") && flag) {
        //     if (hardhdlcEle.children().filter("[value=" + oldHardhdlc + "]").length != 0) {
        //         hardhdlcEle.val(oldHardhdlc);
        //     } else {
        //         hardhdlcEle.val(24);
        //     }
        // }

        // $("#coding").val(oldCoding);
        // if (value == "mfcr2") {
        //     hardhdlcEle.val("16");
        // } else if (value == "em" || value == "em_w") {
        //     hardhdlcEle.val(0);
        // }
        // var val = $("#span_type").val();
        // if (val == "T1" || val == "J1") {
        //     if (oldCoding == "hdb3") {
        //         $('#coding').val("b8zs");
        //     }
        // } else {
        //     if (oldCoding == "b8zs") {
        //         $('#coding').val("hdb3");
        //     }
        // }
        // oldSingnaling = value;
        // if (text == undefined) {
        //     top.Custom.init(doc);
        // }

        // top.dialog.currentDialogType = "iframe";
        // top.dialog.repositionDialog();

        // ev.stopPropagation();
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
        //     collectCallOption = $("#mfcr2_category option[value='collect_call']");

        // if (val == "br") {
        //      collectCallOption.attr("disabled", false);
                // this.setState({ 
                //     mfcr2ForcedReleaseDivStyle: "display-block"
                // })

        // } else {
        //     if ($("#mfcr2_category").val() == "collect_call") {
        //         $("#mfcr2_category").val("national_subscriber");
        //     }
        //     collectCallOption.attr("disabled", true);
            // this.setState({ 
            //     mfcr2ForcedReleaseDivStyle: "hidden"
            // })
        // }
        // var mfcR2Settings = mWindow.mfcR2Settings[0];
        // resetCheckbox(text);

        // if (val == "ve") {
        //     $("#mfcr2_get_ani_first").get(0).checked = true;
        //     $("#mfcr2_get_ani_first").trigger("change", text);
        // }

        // if (mfcR2Settings) {
        //     if ($("#mfcr2_variant").val() == mfcR2Settings.mfcr2_variant) {
        //         var mfcr2GetAniFirstVal = (mfcR2Settings.mfcr2_get_ani_first == "yes") ? true : false;
        //         var mfcr2AllowCollectCallsVal = (mfcR2Settings.mfcr2_allow_collect_calls == "yes") ? true : false;
        //         var mfcr2DoubleAnswerVal = (mfcR2Settings.mfcr2_double_answer == "yes") ? true : false;
        //         //var mfcr2ImmediateAcceptVal = (mfcR2Settings.mfcr2_immediate_accept == "yes") ? true : false;
        //         var mfcr2AcceptOnOfferVal = (mfcR2Settings.mfcr2_accept_on_offer == "yes") ? true : false;
        //         var mfcr2SkipCategoryVal = (mfcR2Settings.mfcr2_skip_category == "yes") ? true : false;
        //         var mfcr2ChargeCallsVal = (mfcR2Settings.mfcr2_charge_calls == "yes") ? true : false;

        //         $("#mfcr2_get_ani_first").get(0).checked = mfcr2GetAniFirstVal;
        //         $("#mfcr2_category").val(mfcR2Settings.mfcr2_category);
        //         $("#mfcr2_allow_collect_calls").get(0).checked = mfcr2AllowCollectCallsVal;
        //         $("#mfcr2_double_answer").get(0).checked = mfcr2DoubleAnswerVal;
        //         //$("#mfcr2_immediate_accept").get(0).checked = mfcr2ImmediateAcceptVal;
        //         $("#mfcr2_accept_on_offer").get(0).checked = mfcr2AcceptOnOfferVal;
        //         $("#mfcr2_skip_category").get(0).checked = mfcr2SkipCategoryVal;
        //         $("#mfcr2_charge_calls").get(0).checked = mfcr2ChargeCallsVal;

        //         $("#mfcr2_mfback_timeout").val(mfcR2Settings.mfcr2_mfback_timeout);
        //         $("#mfcr2_metering_pulse_timeout").val(mfcR2Settings.mfcr2_metering_pulse_timeout);

        //         $("#mfcr2_get_ani_first").trigger("change", text);
        //         $("#mfcr2_skip_category").trigger("change", text);
        //         $("#mfcr2_double_answer").trigger("change", text);

        //         $("#mf_advanced_settings")[0].checked = (mfcR2Settings.mf_advanced_settings == "yes") ? true : false;
        //         $("#mf_advanced_settings")[0].updateStatus();
        //     } else {
        //         $("#mf_advanced_settings")[0].checked = false;
        //         $("#mf_advanced_settings")[0].updateStatus();
        //     }
        // }

        // $("#advanced_area").text(":" + $(this).find("option:selected").text());

        // if (text == undefined) {
        //     top.Custom.init(doc);
        // }
    }
    _onChangeSpanType = () => {
        // var hardhdlcEle = $("#hardhdlc"),
        //     signalling = $('#signalling').val(),
        //     opts;

        // if ($(this).val() == "E1") {

        //     bchanTotalChans = 31;
        //     hardhdlcEle.val(bchanTotalChans);
        //     //$("#hardhdlc").val(16).trigger("change");

        //     if (signalling === 'mfcr2') {
        //         opts = [{
        //             val: "cas"
        //         }];
        //     } else {
        //         opts = [{
        //             val: "ccs"
        //         }];
        //     }

        //     selectbox.appendOpts({
        //         el: "framing",
        //         opts: opts
        //     }, doc);
        //     opts = [];
        //     var dataTrunkChansArr = this._getDataTrunkChansArr();
        //     var allChansArr = this._getTotalArr(dataTrunkChansArr);
        //     if (((allChansArr.length + 1) == bchanTotalChans) || (allChansArr.length == bchanTotalChans)) {
        //         opts = [{
        //             text: $P.lang("LANG133"),
        //             val: "0"
        //         }];
        //     }
        //     for (var i = 1; i <= bchanTotalChans; i++) {
        //         opts.push({
        //             val: i
        //         });
        //     }
        //     hardhdlcEle.empty();
        //     selectbox.appendOpts({
        //         el: "hardhdlc",
        //         opts: opts
        //     }, doc);
        //     hardhdlcEle.val(oldHardhdlc);

        //     opts = [{
        //         val: "hdb3",
        //         text: "HDB3"
        //     }, {
        //         val: "ami",
        //         text: "AMI"
        //     }];

        //     selectbox.appendOpts({
        //         el: "coding",
        //         opts: opts
        //     }, doc);

        //     opts = [{
        //         text: "None",
        //         val: "none"
        //     }, {
        //         val: "crc4",
        //         text: "CRC4"
        //     }];

        //     selectbox.appendOpts({
        //         el: "crc",
        //         opts: opts
        //     }, doc);

        //     opts = [{
        //         val: "pri_net",
        //         text: "PRI_NET"
        //     }, {
        //         val: "pri_cpe",
        //         text: "PRI_CPE"
        //     }, {
        //         val: "ss7",
        //         text: "SS7"
        //     }, {
        //         val: "mfcr2",
        //         text: "MFC/R2"
        //     }];

        //     selectbox.appendOpts({
        //         el: "signalling",
        //         opts: opts
        //     }, doc);

        //     $("#switchtype").val("euroisdn");

        //     $('#crcDiv').css({
        //         "display": "block"
        //     });
        // } else if ($(this).val() == "T1" || $(this).val() == "J1") {

        //     bchanTotalChans = 24;
        //     var opts = [{
        //         val: "esf"
        //     }, {
        //         val: 'd4'
        //     }];

        //     selectbox.appendOpts({
        //         el: "framing",
        //         opts: opts
        //     }, doc);

        //     if (hardhdlcEle.children().length > 25) {
        //         hardhdlcEle.empty();
        //         opts = [];
        //         var dataTrunkChansArr = this._getDataTrunkChansArr(),
        //             allChansArr = this._getTotalArr(dataTrunkChansArr);
        //         if ((allChansArr.length + 1) == bchanTotalChans) {
        //             opts = [{
        //                 text: $P.lang("LANG133"),
        //                 val: "0"
        //             }];
        //         }
        //         for (var i = 1; i <= bchanTotalChans; i++) {
        //             opts.push({
        //                 val: i
        //             });
        //         }
        //         selectbox.appendOpts({
        //             el: "hardhdlc",
        //             opts: opts
        //         }, doc);
        //         hardhdlcEle.val(oldHardhdlc);
        //     }

        //     opts = [{
        //         val: "b8zs",
        //         text: "B8ZS"
        //     }, {
        //         val: "ami",
        //         text: "AMI"
        //     }];

        //     selectbox.appendOpts({
        //         el: "coding",
        //         opts: opts
        //     }, doc);

        //     opts = [{
        //         val: "none"
        //     }];

        //     selectbox.appendOpts({
        //         el: "crc",
        //         opts: opts
        //     }, doc);

        //     opts = [{
        //         val: "pri_net",
        //         text: "PRI_NET"
        //     }, {
        //         val: "pri_cpe",
        //         text: "PRI_CPE"
        //     }, {
        //         val: "ss7",
        //         text: "SS7"
        //     }, {
        //         val: "em",
        //         text: "E&M Immediate"
        //     }, {
        //         val: "em_w",
        //         text: "E&M Wink"
        //     }];

        //     if ($(this).val() === "J1") {
        //         opts.length = 3;
        //     }

        //     selectbox.appendOpts({
        //         el: "signalling",
        //         opts: opts
        //     }, doc);

        //     $("#switchtype").val("national");

        //     $('#crcDiv').hide();
        //     var hardhdlc = hardhdlcEle.val();
        //     if (!text && (Number(hardhdlc) > 24)) {
        //         //top.dialog.clearDialog();

        //         top.dialog.dialogMessage({
        //             type: 'error',
        //             content: $P.lang("LANG3968"),
        //             callback: function() {
        //                 top.dialog.container.show();
        //                 top.dialog.shadeDiv.show();
        //             }
        //         });
        //     }
        // }
        // if (!text && !isChangeSignallingForDataTrunk()) {
        //     top.dialog.dialogMessage({
        //         type: 'error',
        //         content: $P.lang("LANG3978").format($("#hardhdlc").val()),
        //         callback: function() {
        //             top.dialog.container.show();
        //             top.dialog.shadeDiv.show();
        //         }
        //     });
        // }
        // if (oldSingnaling) {
        //     if ($('#signalling').children().filter("[value='" + oldSingnaling + "']").length == 0) {
        //         $('#signalling').val("pri_net");
        //     } else {
        //         $('#signalling').val(oldSingnaling);
        //     }
        // }
        // $('#coding').val(oldCoding);
        // top.Custom.init(doc, $("#hardhdlc")[0]);

        // if ($(this).val() == "T1" || $(this).val() == "J1") {
        //     if (oldSingnaling == "mfcr2") {
        //         $('#signalling').val("pri_cpe");
        //     }
        //     //$('#coding').val("b8zs");

        //     if (oldFraming && oldFraming !== 'ccs' && oldFraming !== 'cas') {
        //         $('#framing').val(oldFraming);
        //     }
        // }

        // if ($(this).val() == "E1") {
        //     if (oldSingnaling == "em" || oldSingnaling == "em_w") {
        //         $('#signalling').val("pri_cpe");
        //     }
        // }

        // $('#signalling').trigger("change", text);

        // top.dialog.currentDialogType = "iframe";
        // top.dialog.repositionDialog();
        // if (text == undefined) {
        //     top.Custom.init(doc);
        // }
        // ev.stopPropagation();

        // // trigger("change", "firstLoad");
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
        //     });
        //     $P("#pointcode, #defaultdpc", document).valid();
        // }
        // //$P("#pointcode, #defaultdpc", document).valid()
        // ev.stopPropagation();
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
                                ref=""
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
                                ref=""
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
                                ref=""
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
                                        <Option value="pri_net">NET</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                        </Col>
                    </Row>
                    <div ref="ss7Options">
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
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
                                    ref=""
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
                                    ref=""
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
                                    ref=""
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
                                    ref=""
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
                                    ref=""
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
                    <div ref="mfcR2Div">
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
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
                                    ref=""
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
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
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
                                            <Option value="collect_call">{ formatMessage({ id: "LANG3304"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref="mfcr2ForcedReleaseDiv"
                                    className={ this.state.mfcr2ForcedReleaseDivStyle }
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
                    </div>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                ref="lboDiv"
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
                        </Col>
                    </Row>
                    <div ref="rtxDiv">
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
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
                                    ref=""
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
                                ref="codecDiv"
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
                                ref="priPlayLocalRbtDiv"
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
                                ref="mfcr2PlayLocaRbtDiv"
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
                                ref=""
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
                                ref="priPlayLocalRbtDiv"
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
                                    {/*
                                        <Option value="ccs">ccs</Option>
                                        <Option value="cas">cas</Option>
                                        <Option value="esf">esf</Option>
                                        <Option value="d4">d4</Option>
                                    */}
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                        </Col>
                    </Row>   
                </div>
            </div>
        )
    }
}

export default injectIntl(BasicSettings)