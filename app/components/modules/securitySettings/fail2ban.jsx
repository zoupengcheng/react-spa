'use strict'

import $ from 'jquery'
import api from "../../api/api"
import _ from 'underscore'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Tooltip, Button, message, Modal, Popconfirm, Checkbox, Table, Tag, Form, Row, Col, Input, InputNumber, Icon, BackTop } from 'antd'

const confirm = Modal.confirm
const FormItem = Form.Item

class DynamicDefense extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fail2banlist: [],
            fail2ban: {},
            fail2ban_enable: '',
            ignoreip_list: [],
            numList: [2, 3, 4, 5]
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _edit = (record) => {

    }
    _delete = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteFax",
                "fax": record.extension
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitData()
                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        let fail2ban = this.state.fail2ban
        let fail2ban_enable = this.state.fail2ban_enable
        let fail2banlist = this.state.fail2banlist
        let ignoreip_list = this.state.ignoreip_list

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getFail2ban'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    fail2ban = response.fail2ban || []
                    fail2ban_enable = response.fail2ban_enable
                    if (fail2ban.ignoreip2 != null) {
                        ignoreip_list.push('ignoreip2')
                    }
                    if (fail2ban.ignoreip3 != null) {
                        ignoreip_list.push('ignoreip3')
                    }
                    if (fail2ban.ignoreip4 != null) {
                        ignoreip_list.push('ignoreip4')
                    }
                    if (fail2ban.ignoreip5 !== null) {
                        ignoreip_list.push('ignoreip5')
                    }
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getFail2banList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    fail2banlist = response.fail2banlist || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        this.setState({
            fail2ban: fail2ban,
            fail2ban_enable: fail2ban_enable,
            fail2banlist: fail2banlist,
            ignoreip_list: ignoreip_list
        })
    }
    _onChangeEnable = (e) => {
        let fail2ban_enable = this.state.fail2ban_enable
        if (e.target.checked) {
            fail2ban_enable = '1'
        } else {
            fail2ban_enable = '0'
        }
        this.setState({
            fail2ban_enable: fail2ban_enable
        })
    }
    _onChangeEnableAsterisk = (e) => {
        let fail2ban = this.state.fail2ban
        if (e.target.checked) {
            fail2ban.enable = 'yes'
        } else {
            fail2ban.enable = 'no'
        }
        this.setState({
            fail2ban: fail2ban
        })
    }
    _removeIP = (num) => {
        let fail2ban = this.state.fail2ban
        fail2ban[`ignoreip${num}`] = null
        let tmp_numList = _.without(this.state.numList, num)
        tmp_numList.push(num)
        this.setState({
            fail2ban: fail2ban,
            numList: tmp_numList
        })
    }
    _addIP = () => {
        const { formatMessage } = this.props.intl
        let fail2ban = this.state.fail2ban
        let numList = this.state.numList
        if (this.state.fail2ban_enable === '1') {
            let n_index = 0
            numList.map(function(item, index) {
                if (fail2ban[`ignoreip${item}`] !== null) {
                    n_index = index + 1
                }
            })
            if (n_index === 4) {
                Modal.warning({
                    content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG2623"})}} ></span>,
                    okText: (formatMessage({id: "LANG727"}))
                })
            } else {
                fail2ban[`ignoreip${numList[n_index]}`] = ''
                this.setState({
                    fail2ban: fail2ban
                })
            }
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const dynamicDefense = this.state.dynamicDefense
        const numList = this.state.numList
        const columns = [{
                key: 'bandType',
                dataIndex: 'bandType',
                title: formatMessage({id: "LANG4813"}),
                sorter: (a, b) => a.bandType.length - b.bandType.length
            }, {
                key: 'blacklist',
                dataIndex: 'blacklist',
                title: formatMessage({id: "LANG2293"}),
                sorter: (a, b) => a.blacklist.length - b.blacklist.length
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG1958"}),
                render: (text, record, index) => {
                    return <div>
                            <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._delete.bind(this, record) }
                            >
                                <span className="sprite sprite-del" title={ formatMessage({id: "LANG739"}) }></span>
                            </Popconfirm>
                        </div>
                }
            }]
        const pagination = {
                total: this.state.fail2banlist.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }
        
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG2600"})
                })
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }
        const formItemWithoutLabelLayout = {
            wrapperCol: { span: 6, offset: 4 }
        }
        const fail2ban = this.state.fail2ban
        const allDisable = this.state.fail2ban_enable === '0'
        const asteriskDisable = allDisable === true || fail2ban.enable === 'no'
        return (
            <div className="app-content-main">
                <div className="content">
                    <div className='section-title section-title-specail'>
                        <span>
                            { formatMessage({id: "LANG2601" })}
                        </span>
                    </div>
                    <Form>
                        <FormItem
                            ref="div_fail2ban_enable"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2605" />}>
                                    <span>{formatMessage({id: "LANG2604"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('fail2ban_enable', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.fail2ban_enable === '1'
                            })(
                                <Checkbox onChange={ this._onChangeEnable } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_bantime"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2611" />}>
                                    <span>{formatMessage({id: "LANG2610"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('bantime', {
                                rules: [],
                                initialValue: fail2ban.bantime ? fail2ban.bantime : 600
                            })(
                                <InputNumber min={ 0 } max={ 999999999999 } disabled={ allDisable } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_findtime"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2613" />}>
                                    <span>{formatMessage({id: "LANG2612"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('findtime', {
                                rules: [],
                                initialValue: fail2ban.findtime ? fail2ban.findtime : 600
                            })(
                                <InputNumber min={ 1 } max={ 999999999999 } disabled={ allDisable } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_maxretry"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2296" />}>
                                    <span>{formatMessage({id: "LANG2300"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('maxretry', {
                                rules: [],
                                initialValue: fail2ban.maxretry ? fail2ban.maxretry : 1
                            })(
                                <InputNumber min={ 1 } max={ 999999999999 } disabled={ allDisable } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_ignoreipTable"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2617" />}>
                                    <span>{formatMessage({id: "LANG2616"})}</span>
                                </Tooltip>
                            )}>
                            <Col span={ 16 }>
                                { getFieldDecorator('ignoreip1', {
                                    rules: [],
                                    initialValue: fail2ban.ignoreip1 ? fail2ban.ignoreip1 : ''
                                })(
                                    <Input disabled={ allDisable } />
                                ) }
                            </Col>
                            <Col span={ 1 } offset={ 1 }>
                                <Icon
                                    className="dynamic-plus-button"
                                    type="plus-circle-o"
                                    onClick={ this._addIP }
                                />
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemWithoutLabelLayout }
                            className= { fail2ban[`ignoreip${numList[0]}`] !== undefined && fail2ban[`ignoreip${numList[0]}`] !== null ? 'display-block' : 'hidden'}
                        >
                            <Col span={ 16 }>
                                { getFieldDecorator(`ignoreip${numList[0]}`, {
                                    rules: [{
                                            required: fail2ban[`ignoreip${numList[0]}`] !== undefined && fail2ban[`ignoreip${numList[0]}`] !== null,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                    initialValue: fail2ban[`ignoreip${numList[0]}`] ? fail2ban[`ignoreip${numList[0]}`] : ''
                                })(
                                    <Input disabled={ allDisable } />
                                ) }
                            </Col>
                            <Col span={ 1 } offset={ 1 }>
                                <Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    onClick={ this._removeIP.bind(this, parseInt(numList[0])) }
                                />
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemWithoutLabelLayout }
                            className= { fail2ban[`ignoreip${numList[1]}`] !== undefined && fail2ban[`ignoreip${numList[1]}`] !== null ? 'display-block' : 'hidden'}
                        >
                            <Col span={ 16 }>
                                { getFieldDecorator(`ignoreip${numList[1]}`, {
                                    rules: [{
                                            required: fail2ban[`ignoreip${numList[1]}`] !== undefined && fail2ban[`ignoreip${numList[1]}`] !== null,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                    initialValue: fail2ban[`ignoreip${numList[1]}`] ? fail2ban[`ignoreip${numList[1]}`] : ''
                                })(
                                    <Input disabled={ allDisable } />
                                ) }
                            </Col>
                            <Col span={ 1 } offset={ 1 }>
                                <Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    onClick={ this._removeIP.bind(this, parseInt(numList[1])) }
                                />
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemWithoutLabelLayout }
                            className= { fail2ban[`ignoreip${numList[2]}`] !== undefined && fail2ban[`ignoreip${numList[2]}`] !== null ? 'display-block' : 'hidden'}
                        >
                            <Col span={ 16 }>
                                { getFieldDecorator(`ignoreip${numList[2]}`, {
                                    rules: [{
                                            required: fail2ban[`ignoreip${numList[2]}`] !== undefined && fail2ban[`ignoreip${numList[2]}`] !== null,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                    initialValue: fail2ban[`ignoreip${numList[2]}`] ? fail2ban[`ignoreip${numList[2]}`] : ''
                                })(
                                    <Input disabled={ allDisable } />
                                ) }
                            </Col>
                            <Col span={ 1 } offset={ 1 }>
                                <Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    onClick={ this._removeIP.bind(this, parseInt(numList[2])) }
                                />
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemWithoutLabelLayout }
                            className= { fail2ban[`ignoreip${numList[3]}`] !== undefined && fail2ban[`ignoreip${numList[3]}`] !== null ? 'display-block' : 'hidden'}
                        >
                            <Col span={ 16 }>
                                { getFieldDecorator(`ignoreip${numList[3]}`, {
                                    rules: [{
                                            required: fail2ban[`ignoreip${numList[3]}`] !== undefined && fail2ban[`ignoreip${numList[3]}`] !== null,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                    initialValue: fail2ban[`ignoreip${numList[3]}`] ? fail2ban[`ignoreip${numList[3]}`] : ''
                                })(
                                    <Input disabled={ allDisable } />
                                ) }
                            </Col>
                            <Col span={ 1 } offset={ 1 }>
                                <Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    onClick={ this._removeIP.bind(this, parseInt(numList[3])) }
                                />
                            </Col>
                        </FormItem>
                    </Form>
                    <div className='section-title section-title-specail'>
                        <span>
                            { formatMessage({id: "LANG2618" })}
                        </span>
                    </div>
                    <Form>
                        <FormItem
                            ref="div_enable"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2619" />}>
                                    <span>{formatMessage({id: "LANG2619"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('enable', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: fail2ban.enable === 'yes'
                            })(
                                <Checkbox onChange={ this._onChangeEnableAsterisk } disabled={ allDisable } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_port"
                            className= { fail2ban.enable === 'yes' ? 'display-block' : 'hidden' }
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2298" />}>
                                    <span>{formatMessage({id: "LANG2302"})}</span>
                                </Tooltip>
                            )}>
                            <Row>
                                <Col span={ 12 }>
                                    { getFieldDecorator('port', {
                                        rules: [],
                                        initialValue: fail2ban.port ? fail2ban.port : 5060
                                    })(
                                        <InputNumber min={ 1 } max={ 65535 } disabled={ true } />
                                    ) }
                                </Col>
                                <Col span={6} offset={1} >
                                    <span className="protocol">
                                        { fail2ban.protocol === 'udp' ? formatMessage({id: 'LANG2672'}) : formatMessage({id: 'LANG2673'}) }
                                    </span>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem
                            ref="div_asterisk_maxretry"
                            className= { fail2ban.enable === 'yes' ? 'display-block' : 'hidden' }
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2615" />}>
                                    <span>{formatMessage({id: "LANG2614"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('asterisk_maxretry', {
                                rules: [],
                                initialValue: fail2ban.asterisk_maxretry ? fail2ban.asterisk_maxretry : 1
                            })(
                                <InputNumber min={ 1 } max={ 86399 } disabled={ asteriskDisable } />
                            ) }
                        </FormItem>
                    </Form>
                    <div className='section-title section-title-specail'>
                        <span>
                            { formatMessage({id: "LANG2316" })}
                        </span>
                    </div>
                    <Table
                        rowKey=""
                        columns={ columns }
                        pagination={ pagination }
                        dataSource={ this.state.fail2banlist }
                        showHeader={ !!this.state.fail2banlist.length }
                    />
                </div>
                <div>
                    <BackTop />
                </div>
            </div>
        )
    }
}

export default injectIntl(DynamicDefense)