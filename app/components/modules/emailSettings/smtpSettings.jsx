'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"

class smtpSettings extends Component {
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
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <FormItem
                        ref="div_smtp_tls_enable"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2047" />}>
                                <span>{formatMessage({id: "LANG2046"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('smtp_tls_enable', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: false
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_smtp_type"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2049" />}>
                                <span>{formatMessage({id: "LANG84"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('smtp_type', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Select>
                                 <Option value="client">{formatMessage({id: "LANG2044"})}</Option>
                                 <Option value="mta">{formatMessage({id: "LANG2045"})}</Option>
                             </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_mail_context_mode"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG5232" />}>
                                <span>{formatMessage({id: "LANG5231"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('mail_context_mode', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Select>
                                 <Option value="html">{formatMessage({id: "LANG5230"})}</Option>
                                 <Option value="txt">{formatMessage({id: "LANG5229"})}</Option>
                             </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_smtp_domain"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2051" />}>
                                <span>{formatMessage({id: "LANG2050"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('smtp_domain', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="60" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_smtp_server"
                        className="hidden"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2053" />}>
                                <span>{formatMessage({id: "LANG2052"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('smtp_server', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="60" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_smtp_username"
                        className="hidden"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2054" />}>
                                <span>{formatMessage({id: "LANG72"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('smtp_username', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="60" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_smtp_password"
                        className="hidden"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2055" />}>
                                <span>{formatMessage({id: "LANG73"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('smtp_password', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="60" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_fromstring"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2255" />}>
                                <span>{formatMessage({id: "LANG2271"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('fromstring', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_serveremail"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2057" />}>
                                <span>{formatMessage({id: "LANG2056"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('serveremail', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="120" />
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

smtpSettings.propTypes = {
}

export default Form.create()(injectIntl(smtpSettings))
