'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import General from './general'
import Misc from './misc'
import SessionTimer from './sessionTimer'
import TcpTls from './tcpTls'
import Nat from './nat'
import Tos from './tos'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class SipSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            SIPGenSettings: {},
            sipMiscSettings: {},
            sipSessiontimerSettings: {},
            sipTcpSettings: {},
            sipNatSettings: {},
            siptosSettings: {}
        }
    }
    componentDidMount() {
        this._getSIPGenSettings()
        this._getSIPMiscSettings()
        this._getSIPSTimerSettings()
        this._getSIPTCPSettings()
        this._getSIPNATSettings()
        this._getTOSSettings()
    }
    componentWillUnmount() {

    }
    onChange(activeKey) {
        if (activeKey === "1") {

        } else {            
            
        }
    }
    _getSIPGenSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getSIPGenSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        SIPGenSettings = res.sip_general_settings
                    this.setState({
                        SIPGenSettings: SIPGenSettings
                    })
                }
            }.bind(this)
        })        
    }
    _getSIPMiscSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getSIPMiscSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        sipMiscSettings = res.sip_misc_settings
                    this.setState({
                        sipMiscSettings: sipMiscSettings
                    })
                }
            }.bind(this)
        })        
    }
    _getSIPSTimerSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getSIPSSTimerSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        sipSessiontimerSettings = res.sip_sessiontimer_settings
                    this.setState({
                        sipSessiontimerSettings: sipSessiontimerSettings
                    })
                }
            }.bind(this)
        })        
    }
    _getSIPTCPSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getSIPTCPSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        sipTcpSettings = res.sip_tcp_settings
                    this.setState({
                        sipTcpSettings: sipTcpSettings
                    })
                }
            }.bind(this)
        })        
    }
    _getSIPNATSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getSIPNATSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        sipNatSettings = res.sip_nat_settings
                    this.setState({
                        sipNatSettings: sipNatSettings
                    })
                }
            }.bind(this)
        })        
    }
    _getTOSSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getTOSSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        siptosSettings = res.siptos_settings
                    this.setState({
                        siptosSettings: siptosSettings
                    })
                }
            }.bind(this)
        })        
    }       
    _handleCancel = () => {
        
    }
    _handleSubmit = () => {
        const { formatMessage } = this.props.intl

        let SIPGenSettingsAction = {}
        SIPGenSettingsAction["action"] = "updateSIPGenSettings"

        _.each(this.state.SIPGenSettings, function(num, key) {
            if (_.isObject(num)) {
                if (typeof (num.errors) === "undefined") {
                    if (num.value === true) {
                        SIPGenSettingsAction[key] = "yes"  
                    } else if (num.value === false) {
                        SIPGenSettingsAction[key] = "no" 
                    } else {
                        SIPGenSettingsAction[key] = num.value
                    }
                } else {
                    return
                }
            } else {
                SIPGenSettingsAction[key] = num
            }
        })
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: SIPGenSettingsAction,
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    // message.destroy()
                    // message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}} ></span>)
                }
            }.bind(this)
        })

        let sipMiscSettingsAction = {}
        sipMiscSettingsAction["action"] = "updateSIPMiscSettings"

        _.each(this.state.sipMiscSettings, function(num, key) {
            if (_.isObject(num)) {
                if (typeof (num.errors) === "undefined") {
                    if (num.value === true) {
                        sipMiscSettingsAction[key] = "yes"  
                    } else if (num.value === false) {
                        sipMiscSettingsAction[key] = "no" 
                    } else {
                        sipMiscSettingsAction[key] = num.value
                    }
                } else {
                    return
                }
            } else {
                sipMiscSettingsAction[key] = num
            }
        })
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: sipMiscSettingsAction,
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    // message.destroy()
                    // message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}} ></span>)
                }
            }.bind(this)
        })

        let sipSessiontimerSettingsAction = {}
        sipSessiontimerSettingsAction["action"] = "updateSIPSSTimerSettings"

        _.each(this.state.sipSessiontimerSettings, function(num, key) {
            if (_.isObject(num)) {
                if (typeof (num.errors) === "undefined") {
                    if (num.value === true) {
                        sipSessiontimerSettingsAction[key] = "yes"  
                   } else if (num.value === false) {
                        sipSessiontimerSettingsAction[key] = "no" 
                   } else {
                        sipSessiontimerSettingsAction[key] = num.value
                   }
                } else {
                    return
                }
            } else {
                sipSessiontimerSettingsAction[key] = num
            }
        })
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: sipSessiontimerSettingsAction,
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}} ></span>)
                }
            }.bind(this)
        })

        let sipTcpSettingsAction = {}
        sipTcpSettingsAction["action"] = "updateSIPTCPSettings"

        _.each(this.state.sipTcpSettings, function(num, key) {
            if (_.isObject(num)) {
                if (typeof (num.errors) === "undefined") {
                    if (num.value === true) {
                        sipTcpSettingsAction[key] = "yes"  
                    } else if (num.value === false) {
                        sipTcpSettingsAction[key] = "no" 
                    } else {
                        sipTcpSettingsAction[key] = num.value
                    } 
                } else {
                    return
                }
            } else {
                sipTcpSettingsAction[key] = num
            }
        })
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: sipTcpSettingsAction,
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}} ></span>)
                }
            }.bind(this)
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG39"})
        })
        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG39"}) }  
                    onSubmit={ this._handleSubmit } 
                    onCancel={ this._handleCancel } 
                    isDisplay='display-block' 
                />
                <Tabs defaultActiveKey="1" onChange={this.onChange}>
                    <TabPane tab={formatMessage({id: "LANG3"})} key="1">
                        <General 
                            dataSource={this.state.SIPGenSettings} 
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG41"})} key="2">
                        <Misc 
                            dataSource={this.state.sipMiscSettings}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG42"})} key="3">
                        <SessionTimer 
                            dataSource={this.state.sipSessiontimerSettings}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG43"})} key="4">
                        <TcpTls 
                            dataSource={this.state.sipTcpSettings}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG44"})} key="5">
                        <Nat />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG45"})} key="6">
                        <Tos />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

SipSettings.propTypes = {
}

export default injectIntl(SipSettings)