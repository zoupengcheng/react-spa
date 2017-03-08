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
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class HolidayTimeItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time_conditions_officetime: {},
            time_conditions_holiday_list: []
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkName = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && _.indexOf(this.state.time_conditions_holiday_list, value) > -1) {
            callback(formatMessage({id: "LANG2137"}))
        } else {
            callback()
        }
    }
    _getInitData = () => {
        const timeId = this.props.params.id
        let time_conditions_holiday = this.state.time_conditions_holiday || {}
        let time_conditions_holiday_list = this.state.time_conditions_holiday_list || []

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listTimeConditionHoliday',
                options: 'name'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    const tmp_time_conditions_holiday_list = response.time_conditions_holiday
                    tmp_time_conditions_holiday_list.map(function(item) {
                        time_conditions_holiday_list.push(item.name)
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        if (timeId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getTimeConditionHoliday',
                    time_conditions_holiday: timeId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        time_conditions_holiday = response.time_conditions_holiday
                        time_conditions_holiday_list = _.without(time_conditions_holiday_list, time_conditions_holiday.name)
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            time_conditions_holiday: time_conditions_holiday,
            time_conditions_holiday_list: time_conditions_holiday_list
        })
    }
    _handleCancel = () => {
        browserHistory.push('/system-settings/timeSettings/5')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const roomId = this.props.params.id

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
                action["pms_room"] = values.pms_room
                action["extension"] = values.extension
                action["address"] = values.address

                if (roomId) {
                    action.action = 'updatePMSRoom'
                    action.address = roomId
                } else {
                    action.action = 'addPMSRoom'
                    action.address = values.address
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
                    0: formatMessage({id: "LANG3266"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG3266"}) }))

        const time_conditions_holiday = this.state.time_conditions_holiday || {}

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
                            ref="div_name"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG135" />}>
                                    <span>{formatMessage({id: "LANG135"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.minlength(data, value, callback, formatMessage, 2)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.cidName(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: this._checkName
                                }],
                                width: 100,
                                initialValue: time_conditions_holiday.name ? time_conditions_holiday.name : ""
                            })(
                                <Input maxLength="25" />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_name"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3274" />}>
                                    <span>{formatMessage({id: "LANG3274"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('memo', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: time_conditions_holiday.memo ? time_conditions_holiday.memo : ""
                            })(
                                <Input type="textarea" rows={4} maxLength="250" />
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(HolidayTimeItem))