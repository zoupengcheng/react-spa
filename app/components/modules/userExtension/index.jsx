'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { injectIntl } from 'react-intl'
import Title from '../../../views/title'
import { Form, Input, message, Tabs } from 'antd'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'

import Feature from './feature'
import SpecificTime from './specificTime'
import BasicSettings from './basicSettings'

const MAXLOCALNETWORK = 10
const TabPane = Tabs.TabPane

class UserExtension extends Component {
    constructor(props) {
        super(props)

        this.state = {
            settings: {},
            languages: [],
            userSettings: {},
            currentEditId: '',
            extension_type: '',
            settingsPrivilege: {},
            userSettingsPrivilege: {}
        }
    }
    componentDidMount() {
        this._getOtherData()
    }
    componentWillMount() {
        this._getInitData()
    }
    componentWillUnmount() {
    }
    _getInitData = () => {
        let extensionId = ''
        let extensionType = ''
        let settings = {}
        let userSettings = {}
        let settingsPrivilege = {}
        let userSettingsPrivilege = {}
        let extensionTypeUpperCase = ''

        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            async: false,
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'listAccount',
                options: 'extension,account_type'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const account = response.account || []

                    extensionId = account[0] ? account[0].extension : ''
                    extensionTypeUpperCase = account[0] ? account[0].account_type.slice(0, 3) : ''
                    extensionType = extensionTypeUpperCase.toLowerCase()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            type: 'json',
            async: false,
            method: 'post',
            url: api.apiHost,
            data: {
                extension: extensionId,
                action: `get${extensionTypeUpperCase}Account`
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    settings = response.extension || {}
                    settingsPrivilege = response.privilege_info || {}

                    _.map(settings, (value, key) => {
                        if (value === null) {
                            settings[key] = ''
                        } else {
                            settings[key] = value
                        }
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            type: 'json',
            async: false,
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getUser',
                user_name: extensionId
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    userSettings = response.user_name || {}
                    userSettingsPrivilege = response.privilege_info || {}
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        this.setState({
            settings: settings,
            userSettings: userSettings,
            currentEditId: extensionId,
            extension_type: extensionType,
            settingsPrivilege: settingsPrivilege,
            userSettingsPrivilege: userSettingsPrivilege
        })
    }
    _getOtherData = () => {
        const { formatMessage } = this.props.intl
        const disabled = formatMessage({id: "LANG273"})

        const languages = UCMGUI.isExist.getList('getLanguage', formatMessage)
        const extensionRange = UCMGUI.isExist.getRange('extension', formatMessage)
        // const officeTimeList = UCMGUI.isExist.getList('listTimeConditionOfficeTime', formatMessage)
        // const holidayList = UCMGUI.isExist.getList('listTimeConditionHoliday', formatMessage)

        this.setState({
            languages: languages,
            // holidayList: holidayList,
            // officeTimeList: officeTimeList,
            extensionRange: extensionRange
        })
    }
    _getImportantValues = () => {
        let fieldsValue = ''
        const getFieldsValue = this.props.form.getFieldsValue

        fieldsValue = getFieldsValue(['secret', 'authid', 'email', 'phone_number', 'first_name', 'last_name', 'user_password'])

        return fieldsValue
    }
    _handleCancel = (e) => {
        browserHistory.push('/user-basic-information/userExtension')
    }
    _handleSubmit = (e) => {
        // e.preventDefault()
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const getFieldInstance = form.getFieldInstance

        form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                let action = {
                        dndwhitelist: [],
                        fwdwhitelist: []
                    },
                    fax = values.faxmode ? values.faxmode : '',
                    type = values.extension_type ? values.extension_type : ''

                action.action = `update${this.state.extension_type.toUpperCase()}Account`

                _.map(values, function(value, key) {
                    let fieldInstance = getFieldInstance(key)

                    if (key === 'enable_cc' || key === 'callbarging_monitor' || key === 'use_callee_dod_on_fwd_rb' ||
                        key === 'mode' || key === 'out_limitime' || key === 'maximumTime' ||
                        key === 'whiteLists' || key === 'fwdwhiteLists' || key === 'localNetworks' ||
                        key === 'presence_dst_account_voicemail' || key === 'presence_dst_external_number' ||
                        key === 'room' || key === 'faxmode' || key === 'cc_mode' || key === 'batch_number' ||
                        key === 'cc_max_agents' || key === 'cc_max_monitors' || key === 'custom_alert_info' ||
                        key === 'user_password' || key === 'phone_number' || key === 'email' || key === 'language' ||
                        key === 'extension_type' || key === 'fullname' || key === 'first_name' || key === 'last_name') {
                        return false
                    }

                    if (key.indexOf('fm_') === 0) {
                        return false
                    }

                    if (key.indexOf('whitelist') === 0) {
                        if (value) {
                            action.dndwhitelist.push(value)
                        }

                        return false
                    }

                    if (key.indexOf('fwdwhitelist') === 0) {
                        if (value) {
                            action.fwdwhitelist.push(value)
                        }

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
                action.fwdwhitelist = action.fwdwhitelist.join()

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

                if (type === 'fxs') {
                    action['hanguponpolarityswitch'] = action['answeronpolarityswitch']

                    if (values.enable_cc) {
                        action['cc_agent_policy'] = 'generic'
                        action['cc_monitor_policy'] = 'generic'
                        action['cc_max_agents'] = '1'
                        action['cc_max_monitors'] = '5'
                        action['cc_offer_timer'] = '120'
                        action['ccnr_available_timer'] = '3600'
                        action['ccbs_available_timer'] = '3600'
                    } else {
                        action['cc_agent_policy'] = 'never'
                        action['cc_monitor_policy'] = 'never'
                    }

                    delete action.allow
                } else {
                    // SIP/ IAX
                    // for (var i = 1; i <= MAXLOCALNETWORK; i++) {
                    //     if (!action.hasOwnProperty('local_network' + i)) {
                    //         action['local_network' + i] = ''
                    //     }
                    // }

                    if (type === 'sip') {
                        if (values.enable_cc) {
                            if (values.cc_mode === 'trunk') {
                                action['cc_agent_policy'] = 'native'
                                action['cc_monitor_policy'] = 'native'
                                action['cc_max_agents'] = values.cc_max_agents ? values.cc_max_agents : ''
                                action['cc_max_monitors'] = values.cc_max_monitors ? values.cc_max_monitors : ''
                                action['cc_offer_timer'] = '120'
                                action['ccnr_available_timer'] = '3600'
                                action['ccbs_available_timer'] = '3600'
                            } else {
                                action['cc_agent_policy'] = 'generic'
                                action['cc_monitor_policy'] = 'generic'
                                action['cc_max_agents'] = '1'
                                action['cc_max_monitors'] = '5'
                                action['cc_offer_timer'] = '120'
                                action['ccnr_available_timer'] = '3600'
                                action['ccbs_available_timer'] = '3600'
                            }
                        } else {
                            action['cc_agent_policy'] = 'never'
                            action['cc_monitor_policy'] = 'never'
                        }

                        if (values.enable_webrtc) {
                            action['enable_webrtc'] = 'yes'
                            action['media_encryption'] = 'auto_dtls'
                            action['account_type'] = 'SIP(WebRTC)'
                        } else {
                            action['enable_webrtc'] = 'no'
                            action['media_encryption'] = 'no'
                            action['account_type'] = 'SIP'
                        }

                        if (values.alertinfo === 'custom') {
                            action['alertinfo'] = 'custom_' + values.custom_alert_info
                        }

                        if (values.room) {
                            action['room'] = action['extension']
                        }

                        // if (values.presence_dst_type === '1' || values.presence_dst_type === '3') {
                        //     action['presence_dst_account'] = values.presence_dst_account_voicemail
                        // } else if (values.presence_dst_type === '2') {
                        //     action['presence_dst_account'] = values.presence_dst_external_number
                        // }
                    }
                }

                // if (values.maximumTime) {
                //     action['limitime'] = parseInt(values.maximumTime) * 1000
                // } else {
                //     action['limitime'] = ''
                // }

                message.loading(formatMessage({ id: "LANG826" }), 0)

                if (!$.isEmptyObject(this.state.privilegeInfo)) {
                    action = UCMGUI.getPrivilegeAction(action, this.state.privilegeInfo)
                }

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
                            let userAction = {
                                    'action': 'updateUser',
                                    'user_id': this.state.userSettings.user_id,
                                    'last_name': this.state.userSettings.last_name,
                                    'first_name': this.state.userSettings.first_name,
                                    'language': (values.language && values.language !== 'default') ? values.language : ''
                                }

                            if (!$.isEmptyObject(this.state.userPrivilegeInfo)) {
                                userAction = UCMGUI.getPrivilegeAction(userAction, this.state.userPrivilegeInfo)
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
                                        message.destroy()
                                        message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>, 2)
                                    }
                                }.bind(this)
                            })
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

        const title = formatMessage({id: "LANG4094"})

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main app-content-extension">
                <Title
                    headerTitle={ title }
                    isDisplay='display-block'
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                />
                <Form className="form-contain-tab">
                    <Tabs defaultActiveKey="1" onChange={ this._onChangeTabs }>
                        <TabPane tab={ formatMessage({id: "LANG2217"}) } key="1">
                            <BasicSettings
                                form={ form }
                                settings={ this.state.settings }
                                languages={ this.state.languages }
                                userSettings={ this.state.userSettings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                extensionRange={ this.state.extensionRange }
                                settingsPrivilege={ this.state.settingsPrivilege }
                                userSettingsPrivilege={ this.state.userSettingsPrivilege }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG106"}) } key="3">
                            <Feature
                                form={ form }
                                settings={ this.state.settings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                settingsPrivilege={ this.state.settingsPrivilege }
                            />
                        </TabPane>
                        {/* <TabPane tab={ formatMessage({id: "LANG3288"}) } key="4">
                            <SpecificTime
                                form={ form }
                                settings={ this.state.settings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG568"}) } key="5">
                            <FollowMe
                                form={ form }
                                settings={ this.state.settings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane> */}
                    </Tabs>
                </Form>
            </div>
        )
    }
}

UserExtension.propTypes = {}

export default Form.create()(injectIntl(UserExtension))