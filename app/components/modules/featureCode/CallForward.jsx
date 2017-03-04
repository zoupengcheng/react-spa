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
import { Checkbox, Col, Form, Input, message, Row, Select, Transfer, Tooltip, Button } from 'antd'

let firstGetSettings = false

const FormItem = Form.Item
const Option = Select.Option

class CallForward extends Component {
    constructor(props) {
        super(props)

        const callForward = this.props.dataSource || {}

        this.state = {
            enable_fcode_dnd_on: callForward.enable_fcode_dnd_on === 'yes',
            enable_fcode_dnd_off: callForward.enable_fcode_dnd_off === 'yes',
            enable_fcode_cfb_on: callForward.enable_fcode_cfb_on === 'yes',
            enable_fcode_cfb_off: callForward.enable_fcode_cfb_off === 'yes',
            enable_fcode_cfn_on: callForward.enable_fcode_cfn_on === 'yes',
            enable_fcode_cfn_off: callForward.enable_fcode_cfn_off === 'yes',
            enable_fcode_cfu_on: callForward.enable_fcode_cfu_on === 'yes',
            enable_fcode_cfu_off: callForward.enable_fcode_cfu_off === 'yes'
        }
    }
    _onChangeEnable = (e) => {
        this.setState({
            [e.target.id]: e.target.checked
        })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const callForward = this.props.dataSource || {}
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 10 }
        }

        return (
            <div className="content">
                <div className="top-button">
                    <Button type="primary">{ formatMessage({id: "LANG751"}) }</Button>
                    <Button type="primary">{ formatMessage({id: "LANG749"}) }</Button>
                </div>
                <div className="ant-form">
                    <Row>
                        <Col span={ 6 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1239" /> }>
                                            <span>{ formatMessage({id: "LANG1238"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_dnd_on', {
                                    initialValue: callForward.fcode_dnd_on
                                })(
                                    <Input disabled={ !this.state.enable_fcode_dnd_on } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_dnd_on', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_dnd_on
                                })(
                                    <Checkbox onChange={ this._onChangeEnable } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1241" /> }>
                                            <span>{ formatMessage({id: "LANG1240"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_dnd_off', {
                                    initialValue: callForward.fcode_dnd_off
                                })(
                                    <Input disabled={ !this.state.enable_fcode_dnd_off } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_dnd_off', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_dnd_off
                                })(
                                    <Checkbox onChange={ this._onChangeEnable } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 6 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1221" /> }>
                                            <span>{ formatMessage({id: "LANG1220"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_cfb_on', {
                                    initialValue: callForward.fcode_cfb_on
                                })(
                                    <Input disabled={ !this.state.enable_fcode_cfb_on } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_cfb_on', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_cfb_on
                                })(
                                    <Checkbox onChange={ this._onChangeEnable } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1223" /> }>
                                            <span>{ formatMessage({id: "LANG1222"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_cfb_off', {
                                    initialValue: callForward.fcode_cfb_off
                                })(
                                    <Input disabled={ !this.state.enable_fcode_cfb_off } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_cfb_off', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_cfb_off
                                })(
                                    <Checkbox onChange={ this._onChangeEnable } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 6 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1225" /> }>
                                            <span>{ formatMessage({id: "LANG1224"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_cfn_on', {
                                    initialValue: callForward.fcode_cfn_on
                                })(
                                    <Input disabled={ !this.state.enable_fcode_cfn_on } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_cfn_on', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_cfn_on
                                })(
                                    <Checkbox onChange={ this._onChangeEnable } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1227" /> }>
                                            <span>{ formatMessage({id: "LANG1226"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_cfn_off', {
                                    initialValue: callForward.fcode_cfn_off
                                })(
                                    <Input disabled={ !this.state.enable_fcode_cfn_off } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_cfn_off', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_cfn_off
                                })(
                                    <Checkbox onChange={ this._onChangeEnable } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 6 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1229" /> }>
                                            <span>{ formatMessage({id: "LANG1228"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_cfu_on', {
                                    initialValue: callForward.fcode_cfu_on
                                })(
                                    <Input disabled={ !this.state.enable_fcode_cfu_on } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_cfu_on', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_cfu_on
                                })(
                                    <Checkbox onChange={ this._onChangeEnable } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1231" /> }>
                                            <span>{ formatMessage({id: "LANG1230"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_cfu_off', {
                                    initialValue: callForward.fcode_cfu_off
                                })(
                                    <Input disabled={ !this.state.enable_fcode_cfu_off } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_cfu_off', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_cfu_off
                                })(
                                    <Checkbox onChange={ this._onChangeEnable } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(CallForward)