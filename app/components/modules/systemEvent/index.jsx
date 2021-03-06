'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Warning from './warning'
import WarningEventsList from './warningEventsList'
import WarningContact from './warningContact'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Input, Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class WarningIndex extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: this.props.params.id ? this.props.params.id : '1',
            isDisplay: this.props.params.id === '1' ? "hidden" : 'display-block',
            has_contact: 0,
            itemId: "",
            warning_general: [],
            enEmail: false,
            emailPageReload: false,
            eventListPageReload: false
        }
    }
    componentDidMount() {
        this._getWarningGeneral()
        this._getHasContact()
    }
    componentWillUnmount() {

    }
    _getHasContact = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'warningCheckHasContact'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const has_contact = response.body.has_contact

                    this.setState({
                        has_contact: has_contact
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getWarningGeneral = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'warningGetGeneralSettings'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const warning_general = response.body.warning_general || []
                    let enEmail = false
                    warning_general.map(function(item) {
                        if (item.enable_email === '1') {
                            enEmail = true
                        }
                    })
                    this.setState({
                        warning_general: warning_general,
                        enEmail: enEmail
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _changeEnEmail = (value) => {
        this.setState({
            enEmail: value
        })
    }
    _onChange = (e) => {
        if (e === '1') {
            this.setState({
                isDisplay: 'hidden',
                activeKey: '1'
            })
        } else {
            this.setState({
                isDisplay: 'display-block',
                activeKey: e
            })
        }
    }
    _warningStart = () => {
        $.ajax({
            url: api.apiHost + 'action=reloadWarning&warningStart=',
            method: "GET",
            type: 'json',
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                }
            }.bind(this)
        })
    }
    _warningStop = () => {
        $.ajax({
            url: api.apiHost + 'action=reloadWarning&warningStop=',
            method: "GET",
            type: 'json',
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                }
            }.bind(this)
        })
    }
    _reloadCrontabs = () => {
        $.ajax({
            url: api.apiHost + 'action=reloadCrontabs&crontabjobs=',
            method: "GET",
            type: 'json',
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                }
            }.bind(this)
        })
    }
    _handleSubmit = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG904" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>

        this.props.form.validateFieldsAndScroll({force: true}, (err, values) => {
            if (!err) {
                console.log(values)
            }
            if (values.super_0 !== undefined && !err) {
                this._warningStop()
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)
                let action = {}
                action.action = 'warningUpdateEmailSettings'
                let admin_email_list = []
                let email_list = []
                for (let i = 0; i <= 9; i++) {
                    if (values[`super_${i}`]) {
                        admin_email_list.push(values[`super_${i}`])
                    }
                    if (values[`manager_${i}`]) {
                        email_list.push(values[`manager_${i}`])
                    }
                }
                action.admin_email = admin_email_list.join(',')
                action.email = email_list.join(',')

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    async: false,
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)
                            if (admin_email_list.length > 0) {
                                this.setState({
                                    has_contact: 1
                                })
                                const itemId = this.state.itemId
                                let actionEn = {}
                                actionEn.action = "warningUpdateGeneralSettings"
                                actionEn.enable = ""
                                actionEn.enable_email = 1 
                                actionEn.id = itemId
                                if (itemId && itemId !== '') {
                                    $.ajax({
                                        url: api.apiHost,
                                        method: "post",
                                        data: actionEn,
                                        type: 'json',
                                        async: false,
                                        error: function(e) {
                                            message.error(e.statusText)
                                        },
                                        success: function(data) {
                                            const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                                            if (bool) {
                                                message.destroy()
                                                message.success(successMessage)
                                                this._getWarningGeneral()
                                            }
                                        }.bind(this)
                                    })
                                }
                            } else if (admin_email_list.length === 0) {
                                this.setState({
                                    has_contact: 0
                                })
                            }
                        }
                    }.bind(this)
                })
                this._warningStart()
            }

            if (values.Pmode_send_warningemail !== undefined && !err) {
                let action_event = {}
                action_event.action = 'setWarningEmailValue'
                if (values.Pmode_send_warningemail === '0') {
                    action_event.action = 'setWarningEmailValue'
                    action_event.Pmode_send_warningemail = values.Pmode_send_warningemail
                } else if (values.Pmode_send_warningemail === '1') {
                    action_event.action = 'setWarningEmailValue'
                    action_event.Pmode_send_warningemail = values.Pmode_send_warningemail
                    action_event.Pmin_send_warningemail = values.email_circle
                    action_event.Ptype_send_warningemail = values.Ptype_send_warningemail
                }

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action_event,
                    type: 'json',
                    async: false,
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)
                            this._reloadCrontabs()
                        }
                    }.bind(this)
                })
            }

            this._warningStop()
            setTimeout(this._warningStart, 1000)
            this.setState({
                reloadWarning: false
            })
        })
    }
    _handleCancel = () => {
        const { resetFields } = this.props.form
        if (this.state.activeKey === '2') {
            resetFields(['Pmode_send_warningemail', 'email_circle', 'Ptype_send_warningemail'])
            this.setState({
                eventListPageReload: true
            })
        } else if (this.state.activeKey === '3') {
            for (let i = 0; i <= 9; i++) {
                resetFields([`super_${i}`])
                resetFields([`manager_${i}`])
            }
            this.setState({
                emailPageReload: true
            })
        }
    }
    _setActiveKey = (key, id) => {
        this.setState({
            activeKey: key,
            itemId: id
        })
    }
    _eventListPageReloadFunc = (key) => {
        this.setState({
            eventListPageReload: key
        })
    }
    _emailPageReloadFunc = (key) => {
        this.setState({
            emailPageReload: key
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG2580"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG2580"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ this.state.isDisplay }
                />
                <Tabs defaultActiveKey='1' activeKey={ this.state.activeKey } onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG2581"})} key="1">
                        <Warning 
                            dataSource={this.state.basicSettings}
                            fileList={this.state.fileList}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG2582"})} key="2">
                        <WarningEventsList
                            form={ this.props.form }
                            has_contact={ this.state.has_contact }
                            warning_general={ this.state.warning_general }
                            setActiveKey={ this._setActiveKey }
                            getWarningGeneral={ this._getWarningGeneral }
                            changeEnEmail={this._changeEnEmail}
                            eventListPageReload={this.state.eventListPageReload}
                            eventListPageReloadFunc={this._eventListPageReloadFunc}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG2546"})} key="3">
                        <WarningContact
                            form={ this.props.form }
                            enEmail={this.state.enEmail}
                            emailPageReload={this.state.emailPageReload}
                            emailPageReloadFunc={this._emailPageReloadFunc}
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

WarningIndex.propTypes = {
}

export default Form.create()(injectIntl(WarningIndex))