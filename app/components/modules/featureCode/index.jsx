'use strict'

import React, { Component, PropTypes } from 'react'
import { message, Tabs, Form } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import FeatureMap from './FeatureMap'
import CallForward from './CallForward'
import FeatureMisc from './FeatureMisc'
import FeatureCodes from './FeatureCodes'
import Title from '../../../views/title'
import _ from 'underscore'
import { browserHistory } from 'react-router'

const TabPane = Tabs.TabPane

class FeatureCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            featureCodes: {},
            featureMaps: {},
            featureSettings: {}
        }
    }
    componentDidMount () {
        this._getInitData()
    }
    _getInitData = () => {
        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'getFeatureCodes'
            },
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var featureCodes = data.response.feature_codes,
                    featureMaps = data.response.feature_maps,
                    featureSettings = data.response.feature_settings

                this.setState({
                    featureCodes: featureCodes,
                    featureMaps: featureMaps,
                    featureSettings: featureSettings
                })
            }.bind(this)
        })
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/featureCode')
    }
    _handleSaveFeatures = (action, successMessage) => {
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
                    message.success(successMessage)
                }
            }.bind(this)
        })
    }
    _handleSubmit = () => {
        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const extensionId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = {},
                    inbound_mode = values.inbound_mode

                action.action = 'updateFeatureCodes'

                _.map(values, function(value, key) {
                    if (key === 'inbound_mode') {
                        return true
                    }

                    if (key.match(/enable/) || key === 'park_as_extension') {
                        value = value ? 'yes' : 'no'
                    }

                    action[key] = value ? value : ''
                })

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
                            if (!action.enable_inboud_multi_mode) {
                                $.ajax({
                                    url: api.apiHost,
                                    method: "post",
                                    data: {
                                        action: 'updateInboundMode',
                                        inbound_mode: 0
                                    },
                                    type: 'json',
                                    error: function(e) {
                                        message.error(e.statusText)
                                    },
                                    success: function(data) {
                                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                                        if (bool) {
                                            message.destroy()
                                            message.success(successMessage)
                                        }
                                    }.bind(this)
                                })
                            } else {
                                $.ajax({
                                    url: api.apiHost,
                                    method: "post",
                                    data: {
                                        action: 'updateInboundMode',
                                        inbound_mode: inbound_mode
                                    },
                                    type: 'json',
                                    error: function(e) {
                                        message.error(e.statusText)
                                    },
                                    success: function(data) {
                                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                                        if (bool) {
                                            message.destroy()
                                            message.success(successMessage)
                                        }
                                    }.bind(this)
                                })
                            }
                        }
                    }.bind(this)
                })
            }
        })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG26"})
        })

        return (
            <div className="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG26"}) }  
                    onSubmit={ this._handleSubmit } 
                    onCancel={ this._handleCancel } 
                    isDisplay='display-block' /> 
                <Form className="form-contain-tab">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={formatMessage({id: "LANG612"})} key="1">
                            <FeatureMap
                                dataSource={ this.state.featureMaps }
                                form={ form }/>
                        </TabPane>
                        <TabPane tab={formatMessage({id: "LANG611"})} key="2">
                            <CallForward
                                dataSource={ this.state.featureCodes }
                                form={ form }/>
                        </TabPane>
                        <TabPane tab={formatMessage({id: "LANG613"})} key="3">
                            <FeatureMisc
                                dataSource={ this.state.featureSettings }
                                form={ form }/>
                        </TabPane>
                        <TabPane tab={formatMessage({id: "LANG610"})} key="4">
                            <FeatureCodes
                                dataSource={ this.state.featureCodes }
                                featureSettings={ this.state.featureSettings }
                                form={ form }/>
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(FeatureCode))