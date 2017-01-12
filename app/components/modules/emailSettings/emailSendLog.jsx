'use strict'

import $ from 'jquery'
import React, { Component, PropTypes } from 'react'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Table, Popconfirm } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'

class EmailSendLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mailSendLog: []
        }
    }
    componentDidMount() {
        this._getMailSendLog()
    }
    componentWillUnmount() {

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
                "action": "deleteExtensionGroup",
                "extension_group": record.group_id
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getExtensionGroups()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/extension-trunk/extensionGroup/edit/' + record.group_id + '/' + record.group_name)
    }
    _getMailSendLog = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listMailSendLog',
                sidx: 'date',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const mailSendLog = response.mail_send_log || []

                    this.setState({
                        mailSendLog: mailSendLog
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _handleFormChange = (changedFields) => {
        _.extend(this.props.dataSource, changedFields)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const columns = [{
                key: 'date',
                dataIndex: 'date',
                title: formatMessage({id: "LANG5383"}),
                width: 100,
                sorter: (a, b) => a.date.length - b.date.length
            }, {
                key: 'module',
                dataIndex: 'module',
                title: formatMessage({id: "LANG5384"}),
                width: 100,
                sorter: (a, b) => a.module.length - b.module.length
            }, {
                key: 'recipient',
                dataIndex: 'recipient',
                title: formatMessage({id: "LANG5385"}),
                width: 100,
                sorter: (a, b) => a.recipient.length - b.recipient.length
            }, {
                key: 'send_time',
                dataIndex: 'send_time',
                title: formatMessage({id: "LANG5386"}),
                width: 100,
                sorter: (a, b) => a.send_time.length - b.send_time.length
            }, {
                key: 'send_to',
                dataIndex: 'send_to',
                title: formatMessage({id: "LANG5387"}),
                width: 100,
                sorter: (a, b) => a.send_to.length - b.send_to.length
            }, {
                key: 'send_result',
                dataIndex: 'send_result',
                title: formatMessage({id: "LANG5388"}),
                width: 100,
                sorter: (a, b) => a.send_result.length - b.send_result.length
            }, {
                key: 'return_code',
                dataIndex: 'return_code',
                title: formatMessage({id: "LANG5389"}),
                width: 100,
                sorter: (a, b) => a.return_code.length - b.return_code.length
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                width: 100,
                render: (text, record, index) => {
                    return <div>
                            <span
                                className="sprite sprite-edit"
                                onClick={ this._edit.bind(this, record) }>
                            </span>
                            <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._delete.bind(this, record) }
                            >
                                <span className="sprite sprite-del"></span>
                            </Popconfirm>
                        </div>
                }
            }]
        const pagination = {
                total: this.state.mailSendLog.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }
        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }

    return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <FormItem
                        ref="div_start_date"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="" />}>
                                <span>{formatMessage({id: "LANG1048"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('start_date', {
                             rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_end_date"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="" />}>
                                <span>{formatMessage({id: "LANG1049"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('end_date', {
                             rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_recipient"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="" />}>
                                <span>{formatMessage({id: "LANG5385"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('recipient', {
                             rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_send_result"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="" />}>
                                <span>{formatMessage({id: "LANG5388"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('send_result', {
                             rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_return_code"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="" />}>
                                <span>{formatMessage({id: "LANG5389"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('return_code', {
                             rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_module"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="" />}>
                                <span>{formatMessage({id: "LANG5384"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('module', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Select>
                                 <Option value="">{formatMessage({id: "LANG4160"})}</Option>
                                 <Option value="account">{formatMessage({id: "LANG85"})}</Option>
                                 <Option value="voicemail">{formatMessage({id: "LANG20"})}</Option>
                                 <Option value="conference">{formatMessage({id: "LANG3775"})}</Option>
                                 <Option value="password">{formatMessage({id: "LANG2810"})}</Option>
                                 <Option value="alert">{formatMessage({id: "LANG2553"})}</Option>
                                 <Option value="cdr">{formatMessage({id: "LANG7"})}</Option>
                                 <Option value="fax">{formatMessage({id: "LANG95"})}</Option>
                                 <Option value="test">{formatMessage({id: "LANG2273"})}</Option>
                             </Select>
                        ) }
                    </FormItem>
                </Form>
                <div className="top-button">
                    <Button type="primary" icon="solution" size='default' >
                        { formatMessage({id: "LANG803"}) }
                    </Button>
                    <Button type="primary" icon="download" size='default' >
                        { formatMessage({id: "LANG4107"}) }
                    </Button>
                    <Button type="primary" icon="delete" size='default' >
                        { formatMessage({id: "LANG3911" })}
                    </Button>
                </div>
                <div>
                    <p ><span >250</span> <span >
                        { formatMessage({id: "LANG5421" })}
                    </span></p>
                    <p ><span >501</span> <span >
                        { formatMessage({id: "LANG5422" })}
                    </span></p>
                    <p ><span >535</span> <span >
                        { formatMessage({id: "LANG5423" })}
                    </span></p>
                    <p ><span >550</span> <span >
                        { formatMessage({id: "LANG5424" })}
                    </span></p>
                    <p ><span >552</span> <span >
                        { formatMessage({id: "LANG5425" })}
                    </span></p>
                    <p ><span >553</span> <span >
                        { formatMessage({id: "LANG5426" })}
                    </span></p>
                    <p ><span >554</span> <span >
                        { formatMessage({id: "LANG5427" })}
                    </span></p>
                    <p ><span >none</span> <span >
                        { formatMessage({id: "LANG5428" })}
                    </span></p>
                </div>
                <Table
                    rowKey="date"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.mailSendLog }
                        showHeader={ !!this.state.mailSendLog.length }
                >
                </Table>
            </div>
        )
    }
}

EmailSendLog.propTypes = {
}

export default Form.create()(injectIntl(EmailSendLog))
