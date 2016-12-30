'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Popover, Select, Tabs } from 'antd'
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
        labelCol: { span: 3 },
        wrapperCol: { span: 6 }
    }

    return (
        <Form>
            <div className="hidden">
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover 
                                title={ formatMessage({id: "LANG1751"}) } 
                                content={ formatMessage({id: "LANG1766"}) }>
                                <span>{ formatMessage({id: "LANG1751"}) }</span>
                            </Popover>
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
                        }
                        ],
                        initialValue: SIPGenSettings.context
                    })(
                        <Input type="text" />
                    ) }
                </FormItem>
            </div>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG1765"}) } 
                            content={ formatMessage({id: "LANG1766"}) }>
                            <span>{ formatMessage({id: "LANG1765"}) }</span>
                        </Popover>
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
                    <Input type="text" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG1768"}) } 
                            content={ formatMessage({id: "LANG1767"}) }>
                            <span>{ formatMessage({id: "LANG1768"}) }</span>
                        </Popover>
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
                    <InputNumber min={1} max={65535} />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG1759"}) } 
                            content={ formatMessage({id: "LANG1760"}) }>
                            <span>{ formatMessage({id: "LANG1759"}) }</span>
                        </Popover>
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
                    <Input type="text" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG5123"}) } 
                            content={ formatMessage({id: "LANG5124"}) }>
                            <span>{ formatMessage({id: "LANG5123"}) }</span>
                        </Popover>
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
                    <Input type="text" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG1745"}) } 
                            content={ formatMessage({id: "LANG1746"}) }>
                            <span>{ formatMessage({id: "LANG1745"}) }</span>
                        </Popover>
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
                        <Popover 
                            title={ formatMessage({id: "LANG1747"}) } 
                            content={ formatMessage({id: "LANG1748"}) }>
                            <span>{ formatMessage({id: "LANG1747"}) }</span>
                        </Popover>
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
                        <Popover 
                            title={ formatMessage({id: "LANG1761"}) } 
                            content={ formatMessage({id: "LANG1762"}) }>
                            <span>{ formatMessage({id: "LANG1761"}) }</span>
                        </Popover>
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
                    <Input type="text" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG4578"}) } 
                            content={ formatMessage({id: "LANG4579"}) }>
                            <span>{ formatMessage({id: "LANG4578"}) }</span>
                        </Popover>
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