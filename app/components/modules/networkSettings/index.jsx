'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import BasicSettings from './basicSettings'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Tabs, message, Modal } from 'antd'
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
            isDisplay: "display-block",
            aOldGateway: "",
            aOldMethod: ""
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _onChange = (e) => {
        if (e === "1") {
            this.setState({
                activeKey: e,
                isDisplay: "display-block"
            })
        } else {
            this.setState({
                activeKey: e,
                isDisplay: "hidden"
            })
        }
    }
    _saveChangeCallback = (e) => {
        const { formatMessage } = this.props.intl
        const { form } = this.props
        const __this = this

        // if (checkIfRejectRules(method)) {
            let all = form.getFieldsValue() 
            let buf = {}
            let methodVal = this.state.aOldMethod
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
                } else {
                    buf[key] = num
                }
            })

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
                        __this._saveRes()
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

    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        const { form } = this.props
        var method = form.getFieldValue("method") 

        if (method === '0') {
            let aOldGateway = this.state.aOldGateway.split('\.')
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
    _getOldGateWay = (aOldGateway) => {
        this.setState({
            aOldGateway: aOldGateway
        })
    }
    _getOldMethod = (aOldMethod) => {
        this.setState({
            aOldMethod: aOldMethod
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
                            getOldMethod={ this._getOldMethod.bind(this) }
                            getOldGateWay={ this._getOldGateWay.bind(this) }
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

NetWorkSettings.propTypes = {
}

export default Form.create()(injectIntl(NetWorkSettings))