'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { injectIntl } from 'react-intl'
import Title from '../../../views/title'
import { Form, message, Tabs } from 'antd'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'

import WebSocket from './websocket'
import SmartRoute from './smartroute'
import CloudService from './cloudservice'

const TabPane = Tabs.TabPane

class WebRTC extends Component {
    constructor(props) {
        super(props)

        this.state = {
            portList: []
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
        this._getInitData()
    }
    _getInitData = () => {
        let portList = []
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getUsedPortInfo'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    portList = response.usedport || []

                    this.setState({
                        portList: portList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleCancel = (e) => {
        browserHistory.push('/value-added-features/webrtc')
    }
    _handleSubmit = (e) => {
        // e.preventDefault()
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const getFieldInstance = form.getFieldInstance

        form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                let action = {
                        dndwhitelist: []
                    },
                    fax = values.faxmode ? values.faxmode : '',
                    type = values.extension_type ? values.extension_type : ''

                if (this.state.currentEditId) {
                    action.action = `update${this.state.extension_type.toUpperCase()}Account`
                } else {
                    action.action = `add${this.state.extension_type.toUpperCase()}AccountAndUser`

                    action.first_name = values.first_name ? values.first_name : ''
                    action.last_name = values.last_name ? values.last_name : ''
                    action.email = values.email ? values.email : ''
                    action.language = (values.language && values.language !== 'default') ? values.language : ''
                    action.user_password = values.user_password ? values.user_password : ''
                    action.phone_number = values.phone_number ? values.phone_number : ''

                    if (action.first_name && action.last_name) {
                        action.fullname = action.first_name + ' ' + action.last_name
                    } else if (action.first_name) {
                        action.fullname = action.first_name
                    } else if (action.last_name) {
                        action.fullname = action.last_name
                    } else {
                        action.fullname = ''
                    }
                }

                _.map(values, function(value, key) {
                    let fieldInstance = getFieldInstance(key)

                    if (key === 'whiteLists' || key === 'localNetworks' || key === 'enable_cc' ||
                        key === 'mode' || key === 'out_limitime' || key === 'maximumTime' ||
                        key === 'room' || key === 'faxmode' || key === 'cc_mode' || key === 'batch_number' ||
                        key === 'cc_max_agents' || key === 'cc_max_monitors' || key === 'custom_alert_info' ||
                        key === 'user_password' || key === 'phone_number' || key === 'email' || key === 'language' ||
                        key === 'extension_type' || key === 'fullname' || key === 'first_name' || key === 'last_name') {
                        return false
                    }

                    if (key.indexOf('whitelist') > -1) {
                        action.dndwhitelist.push(value)

                        return false
                    }

                    if (fieldInstance && fieldInstance.props) {
                        let medaData = fieldInstance.props['data-__meta']

                        if (!medaData.className || medaData.className !== 'hidden') {
                            action[key] = (value !== undefined ? UCMGUI.transCheckboxVal(value) : '')
                        }
                    } else {
                        action[key] = value ? value : ''
                    }
                })

                action['time_condition'] = JSON.stringify([])
                action.dndwhitelist = action.dndwhitelist.join()

                if (fax === 'no') {
                    action['faxdetect'] = 'no'

                    if (type === 'fxs') {
                        action['fax_gateway'] = 'no'
                    }
                } else if (fax === 'detect') {
                    action['faxdetect'] = 'yes'

                    if (type === 'fxs') {
                        action['fax_gateway'] = 'no'
                    }
                } else if (fax === 'gateway') {
                    action['faxdetect'] = 'no'

                    if (type === 'fxs') {
                        action['fax_gateway'] = 'yes'
                    }
                }

                if (values.maximumTime) {
                    action['limitime'] = parseInt(values.maximumTime) * 1000
                } else {
                    action['limitime'] = ''
                }

                message.loading(formatMessage({ id: "LANG826" }), 0)

                $.ajax({
                    data: action,
                    type: 'json',
                    method: "post",
                    url: api.apiHost,
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            if (this.state.currentEditId) {
                                let fieldsValue = this._getImportantValues()

                                let newImportantValues = fieldsValue.secret + fieldsValue.authid +
                                        fieldsValue.email + fieldsValue.phone_number +
                                        fieldsValue.first_name + fieldsValue.last_name + fieldsValue.user_password

                                let userAction = {
                                        'action': 'updateUser',
                                        'email': values.email ? values.email : '',
                                        'user_id': this.state.userSettings.user_id,
                                        'last_name': values.last_name ? values.last_name : '',
                                        'first_name': values.first_name ? values.first_name : '',
                                        'phone_number': values.phone_number ? values.phone_number : '',
                                        'user_password': values.user_password ? values.user_password : '',
                                        'language': (values.language && values.language !== 'default') ? values.language : ''
                                    }

                                if (userAction.user_password === '******') {
                                    delete userAction.user_password
                                }

                                if (this.state.importantValues !== newImportantValues) {
                                    userAction.email_to_user = 'no'
                                }

                                $.ajax({
                                    type: 'json',
                                    method: "post",
                                    url: api.apiHost,
                                    data: userAction,
                                    error: function(e) {
                                        message.error(e.statusText)
                                    },
                                    success: function(data) {
                                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                                        if (bool) {
                                            if ((this.state.importantValues !== newImportantValues) &&
                                                (this.state.autoEmailToUser === 'yes') && userAction['email']) {
                                                $.ajax({
                                                    type: "post",
                                                    async: false,
                                                    url: api.apiHost,
                                                    data: {
                                                        'action': 'sendAccount2User',
                                                        'extension': action['extension']
                                                    },
                                                    error: function(jqXHR, textStatus, errorThrown) {},
                                                    success: function(data) {}
                                                })
                                            }

                                            message.destroy()
                                            message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>, 2)

                                            this._handleCancel()
                                        }
                                    }.bind(this)
                                })
                            } else {
                                if ((this.state.autoEmailToUser === 'yes') && action['email']) {
                                    $.ajax({
                                        type: "post",
                                        async: false,
                                        url: api.apiHost,
                                        data: {
                                            'action': 'sendAccount2User',
                                            'extension': action['extension']
                                        },
                                        error: function(jqXHR, textStatus, errorThrown) {},
                                        success: function(data) {}
                                    })
                                }

                                message.destroy()
                                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4104" })}}></span>, 2)

                                this._handleCancel()
                            }
                        }
                    }.bind(this)
                })
            }
        })
    }
    _onChangeTabs = (activeKey) => {
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         return false
        //     }
        // })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const title = formatMessage({id: "LANG4263"})

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    isDisplay='display-block'
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                />
                <Form className="form-contain-tab">
                    <Tabs defaultActiveKey="1" onChange={ this._onChangeTabs }>
                        <TabPane tab={ formatMessage({id: "LANG4396"}) } key="1">
                            <WebSocket
                                form={ form }
                                portList={ this.state.portList }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG4505"}) } key="2">
                            <CloudService
                                form={ form }
                                portList={ this.state.portList }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG4496"}) } key="3">
                            <SmartRoute
                                form={ form }
                                portList={ this.state.portList }
                            />
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

WebRTC.propTypes = {}

export default Form.create()(injectIntl(WebRTC))