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
import { Col, Form, Input, Icon, message, Row, Select, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class PresenceStatus extends Component {
    constructor(props) {
        super(props)

        let type = this.props.presenceStatusType
        let presenceSettings = this.props.presenceSettings || {}
        let obj = {
                settings: {}
            }

        _.map(presenceSettings, (data) => {
            if (data.presence_status === type) {
                obj.settings = data
            }
        })

        obj.type = type
        obj.destinationDataSource = this.props.destinationDataSource

        obj[`ps_${type}_cfu_type`] = obj.settings.cfu_destination_type ? obj.settings.cfu_destination_type : '0'
        obj[`ps_${type}_cfn_type`] = obj.settings.cfn_destination_type ? obj.settings.cfn_destination_type : '0'
        obj[`ps_${type}_cfb_type`] = obj.settings.cfb_destination_type ? obj.settings.cfb_destination_type : '0'

        this.state = obj
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    _onChangeCFUType = (value) => {
        let obj = {}
        let type = this.props.presenceStatusType

        obj[`ps_${type}_cfu_type`] = value

        this.setState(obj)
    }
    _onChangeCFNType = (value) => {
        let obj = {}
        let type = this.props.presenceStatusType

        obj[`ps_${type}_cfn_type`] = value

        this.setState(obj)
    }
    _onChangeCFBType = (value) => {
        let obj = {}
        let type = this.props.presenceStatusType

        obj[`ps_${type}_cfb_type`] = value

        this.setState(obj)
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, getFieldValue } = this.props.form

        let type = this.state.type
        let settings = this.state.settings
        let cfuType = this.state[`ps_${type}_cfu_type`]
        let cfnType = this.state[`ps_${type}_cfn_type`]
        let cfbType = this.state[`ps_${type}_cfb_type`]

        let desMap = {
            '0': 'none',
            '1': 'account',
            '2': 'external_number',
            '3': 'voicemail',
            '4': 'ringgroup',
            '5': 'queue',
            '6': 'vmgroup',
            '7': 'hangup'
        }

        let formItemLayout = {
                labelCol: { span: 8 },
                wrapperCol: { span: 12 }
            }

        return (
            <div className="custom-tabpanel-content">
                <Row>
                    <Col span={ 12 }>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1084" /> }>
                                        <span>{ formatMessage({id: "LANG1083"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            <Col span={ 11 }>
                                { getFieldDecorator(`ps_${type}_cfu_type`, {
                                    rules: [],
                                    initialValue: cfuType
                                })(
                                    <Select onChange={ this._onChangeCFUType }>
                                        <Option value='0'>{ formatMessage({id: "LANG133"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG85"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3458"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG20"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG600"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG91"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG89"}) }</Option>
                                        <Option value='7'>{ formatMessage({id: "LANG3007"}) }</Option>
                                    </Select>
                                ) }
                            </Col>
                            <Col
                                span={ 11 }
                                offset={ 1 }
                                className={ (cfuType !== '0' && cfuType !== '2' && cfuType !== '7') ? 'display-block' : 'hidden' }
                            >
                                { getFieldDecorator(`ps_${type}_cfu_value`, {
                                    rules: [],
                                    initialValue: settings.cfu
                                })(
                                    <Select>
                                        {
                                            this.state.destinationDataSource[desMap[cfuType]].map(function(obj) {
                                                return <Option
                                                            key={ obj.key }
                                                            value={ obj.value }
                                                            className={ obj.out_of_service === 'yes' ? 'out-of-service' : '' }>
                                                            { obj.label }
                                                        </Option>
                                            })
                                        }
                                    </Select>
                                ) }
                            </Col>
                            <Col
                                span={ 11 }
                                offset={ 1 }
                                className={ cfuType === '2' ? 'display-block' : 'hidden' }
                            >
                                { getFieldDecorator(`ps_${type}_cfu_external`, {
                                    rules: [],
                                    initialValue: settings.cfu
                                })(
                                    <Input />
                                ) }
                            </Col>
                        </FormItem>
                    </Col>
                    <Col span={ 12 }>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG3374" /> }>
                                        <span>{ formatMessage({id: "LANG3371"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator(`ps_${type}_cfu_timetype`, {
                                rules: [],
                                initialValue: settings.cfu_timetype ? settings.cfu_timetype + '' : '0'
                            })(
                                <Select>
                                    <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                    <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                    <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                    <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                    <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                    <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                    <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                </Select>
                            ) }
                        </FormItem>
                    </Col>
                    <Col span={ 12 }>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1086" /> }>
                                        <span>{ formatMessage({id: "LANG1085"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            <Col span={ 11 }>
                                { getFieldDecorator(`ps_${type}_cfn_type`, {
                                    rules: [],
                                    initialValue: cfnType
                                })(
                                    <Select onChange={ this._onChangeCFNType }>
                                        <Option value='0'>{ formatMessage({id: "LANG133"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG85"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3458"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG20"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG600"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG91"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG89"}) }</Option>
                                        <Option value='7'>{ formatMessage({id: "LANG3007"}) }</Option>
                                    </Select>
                                ) }
                            </Col>
                            <Col
                                span={ 11 }
                                offset={ 1 }
                                className={ (cfnType !== '0' && cfnType !== '2' && cfnType !== '7') ? 'display-block' : 'hidden' }
                            >
                                { getFieldDecorator(`ps_${type}_cfn_value`, {
                                    rules: [],
                                    initialValue: settings.cfn
                                })(
                                    <Select>
                                        {
                                            this.state.destinationDataSource[desMap[cfnType]].map(function(obj) {
                                                return <Option
                                                            key={ obj.key }
                                                            value={ obj.value }
                                                            className={ obj.out_of_service === 'yes' ? 'out-of-service' : '' }>
                                                            { obj.label }
                                                        </Option>
                                            })
                                        }
                                    </Select>
                                ) }
                            </Col>
                            <Col
                                span={ 11 }
                                offset={ 1 }
                                className={ cfnType === '2' ? 'display-block' : 'hidden' }
                            >
                                { getFieldDecorator(`ps_${type}_cfn_external`, {
                                    rules: [],
                                    initialValue: settings.cfn
                                })(
                                    <Input />
                                ) }
                            </Col>
                        </FormItem>
                    </Col>
                    <Col span={ 12 }>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG3375" /> }>
                                        <span>{ formatMessage({id: "LANG3372"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator(`ps_${type}_cfn_timetype`, {
                                rules: [],
                                initialValue: settings.cfn_timetype ? settings.cfn_timetype + '' : '0'
                            })(
                                <Select>
                                    <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                    <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                    <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                    <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                    <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                    <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                    <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                </Select>
                            ) }
                        </FormItem>
                    </Col>
                    <Col span={ 12 }>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1088" /> }>
                                        <span>{ formatMessage({id: "LANG1087"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            <Col span={ 11 }>
                                { getFieldDecorator(`ps_${type}_cfb_type`, {
                                    rules: [],
                                    initialValue: cfbType
                                })(
                                    <Select onChange={ this._onChangeCFBType }>
                                        <Option value='0'>{ formatMessage({id: "LANG133"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG85"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3458"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG20"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG600"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG91"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG89"}) }</Option>
                                        <Option value='7'>{ formatMessage({id: "LANG3007"}) }</Option>
                                    </Select>
                                ) }
                            </Col>
                            <Col
                                span={ 11 }
                                offset={ 1 }
                                className={ (cfbType !== '0' && cfbType !== '2' && cfbType !== '7') ? 'display-block' : 'hidden' }
                            >
                                { getFieldDecorator(`ps_${type}_cfb_value`, {
                                    rules: [],
                                    initialValue: settings.cfb
                                })(
                                    <Select>
                                        {
                                            this.state.destinationDataSource[desMap[cfbType]].map(function(obj) {
                                                return <Option
                                                            key={ obj.key }
                                                            value={ obj.value }
                                                            className={ obj.out_of_service === 'yes' ? 'out-of-service' : '' }>
                                                            { obj.label }
                                                        </Option>
                                            })
                                        }
                                    </Select>
                                ) }
                            </Col>
                            <Col
                                span={ 11 }
                                offset={ 1 }
                                className={ cfbType === '2' ? 'display-block' : 'hidden' }
                            >
                                { getFieldDecorator(`ps_${type}_cfb_external`, {
                                    rules: [],
                                    initialValue: settings.cfb
                                })(
                                    <Input />
                                ) }
                            </Col>
                        </FormItem>
                    </Col>
                    <Col span={ 12 }>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG3376" /> }>
                                        <span>{ formatMessage({id: "LANG3373"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator(`ps_${type}_cfb_timetype`, {
                                rules: [],
                                initialValue: settings.cfb_timetype ? settings.cfb_timetype + '' : '0'
                            })(
                                <Select>
                                    <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                    <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                    <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                    <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                    <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                    <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                    <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                </Select>
                            ) }
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default injectIntl(PresenceStatus)