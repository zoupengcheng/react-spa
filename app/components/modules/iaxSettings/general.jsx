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
    const IAXGenSettings = props.dataSource
    const mohNameList = props.datamohNameList
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
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1628" /> }>
                            <span>{ formatMessage({id: "LANG1627"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('bindport', {
                    rules: [{ 
                        type: "integer",
                        message: formatMessage({id: "LANG2150"}) 
                    }],
                    initialValue: IAXGenSettings.bindport
                })(
                    <InputNumber min={1} max={65535} maxLength="6" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1626" /> }>
                            <span>{ formatMessage({id: "LANG1625"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('bindaddr', {
                    rules: [{
                            message: formatMessage({id: "LANG2150"})
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.ipAddress(data, value, callback, formatMessage)
                            }
                        }],
                    initialValue: IAXGenSettings.bindaddr
                })(
                    <Input maxLength="40" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG5124" /> }>
                            <span>{ formatMessage({id: "LANG5123"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('bindaddr6', {
                    rules: [{ 
                            message: formatMessage({id: "LANG2150"})
                        }, { 
                            validator: (data, value, callback) => {
                                Validator.ipv6(data, value, callback, formatMessage)
                            }
                        }],
                    initialValue: IAXGenSettings.bindaddr6
                })(
                    <Input maxLength="44" />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1632" /> }>
                            <span>{ formatMessage({id: "LANG1631"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('iaxcompat', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: IAXGenSettings.iaxcompat === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1639" /> }>
                            <span>{ formatMessage({id: "LANG1638"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('nochecksums', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: IAXGenSettings.nochecksums === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1630" /> }>
                            <span>{ formatMessage({id: "LANG1629"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('delayreject', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: IAXGenSettings.delayreject === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1622" /> }>
                            <span>ADSI:</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('adsi', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: IAXGenSettings.adsi === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1635" /> }>
                            <span>{ formatMessage({id: "LANG1634"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('mohinterpret', {
                    initialValue: IAXGenSettings.mohinterpret
                })(
                    <Select>
                        {
                            mohNameList.map(function(value, index) {
                                return <Option value={ value } key={ index }>{ value }</Option>
                            })
                        }
                    </Select>
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1635" /> }>
                            <span>{ formatMessage({id: "LANG1634"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('mohsuggest', {
                    initialValue: IAXGenSettings.mohsuggest
                })(
                    <Select>
                        {
                            mohNameList.map(function(value, index) {
                                return <Option value={ value } key={ index }>{ value }</Option>
                            })
                        }
                    </Select>
                ) }
            </FormItem>
            <div className="hidden">
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ <FormattedHTMLMessage id="LANG1633" /> }>
                                <span>{ formatMessage({id: "LANG1458"}) }</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('language', {
                        initialValue: IAXGenSettings.language
                    })(
                        <Select>
                            {

                            }
                        </Select>
                    ) }
                </FormItem>
            </div>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1624" /> }>
                            <span>{ formatMessage({id: "LANG1623"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('bandwidth', {
                    rules: [],
                    initialValue: IAXGenSettings.bandwidth
                })(
                    <Select style={{ width: 200 }}>
                        <Option value='low'>{formatMessage({id: "LANG1640"})}</Option>
                        <Option value='medium'>{formatMessage({id: "LANG1641"})}</Option>
                        <Option value='high'>{formatMessage({id: "LANG1642"})}</Option>
                    </Select>
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
        let IAXGenSettings = this.props.dataSource
        let mohNameList = this.props.datamohNameList

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={IAXGenSettings} datamohNameList={mohNameList} />
            </div>
        )
    }
}

General.propTypes = {
}

export default injectIntl(General)
