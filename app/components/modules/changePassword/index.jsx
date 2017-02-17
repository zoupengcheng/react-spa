'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Button, message, Modal, Input, Tag, Select, Form, Row, Col, Tooltip } from 'antd'

const confirm = Modal.confirm
const Option = Select.Option
const FormItem = Form.Item

class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
              user_name: {}
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        const username = localStorage.username

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getUser',
                user_name: username,
                user_password: '',
                email: ''
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const user_name_val = response.user_name || []

                    this.setState({
                        user_name: user_name_val
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _handleCancel = () => {
    }

    _handleSubmit = () => {
        const { formatMessage } = this.props.intl
        const userid = localStorage.getItem('adminId')

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                if (values.newpass_rep === values.user_password) {
                    message.loading(formatMessage({ id: "LANG826" }), 0)

                    let action = {}
                    action.user_id = userid
                    action.action = 'updateUser'

                    action.old_password = values.old_password
                    action.user_password = values.user_password
                    action.email = values.email

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
                                message.success(formatMessage({ id: "LANG932" }))
                                browserHistory.push('/login')
                            }
                        }.bind(this)
                    })
                }
            }
        })
    }

    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const { getFieldDecorator } = this.props.form
        const user_name = this.state.user_name

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG55"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG55"}) }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay= "display-block"
                />
                <Form>
                    <FormItem
                        ref="div_oldpass"
                        { ...formItemLayout }
                        label={
                            <Tooltip title={<FormattedHTMLMessage id="LANG1989" />}>
                                <span>{formatMessage({id: "LANG1989"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('old_password', {
                            rules: [{ required: true,
                                message: formatMessage({id: "LANG2150"})
                                }],
                            initialValue: ''
                        })(
                            <Input type="password"/>
                        ) }
                    </FormItem>

                    <FormItem
                        ref="div_newpass"
                        { ...formItemLayout }
                        label={
                            <Tooltip title={<FormattedHTMLMessage id="LANG1990" />}>
                                <span>{formatMessage({id: "LANG1990"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('user_password', {
                            rules: [{ required: true,
                                message: formatMessage({id: "LANG2150"})
                                }],
                            initialValue: ''
                        })(
                            <Input type="password" />
                        ) }
                    </FormItem>

                    <FormItem
                        ref="div_newpass_rep"
                        { ...formItemLayout }
                        label={
                            <Tooltip title={<FormattedHTMLMessage id="LANG1991" />}>
                                <span>{formatMessage({id: "LANG1991"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('newpass_rep', {
                            rules: [{ required: true,
                                message: formatMessage({id: "LANG2150"})
                                }],
                            initialValue: ''
                        })(
                            <Input type="password"/>
                        ) }
                    </FormItem>

                    <FormItem
                        ref="div_email"
                        { ...formItemLayout }
                        label={
                            <Tooltip title={<FormattedHTMLMessage id="LANG4192" />}>
                                <span>{formatMessage({id: "LANG1081"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('email', {
                            rules: [{ required: true,
                                message: formatMessage({id: "LANG2150"})
                                }],
                            initialValue: user_name.email ? user_name.email : ''
                        })(
                            <Input />
                        ) }
                    </FormItem>
                </Form>
            </div>
            )
    }
}

export default Form.create()(injectIntl(ChangePassword))