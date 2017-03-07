'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import Validator from "../../api/validator"
import { Tooltip, Button, message, Modal, Popconfirm, Checkbox, Table, Tag, Form, Input, Row, Col, BackTop } from 'antd'

const confirm = Modal.confirm
const FormItem = Form.Item

class DynamicDefense extends Component {
    constructor(props) {
        super(props)
        this.state = {
            blacklist: [],
            dynamicDefense: {},
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
                "action": "deleteBlackip",
                "blackip": record.blacklist
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
    _getBlackList = () => {
        const { formatMessage } = this.props.intl
        let blacklist = this.state.blacklist

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getBlacklist'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    if (response.blacklist[0].blacklist !== '') {
                        const list = response.blacklist[0].blacklist.split(',') || []
                        list.map(function(item) {
                            blacklist.push({
                                blacklist: item
                            })
                        })
                    }
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        this.setState({
            blacklist: blacklist,
            firstLoad: false
        })
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        let dynamicDefense = this.state.dynamicDefense

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getDynamicDefense'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    dynamicDefense = response.dynamic_defense || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        this.setState({
            dynamicDefense: dynamicDefense
        })
    }
    _onChangeEnable = (e) => {
        let dynamicDefense = this.state.dynamicDefense
        if (e.target.checked) {
            dynamicDefense.enable = 'yes'
        } else {
            dynamicDefense.enable = 'no'
        }
        this.setState({
            dynamicDefense: dynamicDefense
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const dynamicDefense = this.state.dynamicDefense

        if (this.state.firstLoad && this.props.firstLoad) {
            this._getBlackList()
        }
        if (!this.state.firstLoad && !this.props.firstLoad) {
            this.setState({
                firstLoad: true
            })
        }

        const columns = [{
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
                total: this.state.blacklist.length,
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
                    1: formatMessage({id: "LANG2305"})
                })
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }
        return (
            <div className="app-content-main">
                <div className="content">
                    <div className='section-title section-title-specail'>
                        <span>
                            { formatMessage({id: "LANG2305" })}
                        </span>
                    </div>
                    <Form>
                        <FormItem
                            ref="div_enable"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2304" />}>
                                    <span>{formatMessage({id: "LANG2304"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('dynamic_enable', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dynamicDefense.enable === 'yes'
                            })(
                                <Checkbox onChange={ this._onChangeEnable } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_timeout"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2298" />}>
                                    <span>{formatMessage({id: "LANG2302"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('timeout', {
                                rules: [{
                                    validator: (data, value, callback) => {
                                        Validator.range(data, value, callback, formatMessage, 1, 59)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.digits(data, value, callback, formatMessage)
                                    }
                                }],
                                initialValue: dynamicDefense.timeout ? dynamicDefense.timeout : 1
                            })(
                                <Input min={ 1 } max={ 59 } disabled={ dynamicDefense.enable === 'no' } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_block_timeout"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2297" />}>
                                    <span>{formatMessage({id: "LANG2301"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('block_timeout', {
                                rules: [{
                                    validator: (data, value, callback) => {
                                        Validator.range(data, value, callback, formatMessage, 1, 86399)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.digits(data, value, callback, formatMessage)
                                    }
                                }],
                                initialValue: dynamicDefense.block_timeout ? dynamicDefense.block_timeout : 120
                            })(
                                <Input min={ 1 } max={ 86399 } disabled={ dynamicDefense.enable === 'no' } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_threshold"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2296" />}>
                                    <span>{formatMessage({id: "LANG2300"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('threshold', {
                                rules: [{
                                    validator: (data, value, callback) => {
                                        Validator.range(data, value, callback, formatMessage, 5, 1000)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.digits(data, value, callback, formatMessage)
                                    }
                                }],
                                initialValue: dynamicDefense.threshold ? dynamicDefense.threshold : 100
                            })(
                                <Input min={ 5 } max={ 1000 } disabled={ dynamicDefense.enable === 'no' } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_whitelist"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2294" />}>
                                    <span>{formatMessage({id: "LANG2295"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('whitelist', {
                                rules: [],
                                initialValue: dynamicDefense.white_addr ? dynamicDefense.white_addr.split('\\n').join('\n') : ''
                            })(
                                <Input type="textarea" rows={ 5 } cols={ 25 } disabled={ dynamicDefense.enable === 'no' } />
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
                        dataSource={ this.state.blacklist }
                        showHeader={ !!this.state.blacklist.length }
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