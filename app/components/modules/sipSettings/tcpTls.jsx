'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import _ from 'underscore'

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
    const sipTcpSettings = props.dataSource
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    }

    return (
        <Form>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1854" />}>
                            {formatMessage({id: "LANG1853"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tcpenable', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: sipTcpSettings.tcpenable === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1854" />}>
                            {formatMessage({id: "LANG1851"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tcpbindaddr', {
                    rules: [],
                    initialValue: sipTcpSettings.tcpbindaddr
                })(
                    <Input type="text" maxLength="127" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG5126" />}>
                            {formatMessage({id: "LANG5125"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tcpbindaddr6', {
                    rules: [],
                    initialValue: sipTcpSettings.tcpbindaddr6
                })(
                    <Input type="text" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1867" />}>
                            {formatMessage({id: "LANG1868"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsenable', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: sipTcpSettings.tlsenable === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1855" />}>
                            {formatMessage({id: "LANG5204"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsbindaddr', {
                    rules: [],
                    initialValue: sipTcpSettings.tlsbindaddr
                })(
                    <Input type="text" maxLength="127" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG5128" />}>
                            {formatMessage({id: "LANG5127"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsbindaddr6', {
                    rules: [],
                    initialValue: sipTcpSettings.tlsbindaddr6
                })(
                    <Input type="text" maxLength="127" />
                )}
            </FormItem>
            <FormItem
                className="hidden"
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1865" />}>
                            {formatMessage({id: "LANG1866"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsclientmethod', {
                    rules: [],
                    initialValue: sipTcpSettings.tlsclientmethod
                })(
                    <Select defaultValue="tlsv1" style={{ width: 200 }}>
                        <Option value="tlsv1">TLSv1</Option>
                        <Option value="sslv3">SSLv3</Option>
                        <Option value="sslv2">SSLv2</Option>
                    </Select>
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={<FormattedHTMLMessage id="LANG1869" />}>
                            {formatMessage({id: "LANG1870"})}
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsdontverifyserver', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: sipTcpSettings.tlsdontverifyserver === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
        </Form>
    )
}))

class TcpTls extends Component {
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
        let sipTcpSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={sipTcpSettings} />
            </div>
        )
    }
}

TcpTls.propTypes = {
}

export default injectIntl(TcpTls)