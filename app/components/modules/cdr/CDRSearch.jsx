'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Input, Select, DatePicker, Button, Row, Col, Checkbox, Tooltip, Icon, message } from 'antd'
import { FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Validator from "../../api/validator"
import _ from 'underscore'

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

class CDRSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            actionTypeList: [],
            accountCodes: [],
            all_trunks: []
        }
    }
    componentDidMount () {
        this._loadDatas()
    }
    _loadDatas =() => {
        var actionTypeList = [],
            accountCodes = [],
            all_trunks = [],
            voip_trunks = [],
            analog_trunks = [],
            digital_trunks = []

        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'getCDRActionTypeList'
            },
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var list = data.response.action_type

                if (list && list.length > 0) {
                    actionTypeList = list
                }
            }
        })

        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'getAccountCodeList'
            },
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var list = data.response.accountcode

                if (list && list.length > 0) {
                    accountCodes = list
                }
            }
        })

        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'listVoIPTrunk',
                'page': 1,
                'item_num': 1000000,
                'sord': 'asc',
                'sidx': 'trunk_name'
            },
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var list = data.response.voip_trunk

                if (list && list.length > 0) {
                    voip_trunks = list
                }
            }
        })

        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'listAnalogTrunk',
                'page': 1,
                'item_num': 1000000,
                'sord': 'asc',
                'sidx': 'trunk_name'
            },
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var list = data.response.analogtrunk

                if (list && list.length > 0) {
                    analog_trunks = list
                }
            }
        })

        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'listDigitalTrunk',
                'page': 1,
                'item_num': 1000000,
                'sord': 'asc',
                'sidx': 'trunk_name'
            },
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var list = data.response.digital_trunks

                if (list && list.length > 0) {
                    digital_trunks = list
                }
            }
        })

        all_trunks = voip_trunks.concat(analog_trunks, digital_trunks)

        this.setState({
            actionTypeList: actionTypeList,
            accountCodes: accountCodes,
            all_trunks: all_trunks
        })
    }
    validateCallerNumFormate(rule, value, callback) {
        if (/^[0-9+]*x*.{0,1}$/i.test(value)) {
            callback()
        } else {
            callback('no match')
        }
    }
    render() {
        const { formatMessage, formatHTMLMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }
        const formItemLayoutCheckGroup = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
        }

        const callTypeOptions = [
            {label: formatMessage({id: "LANG193"}), value: 'Inbound'},
            {label: formatMessage({id: "LANG194"}), value: 'Outbound'},
            {label: formatMessage({id: "LANG195"}), value: 'Internal'},
            {label: formatMessage({id: "LANG196"}), value: 'External'}
        ]
        const statusOptions = [
            {label: formatMessage({id: "LANG4863"}), value: 'ANSWERED'},
            {label: formatMessage({id: "LANG4864"}), value: 'NO ANSWER'},
            {label: formatMessage({id: "LANG2237"}), value: 'BUSY'},
            {label: formatMessage({id: "LANG2405"}), value: 'FAILED'}
        ]

        const actionTypeList = this.state.actionTypeList,
              accountCodes = this.state.accountCodes,
              all_trunks = this.state.all_trunks

        return (
            <div className="content">
                <Form id="cdr-form" className={ this.props.isDisplaySearch }>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={formatMessage({id: "LANG1048"})} >
                                        <span>{formatMessage({id: "LANG1048"})}</span>
                                    </Tooltip>
                                )}
                            >
                                {getFieldDecorator('fromtime')(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1049" />}>
                                        <span>{formatMessage({id: "LANG1049"})}</span>
                                    </Tooltip>
                                )}
                            >
                                {getFieldDecorator('totime')(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG4021" />}>
                                        <span>{formatMessage({id: "LANG2216"})}</span>
                                    </Tooltip>
                                )}
                            >
                                {getFieldDecorator('src')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={formatMessage({id: "LANG2234"})}>
                                        <span>{formatMessage({id: "LANG2234"})}</span>
                                    </Tooltip>
                                )}
                            >
                                {getFieldDecorator('caller_name')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={formatMessage({id: "LANG2793"})}>
                                        <span>{formatMessage({id: "LANG2793"})}</span>
                                    </Tooltip>
                                )}
                            >
                                {getFieldDecorator('dst')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={formatMessage({id: "LANG4569"})}>
                                        <span>{formatMessage({id: "LANG4569"})}</span>
                                    </Tooltip>
                                )}
                            >
                                {getFieldDecorator('accountcode')(
                                    <Select multiple>
                                        {
                                            accountCodes.map(function(value, index) {
                                                return <Option value={ value } key={ index }>{ value }</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={formatMessage({id: "LANG5132"})}>
                                        <span>{formatMessage({id: "LANG5132"})}</span>
                                    </Tooltip>
                                )}
                            >
                                {getFieldDecorator('src_trunk_name')(
                                    <Select multiple>
                                        {
                                            all_trunks.map(function(value, index) {
                                                return <Option value={ 'trunk_' + value.trunk_index } key={ index }>{ value.trunk_name }</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={formatMessage({id: "LANG5133"})}>
                                        <span>{formatMessage({id: "LANG5133"})}</span>
                                    </Tooltip>
                                )}
                            >
                                {getFieldDecorator('dst_trunk_name')(
                                    <Select multiple>
                                        {
                                            all_trunks.map(function(value, index) {
                                                return <Option value={ 'trunk_' + value.trunk_index } key={ index }>{ value.trunk_name }</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={formatMessage({id: "LANG5134"})}>
                                        <span>{formatMessage({id: "LANG5134"})}</span>
                                    </Tooltip>
                                )}
                            >
                                {getFieldDecorator('action_type')(
                                    <Select multiple>
                                        {
                                            actionTypeList.map(function(value, index) {
                                                return <Option value={ value} key={ index }>{ value }</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        { ...formItemLayoutCheckGroup }
                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG4783" />}>
                                <span>{formatMessage({id: "LANG2235"})}</span>
                            </Tooltip>
                        )}
                    >
                        {getFieldDecorator('userfield')(
                            <CheckboxGroup options={callTypeOptions} />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayoutCheckGroup }
                        label={(
                            <Tooltip title={formatMessage({id: "LANG186"})}>
                                <span>{formatMessage({id: "LANG186"})}</span>
                            </Tooltip>
                        )}
                    >
                        {getFieldDecorator('disposition')(
                            <CheckboxGroup options={statusOptions} />
                        )}
                    </FormItem>
                    <div className="hide_search sprite sprite-slide-bar" onClick={ this.props._hideSearch }></div>
                </Form>
            </div>
        )
    }
}

export default injectIntl(CDRSearch)