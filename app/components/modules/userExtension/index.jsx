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
import FollowMe from './followMe'
import SpecificTime from './specificTime'
import BasicSettings from './basicSettings'

const MAXLOCALNETWORK = 10
const TabPane = Tabs.TabPane

class UserExtension extends Component {
    constructor(props) {
        super(props)

        this.state = {
            settings: {},
            userSettings: {},
            currentEditId: this.props.params.id,
            extension_type: this.props.params.type ? this.props.params.type : 'sip'
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    componentWillUnmount() {
    }
    _getInitData = () => {
        let settings = {}
        let userSettings = {}
        const { formatMessage } = this.props.intl
        const extensionId = this.props.params.id
        const extensionType = this.props.params.type
        const disabled = formatMessage({id: "LANG273"})
        const extensionRange = UCMGUI.isExist.getRange('extension', formatMessage)
        const existNumberList = UCMGUI.isExist.getList('getNumberList', formatMessage)
        const extensionTypeUpperCase = extensionType ? extensionType.toUpperCase() : ''

        this.setState({
            extensionRange: extensionRange,
            existNumberList: existNumberList
        })

        if (extensionId) {
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

                        _.map(settings, (value, key) => {
                            if (value === null) {
                                settings[key] = ''
                            } else {
                                settings[key] = value
                            }
                        })

                        this.setState({
                            settings: settings
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })

            $.ajax({
                type: 'json',
                method: 'post',
                url: api.apiHost,
                data: {
                    action: 'getUser',
                    user_name: extensionId
                },
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        let importantValues = ''
                        const response = res.response || {}

                        userSettings = response.user_name || {}
                        importantValues = settings.secret + settings.authid +
                                userSettings.email + userSettings.phone_number +
                                userSettings.first_name + userSettings.last_name + userSettings.user_password

                        this.setState({
                            userSettings: userSettings,
                            importantValues: importantValues
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })

            $.ajax({
                type: 'json',
                method: 'post',
                url: api.apiHost,
                data: {
                    action: 'getExtenPrefSettings'
                },
                error: function(jqXHR, textStatus, errorThrown) {},
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        let autoEmail = res.response.extension_pref_settings.auto_email_to_user

                        this.setState({
                            autoEmailToUser: autoEmail ? autoEmail : 'no'
                        })
                    }
                }.bind(this)
            })
        }
    }
    _getImportantValues = () => {
        let fieldsValue = ''
        const getFieldsValue = this.props.form.getFieldsValue

        fieldsValue = getFieldsValue(['secret', 'authid', 'email', 'phone_number', 'first_name', 'last_name', 'user_password'])

        return fieldsValue
    }
    _handleCancel = (e) => {
        browserHistory.push('/extension-trunk/extension')
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

                    if (key === 'mode' || key === 'out_limitime' || key === 'maximumTime' || key === 'enable_cc' ||
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
                    for (var i = 1; i <= MAXLOCALNETWORK; i++) {
                        if (!action.hasOwnProperty('local_network' + i)) {
                            action['local_network' + i] = ''
                        }
                    }

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

                        if (values.presence_dst_type === '1' || values.presence_dst_type === '3') {
                            action['presence_dst_account'] = values.presence_dst_account_voicemail
                        } else if (values.presence_dst_type === '2') {
                            action['presence_dst_account'] = values.presence_dst_external_number
                        }
                    }
                }

                if (values.maximumTime) {
                    action['limitime'] = parseInt(values.maximumTime) * 1000
                } else {
                    action['limitime'] = ''
                }

                // console.log('Received values of form: ', action)
                // console.log('Received values of form: ', values)

                // if (values.batch_number) {
                //     let batchAddExtList = []
                //     let newusersLists = []
                //     let addNumber = values.batch_number

                //     batchAddExtList = this._getBatchUsers()
                    
                //     if (askExtensionRange($("#batch_extension").val(), extensionRange[0], extensionRange[1], extensionRange[2], batchAddExtList[batchAddExtList.length - 1])) {
                //         newusersLists.push("<font>" + batchAddExtList[0] + "</font>");

                //         for (var i = 1; i < addNumber; i++) {
                //             var newusersItem = batchAddExtList[i],
                //                 prevItem = batchAddExtList[i - 1],
                //                 prev = bigNumDelete(newusersItem);

                //             if ((typeof prevItem == 'string' ? prevItem.replace(/0*(\d+)/, "$1") : prevItem) == prev) {
                //                 newusersItem = "<font>" + newusersItem + "</font>";
                //             } else {
                //                 newusersItem = "<font color='green'>" + newusersItem + "</font>";
                //             }

                //             newusersLists.push(newusersItem);
                //         }

                //         action['extension'] = batchAddExtList.toString();
                //     }
                // } else {
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
                // }
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
    _onExtensionTypeChange = (value) => {
        this.setState({
            extension_type: value
        })
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
                                userSettings={ this.state.userSettings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                extensionRange={ this.state.extensionRange }
                                existNumberList={ this.state.existNumberList }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG106"}) } key="3">
                            <Feature
                                form={ form }
                                settings={ this.state.settings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
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
                        </TabPane> */}
                        <TabPane tab={ formatMessage({id: "LANG568"}) } key="5">
                            <FollowMe
                                form={ form }
                                settings={ this.state.settings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

UserExtension.propTypes = {}

export default Form.create()(injectIntl(UserExtension))