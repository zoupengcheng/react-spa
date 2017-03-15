'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Security from './security'
import DynamicDefense from './dynamicDefense'
import Fail2ban from './fail2ban'
import SSH from './sshAccess'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Input, Tabs, message, Modal } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class SecuritySettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: this.props.params.id ? this.props.params.id : '1',
            isDisplay: "display-block",
            networkSettings: {},
            dynamicLoad: false,
            fail2banLoad: false
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    componentWillUnmount() {

    }
    _getInitData = () => {
        let networkSettings = this.state.networkSettings
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getNetworkSettings',
                method: '',
                port: ''
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    networkSettings = response.network_settings || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        this.setState({
            networkSettings: networkSettings
        })
    }
    _onChange = (e) => {
        if (e === "1") {
            this.setState({
                activeKey: e,
                isDisplay: "display-block",
                dynamicLoad: false,
                fail2banLoad: false
            })
        } else if (e === '2') {
            this.setState({
                activeKey: e,
                isDisplay: "hidden",
                dynamicLoad: true,
                fail2banLoad: false
            })
        } else if (e === '3') {
            this.setState({
                activeKey: e,
                isDisplay: "hidden",
                dynamicLoad: false,
                fail2banLoad: true
            })
        } else if (e === '4') {
            this.setState({
                activeKey: e,
                isDisplay: "hidden",
                dynamicLoad: false,
                fail2banLoad: false
            })
        }
    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action_fail2ban = {}
                let action_static = {}
                let action_dynamic = {}
                let action_ssh = {}
                let pass = false

                if ((values.ping_enable_wan === true && values.ping_of_death_wan === true) ||
                    (values.ping_enable_lan === true && values.ping_of_death_lan === true)) {
                    Modal.warning({
                        content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4105"})}} ></span>,
                        okText: (formatMessage({id: "LANG727"}))
                    })
                    pass = true
                }

                if (pass === false && values.fail2ban_enable !== undefined) {
                    action_fail2ban.action = 'updateFail2ban'
                    action_fail2ban.fail2ban_enable = values.fail2ban_enable ? 1 : 0
                    action_fail2ban.enabled = values.enabled ? 'yes' : 'no'
                    action_fail2ban.bantime = values.bantime
                    action_fail2ban.findtime = values.findtime
                    action_fail2ban.maxretry = values.maxretry
                    action_fail2ban.asterisk_maxretry = values.asterisk_maxretry
                    action_fail2ban.ignoreip1 = values.ignoreip1
                    let ignoreip_list = []
                    if (values.ignoreip2 != null) {
                        ignoreip_list.push('ignoreip2')
                    }
                    if (values.ignoreip3 != null) {
                        ignoreip_list.push('ignoreip3')
                    }
                    if (values.ignoreip4 != null) {
                        ignoreip_list.push('ignoreip4')
                    }
                    if (values.ignoreip5 !== null) {
                        ignoreip_list.push('ignoreip5')
                    }
                    if (ignoreip_list.length > 0) {
                        ignoreip_list.map(function(item, index) {
                            action_fail2ban[`ignoreip${index + 2}`] = values[`${item}`]
                        })
                    }
                    $.ajax({
                        url: api.apiHost,
                        method: "post",
                        data: action_fail2ban,
                        type: 'json',
                        async: false,
                        error: function(e) {
                            message.error(e.statusText)
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                            }
                        }.bind(this)
                    })
                }
                if (pass === false && values.dynamic_enable !== undefined) {
                    let whiteArray = values.whitelist.split('\n')
                    let whitelist = []
                    for (let i = 0; i < whiteArray.length; i++) {
                        let item = whiteArray[i]

                        if (item) {
                            if (UCMGUI.isIPv6(whiteArray[i])) {
                                item = item.replace("[", "").replace("]", "")
                            }
                            whitelist.push(item)
                        }
                    }
                    action_dynamic.action = 'updateDynamicDefense'
                    action_dynamic.enable = values.dynamic_enable ? 'yes' : 'no'
                    action_dynamic.threshold = values.threshold
                    action_dynamic.timeout = values.timeout
                    action_dynamic.block_timeout = values.block_timeout
                    action_dynamic.white_addr = whitelist.join('\n')
                    $.ajax({
                        url: api.apiHost,
                        method: "post",
                        data: action_dynamic,
                        type: 'json',
                        async: false,
                        error: function(e) {
                            message.error(e.statusText)
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                            }
                        }.bind(this)
                    })
                }
                if (pass === false && values.reject_all !== undefined) {
                    let ping_enable_list = []
                    let ping_of_death_list = []
                    if (this.state.networkSettings.method === '0') {
                        if (values.ping_enable_wan === true) {
                            ping_enable_list.push('WAN')
                        }
                        if (values.ping_enable_lan === true) {
                            ping_enable_list.push('LAN')
                        }
                        if (values.ping_of_death_wan === true) {
                            ping_of_death_list.push('WAN')
                        }
                        if (values.ping_of_death_lan === true) {
                            ping_of_death_list.push('LAN')
                        }
                    } else if (this.state.networkSettings.method === '1') {
                        if (values.ping_enable_lan === true) {
                            ping_enable_list.push('lan')
                        }
                        if (values.ping_of_death_lan === true) {
                            ping_of_death_list.push('lan')
                        }
                    } else if (this.state.networkSettings.method === '2') {
                        if (values.ping_enable_wan === true) {
                            ping_enable_list.push('LAN1')
                        }
                        if (values.ping_enable_lan === true) {
                            ping_enable_list.push('LAN2')
                        }
                        if (values.ping_of_death_wan === true) {
                            ping_of_death_list.push('LAN1')
                        }
                        if (values.ping_of_death_lan === true) {
                            ping_of_death_list.push('LAN2')
                        }
                    }
                    action_static.action = 'updateTypicalFirewallSettings'
                    action_static.reject_all = values.reject_all ? 'yes' : 'no'
                    action_static.syn_flood = ''
                    action_static.ping_of_death = ping_of_death_list.join(',')
                    action_static.ping_enable = ping_enable_list.join(',')
                    $.ajax({
                        url: api.apiHost,
                        method: "post",
                        data: action_static,
                        type: 'json',
                        async: false,
                        error: function(e) {
                            message.error(e.statusText)
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                pass = true
                                message.destroy()
                                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                            }
                        }.bind(this)
                    })
                }
                if (pass === true && values.access !== undefined) {
                    action_ssh.action = 'sshControl'
                    action_ssh.option = values.access ? 'yes' : 'no'
                  
                    $.ajax({
                        url: api.apiHost,
                        method: "post",
                        data: action_ssh,
                        type: 'json',
                        async: false,
                        error: function(e) {
                            message.error(e.statusText)
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                            }
                        }.bind(this)
                    })
                }
                if (pass === true) {
                }
            }
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
                    1: formatMessage({id: "LANG5301"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG5301"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay='display-block'
                />
                <Tabs defaultActiveKey={ this.state.activeKey } onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG38"})} key="1">
                        <Security 
                            form={ this.props.form }
                            networkSettings= { this.state.networkSettings }
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG2303"})} key="2">
                        <DynamicDefense
                            form={ this.props.form }
                            firstLoad={this.state.dynamicLoad}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG2600"})} key="3">
                        <Fail2ban
                            form={ this.props.form }
                            firstLoad={this.state.fail2banLoad}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG4179"})} key="4">
                        <SSH
                            form={ this.props.form }
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

SecuritySettings.propTypes = {
}

export default Form.create()(injectIntl(SecuritySettings))