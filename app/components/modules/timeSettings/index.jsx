'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import DateTime from './datetime'
import ChangeTime from './changetime'
import OfficeTime from './officetime'
import HolidayTime from './holidaytime'
import NTPServer from './ntpserver'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Input, Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'
import { browserHistory } from 'react-router'

class TimeSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: this.props.params.id ? this.props.params.id : '1',
            isDisplay: "display-block"
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _onChange = (e) => {
        if (e === '1' || e === '2' || e === '3') {
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
    _handleCancel = () => {
        browserHistory.push('/system-settings/timeSettings')
    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action_datetime = {}
                let action_changetime = {}
                let action_ntpserver = {}
                let need_logout = false

                if (values.remote_ntp_server) {
                    action_datetime["action"] = "updateTimeSettings"
                    action_datetime["remote_ntp_server"] = values.remote_ntp_server
                    action_datetime["enable_dhcp_option_2"] = values.enable_dhcp_option_2 ? '1' : '0'
                    action_datetime["enable_dhcp_option_42"] = values.enable_dhcp_option_42 ? '1' : '0'
                    action_datetime["time_zone"] = values.time_zone
                    action_datetime["self_defined_time_zone"] = values.self_defined_time_zone
                    $.ajax({
                        url: api.apiHost,
                        method: "post",
                        data: action_datetime,
                        type: 'json',
                        error: function(e) {
                            message.error(e.statusText)
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                            } else {
                                message.error(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2981" })}}></span>)
                            }
                        }.bind(this)
                    })
                }

                if (values.setsystime) {
                    action_changetime["action"] = "setTimeManual"
                    action_changetime["setTime"] = values.setsystime.format('YYYY-MM-DD HH:mm:ss')
                    $.ajax({
                        url: api.apiHost,
                        method: "post",
                        data: action_changetime,
                        type: 'json',
                        error: function(e) {
                            message.error(e.statusText)
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                                need_logout = true
                            } else {
                                message.error(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2981" })}}></span>)
                            }
                        }.bind(this)
                    })
                }

                if (values.enable_ntpserver) {
                    if (values.ntpserver === true) {                    
                        action_ntpserver["action"] = "startNTPServer"
                        action_ntpserver["startNTP"] = ""
                    } else if (values.ntpserver === false) {
                        action_ntpserver["action"] = "stopNTPServer"
                        action_ntpserver["stopNTP"] = ""
                    }
                    $.ajax({
                        url: api.apiHost,
                        method: "post",
                        data: action_ntpserver,
                        type: 'json',
                        error: function(e) {
                            message.error(e.statusText)
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                            } else {
                                message.error(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2981" })}}></span>)
                            }
                        }.bind(this)
                    })
                }
                if (need_logout) {
                    UCMGUI.logoutFunction.doLogout()
                }
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl

        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG718"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG718"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ this.state.isDisplay }
                />
                <Tabs defaultActiveKey={ this.state.activeKey } onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG59"})} key="1">
                        <DateTime 
                            form={ this.props.form }
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG2502"})} key="2">
                        <ChangeTime
                            form={ this.props.form }
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG2491"})} key="3">
                        <NTPServer 
                            form={ this.props.form }
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3271"})} key="4">
                        <OfficeTime />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3266"})} key="5">
                        <HolidayTime />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Form.create()(injectIntl(TimeSettings))