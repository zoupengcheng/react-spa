'use strict'

import $ from 'jquery'
import _ from 'underscore'
import cookie from 'react-cookie'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage, formatMessage } from 'react-intl'
import { Form, Input, Button, Row, Col, Checkbox, message, Popover, Select, Tabs, Modal, Tooltip } from 'antd'
import api from "../../api/api"
import Validator from "../../api/validator"
import UCMGUI from "../../api/ucmgui"
import DevicesList from "./devicesList"

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm

class Devices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            zeroConfigSettings: UCMGUI.isExist.getList("getZeroConfigSettings"),
            filter: "all",
            audoDiscoverVisible: false,
            modalType: null,
            networkInfo: {
                LANAddr: null,
                netSegFromAddr: null,
                netSegToAddr: null
            }            
        }
    }
    componentDidMount() {
        this._getAllDeviceExtensions()
    }
    componentWillUnmount() {

    }
    _getAllDeviceExtensions = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { 
                action: 'getAllDeviceExtensions' 
            },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        getAllDeviceExtensions = res.getAllDeviceExtensions
                    // this.setState({
                    //     getAllDeviceExtensions: getAllDeviceExtensions
                    // })
                }
            }.bind(this)
        })  
    }
    _checkZeroConfigInvalidModels = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { 
                action: 'checkZeroConfigInvalidModels' 
            },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        models = res.models
                    // this.setState({
                    //     models: models
                    // })
                }
            }.bind(this)
        })          
    }
    _handleFilterChange = (e) => {
        this.setState({
            filter: e
        })
    }
    /**                          
    *   Handle Auto Discover Modal    
    */    
    _showAutoDiscoverModal = () => {      
        $.ajax({
            url: api.apiHost + 'action=getNetworkInformation',
            method: 'GET',
            type: 'json',
            async: true,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                if (data.status === 0) {
                    const LIST = ["wan", "lan", "lan1", "lan2"]
                    
                    for (let i = 3; i >= 0; i--) {
                        const mode = data.response[LIST[i]]
                        // ZeroConfig AutoDiscover only available for lan/lan1
                        if (mode && mode.ip && mode.mask && LIST[i] !== 'wan' && LIST[i] !== 'lan2') {
                            this._processNetRange(mode.ip, mode.mask)
                            break                           
                        }
                    }                    
                }
            }.bind(this)
        })      
    }
    _processNetRange = (ipStr, maskStr) => {
        const ipArray = ipStr.split(".")
        const netMaskArray = maskStr.split(".")
        let rangeFromArray = []
        let rangeToArray = []
        if (ipArray.length !== 4 || netMaskArray.length !== 4) {
            return false
        }

        for (let i = 0; i < 4; i++) {
            const ip_octet = Number(ipArray[i])
            const mask_octet = Number(netMaskArray[i])
            const re_cidr = 8 - this._calculateCIDR(mask_octet)
            rangeFromArray.push(ip_octet & mask_octet)
            rangeToArray.push((ip_octet >> re_cidr) + Math.pow(2, re_cidr) - 1)
        }

        this.setState({
            audoDiscoverVisible: true,
            modalType: "autoDiscover",
            networkInfo: {
                LANAddr: ipStr,
                netSegFromAddr: rangeFromArray.join("."),
                netSegToAddr: rangeToArray.join(".")
            }
        })
    }
    _calculateCIDR = (mask) => {
        let count = 0,
        cidr = 0

        if (mask === 0) {
            return cidr
        }
        while (!(mask & 0x1)) {
            mask = mask >> 1
            count++
        }
        if (count < 8) {
            cidr = 8 - count
        }

        return cidr
    }
    _handleAutoDiscover = () => {
        const { formatMessage } = this.props.intl
        let scan_cgi = (action) => {
            $.ajax({
                url: api.apiHost + action,
                method: 'GET',
                type: 'json',
                async: true,
                error: function(e) {
                    message.error(e.statusText)
                },
                success: function(data) {
                    console.log("weiling test scan result:", data)
                    /* if (data.status === '0') {
                        const res = data.response.scanDevices

                        if (res === "Scanning Device") {
                            if (isBroadcastIp()) {
                                top.dialog.dialogMessage({
                                    type: 'success',
                                    content: $P.lang("LANG3768")
                                });

                                UCMGUI.config.zcScanProgress = '1';
                            } else {
                                top.dialog.dialogMessage({
                                    type: 'loading',
                                    title: $P.lang("LANG3769"),
                                    content: $P.lang("LANG905")
                                });

                                // check whether single ip scanning has done per second.
                                checkInterval = setInterval(function() {
                                    IntervalForSingleIP();
                                }, 1000);
                            }
                        } else {
                            var num = res.slice("ZCERROR_".length);

                            top.dialog.dialogMessage({
                                type: 'error',
                                content: $P.lang(zeroconfigErr[num])
                            });
                        }
                    } else {
                        message.errMsg(formatMessage({id: "LANG909"}))
                    } */
                }.bind(this)
            }) 
        }

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                let username = cookie.load("username")

                let action = `action=scanDevices&username=${username}&method=${values.method}&ip=${values.targetAddr}&interface=1`
                console.log("weiling action:", action)
                if (values.targetAddr === this.state.networkInfo.netSegToAddr) {
                    let confirmContent = `<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2221" })}}></span>`
                    confirm({
                        title: '',
                        content: confirmContent,
                        onOk() {
                            console.log("weiling ok to broadcast scan ")
                            scan_cgi(action)
                        },
                        onCancel() {}
                    })
                } else {
                    scan_cgi(action)
                }                
                // message.loading(formatMessage({ id: "LANG826" }), 0)
                /* $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(formatMessage({ id: "LANG815" }))
                        }
                    }.bind(this)
                }) */
            }
        })
    }
    _handleCancel = () => {
        this.setState({
            audoDiscoverVisible: false,
            modalType: null
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        }
        const filter = this.state.filter
        const networkInfo = this.state.networkInfo
        return (
            <div className="app-content-main" id="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button type="primary" icon="" onClick={this._showAutoDiscoverModal} >
                            {formatMessage({id: "LANG757"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG754"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG755"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG3866"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG2626"})}
                        </Button>
                        <label>{formatMessage({id: "LANG1288"}) + ":"}</label>
                        <Select 
                            style={{ width: 200 }}
                            onChange={this._handleFilterChange}
                            defaultValue={filter}>
                            <Option value="all">{formatMessage({id: "LANG104"})}</Option>
                            <Option value="res">{formatMessage({id: "LANG1289"})}</Option>
                        </Select>
                    </div>
                    <DevicesList filter={filter}/>
                    <Modal 
                        title={ formatMessage({id: "LANG757"}) }
                        visible={this.state.audoDiscoverVisible}
                        onOk={this._handleAutoDiscover} 
                        onCancel={this._handleCancel}
                        okText={formatMessage({id: "LANG727"})}
                        cancelText={formatMessage({id: "LANG726"})}>
                        <Form>
                            <div className="lite-desc">
                                { formatMessage({id: "LANG1316"}) }
                            </div>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4817" /> }>
                                        <span>{formatMessage({id: "LANG4816"})}</span>
                                    </Tooltip>
                                )}>
                                <span>                            
                                    {networkInfo.LANAddr}
                                </span>
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4819" /> }>
                                        <span>{formatMessage({id: "LANG4818"})}</span>
                                    </Tooltip>
                                )}>
                                <span>                            
                                    {networkInfo.netSegFromAddr} - {networkInfo.netSegToAddr}
                                </span>
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4821" /> }>
                                        <span>{formatMessage({id: "LANG4820"})}</span>
                                    </Tooltip>
                                )}>
                                <span>                            
                                    {networkInfo.netSegToAddr}
                                </span>
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1320" /> }>
                                        <span>{formatMessage({id: "LANG1319"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('method', {
                                    initialValue: 'Ping'
                                })(
                                    <Select 
                                        style={{ width: 200 }}
                                        >
                                        <Option value="Ping">Ping</Option>
                                        <Option value="ARP">ARP</Option>
                                        <Option value="SipMsg">SIP-Message</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1318" /> }>
                                        <span>{formatMessage({id: "LANG1317"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('targetAddr', {
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }, { 
                                        validator: (data, value, callback) => {
                                            Validator.ipAddress(data, value, callback, formatMessage)
                                        }
                                    }, { 
                                        validator: (data, value, callback) => {
                                            let errMsg = formatMessage({id: "LANG2176"})

                                            if (!value) {
                                                callback()
                                            }
                                            const targetAddrArry = value.split(".")
                                            const fromAddrArry = networkInfo.netSegFromAddr.split(".")
                                            const toAddrArry = networkInfo.netSegToAddr.split(".")
                                            let ret = true
                                            if (targetAddrArry.length === 4) {
                                                for (let i = 0; i < 4; i++) {
                                                    const target = Number(targetAddrArry[i]),
                                                          min = Number(fromAddrArry[i]),
                                                          max = Number(toAddrArry[i])
                                                    if (target < min || target > max) {
                                                        ret = false
                                                        break
                                                    }
                                                }
                                            } else {
                                                ret = false
                                            }
                                            if (ret) {
                                                callback()
                                            } else {
                                                callback(errMsg)
                                            }                                            
                                        }
                                    }, { 
                                        validator: (data, value, callback) => {
                                            let errMsg = formatMessage({id: "LANG4822"})

                                            if (!value) {
                                                callback()
                                            }

                                            if (value !== networkInfo.netSegFromAddr) {
                                                callback()
                                            } else {
                                                callback(errMsg)
                                            }
                                        }
                                    }, { 
                                        validator: (data, value, callback) => {
                                            let errMsg = formatMessage({id: "LANG4823"})

                                            if (!value) {
                                                callback()
                                            }

                                            if (value !== networkInfo.LANAddr) {
                                                callback()
                                            } else {
                                                callback(errMsg)
                                            }
                                        }
                                    }]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}

Devices.propTypes = {
}

export default Form.create()(injectIntl(Devices))