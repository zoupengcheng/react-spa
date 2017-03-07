'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import BasicSettings from './basicSettings'
import DHCPClient from './dhcpclient'
import Network8021x from './8021x'
import PortForwarding from './portForwarding'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { browserHistory } from 'react-router'
import Title from '../../../views/title'
import { Form, Input, Tabs, message, Modal, BackTop } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

const baseServerURl = api.apiHost
const interfaceObj = {
    '0': 'eth1',
    '1': 'eth0',
    '2': {
        'LAN1': 'eth0',
        'LAN2': 'eth1'
    }
}

class NetWorkSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: this.props.params.id ? this.props.params.id : '1',
            isDisplay: (this.props.params.id === '2' || this.props.params.id === '4') ? "hidden" : "display-block",
            network_settings: {},
            dhcp_settings: {},
            dhcp6_settings: {},
            method_8021_calss: {
                lan1: 'hidden',
                lan2: 'display-block',
                lantitle: 'display-block',
                lan1title: 'hidden',
                lan2title: 'hidden',
                wantitle: 'hidden'
            }
        }
    }
    componentWillMount() {
        this._getInitNetwork()
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _onChange = (e) => {
        if (e === "2" || e === "4") {
            this.setState({
                activeKey: e,
                isDisplay: "hidden"
            })
        } else {
            this.setState({
                activeKey: e,
                isDisplay: "display-block"
            })
        }
    }
    _save8021x = (e) => {
         const { formatMessage } = this.props.intl
        const { form } = this.props
        const __this = this

        // if (checkIfRejectRules(method)) {
            let buf = {}
            buf["action"] = "updateNetworkproSettings"
            buf["mode"] = form.getFieldValue('mode')
            if (buf["mode"] !== undefined) {
                buf["identity"] = form.getFieldValue('identity')
                buf["md5_secret"] = form.getFieldValue('md5_secret')
                buf["lan2.802.1x.mode"] = form.getFieldValue('lan2.802.1x.mode')
                buf["lan2.802.1x.identity"] = form.getFieldValue('lan2.802.1x.identity')
                buf["lan2.802.1x.username"] = form.getFieldValue('lan2.802.1x.username')
                buf["lan2.802.1x.password"] = form.getFieldValue('lan2.802.1x.password')

                $.ajax({
                    type: "post",
                    url: baseServerURl,
                    data: buf,
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, formatMessage)

                        if (bool) {
                            /* -------- End -------- */
                            __this._saveRes()
                        }
                    }
                })
            } else {
                __this._saveRes()
            }
        // }
    }
    _saveChangeCallback = (e) => {
        const { formatMessage } = this.props.intl
        const { form } = this.props
        const __this = this

        // if (checkIfRejectRules(method)) {
            // let all = form.getFieldsValue(['method', 'mtu', 'default_interface', 'altdns', 
            //    'lan2_ip_method', 'lan2_ip', 'lan2_mask', 'lan2_gateway', 'lan2_dns1', 'lan2_dns2', 'lan2_username', 'lan2_password', 'lan2_vid', 'lan2_priority',
            //    'lan1_ip_method', 'lan1_ipaddr', 'lan1_submask', 'lan1_gateway', 'lan1_dns1', 'lan1_dns2', 'lan1_username', 'lan1_password', 'lan1_vid', 'lan1_priority',
            //    'dhcp_ipaddr', 'dhcp_submask', 'dhcp_enable', 'dhcp_dns1', 'dhcp_dns2', 'ipfrom', 'ipto', 'dhcp_gateway', 'ipleasetime']) 
            let all = form.getFieldsValue()

            let buf = {}
            let methodVal = this.state.network_settings.method
            let lasInterface = ''
            if (methodVal === '2') {
                lasInterface = interfaceObj[methodVal][defaultInterface]
            } else {
                lasInterface = interfaceObj[methodVal]
            }
            buf["action"] = "updateNetworkSettings"
            _.each(all, function(num, key) {
                if (key === 'dhcp_enable' || key === 'dhcp6_enable') {
                    buf[key] = num ? "1" : "0"
                } else if (key !== 'mode' && key !== 'identity' && key !== 'md5_secret' && key !== 'lan2.802.1x.mode' && key !== 'lan2.802.1x.identity' && key !== 'lan2.802.1x.username' && key !== 'lan2.802.1x.password') {
                    buf[key] = num
                }
            })

            if (buf["altdns"] === '') {
                buf["altdns"] = "0.0.0.0"
            }
            if (buf["lan1_dns2"] === '') {
                buf["lan1_dns2"] = "0.0.0.0"
            }
            if (buf["lan1_vid"] === undefined) {
                buf["lan1_vid"] = ""
            }
            if (buf["lan1_priority"] === undefined) {
                buf["lan1_priority"] = ""
            }
            if (buf["lan2_vid"] === undefined) {
                buf["lan2_vid"] = ""
            }
            if (buf["lan2_priority"] === undefined) {
                buf["lan2_priority"] = ""
            }

            let method = buf["method"] || "1"
            let defaultInterface = buf["default_interface"] || "LAN2"

            $.ajax({
                type: "post",
                url: baseServerURl,
                data: buf,
                error: function(jqXHR, textStatus, errorThrown) {
                    message.destroy()

                    // top.dialog.dialogMessage({
                    //     type: 'error',
                    //     content: errorThrown
                    // });
                },
                success: function(data) {
                    const bool = UCMGUI.errorHandler(data, null, formatMessage)

                    if (bool) {
                        let currentInterface = ''

                        if (method === '2') {
                            currentInterface = interfaceObj[method][defaultInterface]
                        } else {
                            currentInterface = interfaceObj[method]
                        }

                        if (lasInterface !== currentInterface) {
                            $.ajax({
                                type: "POST",
                                url: "../cgi",
                                async: false,
                                data: {
                                    'action': 'confPhddns',
                                    'nicName': currentInterface,
                                    'conffile': ''
                                },
                                error: function(jqXHR, textStatus, errorThrown) {},
                                success: function(data) {
                                    // var bool = UCMGUI.errorHandler(data);

                                    // if (bool) {}
                                }
                            })
                        }
                        /* -------- End -------- */
                        __this._save8021x()
                    }
                }
            })
        // }
    }
    _reBoot = () => {
        UCMGUI.loginFunction.confirmReboot()
    }
    _saveRes = () => {
        const { formatMessage } = this.props.intl
        Modal.confirm({
            title: 'Confirm',
            content: formatMessage({id: "LANG927"}),
            okText: formatMessage({id: "LANG727"}),
            cancelText: formatMessage({id: "LANG726"}),
            onOk: this._reBoot.bind(this)
        })
    }
    _deleteBatchDHCPClient = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        $.ajax({
            url: baseServerURl,
            type: "GET",
            data: {
                action: "deleteBatchDHCPClient",
                mac: 'ALL',
                isbind: 'no'
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.success(formatMessage({ id: "LANG5078"}))
                    this._saveChangeCallback()
                }
            }.bind(this)
        })
    }
    _change8021xMethod = (value) => {
         let method = {}

        if (value === "0") {
            method = {
                lan1: 'display-block',
                lan2: 'hidden',
                lantitle: 'hidden',
                lan1title: 'hidden',
                lan2title: 'hidden',
                wantitle: 'display-block'
            }
        } else if (value === "2") {
            method = {
                lan1: 'display-block',
                lan2: 'display-block',
                lantitle: 'hidden',
                lan1title: 'display-block',
                lan2title: 'display-block',
                wantitle: 'hidden'
            }
        } else {
            method = {
                lan1: 'hidden',
                lan2: 'display-block',
                lantitle: 'hidden',
                lan1title: 'hidden',
                lan2title: 'hidden',
                wantitle: 'hidden'
            }
        }

        this.setState({
            method_8021_calss: method
        })       
    }
    _onChangeDHCP = (e) => {
        let data = this.state.network_settings
        data.dhcp_enable = e.target.checked
        this.setState({
            network_settings: data
        })
    }
    _changeDHCP6Enable = (e) => {
        let data = this.state.network_settings
        data.dhcp6_enable = e
        this.setState({
            network_settings: data
        })
    }
    _getInitNetwork = () => {
        const { formatMessage } = this.props.intl

        let network_settings = {}
        let dhcp_settings = {}
        let dhcp6_settings = {}

        $.ajax({
            url: baseServerURl,
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                action: "getNetworkSettings"
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    const response = data.response || {}
                    _.each(response.network_settings, function(num, key) {
                        if (key === 'dhcp_enable') {
                            network_settings[key] = num === "1" ? true : false
                        } else {
                            network_settings[key] = num
                        }
                    })
                    dhcp_settings = data.response.dhcp_settings
                    dhcp6_settings = data.response.dhcp6_settings
               }
           }
        })

        let method = network_settings.method
        let method_calss = {}
        if (method === "0") {
            method_calss = {
                lan1: 'display-block',
                lan2: 'hidden',
                lantitle: 'hidden',
                lan1title: 'hidden',
                lan2title: 'hidden',
                wantitle: 'display-block'
            }
        } else if (method === "2") {
            method_calss = {
                lan1: 'display-block',
                lan2: 'display-block',
                lantitle: 'hidden',
                lan1title: 'display-block',
                lan2title: 'display-block',
                wantitle: 'hidden'
            }
        } else {
            method_calss = {
                lan1: 'hidden',
                lan2: 'display-block',
                lantitle: 'hidden',
                lan1title: 'hidden',
                lan2title: 'hidden',
                wantitle: 'hidden'
            }
        }

        this.setState({
            network_settings: network_settings,
            dhcp_settings: dhcp_settings,
            dhcp6_settings: dhcp6_settings,
            method_8021_calss: method_calss
        })
    }
    _handleCancel = () => {
        browserHistory.push('/system-settings/networkSettings')
    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        const { form } = this.props
        var method = form.getFieldValue("method") 

        if (method === '0') {
            let aOldGateway = this.state.dhcp_settings.dhcp_gateway.split('\.')
            let aNewGateWay = form.getFieldValue("dhcp_gateway").split('\.')

            if (aOldGateway[0] !== aNewGateWay[0] || aOldGateway[1] !== aNewGateWay[1] || aOldGateway[2] !== aNewGateWay[2]) {
                $.ajax({
                    url: baseServerURl,
                    type: "GET",
                    data: {
                        action: "checkIfHasMacBind"
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, formatMessage)

                        if (bool) {
                            let bBind = (data.response.hasbind === 'yes')

                            if (bBind) {
                                Modal.confirm({
                                    title: 'Confirm',
                                    content: formatMessage({id: "LANG5077"}),
                                    okText: formatMessage({id: "LANG727"}),
                                    cancelText: formatMessage({id: "LANG726"}),
                                    onOk: this._deleteBatchDHCPClient.bind(this)
                                })
                            } else {
                                this._saveChangeCallback()
                            }
                        }
                    }
                })
            } else {
                this._saveChangeCallback()
            }
        } else {
            this._saveChangeCallback()
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG717"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG48"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ this.state.isDisplay }
                />
                <Tabs defaultActiveKey={ this.state.activeKey } onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG2217"})} key="1">
                        <BasicSettings
                            form={ this.props.form }
                            dataSource={ this.state.network_settings }
                            dataDHCPSettings={ this.state.dhcp_settings }
                            dataDHCP6Settings={ this.state.dhcp6_settings }
                            change8021x={ this._change8021xMethod.bind(this) }
                            dhcpEnable={ this._onChangeDHCP.bind(this) }
                            dhcp6Enable={ this._changeDHCP6Enable.bind(this) }
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG4586"})} key="2" disabled={ model_info.allow_nat === "0" ? true : false }>
                        <DHCPClient
                            dataMethod={ this.state.network_settings.method }
                            dataDHCPEnable={ this.state.network_settings.dhcp_enable }
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG708"})} key="3">
                        <Network8021x
                            form={ this.props.form }
                            class8021x={ this.state.method_8021_calss }
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG709"})} key="4" disabled={ model_info.allow_nat === "0" ? true : false }>
                        <PortForwarding
                        />
                    </TabPane>
                </Tabs>
                <div>
                    <BackTop />
                </div>
            </div>
        )
    }
}

NetWorkSettings.propTypes = {
}

export default Form.create()(injectIntl(NetWorkSettings))
