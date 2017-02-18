'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Button, Checkbox, Col, Form, Input, message, Row, Select, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class InboundBlackList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            numberList: [],
            featureMaps: {},
            featureCodes: {},
            featureSettings: {},
            enableMultiMode: false,
            numberListWithoutFCodes: []
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkExist = (rule, value, callback) => {
        let exist
        let val = $.trim(value)
        const { formatMessage } = this.props.intl

        exist = _.find(this.state.customBlacklist, function(data) {
            return data.blacklist === val
        })

        if (val && exist) {
            callback(formatMessage({id: "LANG5342"}))
        } else {
            callback()
        }
    }
    _checkFormat = (rule, value, callback) => {
        let val = $.trim(value)
        const { formatMessage } = this.props.intl

        if (val && /[^a-zA-Z0-9\#\*\.!\-\+\/]/.test(val)) {
            callback(formatMessage({id: "LANG5343"}))
        } else {
            callback()
        }
    }
    _checkNumberExists = (rule, value, callback) => {
        let val = $.trim(value)
        const { formatMessage } = this.props.intl

        if (val && this.state.numberListWithoutFCodes.indexOf(val) > -1) {
            callback(formatMessage({id: "LANG2126"}))
        } else {
            callback()
        }
    }
    _getInitData = () => {
        let featureMaps = {}
        let featureCodes = {}
        let featureSettings = {}

        let numberList = []
        let numberListWithoutFCodes = []

        const form = this.props.form
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            async: false,
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getFeatureCodes'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    featureMaps = response.feature_maps || {}
                    featureCodes = response.feature_codes || {}
                    featureSettings = response.feature_settings || {}
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
                action: 'getInboundMode'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    featureCodes.inbound_mode = (response.inbound_mode.inbound_mode + '') || '0'
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        numberList = UCMGUI.isExist.getList('getNumberList', formatMessage)

        numberListWithoutFCodes = [].concat(numberList)

        for (var id in featureCodes) {
            if (featureCodes.hasOwnProperty(id)) {
                numberListWithoutFCodes = _.without(numberListWithoutFCodes, featureCodes[id])
            }
        }

        this.setState({
            numberList: numberList,
            featureMaps: featureMaps,
            featureCodes: featureCodes,
            featureSettings: featureSettings,
            numberListWithoutFCodes: numberListWithoutFCodes,
            enableMultiMode: featureCodes.enable_inboud_multi_mode === 'yes'
        })
    }
    _handleCancel = (e) => {
        browserHistory.push('/extension-trunk/inboundRoute')
    }
    _handleSubmit = (e) => {
        // e.preventDefault()

        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let inboundMode = values.enable_inboud_multi_mode ? values.inbound_mode : '0'

                values.action = 'updateFeatureCodes'
                values.enable_inboud_multi_mode = values.enable_inboud_multi_mode ? 'yes' : 'no'
                delete values.inbound_mode

                $.ajax({
                    data: values,
                    type: 'json',
                    method: 'post',
                    url: api.apiHost,
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            $.ajax({
                                type: 'json',
                                method: 'post',
                                url: api.apiHost,
                                data: {
                                    'inbound_mode': inboundMode,
                                    'action': 'updateInboundMode'
                                },
                                error: function(e) {
                                    message.error(e.statusText)
                                },
                                success: function(data) {
                                    const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                                    if (bool) {
                                        message.destroy()
                                        message.success(successMessage)

                                        this._handleCancel()
                                    }
                                }.bind(this)
                            })
                        }
                    }.bind(this)
                })
            }
        })
    }
    _onChange = (e) => {
        this.setState({
            enableMultiMode: e.target.checked
        })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const settings = this.state.featureCodes || {}
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
                labelCol: { span: 4 },
                wrapperCol: { span: 6 }
            }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG4543"})
                })

        return (
            <div className="app-content-main">
                <Title
                    isDisplay='hidden'
                    isDisplay='display-block'
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    headerTitle={ formatMessage({id: "LANG4543"}) }
                />
                <div className="content">
                    <Form>
                        <Row>
                            <div className="function-description">
                                <span>{ formatMessage({id: "LANG4301"}) }</span>
                            </div>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4298" /> }>
                                            <span>{ formatMessage({id: "LANG4295"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('enable_inboud_multi_mode', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.enableMultiMode
                                })(
                                    <Checkbox onChange={ this._onChange } />
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4542" /> }>
                                            <span>{ formatMessage({id: "LANG4541"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('inbound_mode', {
                                    rules: [],
                                    initialValue: settings.inbound_mode ? settings.inbound_mode : '0'
                                })(
                                    <Select disabled={ !this.state.enableMultiMode }>
                                        <Option value='0'>{ formatMessage({id: "LANG3940"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG4540"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4299" /> }>
                                            <span>{ formatMessage({id: "LANG4296"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('fcode_inbound_mode_zero', {
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }, {
                                        validator: (data, value, callback) => {
                                            Validator.numeric_pound_star(data, value, callback, formatMessage)
                                        }
                                    }, {
                                        validator: this._checkNumberExists
                                    }],
                                    initialValue: settings.fcode_inbound_mode_zero ? settings.fcode_inbound_mode_zero : '*61'
                                })(
                                    <Input disabled={ !this.state.enableMultiMode } />
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4300" /> }>
                                            <span>{ formatMessage({id: "LANG4297"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('fcode_inbound_mode_one', {
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }, {
                                        validator: (data, value, callback) => {
                                            Validator.numeric_pound_star(data, value, callback, formatMessage)
                                        }
                                    }, {
                                        validator: this._checkNumberExists
                                    }],
                                    initialValue: settings.fcode_inbound_mode_one ? settings.fcode_inbound_mode_one : '*62'
                                })(
                                    <Input disabled={ !this.state.enableMultiMode } />
                                ) }
                            </FormItem>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(InboundBlackList))