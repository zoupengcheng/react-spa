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

class AdvanceSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    _onChangeTelUri = (val) => {
        this.setState({
            telUri: val
        })  
    }
    _onChangeEnableCc = (val) => {
        this.setState({
            enableCc: val
        })  
    }
    _checkLdapPrefix = (rule, value, callback) => {
        // var default_ob = $('#ldap_outrt_prefix').val();

        // if (default_ob && default_ob == 'custom' && value == "") {
        //     return "prefix is required.";
        // }

        // return true;
    }
    _checkOpenPort(rule, value, callback) {
        // var ele;

        // if (val === loadValue) {
        //     return true;
        // }

        // for (var i = 0; i < openPort.length; i++) {
        //     ele = openPort[i];

        //     if (val == ele) {
        //         return "LANG3869";
        //     }
        // }

        // return true;
    }
    _transData = (res, cb) => {
        let arr = []

        for (var i = 0; i < res.length; i++) {
            arr.push(res[i]["trunk_name"])
        }

        if (cb && typeof cb === "function") {
            cb(arr)
        }

        return arr
    }
    _getNameList = () => {
        const { formatMessage } = this.props.intl
        let trunkList = UCMGUI.isExist.getList("getTrunkList", formatMessage)
        this.setState({
            trunkNameList: this._transData(trunkList)
        })
    }
    _trunkNameIsExist = (rule, value, callback, errMsg) => {
        if (_.find(this.state.trunkNameList, function (num) { 
            return num === value
        })) {
            callback(errMsg)
        }
        callback()
    }
    _isRightIP = (rule, value, callback, errMsg) => {
        let ipArr = value.split("."),
            ipDNSReg = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/
        
        if (ipDNSReg.test(value) && (ipArr[0] === "127" || ipArr[0] >= 224 || ipArr[3] === 0)) {
            callback(errMsg)
        } else {
            callback()
        }
    }
    _isSelfIP = (rule, value, callback, errMsg) => {
        let selfIp = window.location.hostname,
            inputIp = value ? value.split(':')[0] : ""
        
        if (inputIp === selfIp) {
            callback(errMsg)
        } else {
            callback()
        }
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const trunk = this.props.trunk || {}

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="content">
                {/* <Transfer
                    id="div_codecs"
                    dataSource={mockData}
                    titles={['Source', 'Target']}
                    targetKeys={state.targetKeys}
                    selectedKeys={state.selectedKeys}
                    onChange={this.handleChange}
                    onSelectChange={this.handleSelectChange}
                    render={item => item.title}
                  /> */}
                <FormItem
                    id="div_send_ppi"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG3901" />}>
                            <span>{formatMessage({id: "LANG3900"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('send_ppi', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.send_ppi === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="div_use_dod_in_ppi"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG5322" />}>
                            <span>{formatMessage({id: "LANG5321"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('use_dod_in_ppi', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.use_dod_in_ppi === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="div_send_pai"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG3989" />}>
                            <span>{formatMessage({id: "LANG3988"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('send_pai', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.send_pai === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="div_send_pai"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG5320" />}>
                            <span>{formatMessage({id: "LANG5319"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('pai_number', {
                        rules: [{ 
                            validator: (data, value, callback) => {
                                Validator.specailCalleridSip(data, value, callback, formatMessage)
                            }
                        }],
                        initialValue: trunk.pai_number
                    })(
                        <InputNumber />
                    ) }
                </FormItem>
                <FormItem
                    id="is_outboundproxy_field"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1381" />}>
                            <span>{formatMessage({id: "LANG1380"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('chkOutboundproxy', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.chkOutboundproxy === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="outboundproxy_field"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1379" />}>
                            <span>{formatMessage({id: "LANG1378"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('outboundproxy', {
                        rules: [{ 
                            validator: (data, value, callback) => {
                                Validator.specialhost(data, value, callback, formatMessage)
                            }
                        }, { 
                            validator: (data, value, callback) => {
                                let msg = formatMessage({id: "LANG2542"}, {0: formatMessage({id: "LANG1378"})})
                                this._isSelfIP(data, value, callback, msg)
                            }
                        }],
                        initialValue: trunk.outboundproxy
                    })(
                        <Input />
                    ) }
                </FormItem>
                <FormItem
                    id="rmvObpFromRoute_field"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG5030" />}>
                            <span>{formatMessage({id: "LANG5029"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('rmv_obp_from_route', {
                        rules: [],
                        initialValue: trunk.keepcid
                    })(
                        <Input disabled={ this.state.telUri !== "disabled" ? true : false } />
                    ) }
                </FormItem>
                <FormItem
                    id="didmode_field"
                    className="hidden"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG2649" />}>
                            <span>{formatMessage({id: "LANG2648"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('did_mode', {
                        rules: [],
                        initialValue: trunk.did_mode
                    })(
                        <Select>
                            <Option value='request-line'>{formatMessage({id: "LANG2650"})}</Option>
                            <Option value='to-header'>{formatMessage({id: "LANG2651"})}</Option>
                        </Select>
                    ) }
                </FormItem>
                <FormItem
                    id="div_dtmfmode"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1786" />}>
                            <span>{formatMessage({id: "LANG1097"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('dtmfmode', {
                        rules: [],
                        initialValue: trunk.dtmfmode
                    })(
                        <Select>
                            <Option value=''>{formatMessage({id: "LANG257"})}</Option>
                            <Option value='rfc2833'>RFC2833</Option>
                            <Option value='info'>{formatMessage({id: "LANG1099"})}</Option>
                            <Option value='inband'>{formatMessage({id: "LANG1100"})}</Option>
                            <Option value='auto'>{formatMessage({id: "LANG138"})}</Option>
                        </Select>
                    ) }
                </FormItem>
                <FormItem
                    id="editTrunk_Field_qualify"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1367" />}>
                            <span>{formatMessage({id: "LANG1366"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('enable_qualify', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.enable_qualify === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="div_qualifyfreq"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1385" />}>
                            <span>{formatMessage({id: "LANG1384"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('qualifyfreq', {
                        rules: [{ 
                            type: "integer", 
                            required: true, 
                            message: formatMessage({id: "LANG2150"}) 
                        }],
                        initialValue: trunk.qualifyfreq
                    })(
                        <InputNumber min={1} max={3600} maxLength="4" />
                    ) }
                </FormItem>
                <FormItem
                    id="div_out_maxchans"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG3024" />}>
                            <span>{formatMessage({id: "LANG3023"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('out_maxchans', {
                        rules: [{ 
                            type: "integer", 
                            required: true, 
                            message: formatMessage({id: "LANG2150"}) 
                        }],
                        initialValue: trunk.out_maxchans
                    })(
                        <InputNumber max={999} />
                    ) }
                </FormItem>
                <FormItem
                    id="editTrunk_Field_faxmode"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG4199" />}>
                            <span>{formatMessage({id: "LANG3871"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('faxmode', {
                        rules: [],
                        initialValue: trunk.faxmode
                    })(
                        <Select>
                            <Option value='no'>{formatMessage({id: "LANG133"})}</Option>
                            <Option value='detect'>{formatMessage({id: "LANG1135"})}</Option>
                            {/* <option value='gateway' locale="LANG3554"></option> */}
                        </Select>
                    ) }
                </FormItem>
                <div id="detect_div">
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4380" />}>
                                <span>{formatMessage({id: "LANG4379"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('fax_intelligent_route', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: trunk.fax_intelligent_route === "yes" ? true : false
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4382" />}>
                                <span>{formatMessage({id: "LANG4381"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('fax_intelligent_route_destination', {
                            rules: [],
                            initialValue: trunk.fax_intelligent_route_destination
                        })(
                            <Select>
                                <Option value=''>{formatMessage({id: "LANG133"})}</Option>
                            </Select>
                        ) }
                    </FormItem>
                </div>
                <FormItem
                    id="div_srtp"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1390" />}>
                            <span>{formatMessage({id: "LANG1389"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('encryption', {
                        rules: [],
                        initialValue: trunk.encryption
                    })(
                        <Select>
                            <Option value="no">{formatMessage({id: "LANG4377"})}</Option>
                            <Option value="support">{formatMessage({id: "LANG4376"})}</Option>
                            <Option value="yes">{formatMessage({id: "LANG4375"})}</Option>
                        </Select>
                    ) }
                </FormItem>
                {/* ldap for trunk */}
                <div id="ldapDiv">
                    <FormItem
                        id="div_ldap_sync_enable"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2497" />}>
                                <span>{formatMessage({id: "LANG2493"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('ldap_sync_enable', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: trunk.ldap_sync_enable === "yes" ? true : false
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        id="div_ldap_sync_passwd"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2498" />}>
                                <span>{formatMessage({id: "LANG2494"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('ldap_sync_passwd', {
                            rules: [{ 
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }, { 
                                validator: (data, value, callback) => {
                                    Validator.alphanumeric(data, value, callback, formatMessage)
                                }
                            }, { 
                                validator: (data, value, callback) => {
                                    Validator.minlength(data, value, callback, formatMessage)
                                }
                            }],
                            initialValue: trunk.ldap_sync_passwd
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                    <FormItem
                        id="div_ldap_sync_port"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2499" />}>
                                <span>{formatMessage({id: "LANG2495"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('ldap_sync_port', {
                            rules: [{ 
                                type: "integer", 
                                required: true, 
                                message: formatMessage({id: "LANG2150"}) 
                            }, { 
                                validator: this._checkLdapPrefix
                            }, { 
                                validator: this._checkOpenPort
                            }],
                            initialValue: trunk.ldap_sync_port
                        })(
                            <InputNumber min={1} max={65534} />
                        ) }
                    </FormItem>
                    <FormItem
                        id="div_ldap_default_outrt"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2500" />}>
                                <span>{formatMessage({id: "LANG2496"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('ldap_default_outrt', {
                            rules: [],
                            initialValue: trunk.ldap_default_outrt
                        })(
                            <Select></Select>
                        ) }
                    </FormItem>
                    <FormItem
                        id="div_ldap_default_outrt_prefix"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2499" />}>
                                <span>{formatMessage({id: "LANG2518"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('ldap_outrt_prefix', {
                            rules: [{ 
                                type: "integer", 
                                required: true, 
                                message: formatMessage({id: "LANG2150"}) 
                            }, { 
                                validator: this._checkLdapPrefix
                            }],
                            initialValue: trunk.ldap_outrt_prefix
                        })(
                            <InputNumber maxLength="14" />
                        ) }
                    </FormItem>
                    <FormItem
                        id="div_ldap_last_sync_date"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={ <FormattedHTMLMessage id="LANG2653" /> }>
                                <span>{ formatMessage({id: "LANG2652"}) }</span>
                            </Tooltip>
                        }>
                        { <div id="label_ldap_last_sync_date"></div> }
                    </FormItem>
                </div>
                {/*  ended of  ldap for trunk  */}
                {/*  ccss for trunk  */}
                <div id="ccss">
                    <div className='section-title'>{ formatMessage({id: "LANG3725"}) }</div>
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={ <FormattedHTMLMessage id="LANG3727" /> }>
                                <span>{ formatMessage({id: "LANG3726"}) }</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('enable_cc', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: trunk.enable_cc === "yes" ? true : false
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        id="cc-max-agents"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={ <FormattedHTMLMessage id="LANG3734" /> }>
                                <span>{ formatMessage({id: "LANG3733"}) }</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('cc_max_agents', {
                            rules: [{ 
                                type: "integer", 
                                required: true, 
                                message: formatMessage({id: "LANG2150"}) 
                            }],
                            initialValue: trunk.cc_max_agents
                        })(
                            <InputNumber min={1} max={999} maxLength="10" />
                        ) }
                    </FormItem>
                    <FormItem
                        id="cc-max-monitors"
                        { ...formItemLayout }
                        className={ this.state.enableCc === true ? "display-block" : "hidden" }
                        label={                            
                            <Tooltip title={ <FormattedHTMLMessage id="LANG3740" /> }>
                                <span>{ formatMessage({id: "LANG3739"}) }</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('cc_max_monitors', {
                            rules: [{ 
                                type: "integer", 
                                required: true, 
                                message: formatMessage({id: "LANG2150"}) 
                            }],
                            initialValue: trunk.cc_max_monitors
                        })(
                            <InputNumber min={1} max={999} maxLength="10" />
                        ) }
                    </FormItem>
                </div>      
                {/* ended of  ccss for trunk */} 
            </div>
        )
    }
}

export default injectIntl(AdvanceSettings)