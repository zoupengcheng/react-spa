'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage, formatMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, TimePicker } from 'antd'
import moment from "moment"

const FormItem = Form.Item
const Option = Select.Option
const addZero = UCMGUI.addZero

class PortForwardingItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            portForwarding: {
                protocol: "0"
            }
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }

    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _getInitData = () => {
        const id = this.props.params.id
        let portForwarding = this.state.portForwarding || {}

        if (id) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getPortForwarding',
                    id: id
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        portForwarding = response.id
                        portForwarding['protocol'] = response.id['protocol'].toString()
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            portForwarding: portForwarding
        })
    }
    _handleCancel = () => {
        browserHistory.push('/system-settings/networkSettings/4')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const id = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = {}
                action["id"] = values.id
                action["wan_port"] = values.wan_port
                action["lan_ip"] = values.lan_ip
                action["lan_port"] = values.lan_port
                action["protocol"] = Number(values.protocol)

                if (id) {
                    action.action = 'updatePortForwarding'
                    action.id = id
                } else {
                    action.action = 'addPortForwarding'
                }

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)
                        }

                        this._handleCancel()
                    }.bind(this)
                })
            }
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, setFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const PortForwarding = this.state.portForwarding

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG3271"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG3271"}) }))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'
                />
                <div className="content">
                    <Form>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG552" /> }>
                                        <span>{ formatMessage({id: "LANG552"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator('wan_port', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: PortForwarding.wan_port
                            })(
                                <Input/>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG5194" /> }>
                                        <span>{ formatMessage({id: "LANG553"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator('lan_ip', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: PortForwarding.lan_ip
                            })(
                                <Input/>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG554" /> }>
                                        <span>{ formatMessage({id: "LANG554"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator('lan_port', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: PortForwarding.lan_port
                            })(
                                <Input/>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG555" /> }>
                                        <span>{ formatMessage({id: "LANG555"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator('protocol', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: PortForwarding.protocol
                            })(
                                <Select style={{ width: 200 }}>
                                    <Option value='0'>{formatMessage({id: "LANG556"})}</Option>
                                    <Option value='1'>{formatMessage({id: "LANG557"})}</Option>
                                    <Option value='2'>{formatMessage({id: "LANG558"})}</Option>
                                </Select>
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(PortForwardingItem))