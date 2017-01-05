'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class BasicSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            add_method: 'single',
            extension_type: 'sip'
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    _onChangeExtensionType = (value) => {
        if (value === 'fxs') {
            this.setState({
                add_method: 'single'
            })

            // setState for select does not work
            this.props.form.setFieldsValue({
                add_method: 'single'
            })
        }

        this.setState({
            extension_type: value
        })
    }
    _onChangeAddMethod = (value) => {
        this.setState({
            add_method: value
        })
    }
    _onFocus = (e) => {
        e.preventDefault()

        const form = this.props.form

        form.validateFields([e.target.id], { force: true })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const settings = this.props.settings || {}
        const current_mode = (this.props.currentMode === 'add')

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        return (
            <div className="content">
                <div className="ant-form">
                    <Row
                        className={ current_mode ? 'display-block' : 'hidden' }
                    >
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage
                                                            id="LANG5417"
                                                            defaultMessage="LANG5417"
                                                        /> }>
                                            <span>{ formatMessage({id: "LANG5417"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('extension_type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: this.state.extension_type
                                })(
                                    <Select onChange={ this._onChangeExtensionType }>
                                        <Option value='sip'>{ formatMessage({id: "LANG2927"}) }</Option>
                                        <Option value='iax'>{ formatMessage({id: "LANG2929"}) }</Option>
                                        <Option value='fxs'>{ formatMessage({id: "LANG2928"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row
                        className={ current_mode ? 'display-block' : 'hidden' }
                    >
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage
                                                            id="LANG5418"
                                                            defaultMessage="LANG5418"
                                                        /> }>
                                            <span>{ formatMessage({id: "LANG5418"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('add_method', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: this.state.add_method
                                })(
                                    <Select onChange={ this._onChangeAddMethod }>
                                        <Option value='single'>{ formatMessage({id: "LANG5420"}) }</Option>
                                        <Option
                                            value='batch'
                                            disabled={ this.state.extension_type === 'fxs' }
                                        >
                                            { formatMessage({id: "LANG5419"}) }
                                        </Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                className={ this.state.add_method === 'batch' ? 'display-block' : 'hidden' }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage
                                                            id="LANG1158"
                                                            defaultMessage="LANG1158"
                                                        /> }>
                                            <span>{ formatMessage({id: "LANG1157"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('batch_number', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.batch_number
                                })(
                                    <InputNumber min={ 1 } max={ 100 } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG625"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage
                                                            id="LANG1064"
                                                            defaultMessage="LANG1064"
                                                        /> }>
                                            <span>{ formatMessage({id: "LANG85"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('extension', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: this.state.add_method
                                })(
                                    <Select onChange={ this._onChangeAddMethod }>
                                        <Option value='single'>{ formatMessage({id: "LANG5420"}) }</Option>
                                        <Option
                                            value='batch'
                                            disabled={ this.state.extension_type === 'fxs' }
                                        >
                                            { formatMessage({id: "LANG5419"}) }
                                        </Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                className={ this.state.add_method === 'batch' ? 'display-block' : 'hidden' }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage
                                                            id="LANG1158"
                                                            defaultMessage="LANG1158"
                                                        /> }>
                                            <span>{ formatMessage({id: "LANG1157"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('batch_number', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.batch_number
                                })(
                                    <InputNumber min={ 1 } max={ 100 } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(BasicSettings)