'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"

const CustomizedForm = injectIntl(Form.create({
    onFieldsChange(props, changedFields) {
        // this.props.dataSource["form"] = this.props.form
        props.onChange(changedFields)
    },
    mapPropsToFields(props) {
        return {
            username: {
            }
        }
    }
})((props) => {
    const { getFieldDecorator } = props.form
    const { formatMessage } = props.intl
    const SIPGenSettings = props.dataSource
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    }

    return (
        <Form>
            <div className="hidden">
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={<FormattedHTMLMessage id="LANG1766" />}>
                                {formatMessage({id: "LANG1751"})}
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('context', {
                        rules: [{ 
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }, { 
                            validator: (data, value, callback) => {
                                Validator.letterswithbasicpunc(data, value, callback, formatMessage)
                            }
                        }],
                        initialValue: SIPGenSettings.context
                    })(
                        <Input maxLength="20" />
                    ) }
                </FormItem>
            </div>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1766" />}>
                            {formatMessage({id: "LANG1765"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('realm', {
                    rules: [{ 
                            required: true, 
                            message: formatMessage({id: "LANG2150"})
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.alphanumeric(data, value, callback, formatMessage)
                            }
                        }
                    ],
                    initialValue: SIPGenSettings.realm
                })(
                    <Input maxLength="30" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1767" />}>
                            { formatMessage({id: "LANG1768"}) }
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('bindport', {
                    rules: [{ 
                        type: "integer", 
                        required: true, 
                        message: formatMessage({id: "LANG2150"}) 
                    }],
                    initialValue: SIPGenSettings.bindport
                })(
                    <InputNumber min={1} max={65535} maxLength="6" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1760" />}>
                            {formatMessage({id: "LANG1759"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('bindaddr', {
                    rules: [{ 
                            required: true, 
                            message: formatMessage({id: "LANG2150"})
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.ipAddress(data, value, callback, formatMessage)
                            }
                        }],
                    initialValue: SIPGenSettings.bindaddr
                })(
                    <Input maxLength="40" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG5124" />}>
                            {formatMessage({id: "LANG5123"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('bindaddr6', {
                    rules: [{ 
                            required: true, 
                            message: formatMessage({id: "LANG2150"})
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.ipv6(data, value, callback, formatMessage)
                            }
                        }],
                    initialValue: SIPGenSettings.bindaddr6
                })(
                    <Input maxLength="44" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1746" />}>
                            {formatMessage({id: "LANG1745"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('allowguest', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: SIPGenSettings.allowguest === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1748" />}>
                            {formatMessage({id: "LANG1747"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('allowtransfer', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: SIPGenSettings.allowtransfer === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1762" />}>
                            {formatMessage({id: "LANG1761"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('mwi_from', {
                    rules: [{ 
                            validator: (data, value, callback) => {
                                Validator.alphanumeric(data, value, callback, formatMessage)
                            }
                        }],
                    initialValue: SIPGenSettings.mwi_from
                })(
                    <Input maxLength="30" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG4579" />}>
                            {formatMessage({id: "LANG4578"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('enable_diversion', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: SIPGenSettings.enable_diversion === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
        </Form>
    )
}))

class General extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _handleFormChange = (changedFields) => {
        _.extend(this.props.dataSource, changedFields)
    }
    render() {
        const {formatMessage} = this.props.intl
        let SIPGenSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={SIPGenSettings} />
            </div>
        )
    }
}

General.propTypes = {
}

export default injectIntl(General)
