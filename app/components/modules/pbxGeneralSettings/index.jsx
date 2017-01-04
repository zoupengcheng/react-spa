'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Form, Select, Button, Col, Popover, Tabs, message } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import GeneralPreference from './GeneralPreference'
import ExtensionPreference from './ExtensionPreference'
import Title from '../../../views/title'

const TabPane = Tabs.TabPane

class PbxGeneralSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            general: {
                generalPrefSettings: {},
                enable_out_limitime: false,
                record_prompt: false,
                isDisplay: 'hidden'
            }
        }
    }
    componentWillMount() {
        this._getGeneralPrefSettings()
        this._getExtensionPrefSettings()
    }
    _getGeneralPrefSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getGeneralPrefSettings' },
            type: 'json',
            async: true,
            success: function(res) {
                let generalPrefSettings = res.response.general_pref_settings

                this.setState({
                    general: {
                        generalPrefSettings: generalPrefSettings,
                        enable_out_limitime: generalPrefSettings.limitime !== null,
                        record_prompt: generalPrefSettings.record_prompt === 'yes',
                        isDisplay: generalPrefSettings.limitime !== null ? 'display-block' : 'hidden'
                    }
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getExtensionPrefSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getExtenPrefSettings' },
            type: 'json',
            async: true,
            success: function(res) {
                let extensionPrefSettings = res.response.extension_pref_settings

                this.setState({
                    extension: extensionPrefSettings
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _onLimitimeEnableChange = (e) => {
        this.setState({
            general: {
                enable_out_limitime: e.target.checked,
                isDisplay: e.target.checked ? 'display-block' : 'hidden'
            }
        })
    }
    _handleCancel = () => {
        this.setState({
            general: {},
            extension: {}
        })
    }
    _handleSubmit = () => {
        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values

                action.action = 'updateJBSettings'

                action.gs_jbenable = (action.service_check_enable ? 'yes' : 'no')

                $.ajax({
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
                })
            }
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG3949"})})

        return (
            <div className="app-content-main">
                <Title headerTitle={formatMessage({id: "LANG3949"})} onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Tabs type="card">
                    <TabPane tab={formatMessage({id: "LANG667"})} key="1">
                        <GeneralPreference general={ this.state.general } _onLimitimeEnableChange= { this._onLimitimeEnableChange } />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG668"})} key="2">
                        <ExtensionPreference extension={ this.state.extension } />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

PbxGeneralSettings.propTypes = {}
PbxGeneralSettings.defaultProps = {}

module.exports = injectIntl(PbxGeneralSettings)