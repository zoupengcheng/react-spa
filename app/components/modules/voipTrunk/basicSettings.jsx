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
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getNameList()
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
        let _this = this

        if (_.find(this.state.trunkNameList, function (num) { 
            return (num === value && _this.props.trunk.trunk_name !== value)
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
            inputIp = value.split(':')[0]
        
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
                <FormItem
                    ref="div_trunk_name"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1383" />}>
                            <span>{formatMessage({id: "LANG1382"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('trunk_name', {
                        rules: [{ 
                            required: true, 
                            message: formatMessage({id: "LANG2150"})
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.minlength(data, value, callback, formatMessage, 2)
                            }
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.alphanumeric(data, value, callback, formatMessage)
                            }
                        }, { 
                            validator: (data, value, callback) => {
                                let errMsg = formatMessage({id: "LANG2137"})
                                this._trunkNameIsExist(data, value, callback, errMsg)
                            }
                        }],
                        initialValue: trunk.trunk_name
                    })(
                        <Input maxLength="16" />
                    ) }
                </FormItem>
                <FormItem
                    id="div_hostname"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1374" />}>
                            <span>{formatMessage({id: "LANG1373"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('host', {
                        rules: [{ 
                            required: true, 
                            message: formatMessage({id: "LANG2150"})
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.alphanumeric(data, value, callback, formatMessage)
                            }
                        }, { 
                            validator: (data, value, callback) => {
                                let msg = formatMessage({id: "LANG2542"}, {0: formatMessage({id: "LANG1373"})})
                                this._isSelfIP(data, value, callback, msg)
                            }
                        }, { 
                            validator: (data, value, callback) => {
                                let msg = formatMessage({id: "LANG2167"}, {0: formatMessage({id: "LANG1373"}).toLowerCase()})
                                this._isRightIP(data, value, callback, msg)
                            }
                        }],
                        initialValue: trunk.host
                    })(
                        <Input maxLength="60" />
                    ) }
                </FormItem>
                <FormItem
                    id="div_transport"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1391" />}>
                            <span>{formatMessage({id: "LANG1392"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('transport', {
                        rules: [],
                        initialValue: trunk.transport
                    })(
                        <Select id="transport" name="transport" dfalt="udp,tcp,tls" mSelect="true">
                             <Option value="udp">{formatMessage({id: "LANG1401"})}</Option>
                             <Option value="tcp">{formatMessage({id: "LANG1402"})}</Option>
                             <Option value="tls">{formatMessage({id: "LANG1403"})}</Option>
                             {/* <Option value="udp,tcp,tls" locale="LANG1404">All - UDP Primary</Option>
                             <Option value="tcp,udp,tls" locale="LANG1405">All - TCP Primary</Option>
                             <Option value="tls,udp,tcp" locale="LANG1406">All - TLS Primary</Option> */}
                         </Select>
                    ) }
                </FormItem>
                <FormItem
                    id="div_keep_org_cid"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG4109" />}>
                            <span>{formatMessage({id: "LANG4108"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('keeporgcid', {
                        rules: [],
                        initialValue: trunk.keeporgcid
                    })(
                        <Input maxLength="60" />
                    ) }
                </FormItem>
                <FormItem
                    id="div_keep_cid"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG2319" />}>
                            <span>{formatMessage({id: "LANG2318"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('keepcid', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.keepcid === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="div_nat"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1093" /> }>
                            <span>{ formatMessage({id: "LANG5036"}) }</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('nat', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.nat === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="div_out_of_service"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG3480" />}>
                            <span>{formatMessage({id: "LANG2757"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('out_of_service', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.out_of_service === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="div_tel_uri"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG2769" />}>
                            <span>{formatMessage({id: "LANG2768"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('tel_uri', {
                        rules: [],
                        initialValue: trunk.tel_uri
                    })(
                        <Select>
                            <Option value='disabled'>{formatMessage({id: "LANG2770"})}</Option>
                            <Option value='user_phone'>{formatMessage({id: "LANG2771"})}</Option>
                            <Option value='enabled'>{formatMessage({id: "LANG2772"})}</Option>
                        </Select>
                    ) }
                </FormItem>
                <FormItem
                    id="need_register_div"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG3016" />}>
                            <span>{formatMessage({id: "LANG3015"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('need_register', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.need_register === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="allow_outgoing_calls_if_reg_failed_div"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG5070" />}>
                            <span>{formatMessage({id: "LANG5069"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('allow_outgoing_calls_if_reg_failed', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.allow_outgoing_calls_if_reg_failed === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="div_callerid"
                    className={trunk.trunk_type === "peer" ? "display-block" : "hidden"}
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1360" />}>
                            <span>{formatMessage({id: "LANG1359"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('cidnumber', {
                        rules: [{ 
                            validator: (data, value, callback) => {
                                Validator.calleridSip(data, value, callback, formatMessage)
                            }
                        }, { 
                            validator: (data, value, callback) => {
                                // LANG5066
                                // var isChecked = $('#keepcid')[0].checked;
                                // if ((isChecked && $("#cidnumber").val() != "") || !isChecked) {
                                //     return true;
                                // }
                                // return false;
                            }
                        }],
                        initialValue: trunk.cidnumber
                    })(
                        <Input maxLength="64" />
                    ) }
                </FormItem>
                <FormItem
                    id="div_callername"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1362" />}>
                            <span>{formatMessage({id: "LANG1361"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('cidname', {
                        rules: [{ 
                            validator: (data, value, callback) => {
                                Validator.minlength(data, value, callback, formatMessage, 2)
                            }
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.cidName(data, value, callback, formatMessage)
                            }
                        }],
                        initialValue: trunk.cidname
                    })(
                        <Input maxLength="64" />
                    ) }
                </FormItem>
                <FormItem
                    id="div_fromdomain"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1370" />}>
                            <span>{formatMessage({id: "LANG1369"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('fromdomain', {
                        rules: [{ 
                            validator: (data, value, callback) => {
                                Validator.specialhost(data, value, callback, formatMessage)
                            }
                        }],
                        initialValue: trunk.fromdomain
                    })(
                        <Input maxLength="60" />
                    ) }
                </FormItem>
                <FormItem
                    id="div_fromuser"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1372" />}>
                            <span>{formatMessage({id: "LANG1371"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('fromuser', {
                        rules: [{ 
                            validator: (data, value, callback) => {
                                Validator.calleridSip(data, value, callback, formatMessage)
                            }
                        }],
                        initialValue: trunk.fromuser
                    })(
                        <Input maxLength="64" />
                    ) }
                </FormItem>
                <FormItem
                    id="div_username"
                    className={ trunk.trunk_type === "register" ? "display-block" : "hidden"}
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG1393" />}>
                            <span>{formatMessage({id: "LANG72"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('user_name', {
                        rules: [{ 
                            required: true, 
                            message: formatMessage({id: "LANG2150"})
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.calleridSip(data, value, callback, formatMessage)
                            }
                        }],
                        initialValue: trunk.user_name
                    })(
                        <Input maxLength="64" />
                    ) }
                </FormItem>
                <FormItem
                    id="div_secret"
                    className={ trunk.trunk_type === "register" ? "display-block" : "hidden"}
                    { ...formItemLayout }
                    label={formatMessage({id: "LANG73"})}>
                    { getFieldDecorator('secret', {
                        rules: [{ 
                            required: true, 
                            message: formatMessage({id: "LANG2150"})
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.keyboradNoSpace(data, value, callback, formatMessage)
                            }
                        }],
                        initialValue: trunk.secret
                    })(
                        <Input type="secret" maxLength="64" autoComplete="off" />
                    ) }
                </FormItem>
                <FormItem
                    id="authid_field"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG2488" />}>
                            <span>{formatMessage({id: "LANG2487"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('authid', {
                        rules: [{ 
                            validator: (data, value, callback) => {
                                Validator.specialauthid1(data, value, callback, formatMessage)
                            }
                        }],
                        initialValue: trunk.authid
                    })(
                        <Input maxLength="64" />
                    ) }
                </FormItem>
                <FormItem
                    id="auth_trunk_field"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG4262" />}>
                            <span>{formatMessage({id: "LANG4261"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('auth_trunk', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.auth_trunk === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
                <FormItem
                    id="auto_record_field"
                    { ...formItemLayout }
                    label={                            
                        <Tooltip title={<FormattedHTMLMessage id="LANG5266" />}>
                            <span>{formatMessage({id: "LANG2543"})}</span>
                        </Tooltip>
                    }>
                    { getFieldDecorator('auto_recording', {
                        rules: [],
                        valuePropName: "checked",
                        initialValue: trunk.auto_recording === "yes" ? true : false
                    })(
                        <Checkbox />
                    ) }
                </FormItem>
            </div>
        )
    }
}

export default injectIntl(BasicSettings)