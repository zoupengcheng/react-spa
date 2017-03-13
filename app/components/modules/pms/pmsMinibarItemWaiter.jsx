'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class WaiterItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            waiterItem: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _getInitData = () => {
        const waiterId = this.props.params.id
        let waiterItem = {}

        if (waiterId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getMiniBarWaiter',
                    waiter_id: waiterId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        waiterItem = res.response.waiter_id || {}
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            waiterItem: waiterItem
        })
    }
    _handleCancel = () => {
        browserHistory.push('/value-added-features/pms/4')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const waiterId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = values

                if (waiterId) {
                    action.action = 'updateMiniBarWaiter'
                    action.waiter_id = waiterId
                } else {
                    action.action = 'addMiniBarWaiter'
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
                    0: formatMessage({id: "LANG5057"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG5057"}) }))

        const wakeupItem = this.state.wakeupItem || {}

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
                            ref="div_waiter_id"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG4963" />}>
                                    <span>{formatMessage({id: "LANG4963"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('waiter_id', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.digits(data, value, callback, formatMessage)
                                    }
                                }],
                                width: 100,
                                initialValue: this.state.waiterItem.waiter_id
                            })(
                                <Input maxLength="128" disabled={ this.props.params.id ? true : false }/>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_secret"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG127" />}>
                                    <span>{formatMessage({id: "LANG127"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('secret', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.digits(data, value, callback, formatMessage)
                                    }
                                }],
                                width: 100,
                                initialValue: this.state.waiterItem.secret
                            })(
                                <Input maxLength="128" />
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(WaiterItem))