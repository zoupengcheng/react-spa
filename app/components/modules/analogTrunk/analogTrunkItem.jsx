'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Modal, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Tabs } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import _ from 'underscore'
import api from "../../api/api"
import Validator from "../../api/validator"
import Title from '../../../views/title'

const CheckboxGroup = Checkbox.Group
const baseServerURl = api.apiHost

let oldTrunkName = "",
    oldSLAMode = '',
    trunkId = "",
    countryObj = {},
    ch_chkbxClass = "FXO_ChkBoxes",
    trunkgroup = "",
    trunk_index = ""
    global.type = ""

class AnalogTrunkItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    componentDidMount() {
        const form = this.props.form 

        this._initForm()
        let mode = this.props.route.path
        
        if (mode.indexOf('edit') === 0) {
            let showEles = ["div_out_maxchans", "div_faxmode", "div_detect"],
                showElesObj = {}

            showEles.map(function(it) {
                showElesObj[it + "_style"] = true
            })
            this.setState({
                type: "edit",
                ...showElesObj
            })

            trunkId = this.props.params.trunkId

            this._getAnalogTrunk(trunkId)
        } else {
            this.setState({
                type: "add"
            })

            form.setFieldsValue({
                countrytone: "us"
            })

            this._onChangeCountrytone("us")
        }
    }
    componentWillUnmount() {
    }
    _initForm = () => {
        const form = this.props.form 

        this._loadChans()
        this._loadToneZone()

        this.setState({
            div_out_maxchans_style: "hidden",
            div_detect_style: "hidden"
        })

        form.setFieldsValue({
            usecallerid: true,
            busydetect: true,
            congestiondetect: true,
            enablecurrentdisconnectthreshold: true,
            faxmode: "no",
            polarityonanswerdelay: 600,
            currentdisconnectthreshold: 200,
            fxooutbandcalldialdelay: 0,
            ringtimeout: 8000,
            rxgain: 0,
            txgain: 0,
            busycount: 2,
            congestioncount: 2
        })
        this._tectFax()
    }
    _loadChans = () => {
        // var chans = Number(UCMGUI.config.model_info.num_fxo),
        //     chanList = mWindow.chanList;

        // for (var i = 1; i <= chans; i++) {
        //     var lbl = document.createElement('div'),
        //         label = document.createElement('label'),
        //         lbltext = document.createTextNode(i),
        //         ncbx = document.createElement('input');

        //     lbl.className = 'special';
        //     ncbx.type = 'checkbox';
        //     ncbx.setAttribute("noSerialize", true);
        //     ncbx.value = i;

        //     if (UCMGUI.inArray(i, chanList)) {
        //         ncbx.disabled = true;
        //     }

        //     ncbx.className = ch_chkbxClass;

        //     label.appendChild(lbltext);
        //     lbl.appendChild(ncbx);
        //     lbl.appendChild(label);

        //     document.getElementById("new_ATRNK_cls_container").appendChild(lbl);
        // };

        // $('.' + ch_chkbxClass).bind("click", function() {
        //     $P('#trunk_name', document).valid();

        //     btnDisable();
        // });
    }
    _loadToneZone = () => {
        // var toneZoneSettings = mWindow.toneZoneSettings,
        //     arr = [],
        //     regexBusy = /^([\d+*]+)\/(\d+),[\d+]+\/(\d+)(,[\d+*]+\/(\d+),[\d+]+\/(\d+))?(,[\d+*]+\/(\d+),[\d+]+\/(\d+))?$/,
        //     regexCongestion = /^([\d+*]+)\/(\d+),[\d+]+\/(\d+)(,[\d+*]+\/(\d+),[\d+]+\/(\d+))?(,[\d+*]+\/(\d+),[\d+]+\/(\d+))?$/;

        // $.each(toneZoneSettings, function(index, item) {
        //     var countryItem = {},
        //         obj = {},
        //         country = item["country"];

        //     obj["text"] = item["description"];
        //     obj["val"] = country;
        //     obj["locale"] = nation2langObj[country.toLowerCase()];

        //     arr.push(obj);

        //     var match = item.busy.match(regexBusy);

        //     if (match) {
        //         countryItem.busyfreq = match[1];
        //         countryItem.busypattern = match[2] + ',' + match[3] + ((match[5]) ? ('-' + match[5] + ',' + match[6]) : '') + ((match[8]) ? ('-' + match[8] + ',' + match[9]) : '');
        //     }

        //     match = item.congestion.match(regexCongestion);

        //     if (match) {
        //         countryItem.congestionfreq = match[1];
        //         countryItem.congestionpattern = match[2] + ',' + match[3] + ((match[5]) ? ('-' + match[5] + ',' + match[6]) : '') + ((match[8]) ? ('-' + match[8] + ',' + match[9]) : '');
        //     }

        //     countryItem.desc = item.description;

        //     countryObj[item.country] = countryItem;
        // });

        // arr.push({
        //     val: "custom",
        //     text: "Custom",
        //     locale: "LANG231"
        // });

        // selectbox.appendOpts({
        //     el: "countrytone",
        //     opts: arr
        // }, doc);

        // $("#countrytone").change(function(ev) {
        //     var countrytone = $(this),
        //         val = countrytone.val(),
        //         busytone = '',
        //         congestiontone = '',
        //         freq_tmp;

        //     if (val === 'custom') {
        //         $('.tone-setting').removeAttr('disabled');
        //     } else {
        //         var countryTone = countryObj[val];

        //         if (countryTone) {
        //             // f1=500[@-11][,f2=440[@-11]],c=500/500[-600/600[-700/700]]; 
        //             freq_tmp = countryTone.busyfreq.split('+');

        //             for (var i = 0, len = freq_tmp.length; i < len; i++) {
        //                 busytone += 'f' + (i + 1) + '=' + freq_tmp[i] + '@-50' + ',';
        //             }

        //             busytone += 'c=' + countryTone.busypattern.replace(/,/g, '/');

        //             $('#busy').val(busytone);

        //             freq_tmp = countryTone.congestionfreq.split('+');

        //             for (var i = 0, len = freq_tmp.length; i < len; i++) {
        //                 congestiontone += 'f' + (i + 1) + '=' + freq_tmp[i] + '@-50' + ',';
        //             }

        //             congestiontone += 'c=' + countryTone.congestionpattern.replace(/,/g, '/');

        //             $('#congestion').val(congestiontone);
        //         }

        //         $('.tone-setting').attr('disabled', true).removeClass('ui-state-highlight');
        //     }
        // });
    }
    _tectFax() {
        // var accountList = UCMGUI.isExist.getList("listAccount").account,
        //     faxList = UCMGUI.isExist.getList("listFax").fax,
        //     str = '',
        //     ele;

        // for (var i = 0; i < accountList.length; i++) {
        //     ele = accountList[i];

        //     if (ele.account_type.match(/FXS/i)) {
        //         str += '<option value="' + ele.extension + '">' + ele.extension + '</option>';
        //     }
        // }

        // for (var i = 0; i < faxList.length; i++) {
        //     ele = faxList[i];

        //     str += '<option value="' + ele.extension + '">' + ele.extension + '</option>';

        // }

        // $('#fax_intelligent_route_destination').append(str);
        // $('#faxmode').on('change', function() {
        //     if ($(this).val() === 'detect') {
        //         $('#div_detect').show();
        //     } else {
        //         $('#div_detect').hide();
        //     }
        // });
        // enableCheckBox({
        //     enableCheckBox: 'fax_intelligent_route',
        //     enableList: ['fax_intelligent_route_destination']
        // }, doc);
        // disableCheckBox({
        //     enableCheckBox: 'trunkmode',
        //     enableList: ['polarityswitch', 'dahdilineselectmode', 'out_maxchans']
        // }, doc);
    }
    _getAnalogTrunk = (trunkId) => {
        // var action = {
        //     "action": "getAnalogTrunk",
        //     "analogtrunk": trunkId
        // };

        // $.ajax({
        //     type: "post",
        //     url: "../cgi",
        //     data: action,
        //     error: function(jqXHR, textStatus, errorThrown) {
        //         top.dialog.clearDialog();

        //         top.dialog.dialogMessage({
        //             type: 'error',
        //             content: errorThrown
        //         });
        //     },
        //     success: function(data) {
        //         var bool = UCMGUI.errorHandler(data);

        //         if (bool) {
        //             var analogtrunk = data.response.analogtrunk,
        //                 busy = analogtrunk.busy,
        //                 congestion = analogtrunk.congestion,
        //                 chans = analogtrunk.chans ? analogtrunk.chans.split(",") : [];

        //             oldTrunkName = analogtrunk.trunk_name;
        //             trunkgroup = analogtrunk.trunkgroup;
        //             trunk_index = analogtrunk.trunk_index;
        //             oldSLAMode = analogtrunk.trunkmode;

        //             UCMGUI.domFunction.updateDocument(analogtrunk, document);

        //             if ($('#fax_intelligent_route_destination').val() === null) {
        //                 $('#fax_intelligent_route_destination').val('no');
        //             }

        //             $("#busy").val(busy);

        //             $("#congestion").val(congestion);

        //             if (Number($("#busycount").val()) == 0) {
        //                 $("#busycount").val(2);
        //             }

        //             if (Number($("#congestioncount").val()) == 0) {
        //                 $("#congestioncount").val(2);
        //             }

        //             $('#countrytone').trigger('change');

        //             $.each($('.' + ch_chkbxClass + ':disabled'), function(index, item) {
        //                 if (UCMGUI.inArray($(item).val(), chans)) {
        //                     $(item).attr({
        //                         disabled: false,
        //                         checked: true
        //                     });
        //                 }
        //             });

        //             if ((analogtrunk['faxdetect'] === 'no') && (analogtrunk['fax_gateway'] === 'no')) {
        //                 $('#faxmode').val('no');
        //             } else if (analogtrunk['faxdetect'] === 'incoming') {
        //                 $('#faxmode').val('detect');
        //             } else if (analogtrunk['fax_gateway'] === 'yes') {
        //                 $('#faxmode').val('gateway');
        //             }

        //             var div_currentdisconnectthreshold = $("#div_currentdisconnectthreshold"),
        //                 div_polarityonanswerdelay = $("#div_polarityonanswerdelay");

        //             if (analogtrunk.busydetect == "yes") {
        //                 $("#div_busycount").show();
        //             } else {
        //                 $("#div_busycount").hide();
        //             }

        //             if (analogtrunk.congestiondetect == "yes") {
        //  this.setState({
        //        div_congestioncount_style: true
        //    })
        //             } else {
        //  this.setState({
        //        div_congestioncount_style: false
        //    })
        //             }

        //             if (analogtrunk.enablecurrentdisconnectthreshold == "yes") {
        //                 div_currentdisconnectthreshold.show();
        //             } else {
        //                 div_currentdisconnectthreshold.hide();
        //                 $("#div_currentdisconnectthreshold").val("200");
        //             }

        //             // if (analogtrunk.polarityswitch == "yes") {
            // this.setState({
            //     polarityswitchVal: true,
            // div_polarityonanswerdelay_style: true
            // })
        //             // } else {
        //             //     div_polarityonanswerdelay.hide();
        //             // }
        //             $("#polarityswitch").trigger("change");

        //             if (analogtrunk.trunkmode == 'sla') {
        //                 var trunkmode = $('#trunkmode');
        //                 trunkmode.attr('checked', true);

        //                             this.setState({
        //        div_slaOptions_style: true
        //    })
        //                 trunkmode.get(0).updateStatus();
        //                 // $('#polarityswitch').attr('disabled', true);

        //                 getSLAData(trunkId);
        //             }
        //             $('#faxmode').trigger('change');
        //             $('#fax_intelligent_route_destination')[0].disabled = !$('#fax_intelligent_route')[0].checked;

        //             btnDisable();

        //             top.Custom.init(doc);
        //         }
        //     }
        // });
    }
    _onChangeCountrytone = (val) => {

    }
    _onChangeBusydetect = (e) => {
        let isChecked = e.target.checked

        if (isChecked) {
            this.setState({
                div_busycount_style: true
            })
        } else {
            this.setState({
                div_busycount_style: false
            })
        }
    }
    _onChangeCongestiondetect = (e) => {
        let isChecked = e.target.checked

        if (isChecked) {
            this.setState({
                div_congestioncount_style: true
            })
        } else {
            this.setState({
                div_congestioncount_style: false
            })
        }
    }
    _onChangeTrunkmode = (e) => {
        let isChecked = e.target.checked

        if (isChecked) {
            this.setState({
                div_slaOptions_style: true
            })
        } else {
            this.setState({
                div_slaOptions_style: false
            })
        }
    }
    _onChangePolarityswitch = (e) => {
        let isChecked = e.target.checked

        if (isChecked) {
            this.setState({
                div_polarityonanswerdelay_style: true,
                polarityswitchVal: true
            })
        } else {
            this.setState({
                div_polarityonanswerdelay_style: false,
                polarityswitchVal: false
            })
        }
    }
    _onChangeEnablecurrentdisconnectthreshold = (e) => {
        let isChecked = e.target.checked

        if (isChecked) {
            this.setState({
                div_currentdisconnectthreshold: true
            })
        } else {
            this.setState({
                div_currentdisconnectthreshold: false
            })
        }
    }
    _onClickDetect = () => {
        // if ($("#detect").attr("disabled") == "disabled") {
        //     return
        // }

        // $("#editForm").hide();

        // $("#pstn_div").show();

        // $("#detect_model").change(function(ev) {
        //     if ($(this).val() == 1) {
        //         $("#dev_deschannel").hide();
        //     } else {
        //         $("#dev_deschannel").show();
        //     }
        // });

        // if (window.frameElement) {
        //     $(window.frameElement).css("height", "0px");
        //     $(window.frameElement).css("width", "0px");
        // }

        // top.dialog.repositionDialog();

        // $("#src_number").val("6000");
        // $("#des_number").val("");

        // $('#is_save_record')[0].checked = false;

        // $('#src_channels').empty();
        // $('#des_channels').empty();

        // selectChannel = getSelectedChannels();

        // var srcArr = [],
        //     desArr = [];

        // $.each(selectChannel, function(index, item) {
        //     srcArr.push($(item).val());
        // });

        // selectbox.appendOpts({
        //     el: "src_channels",
        //     opts: transSelectData(srcArr)
        // }, doc);

        // $.each($("." + ch_chkbxClass), function(index, item) {
        //     desArr.push($(item).val());
        // });

        // selectbox.appendOpts({
        //     el: "des_channels",
        //     opts: transSelectData(desArr)
        // }, doc);

        // top.Custom.init(document, $("#pstn_div")[0]);

        // type = "pstn";
    }
    _onClickPstnCancel() {
        // $("#pstn_div").hide();
        // $("#editForm").show();
        // top.dialog.dialogCommands.show();
        // type = "edit";
    }
    _handleSubmit = (e) => {
        // const { formatMessage } = this.props.intl

        // let trunkId = this.props.params.trunkId,
        //     technology = this.props.params.technology,
        //     trunkType = this.props.params.trunkType,
        //     action = {}

        // if (technology.toLowerCase() === "sip") {
        //     action["action"] = "updateSIPTrunk"
        // } else {
        //     action["action"] = "updateIAXTrunk"
        // }

        // this.props.form.validateFieldsAndScroll((err, values) => {
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
        //             } else if (typeof divKey === "undefined") {
        //                 action[key] = UCMGUI.transCheckboxVal(values[key])
        //             }
        //         }
        //     }
        //     action = me._transAction(action)
        //     let confirmStr = ""

        //     if ((action["action"].toLowerCase().indexOf('sip') > -1) && /[a-zA-Z]/g.test(action['host']) && !UCMGUI.isIPv6(action['host'])) {
        //         confirmStr = formatMessage({ id: "LANG4163" })
        //     } else if ((action["action"].toLowerCase().indexOf('iax') > -1) &&
        //         (/[a-zA-Z]/g.test(action['host']) || /:\d*$/.test(action['host'])) && !UCMGUI.isIPv6(action['host'])) {
        //         confirmStr = formatMessage({ id: "LANG4469" })
        //     }
        //     if (confirmStr) {
        //         Modal.confirm({
        //             title: 'Confirm',
        //             content: confirmStr,
        //             okText: formatMessage({id: "LANG727"}),
        //             cancelText: formatMessage({id: "LANG726"}),
        //             onOk: this._doUpdateTrunksInfo.bind(this, action)
        //         })
        //     } else {
        //         this._doUpdateTrunksInfo(action)
        //     }
        //     this._doUpdateTrunksInfo(action)
        // })
    }
    _handleCancel = (e) => {
        browserHistory.push('/extension-trunk/analogTrunk')
    }
    _showModal = () => {
        this.setState({
            visible: true
        })
    }
    _handleOk = () => {
        this.setState({
            visible: false
        })
    }
    // _handleCancel = () => {
    //     this.setState({
    //         visible: false
    //     })
    // }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        let state = this.state,
            mode = this.props.route.path,
            headerTitle = formatMessage({id: "LANG762"})
        
        if (mode.indexOf('edit') === 0) {
            headerTitle = formatMessage({id: "LANG642"}, {0: formatMessage({id: "LANG105"}), 1: "trunkName"})
        }
        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ headerTitle }
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel }  
                    isDisplay='display-block' 
                />
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={formatMessage({id: "LANG1329"})}>
                                { getFieldDecorator('new_ATRNK_cls_container', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                className="hidden"
                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1343" />}>
                                        <span>{formatMessage({id: "LANG1342"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('trunkgroup', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Select></Select>
                                )}
                            </FormItem>                            
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1350" />}>
                                        {formatMessage({id: "LANG1351"})}
                                    </Tooltip>
                                }>
                                { getFieldDecorator('trunk_name', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3219" />}>
                                        {formatMessage({id: "LANG3218"})}
                                    </Tooltip>
                                }>
                                { getFieldDecorator('trunkmode', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: ""
                                })(
                                    <Checkbox onChange={ this._onChangeTrunkmode } disabled={ state.polarityswitchVal ? true : false }/>
                                )}
                            </FormItem>                        
                        </Col>
                    </Row>
                    <div ref="div_slaOptions" className={ state.div_slaOptions_style === false ? "hidden" : "display-block" }>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3221" />}>
                                            {formatMessage({id: "LANG3220"})}
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('bargeallowed', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: ""
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3223" />}>
                                            {formatMessage({id: "LANG3222"})}
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('holdaccess', {
                                        rules: [],
                                        initialValue: "open"
                                    })(
                                        <Select style={{ width: 200 }}>
                                            <Option value="open">Open</Option>
                                            <Option value="private">Private</Option>
                                        </Select>
                                    )}
                                </FormItem>                        
                            </Col>
                        </Row>  
                    </div>
                    <div className="section-title">
                        <span>{ formatMessage({id: "LANG229"}) }</span>
                    </div>
                    <div className="section-body">
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1341" />}>
                                            {formatMessage({id: "LANG1340"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('polarityswitch', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox onChange={ this._onChangePolarityswitch } />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    ref="div_polarityonanswerdelay"
                                    className={ state.div_polarityonanswerdelay_style === false ? "hidden" : "display-block" }
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1345"}) }>
                                            {formatMessage({id: "LANG1344"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('polarityonanswerdelay', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input maxLength="4" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1695" />}>
                                            {formatMessage({id: "LANG1694"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('enablecurrentdisconnectthreshold', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox onChange={ this._onChangeEnablecurrentdisconnectthreshold }/>
                                    )}
                                    <Input ref="div_currentdisconnectthreshold" className={ state.div_currentdisconnectthreshold_style === false ? "hidden" : "display-block" }/>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1347"}) }>
                                            {formatMessage({id: "LANG1346"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('ringtimeout', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1695" />}>
                                            {formatMessage({id: "LANG1397"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('rxgain', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1400"}) }>
                                            {formatMessage({id: "LANG1399"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('txgain', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1352" />}>
                                            {formatMessage({id: "LANG1353"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('usecallerid', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} ref="div_faxmode" className={ state.div_detect_style === false ? "hidden" : "display-block" }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG3555"}) }>
                                            {formatMessage({id: "LANG3871"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('faxmode', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Select>
                                            <Option value='no'>{formatMessage({id: "LANG133"})}</Option>
                                            <Option value='detect'>{formatMessage({id: "LANG1135"})}</Option>
                                            <Option value='gateway'>{formatMessage({id: "LANG3554"})}</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row id="div_detect" className={ state.div_detect_style === false ? "hidden" : "display-block" }>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1352" />}>
                                            {formatMessage({id: "LANG1353"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('fax_intelligent_route', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG4380"}) }>
                                            {formatMessage({id: "LANG4379"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('fax_intelligent_route_destination', {
                                        rules: [],
                                        initialValue: "no"
                                    })(
                                        <Select>
                                            <Option value='no'>{formatMessage({id: "LANG133"})}</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2254" />}>
                                            {formatMessage({id: "LANG2275"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('cidmode', {
                                        rules: [],
                                        initialValue: "0"
                                    })(
                                    <Select>
                                        <Option value='0'>{formatMessage({id: "LANG2268"})}</Option>
                                        <Option value='1'>{formatMessage({id: "LANG2250"})}</Option>
                                        <Option value='2'>{formatMessage({id: "LANG2267"})}</Option>
                                        <Option value='3'>{formatMessage({id: "LANG2249"})}</Option>
                                        <Option value='4'>{formatMessage({id: "LANG2266"})}</Option>
                                        <Option value='5'>{formatMessage({id: "LANG2248"})}</Option>
                                        <Option value='6'>{formatMessage({id: "LANG2265"})}</Option>
                                        <Option value='7'>{formatMessage({id: "LANG2247"})}</Option>
                                        <Option value='8'>{formatMessage({id: "LANG2262"})}</Option>
                                        <Option value='9'>{formatMessage({id: "LANG2245"})}</Option>
                                        <Option value='10'>{formatMessage({id: "LANG5268"})}</Option>
                                        <Option value='11'>{formatMessage({id: "LANG2410"})}</Option>
                                    </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG3254"}) }>
                                            {formatMessage({id: "LANG3253"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('fxooutbandcalldialdelay', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG5266" />}>
                                            {formatMessage({id: "LANG2543"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('auto_record', {
                                        rules: [],
                                        initialValue: false
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG3480"}) }>
                                            {formatMessage({id: "LANG2757"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('out_of_service', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: false
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3533" />}>
                                            {formatMessage({id: "LANG3532"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('dahdilineselectmode', {
                                        rules: [],
                                        initialValue: "ascend"
                                    })(
                                        <Select>
                                            <Option value='ascend'>{formatMessage({id: "LANG3534"})}</Option>
                                            <Option value='poll'>{formatMessage({id: "LANG3535"})}</Option>
                                            <Option value='desend'>{formatMessage({id: "LANG3536"})}</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    ref="div_out_maxchans"
                                    className={ state.div_out_maxchans_style === false ? "hidden" : "display-block" }
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG3024"}) }>
                                            {formatMessage({id: "LANG3023"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('out_maxchans', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div className="section-title">
                        <span>{ formatMessage({id: "LANG2387"}) }</span>
                    </div>
                    <div className="section-body">
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1324" />}>
                                            {formatMessage({id: "LANG1323"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('busydetect', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox onChange={ this._onChangeBusydetect } />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    ref="div_busycount"
                                    className={ state.div_busycount_style === false ? "hidden" : "display-block" }
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1322"}) }>
                                            {formatMessage({id: "LANG1321"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('busycount', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1335" />}>
                                            {formatMessage({id: "LANG1334"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('congestiondetect', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox onChange={ this._onChangeCongestiondetect }/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    id="div_congestioncount"
                                    className={ state.div_congestioncount_style === false ? "hidden" : "display-block"}
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1333"}) }>
                                            {formatMessage({id: "LANG1332"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('congestioncount', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    id="toneCountryField"
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1348" />}>
                                            {formatMessage({id: "LANG1349"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('countrytone', {
                                        rules: [],
                                        initialValue: "us"
                                    })(
                                        <Select></Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1326"}) }>
                                            {formatMessage({id: "LANG1325"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('busy', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input className="tone-setting"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    id="toneCountryField"
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1337" />}>
                                            {formatMessage({id: "LANG1336"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('congestion', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                {/* <input type="hidden" id="busypattern" name="busypattern" dfalt='500,500' />
                                <input type="hidden" id="congestionpattern" name="congestionpattern" dfalt='250,250' />
                                <input type="hidden" id="busyfrequencies" name="busyfrequencies" dfalt='480+620' />
                                <input type="hidden" id="congestionfrequencies" name="congestionfrequencies" dfalt='450+450' />
                                <input type="hidden" id="busylevels" name="busylevels" />
                                <input type="hidden" id="congestionlevels" name="congestionlevels" />
                                <input type="hidden" id="congestioncount" name="congestioncount" />
                                <input type="hidden" id="cidstart" name="cidstart" />
                                <input type="hidden" id="cidsignalling" name="cidsignalling" />
                                <input type="hidden" id="echocancel" name="echocancel" dfalt='128' value="128" /> */}
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG2348"}) }>
                                            {formatMessage({id: "LANG2347"})}
                                        </Tooltip>
                                    )}>
                                    <Button type="primary" ref="detect" size="default" onClick={ this._onClickDetect }>{formatMessage({id: "LANG2325"})}</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <Modal 
                        title={formatMessage({id: "LANG2347"})}
                        visible={this.state.visible}
                        onOk={this._handleOk} 
                        onCancel={this._handleCancel}
                        okText={formatMessage({id: "LANG2325"})}
                        cancelText={formatMessage({id: "LANG726"})}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2409"}) }>
                                        {formatMessage({id: "LANG2408"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('detect_model', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Select>
                                        <Option value='0'>{formatMessage({id: "LANG2410"})}</Option>
                                        <Option value='1'>{formatMessage({id: "LANG2411"})}</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2327"}) }>
                                        {formatMessage({id: "LANG2326"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('src_channels', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Select></Select>
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                className="hidden"
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2331"}) }>
                                        {formatMessage({id: "LANG2330"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('src_number', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2329"}) }>
                                        {formatMessage({id: "LANG2328"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('des_channels', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Select></Select>
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2333"}) }>
                                        {formatMessage({id: "LANG2332"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('des_number', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG5139"}) }>
                                        {formatMessage({id: "LANG5139"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('is_save_record', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                )}
                            </FormItem>
                            <span>{formatMessage({id: "LANG2414"})}</span>
                    </Modal>
                </Form>
            </div>
        )
    }
}

AnalogTrunkItem.defaultProps = {
    cidmodeObj: {
        0: {
            cidstart: "ring",
            cidsignalling: "bell"
        },
        1: {
            cidstart: "ring",
            cidsignalling: "bell"
        },
        2: {
            cidstart: "ring",
            cidsignalling: "bell"
        },
        3: {
            cidstart: "ring",
            cidsignalling: "bell"
        },
        4: {
            cidstart: "ring",
            cidsignalling: "bell"
        },
        5: {
            cidstart: "polarity",
            cidsignalling: "dtmf"
        },
        6: {
            cidstart: "dtmf",
            cidsignalling: "dtmf"
        },
        7: {
            cidstart: "polarity",
            cidsignalling: "dtmf"
        },
        8: {
            cidstart: "polarity_in",
            cidsignalling: "dtmf"
        },
        9: {
            cidstart: "polarity",
            cidsignalling: "v23"
        },
        10: {
            cidstart: "polarity",
            cidsignalling: "v23_jp"
        },
        11: {
            cidstart: "autodetect",
            cidsignalling: ""
        }
    },
    mappingErrCode: {
        "-1": "LANG2931", // "time out"
        0: "", // "no error return"
        1: "LANG2934", // "ACIM detect is running"
        2: "LANG2933", // "CPT detect is running"
        3: "LANG2936", // "unload dahdi module failed"
        4: "LANG2948", // "invaid extension number"
        5: "LANG2949", // "invaid fxo channel number"
        6: "LANG2937", // "fxo absent/busy"
        7: "LANG2950", // "fxo disconnect"
        8: "LANG2951", // "monitor task init failed"
        9: "LANG2952", // "fxo configure failed"
        10: "LANG2953", // "fxo offhook failed"
        11: "LANG2954", // "fxo dial failed"
        12: "LANG2955", // "no dial tone detected"
        13: "LANG2956", // "pickup the call failed"
        14: "LANG2957", // "user pickup the call timeout"
        15: "LANG2958", // "no ringback tone detected"
        16: "LANG2959", // "fxo dtmf send failed"
        17: "LANG2960", // "fxo no ringing, call setup failed"
        18: "LANG2961", // "hang up the call failed"
        19: "LANG2962", // "user hangup the call timeout"
        20: "LANG2963", // "no busy tone detected"
        21: "LANG2964" // "thread creat failed"
    },
    nation2langObj: {
        "ad": 'LANG275',
        "ae": 'LANG276',
        "af": 'LANG277',
        "ag": 'LANG278',
        "ai": 'LANG279',
        "al": 'LANG280',
        "am": 'LANG281',
        "ao": 'LANG282',
        "aq": 'LANG283',
        "ar": 'LANG284',
        "as": 'LANG285',
        "at": 'LANG286',
        "au": 'LANG287',
        "aw": 'LANG288',
        "ax": 'LANG289',
        "az": 'LANG290',
        "ba": 'LANG291',
        "bb": 'LANG292',
        "bd": 'LANG293',
        "be": 'LANG294',
        "bf": 'LANG295',
        "bg": 'LANG296',
        "bg2": 'LANG297',
        "bg3": 'LANG298',
        "bh": 'LANG299',
        "bi": 'LANG300',
        "bj": 'LANG301',
        "bl": 'LANG302',
        "bm": 'LANG303',
        "bn": 'LANG304',
        "bo": 'LANG305',
        "bq": 'LANG306',
        "br": 'LANG307',
        "bs": 'LANG308',
        "bt": 'LANG309',
        "bv": 'LANG310',
        "bw": 'LANG311',
        "by": 'LANG312',
        "bz": 'LANG313',
        "ca": 'LANG314',
        "cc": 'LANG315',
        "cd": 'LANG316',
        "cf": 'LANG317',
        "cg": 'LANG318',
        "ch": 'LANG319',
        "ci": 'LANG320',
        "ck": 'LANG321',
        "cl": 'LANG322',
        "cm": 'LANG323',
        "cn": 'LANG324',
        "co": 'LANG325',
        "cr": 'LANG326',
        "cu": 'LANG327',
        "cv": 'LANG328',
        "cw": 'LANG329',
        "cx": 'LANG330',
        "cy": 'LANG331',
        "cz": 'LANG332',
        "de": 'LANG333',
        "dj": 'LANG334',
        "dk": 'LANG335',
        "dk1": 'LANG336',
        "dm": 'LANG337',
        "do": 'LANG338',
        "do2": 'LANG339',
        "dz": 'LANG340',
        "ec": 'LANG341',
        "ee": 'LANG342',
        "eg": 'LANG343',
        "eh": 'LANG344',
        "er": 'LANG345',
        "es": 'LANG346',
        "et": 'LANG347',
        "fi": 'LANG348',
        "fj": 'LANG349',
        "fk": 'LANG350',
        "fm": 'LANG351',
        "fo": 'LANG352',
        "fr": 'LANG353',
        "ga": 'LANG354',
        "gb": 'LANG355',
        "gd": 'LANG356',
        "ge": 'LANG357',
        "gf": 'LANG358',
        "gg": 'LANG359',
        "gh": 'LANG360',
        "gi": 'LANG361',
        "gl": 'LANG362',
        "gm": 'LANG363',
        "gn": 'LANG364',
        "gp": 'LANG365',
        "gq": 'LANG366',
        "gr": 'LANG367',
        "gs": 'LANG368',
        "gt": 'LANG369',
        "gu": 'LANG370',
        "gw": 'LANG371',
        "gy": 'LANG372',
        "hk": 'LANG373',
        "hm": 'LANG374',
        "hn": 'LANG375',
        "hr": 'LANG376',
        "ht": 'LANG377',
        "hu": 'LANG378',
        "id": 'LANG379',
        "ie": 'LANG380',
        "il": 'LANG381',
        "im": 'LANG382',
        "in": 'LANG383',
        "io": 'LANG384',
        "iq": 'LANG385',
        "ir": 'LANG386',
        "is": 'LANG387',
        "it": 'LANG388',
        "je": 'LANG389',
        "jm": 'LANG390',
        "jo": 'LANG391',
        "jp": 'LANG392',
        "ke": 'LANG393',
        "kg": 'LANG394',
        "kh": 'LANG395',
        "ki": 'LANG396',
        "km": 'LANG397',
        "kn": 'LANG398',
        "kp": 'LANG399',
        "kr": 'LANG400',
        "kw": 'LANG401',
        "ky": 'LANG402',
        "kz": 'LANG403',
        "la": 'LANG404',
        "lb": 'LANG405',
        "lc": 'LANG406',
        "li": 'LANG407',
        "lk": 'LANG408',
        "lr": 'LANG409',
        "ls": 'LANG410',
        "ls2": 'LANG411',
        "lt": 'LANG412',
        "lu": 'LANG413',
        "lv": 'LANG414',
        "ly": 'LANG415',
        "ma": 'LANG416',
        "ma2": 'LANG417',
        "mc": 'LANG418',
        "md": 'LANG419',
        "me": 'LANG420',
        "mf": 'LANG421',
        "mg": 'LANG422',
        "mh": 'LANG423',
        "mk": 'LANG424',
        "ml": 'LANG425',
        "mm": 'LANG426',
        "mn": 'LANG427',
        "mo": 'LANG428',
        "mp": 'LANG429',
        "mq": 'LANG430',
        "mr": 'LANG431',
        "ms": 'LANG432',
        "mt": 'LANG433',
        "mu": 'LANG434',
        "mv": 'LANG435',
        "mw": 'LANG436',
        "mx": 'LANG437',
        "my": 'LANG438',
        "mz": 'LANG439',
        "na": 'LANG440',
        "nc": 'LANG441',
        "ne": 'LANG442',
        "nf": 'LANG443',
        "ng": 'LANG444',
        "ni": 'LANG445',
        "nl": 'LANG446',
        "no": 'LANG447',
        "np": 'LANG448',
        "nr": 'LANG449',
        "nauru": 'LANG450',
        "nu": 'LANG451',
        "nz": 'LANG452',
        "om": 'LANG453',
        "pa": 'LANG454',
        "pe": 'LANG455',
        "pf": 'LANG456',
        "pg": 'LANG457',
        "ph": 'LANG458',
        "pk": 'LANG459',
        "pl": 'LANG460',
        "pm": 'LANG461',
        "pn": 'LANG462',
        "pr": 'LANG463',
        "ps": 'LANG464',
        "pt": 'LANG465',
        "pt2": 'LANG466',
        "pw": 'LANG467',
        "py": 'LANG468',
        "qa": 'LANG469',
        "qa1": 'LANG470',
        "qa2": 'LANG471',
        "qa3": 'LANG472',
        "re": 'LANG473',
        "ro": 'LANG474',
        "rs": 'LANG475',
        "ru": 'LANG476',
        "rw": 'LANG477',
        "sa": 'LANG478',
        "sb": 'LANG479',
        "sc": 'LANG480',
        "sd": 'LANG481',
        "se": 'LANG482',
        "sg": 'LANG483',
        "sh": 'LANG484',
        "si": 'LANG485',
        "sj": 'LANG486',
        "sk": 'LANG487',
        "sl": 'LANG488',
        "sm": 'LANG489',
        "sn": 'LANG490',
        "so": 'LANG491',
        "sr": 'LANG492',
        "ss": 'LANG493',
        "st": 'LANG494',
        "sv": 'LANG495',
        "sx": 'LANG496',
        "sy": 'LANG497',
        "sz": 'LANG498',
        "tc": 'LANG499',
        "td": 'LANG500',
        "tf": 'LANG501',
        "tg": 'LANG502',
        "th": 'LANG503',
        "tj": 'LANG504',
        "tk": 'LANG505',
        "tl": 'LANG506',
        "tm": 'LANG507',
        "tn": 'LANG508',
        "to": 'LANG509',
        "tr": 'LANG510',
        "tt": 'LANG511',
        "tv": 'LANG512',
        "tw": 'LANG513',
        "tz": 'LANG514',
        "tz2": 'LANG515',
        "ua": 'LANG516',
        "ug": 'LANG517',
        "ug2": 'LANG518',
        "uk": 'LANG519',
        "um": 'LANG520',
        "us": 'LANG521',
        "us_old": 'LANG522',
        "us-old": 'LANG523',
        "uy": 'LANG524',
        "uz": 'LANG525',
        "va": 'LANG526',
        "vc": 'LANG527',
        "ve": 'LANG528',
        "vg": 'LANG529',
        "vi": 'LANG530',
        "vn": 'LANG531',
        "vu": 'LANG532',
        "wf": 'LANG533',
        "ws": 'LANG534',
        "ye": 'LANG535',
        "yt": 'LANG536',
        "za": 'LANG537',
        "zm": 'LANG538',
        "zw": 'LANG539'
    }
}

AnalogTrunkItem.propTypes = {
}

export default Form.create()(injectIntl(AnalogTrunkItem))