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

class OfficeTimeItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time_conditions_officetime: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkName = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && _.indexOf(this.state.groupNameList, value) > -1) {
            callback(formatMessage({id: "LANG2137"}))
        } else {
            callback()
        }
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _getInitData = () => {
        const timeId = this.props.params.id
        let time_conditions_officetime = this.state.time_conditions_officetime || {}

        if (timeId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getTimeConditionOfficeTime',
                    time_conditions_officetime: timeId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        time_conditions_officetime = response.time_conditions_officetime
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            time_conditions_officetime: time_conditions_officetime
        })
    }
    _handleCancel = () => {
        browserHistory.push('/system-settings/timeSettings/4')
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
        let start_time = ''
        let end_time = ''

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

        const time_conditions_officetime = this.state.time_conditions_officetime || {}
        if (time_conditions_officetime.start_hour !== undefined) {
            start_time = addZero(time_conditions_officetime.start_hour) + ':' + addZero(time_conditions_officetime.start_min)
            end_time = addZero(time_conditions_officetime.end_hour) + ':' + addZero(time_conditions_officetime.end_min)
        }

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
                            ref="div_starttime"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG169" />}>
                                    <span>{formatMessage({id: "LANG169"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('starttime', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: start_time !== '' ? moment(start_time, 'HH:mm') : ''
                            })(
                                <TimePicker
                                    format="HH:mm"
                                    placeholder={ formatMessage({id: "LANG169"}) }
                                    onChange={this._onChangePicker}
                                />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_endtime"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG184" />}>
                                    <span>{formatMessage({id: "LANG184"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('endtime', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: end_time !== '' ? moment(end_time, 'HH:mm') : ''
                            })(
                                <TimePicker
                                    format="HH:mm"
                                    placeholder={ formatMessage({id: "LANG184"}) }
                                    onChange={this._onChangePicker}
                                />
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(OfficeTimeItem))