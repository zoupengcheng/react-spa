'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Checkbox, Form, Input, message, Tooltip, Popconfirm, Select } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item

class AutoDownload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            enable: false,
            reserve: false,
            showReserve: 'hidden',
            reserveVisible: false
        }
    }
    componentDidMount() {
        this._getVMSettings()
    }
    _emailConfirm = () => {
        browserHistory.push('/system-settings/emailSettings')
    }
    _getVMSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getVMSettings',
                reserve: '',
                attach: ''
            },
            type: 'json',
            async: false,
            success: function(res) {
                let response = res.response || {}
                let voicemail_settings = response.voicemail_settings || {}

                this.setState({
                    attach: (voicemail_settings.attach === 'yes'),
                    reserve: (voicemail_settings.reserve === 'yes'),
                    showReserve: (voicemail_settings.attach === 'yes' ? 'display-block' : 'hidden')
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/voicemail')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values

                action.action = 'updateVMSettings'
                action.attach = (action.attach ? 'yes' : 'no')
                action.reserve = (action.reserve ? 'yes' : 'no')

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.toString())
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(formatMessage({ id: "LANG4764" }))
                        }
                    }.bind(this)
                })
            }
        })
    }
    _handleReserveVisibleChange = (visible) => {
        if (!visible) {
            this.setState({
                reserveVisible: visible
            })

            return
        }
    }
    _onEnableChange = (e) => {
        this.setState({
            showReserve: (e.target.checked ? 'display-block' : 'hidden')
        })
    }
    _onReserveChange = (e) => {
        if (!e.target.checked) {
            this.setState({
                reserveVisible: true
            })
        } else {
            this.setState({
                reserveVisible: false
            })
        }
    }
    _reserveConfirm = () => {
        this.setState({
            reserveVisible: false
        })
    }
    _reserveCancel = () => {
        this.setState({
            reserveVisible: false
        })

        this.props.form.setFieldsValue({
            reserve: true
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 12 }
        }

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG3955"})})

        return (
            <div className="app-content-main app-content-auto-download">
                <Title headerTitle={ formatMessage({id: "LANG3955"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form>
                    <div className="lite-desc">{ formatMessage({id: "LANG3959"}, {0: formatMessage({id: "LANG64"})}) }</div>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ formatMessage({id: "LANG3955"}) }>
                                    <span>{ formatMessage({id: "LANG3955"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('enable')(
                            <Checkbox onChange={ this._onEnableChange } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ formatMessage({id: "LANG3957"}) }>
                                    <span>{ formatMessage({id: "LANG3956"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('reserve')(
                            <Select onChange={ this._onReserveChange } style={{ width: 128 }}>
                                <Option value="day">{ formatMessage({id: "LANG200"}) }</Option>
                                <Option value="week">{ formatMessage({id: "LANG199"}) }</Option>
                                <Option value="month">{ formatMessage({id: "LANG198"}) }</Option>
                            </Select>
                        ) }
                        { getFieldDecorator('reserve')(
                            <Select onChange={ this._onReserveChange } style={{ width: 128 }}>
                                <Option value="0">{ formatMessage({id: "LANG250"}) }</Option>
                                <Option value="1">{ formatMessage({id: "LANG251"}) }</Option>
                                <Option value="2">{ formatMessage({id: "LANG252"}) }</Option>
                                <Option value="3">{ formatMessage({id: "LANG253"}) }</Option>
                                <Option value="4">{ formatMessage({id: "LANG254"}) }</Option>
                                <Option value="5">{ formatMessage({id: "LANG255"}) }</Option>
                                <Option value="6">{ formatMessage({id: "LANG256"}) }</Option>
                            </Select>
                        ) }
                        { getFieldDecorator('reserve')(
                            <Select onChange={ this._onReserveChange } style={{ width: 128 }}>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ formatMessage({id: "LANG4546"}) }>
                                    <span>{ formatMessage({id: "LANG2032"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('email')(
                            <Input style={{ width: 408 }} />
                        ) }
                        <Popconfirm
                            onConfirm={ this._emailConfirm }
                            okText={ formatMessage({id: "LANG136"}) }
                            cancelText={ formatMessage({id: "LANG137"}) }
                            title={ formatMessage({id: "LANG843"}, {0: formatMessage({id: "LANG4572"})}) }
                        >
                            <a href="#">{ formatMessage({id: "LANG4572"}) }</a>
                        </Popconfirm>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(AutoDownload))