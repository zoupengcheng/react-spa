'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, InputNumber, message, Checkbox, Tooltip, Select } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

class SpeedDialItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountList: [],
            dialList: [],
            speedDialItem: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkAccount = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && _.indexOf(this.state.accountList, value) > -1) {
            callback(formatMessage({id: "LANG2126"}))
        } else {
            callback()
        }
    }
    _getInitData = () => {
        let accountList = []
        let speedDialItem = {}
        let dialList = []
        const { formatMessage } = this.props.intl
        const account = this.props.params.id

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getNumberList' },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    let response = res.response || {}
                    accountList = response.number || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        if (account) {
            accountList = _.without(accountList, account)
        }

        this.setState({
            accountList: accountList
        })

        if (account) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getSpeedDial',
                    speed_dial: account
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        speedDialItem = res.response.speed_dial || {}
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })

            this.setState({
                speedDialItem: speedDialItem 
        })
        }
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/speedDial')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const account = this.props.params.id

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

                if (action.enable_destination === true) {
                    action.enable_destination = "yes"  
                } else {
                    action.enable_destination = "no" 
                }

               if (account) {
                    action.action = 'updateSpeedDial'
                    action.speed_dial = account
                } else {
                    action.action = 'addSpeedDial'
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
    _createDial = () => {
        for (let i = 0; i < 100; i++) {

        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const speedDialItem = this.state.speedDialItem || {}
        let account = speedDialItem.extension

        if (!account) {
            account = this._createDial()
        }

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
                    0: formatMessage({id: "LANG3501"}),
                    1: this.props.params.id
                })
                : formatMessage({id: "LANG5087"}))

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
                                    <span>{ formatMessage({id: "LANG2990"}) }</span>
                                </span>
                            )}>
                            { getFieldDecorator('enable_destination', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.speedDialItem.enable_destination === "yes" ? true : false
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <span>{ formatMessage({id: "LANG5108"}) }</span>
                                </span>
                            )}
                        >
                            { getFieldDecorator('speed_dial', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: this._checkAccount
                                }],
                                initialValue: account
                            })(
                                <Input maxLength="2" />
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(SpeedDialItem))
