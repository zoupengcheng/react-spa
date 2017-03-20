'use strict'

import $ from 'jquery'
import api from "../../api/api"
import _ from 'underscore'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from '../../api/validator'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Tooltip, Button, message, Modal, Popconfirm, Checkbox, Table, Tag, Form, Input, Row, Col, Icon, BackTop } from 'antd'

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
            numList: [2, 3, 4, 5],
            firstLoad: true
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
                "action": "delFail2banList",
                "param": record.bandType + ',' + record.ip
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitData()
                    this._getFail2banList()
                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getFail2banList = () => {
        const { formatMessage } = this.props.intl
        let fail2banlist = []
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
                    const tmp_fail2banlist = response.fail2banlist || []
                    tmp_fail2banlist.map(function(item) {
                        for (let tmp in item) {
                            if (item.hasOwnProperty(tmp)) {
                                let ips = item[tmp]
                                ips.map(function(ip_item) {
                                    fail2banlist.push({
                                        bandType: tmp,
                                        ip: ip_item
                                    })
                                })
                            }
                        }
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        this.setState({
            fail2banlist: fail2banlist,
            firstLoad: false
        })
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        let fail2ban = this.state.fail2ban
        let fail2ban_enable = this.state.fail2ban_enable
        let fail2banlist = []
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
        this.setState({
            fail2ban: fail2ban,
            fail2ban_enable: fail2ban_enable,
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
            fail2ban.enabled = 'yes'
        } else {
            fail2ban.enabled = 'no'
        }
        this.setState({
            fail2ban: fail2ban
        })
    }
    _removeIP = (k) => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')
        let fail2ban = this.state.fail2ban
        fail2ban[`ignoreip${k}`] = null
        this.setState({
            fail2ban: fail2ban
        })
        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        })
    }
    _addIP = () => {
        const { formatMessage } = this.props.intl
        const form = this.props.form
        if (this.state.fail2ban_enable === '1') {
            const keys = form.getFieldValue('keys')

            if (keys.length === 4) {
                Modal.warning({
                    content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG2623"})}} ></span>,
                    okText: (formatMessage({id: "LANG727"}))
                })
            } else {
                const tmpNumList = [2, 3, 4, 5]
                let nextk = null
                tmpNumList.map(function(item) {
                    if (_.indexOf(keys, item) === -1 && nextk === null) {
                        nextk = item
                    }
                })
                const nextKeys = keys.concat(nextk)
                // can use data-binding to set
                // important! notify form to detect changes
                form.setFieldsValue({
                    keys: nextKeys
                })
            }
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, getFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const dynamicDefense = this.state.dynamicDefense
        const numList = this.state.numList

        if (this.state.firstLoad && this.props.firstLoad) {
            this._getFail2banList()
        }
        if (!this.state.firstLoad && !this.props.firstLoad) {
            this.setState({
                firstLoad: true
            })
        }

        const columns = [{
                key: 'bandType',
                dataIndex: 'bandType',
                title: formatMessage({id: "LANG4813"}),
                sorter: (a, b) => a.bandType.length - b.bandType.length
            }, {
                key: 'ip',
                dataIndex: 'ip',
                title: formatMessage({id: "LANG2293"}),
                sorter: (a, b) => a.ip.length - b.ip.length
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
        const asteriskDisable = allDisable === true || fail2ban.enabled === 'no'

        let keyList = []
        for (let k = 0; k < this.state.ignoreip_list.length; k++) {
            keyList.push(k + 2)
        }
        getFieldDecorator('keys', { initialValue: keyList })
        const keys = getFieldValue('keys')
        const formIPItem = keys.map((k, index) => {
            return (
                <FormItem key={k}
                    { ...formItemWithoutLabelLayout }
                >
                    <Col span={ 16 }>
                        { getFieldDecorator(`ignoreip${k}`, {
                            rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.ipv4withcidr(data, value, callback, formatMessage)
                                    }
                                }],
                            initialValue: fail2ban[`ignoreip${k}`] ? fail2ban[`ignoreip${k}`] : ''
                        })(
                            <Input disabled={ allDisable } />
                        ) }
                    </Col>
                    <Col span={ 1 } offset={ 1 }>
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={ this._removeIP.bind(this, parseInt(k)) }
                        />
                    </Col>
                </FormItem>
                )
        })

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
                                rules: [{
                                    required: allDisable === false,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        allDisable ? callback() : Validator.digits(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        allDisable ? callback() : Validator.range(data, value, callback, formatMessage, 0, 999999999999)
                                    }
                                }],
                                initialValue: fail2ban.bantime ? fail2ban.bantime : 600
                            })(
                                <Input min={ 0 } max={ 999999999999 } disabled={ allDisable } />
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
                                rules: [{
                                    required: allDisable === false,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        allDisable ? callback() : Validator.digits(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        allDisable ? callback() : Validator.range(data, value, callback, formatMessage, 1, 999999999999)
                                    }
                                }],
                                initialValue: fail2ban.findtime ? fail2ban.findtime : 600
                            })(
                                <Input min={ 1 } max={ 999999999999 } disabled={ allDisable } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_maxretry"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2615" />}>
                                    <span>{formatMessage({id: "LANG2614"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('maxretry', {
                                rules: [{
                                    required: allDisable === false,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        allDisable ? callback() : Validator.digits(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        allDisable ? callback() : Validator.range(data, value, callback, formatMessage, 1, 999999999999)
                                    }
                                }],
                                initialValue: fail2ban.maxretry ? fail2ban.maxretry : 1
                            })(
                                <Input min={ 1 } max={ 999999999999 } disabled={ allDisable } />
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
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            Validator.ipv4withcidr(data, value, callback, formatMessage)
                                        }
                                    }],
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
                        { formIPItem }
                    </Form>
                    <div className='section-title section-title-specail'>
                        <span>
                            { formatMessage({id: "LANG2618" })}
                        </span>
                    </div>
                    <Form>
                        <FormItem
                            ref="div_enabled"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2619" />}>
                                    <span>{formatMessage({id: "LANG2619"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('enabled', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: fail2ban.enabled === 'yes'
                            })(
                                <Checkbox onChange={ this._onChangeEnableAsterisk } disabled={ allDisable } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_port"
                            className= { fail2ban.enabled === 'yes' ? 'display-block' : 'hidden' }
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2620" />}>
                                    <span>{formatMessage({id: "LANG5292"})}</span>
                                </Tooltip>
                            )}>
                            <Row>
                                <Col span={ 12 }>
                                    { getFieldDecorator('port', {
                                        rules: [],
                                        initialValue: fail2ban.port ? fail2ban.port : 5060
                                    })(
                                        <Input min={ 1 } max={ 65535 } disabled={ true } />
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
                            className= { fail2ban.enabled === 'yes' ? 'display-block' : 'hidden' }
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
                                <Input min={ 1 } max={ 86399 } disabled={ asteriskDisable } />
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