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
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip, Button, Modal } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class FeatureCode extends Component {
    constructor(props) {
        super(props)

        const featureCodes = this.props.dataSource || {}
        const featureSettings = this.props.featureSettings || {}

        this.state = {
            enable_fcode_dialvm: featureCodes.enable_fcode_dialvm === 'yes',
            enable_fcode_vmmain: featureCodes.enable_fcode_vmmain === 'yes',
            enable_fcode_agentpause: featureCodes.enable_fcode_agentpause === 'yes',
            enable_fcode_agentunpause: featureCodes.enable_fcode_agentunpause === 'yes',
            enable_fcode_paging_prefix: featureCodes.enable_fcode_paging_prefix === 'yes',
            enable_fcode_intercom_prefix: featureCodes.enable_fcode_intercom_prefix === 'yes',
            enable_fcode_blacklist_add: featureCodes.enable_fcode_blacklist_add === 'yes',
            enable_fcode_blacklist_remove: featureCodes.enable_fcode_blacklist_remove === 'yes',
            enable_fcode_pickup: featureCodes.enable_fcode_pickup === 'yes',
            enable_number_seamless_transfer: featureCodes.enable_number_seamless_transfer === 'yes',
            enable_fgeneral_pickupexten: featureCodes.enable_fgeneral_pickupexten === 'yes',
            enable_fcode_direct_vm: featureCodes.enable_fcode_direct_vm === 'yes',
            enable_fcode_direct_phonenumber: featureCodes.enable_fcode_direct_phonenumber === 'yes',
            enable_fcode_cc_request: featureCodes.enable_fcode_cc_request === 'yes',
            enable_fcode_cc_cancel: featureCodes.enable_fcode_cc_cancel === 'yes',
            enable_fcode_ucm_wakeup: featureCodes.enable_fcode_ucm_wakeup === 'yes',
            enable_fcode_wakeup: featureCodes.enable_fcode_wakeup === 'yes',
            enable_fcode_pms_status: featureCodes.enable_fcode_pms_status === 'yes',
            barge_enable: featureSettings.barge_enable === 'yes',
            enable_inboud_multi_mode: featureCodes.enable_inboud_multi_mode === 'yes'
        }
    }
    componentWillMount() {
    }
    _onChangeEnable = (e) => {
        this.setState({
            [e.target.id]: e.target.checked
        })
    }
    _onChangeBargeEnable = (e) => {
        const {formatMessage} = this.props.intl,
            self = this

        this.setState({
            barge_enable: e.target.checked
        })

        if (e.target.checked) {
            Modal.confirm({
                title: formatMessage({ id: "LANG543" }),
                content: formatMessage({
                    id: "LANG4020"
                }, {
                    0: formatMessage({ id: "LANG4018" }), 
                    1: formatMessage({ id: "LANG727" })
                }),
                okText: formatMessage({ id: "LANG727" }),
                cancelText: formatMessage({ id: "LANG726" }),
                onOk() {
                    self.props.form.setFieldsValue({
                        barge_enable: true
                    })
                    self.setState({
                        barge_enable: true
                    })
                },
                onCancel() {
                    self.props.form.setFieldsValue({
                        barge_enable: false
                    })
                    self.setState({
                        barge_enable: false
                    })
                }
            })
        }
    }
    _onChangeEnableInboud = (e) => {
        const {formatMessage} = this.props.intl,
            self = this

        this.setState({
            enable_inboud_multi_mode: e.target.checked
        })

        if (!e.target.checked) {
            Modal.confirm({
                title: formatMessage({ id: "LANG543" }),
                content: formatMessage({ id: "LANG4301" }),
                okText: formatMessage({ id: "LANG727" }),
                cancelText: formatMessage({ id: "LANG726" }),
                onOk() {
                    self.props.form.setFieldsValue({
                        enable_inboud_multi_mode: false
                    })
                    self.setState({
                        enable_inboud_multi_mode: false
                    })
                },
                onCancel() {
                    self.props.form.setFieldsValue({
                        enable_inboud_multi_mode: true
                    })
                    self.setState({
                        enable_inboud_multi_mode: true
                    })
                }
            })
        }
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const featureCodes = this.props.dataSource || {}
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 10 }
        }
        const formItemLayoutDefault = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1233" /> }>
                                            <span>{ formatMessage({id: "LANG1232"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_dialvm', {
                                    initialValue: featureCodes.fcode_dialvm
                                })(
                                    <Input disabled={ !this.state.enable_fcode_dialvm } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_dialvm', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_dialvm
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1252" /> }>
                                            <span>{ formatMessage({id: "LANG1253"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_vmmain', {
                                    initialValue: featureCodes.fcode_vmmain
                                })(
                                    <Input disabled={ !this.state.enable_fcode_vmmain } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_vmmain', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_vmmain
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1205" /> }>
                                            <span>{ formatMessage({id: "LANG1204"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_agentpause', {
                                    initialValue: featureCodes.fcode_agentpause
                                })(
                                    <Input disabled={ !this.state.enable_fcode_agentpause } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_agentpause', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_agentpause
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1207" /> }>
                                            <span>{ formatMessage({id: "LANG1206"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_agentunpause', {
                                    initialValue: featureCodes.fcode_agentunpause
                                })(
                                    <Input disabled={ !this.state.enable_fcode_agentunpause } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_agentunpause', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_agentunpause
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1249" /> }>
                                            <span>{ formatMessage({id: "LANG1248"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_paging_prefix', {
                                    initialValue: featureCodes.fcode_paging_prefix
                                })(
                                    <Input disabled={ !this.state.enable_fcode_paging_prefix } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_paging_prefix', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_paging_prefix
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1247" /> }>
                                            <span>{ formatMessage({id: "LANG1246"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_intercom_prefix', {
                                    initialValue: featureCodes.fcode_intercom_prefix
                                })(
                                    <Input disabled={ !this.state.enable_fcode_intercom_prefix } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_intercom_prefix', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_intercom_prefix
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2286" /> }>
                                            <span>{ formatMessage({id: "LANG2282"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_blacklist_add', {
                                    initialValue: featureCodes.fcode_blacklist_add
                                })(
                                    <Input disabled={ !this.state.enable_fcode_blacklist_add } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_blacklist_add', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_blacklist_add
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2284" /> }>
                                            <span>{ formatMessage({id: "LANG2281"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_blacklist_remove', {
                                    initialValue: featureCodes.fcode_blacklist_remove
                                })(
                                    <Input disabled={ !this.state.enable_fcode_blacklist_remove } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_blacklist_remove', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_blacklist_remove
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1219" /> }>
                                            <span>{ formatMessage({id: "LANG1218"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_pickup', {
                                    initialValue: featureCodes.fcode_pickup
                                })(
                                    <Input disabled={ !this.state.enable_fcode_pickup } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_pickup', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_pickup
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5156" /> }>
                                            <span>{ formatMessage({id: "LANG5154"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('number_seamless_transfer', {
                                    initialValue: featureCodes.number_seamless_transfer
                                })(
                                    <Input disabled={ !this.state.enable_number_seamless_transfer } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_number_seamless_transfer', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_number_seamless_transfer
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2517" /> }>
                                            <span>{ formatMessage({id: "LANG2516"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fgeneral_pickupexten', {
                                    initialValue: featureCodes.fgeneral_pickupexten
                                })(
                                    <Input disabled={ !this.state.enable_fgeneral_pickupexten } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fgeneral_pickupexten', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fgeneral_pickupexten
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2639" /> }>
                                            <span>{ formatMessage({id: "LANG2638"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_direct_vm', {
                                    initialValue: featureCodes.fcode_direct_vm
                                })(
                                    <Input disabled={ !this.state.enable_fcode_direct_vm } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_direct_vm', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_direct_vm
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5096" /> }>
                                            <span>{ formatMessage({id: "LANG5095"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_direct_phonenumber', {
                                    initialValue: featureCodes.fcode_direct_phonenumber
                                })(
                                    <Input disabled={ !this.state.enable_fcode_direct_phonenumber } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_direct_phonenumber', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_direct_phonenumber
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3722" /> }>
                                            <span>{ formatMessage({id: "LANG3721"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_cc_request', {
                                    initialValue: featureCodes.fcode_cc_request
                                })(
                                    <Input disabled={ !this.state.enable_fcode_cc_request } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_cc_request', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_cc_request
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3724" /> }>
                                            <span>{ formatMessage({id: "LANG3723"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_cc_cancel', {
                                    initialValue: featureCodes.fcode_cc_cancel
                                })(
                                    <Input disabled={ !this.state.enable_fcode_cc_cancel } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_cc_cancel', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_cc_cancel
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4019" /> }>
                                            <span>{ formatMessage({id: "LANG4018"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('barge_enable', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.barge_enable
                                })(
                                    <Checkbox onChange={ this._onChangeBargeEnable } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayoutDefault }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4013" /> }>
                                            <span>{ formatMessage({id: "LANG4012"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_barge_listen', {
                                    initialValue: featureCodes.fcode_barge_listen
                                })(
                                    <Input disabled={ !this.state.barge_enable } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayoutDefault }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4015" /> }>
                                            <span>{ formatMessage({id: "LANG4014"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_barge_whisper', {
                                    initialValue: featureCodes.fcode_barge_whisper
                                })(
                                    <Input disabled={ !this.state.barge_enable } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayoutDefault }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4017" /> }>
                                            <span>{ formatMessage({id: "LANG4016"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_barge_barge', {
                                    initialValue: featureCodes.fcode_barge_barge
                                })(
                                    <Input disabled={ !this.state.barge_enable } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayoutDefault }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4298" /> }>
                                            <span>{ formatMessage({id: "LANG4295"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('enable_inboud_multi_mode', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_inboud_multi_mode
                                })(
                                    <Checkbox onChange={ this._onChangeEnableInboud } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayoutDefault }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4542" /> }>
                                            <span>{ formatMessage({id: "LANG4541"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('inbound_mode', {
                                    initialValue: featureCodes.inbound_mode || '0'
                                })(
                                    <Select disabled={ !this.state.enable_inboud_multi_mode }>
                                        <Option value="0">{ formatMessage({id: "LANG3940"}) }</Option>
                                        <Option value="1">{ formatMessage({id: "LANG4540"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayoutDefault }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4299" /> }>
                                            <span>{ formatMessage({id: "LANG4296"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_inbound_mode_zero', {
                                    initialValue: featureCodes.fcode_inbound_mode_zero
                                })(
                                    <Input disabled={ !this.state.enable_inboud_multi_mode } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayoutDefault }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4300" /> }>
                                            <span>{ formatMessage({id: "LANG4297"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_inbound_mode_one', {
                                    initialValue: featureCodes.fcode_inbound_mode_one
                                })(
                                    <Input disabled={ !this.state.enable_inboud_multi_mode } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5202" /> }>
                                            <span>{ formatMessage({id: "LANG4858"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_ucm_wakeup', {
                                    initialValue: featureCodes.fcode_ucm_wakeup
                                })(
                                    <Input disabled={ !this.state.enable_fcode_ucm_wakeup } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_ucm_wakeup', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_ucm_wakeup
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5165" /> }>
                                            <span>{ formatMessage({id: "LANG5166"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_wakeup', {
                                    initialValue: featureCodes.fcode_wakeup
                                })(
                                    <Input disabled={ !this.state.enable_fcode_wakeup } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_wakeup', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_wakeup
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4924" /> }>
                                            <span>{ formatMessage({id: "LANG4885"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('fcode_pms_status', {
                                    initialValue: featureCodes.fcode_pms_status
                                })(
                                    <Input disabled={ !this.state.enable_fcode_pms_status } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('enable_fcode_pms_status', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_fcode_pms_status
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

export default injectIntl(FeatureCode)