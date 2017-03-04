'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Input, Button, Row, Col, Checkbox, message, Popover, Select } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item
const Option = Select.Option

class JitterBuffer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            jitterBuffer: {}
        }
    }
    componentDidMount() {
        this._getJBSettings()
    }
    _checkJBLen = (rule, value, callback) => {
        const form = this.props.form

        if (value) {
            form.validateFields(['gs_jbmax'], { force: true })
        }

        callback()
    }
    _checkJBMax = (rule, value, callback) => {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const len = form.getFieldValue('gs_jblen')

        if (value && len && value < len) {
            callback(formatMessage({id: "LANG2142"}, { 0: formatMessage({id: "LANG1655"}), 1: formatMessage({id: "LANG2460"}) }))
        } else {
            callback()
        }
    }
    _getJBSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getJBSettings' },
            type: 'json',
            async: false,
            success: function(res) {
                let jitterBuffer = res.response.jitterbuffer_settings

                this.setState({
                    jitterBuffer: jitterBuffer
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleCancel = () => {
        browserHistory.push('/pbx-settings/jitterBuffer')
    }
    _handleSubmit = () => {
        // e.preventDefault()

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
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        let jitterBuffer = this.state.jitterBuffer || {}
        let enabled = (jitterBuffer.gs_jbenable === 'yes')
        let len = jitterBuffer.gs_jblen
        let max = jitterBuffer.gs_jbmax
        let mpl = jitterBuffer.gs_jbmpl

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG40"})})

        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG40"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG3438"}) } content={ formatMessage({id: "LANG3432"}) }><span>{ formatMessage({id: "LANG3438"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('gs_jbenable', {
                            valuePropName: 'checked',
                            initialValue: enabled
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG2460"}) } content={ formatMessage({id: "LANG2461"}) }><span>{ formatMessage({id: "LANG2460"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('gs_jblen', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) },
                                { validator: this._checkJBLen }
                            ],
                            initialValue: len
                        })(
                            <Input min={ 100 } max={ 1000 } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG1655"}) } content={ formatMessage({id: "LANG1656"}) }><span>{ formatMessage({id: "LANG1655"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('gs_jbmax', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) },
                                { validator: this._checkJBMax }
                            ],
                            initialValue: max
                        })(
                            <Input min={ 100 } max={ 1000 } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG1772"}) } content={ formatMessage({id: "LANG1773"}) }><span>{ formatMessage({id: "LANG1772"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('gs_jbmpl', {
                            initialValue: mpl
                        })(
                            <Select>
                                <Option value='fixed'>{ formatMessage({id: "LANG1777"}) }</Option>
                                <Option value='adaptive'>{ formatMessage({id: "LANG1778"}) }</Option>
                            </Select>
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(JitterBuffer))