'use strict'

import $ from 'jquery'
import React, { Component, PropTypes } from 'react'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Table, Popconfirm, Modal, DatePicker } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'

const Option = Select.Option

class EmailSendLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mailSendLog: [],
            infoVisible: false,
            isDisplay: "display-block-filter",
            isDisplaySearch: 'hidden',
            sub_send_mail_log: []
        }
    }
    componentDidMount() {
        this._getMailSendLog()
    }
    componentWillUnmount() {

    }
    _hideSearch = () => {
        this.setState({
            isDisplay: 'display-block-filter',
            isDisplaySearch: 'hidden'
        })
    }
    _handleSearch = () => {
        this.setState({
            isDisplay: 'display-block',
            isDisplaySearch: 'display-block'
        })
    }
    _handleCancel = () => {
        this._getMailSendLog()
    }
    _infoCancel = () => {
        this.setState({
            infoVisible: false
        })
    }
    _info = (record) => {
        const ID = record.id
        const { formatMessage } = this.props.intl
        let sub_send_mail_log = []
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getSubMailSendLog',
                id: ID
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    sub_send_mail_log = response.sub_send_mail_log || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        this.setState({
            infoVisible: true,
            sub_send_mail_log: sub_send_mail_log
        })
    }
    _searchMailLog = () => {
        const { getFieldValues } = this.props.form
        const { formatMessage } = this.props.intl
        const { form } = this.props
        const values = this.props.form.getFieldsValue() 

        let action = {}
        action.action = 'listMailSendLog'
        action.options = 'id,date,module,recipient,send_time,send_to,send_result,return_code'
        action.sidx = 'date'
        action.sord = 'desc'
        if (values.start_date !== undefined && values.statr_date !== null && values.start_date !== '') {
            action.start_date = values.start_date.format('YYYY-MM-DD HH:mm')
        }
        if (values.end_date !== undefined && values.end_date !== null && values.end_date !== '') {
            action.end_date = values.end_date.format('YYYY-MM-DD HH:mm')
        }
        if (values.recipient !== undefined && values.recipient !== null && values.recipient !== '') {
            action.recipient = values.recipient
        }
        if (values.send_result !== undefined && values.send_result !== null && values.send_result !== '') {
            action.send_result = values.send_result
        }
        if (values.return_code !== undefined && values.return_code !== null && values.return_code !== '') {
            action.return_code = values.return_code
        }
        if (values.module !== undefined && values.module !== null && values.module !== '') {
            action.module = values.module
        }

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: action,
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
    _deleteAll = () => {
        const { formatMessage } = this.props.intl

        let action = {}
        action.action = 'deleteMailSendLogAll'
        message.loading(formatMessage({ id: "LANG826" }), 0)
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: action,
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                    this._getMailSendLog()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _showAll = () => {
        this._getMailSendLog()
    }
    _getMailSendLog = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listMailSendLog',
                sidx: 'date',
                sord: 'desc'
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
        const sub_send_mail_log = this.state.sub_send_mail_log
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
                                title={ formatMessage({id: "LANG3923"}) }
                                onClick={ this._info.bind(this, record) }>
                            </span>
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
        const columns_info = [{
                key: 'send_time',
                dataIndex: 'send_time',
                title: formatMessage({id: "LANG5392"}),
                width: 100
            }, {
                key: 'send_to',
                dataIndex: 'send_to',
                title: formatMessage({id: "LANG5393"}),
                width: 100
            }, {
                key: 'send_result',
                dataIndex: 'send_result',
                title: formatMessage({id: "LANG5388"}),
                width: 100
            }, {
                key: 'return_code',
                dataIndex: 'return_code',
                title: formatMessage({id: "LANG5389"}),
                width: 100
            }]

    return (
            <div className="app-content-main" id="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG2581"}) }
                    onSubmit={ this._searchMailLog }
                    onCancel={ this._handleCancel } 
                    onSearch = { this._handleSearch } 
                    isDisplay= { this.state.isDisplay }
                    saveTxt = { formatMessage({id: "LANG1288" }) }
                    cancelTxt = { formatMessage({id: "LANG750" }) }
                />
                <Form className={ this.state.isDisplaySearch }>
                    <FormItem
                        ref="div_start_date"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="" />}>
                                <span>{formatMessage({id: "LANG1048"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('start_date', {
                             rules: []
                        })(
                            <DatePicker showTime placeholder={ formatMessage({id: "LANG5373"}) } format="YYYY-MM-DD HH:mm" />
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
                             rules: []
                        })(
                            <DatePicker showTime placeholder={ formatMessage({id: "LANG5373"}) } format="YYYY-MM-DD HH:mm" />
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
                    <div className="hide_search sprite sprite-slide-bar" onClick={ this._hideSearch }></div>
                </Form>
                <div className="content">
                    <Button type="primary" icon="solution" size='default' onClick={ this._showAll }>
                        { formatMessage({id: "LANG4107"}) }
                    </Button>
                    <Button type="primary" icon="delete" size='default' onClick={ this._deleteAll }>
                        { formatMessage({id: "LANG3911" })}
                    </Button>
                </div>
                <div className="content">
                    <p >
                        <Row>
                            <Col span={ 1 }>
                                <span className="error-code">250</span>
                            </Col>
                            <Col span={ 23 }>
                                <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5421"})}} >
                                </span>
                            </Col>
                        </Row>
                    </p>
                    <p >
                        <Row>
                            <Col span={ 1 }>
                                <span className="error-code">501</span>
                            </Col>
                            <Col span={ 23 }>
                                <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5422"})}} >
                                </span>
                            </Col>
                        </Row>
                    </p>
                    <p >
                        <Row>
                            <Col span={ 1 }>
                                <span className="error-code">535</span>
                            </Col>
                            <Col span={ 23 }>
                                <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5423"})}} >
                                </span>
                            </Col>
                        </Row>
                    </p>
                    <p >
                        <Row>
                            <Col span={ 1 }>
                                <span className="error-code">550</span>
                            </Col>
                            <Col span={ 23 }>
                                <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5424"})}} >
                                </span>
                            </Col>
                        </Row>
                    </p>
                    <p >
                        <Row>
                            <Col span={ 1 }>
                                <span className="error-code">552</span>
                            </Col>
                            <Col span={ 23 }>
                                <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5425"})}} >
                                </span>
                            </Col>
                        </Row>
                    </p>
                    <p >
                        <Row>
                            <Col span={ 1 }>
                                <span className="error-code">553</span>
                            </Col>
                            <Col span={ 23 }>
                                <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5426"})}} >
                                </span>
                            </Col>
                        </Row>
                    </p>
                    <p >
                        <Row>
                            <Col span={ 1 }>
                                <span className="error-code">554</span>
                            </Col>
                            <Col span={ 23 }>
                                <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5427"})}} >
                                </span>
                            </Col>
                        </Row>
                    </p>
                    <p >
                        <Row>
                            <Col span={ 1 }>
                                <span className="error-code">none</span>
                            </Col>
                            <Col span={ 23 }>
                                <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5428"})}} >
                                </span>
                            </Col>
                        </Row>
                    </p>
                    <p ><span className="lite-desc-warning">
                        { formatMessage({id: "LANG5429" })}
                    </span></p>
                    <p ><span className="lite-desc-warning">
                        { formatMessage({id: "LANG5430" })}
                    </span></p>
                </div>
                <div>
                    <Table
                        rowKey="id"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.mailSendLog }
                        showHeader={ !!this.state.mailSendLog.length }
                    >
                    </Table>
                </div>
                <Modal title={ formatMessage({id: "LANG3923"}) }
                    visible={ this.state.infoVisible }
                    onOk={ this._infoCancel }
                    onCancel={ this._infoCancel }
                    footer={[
                        <Button onClick={this._infoCancel}>{ formatMessage({id: "LANG726"}) }</Button>
                    ]}
                >
                    <Table
                        rowKey="send_time"
                        columns={ columns_info }
                        pagination={ false }
                        dataSource={ sub_send_mail_log }
                        showHeader={ !!sub_send_mail_log.length }
                        scroll={{ y: 240 }}
                    >
                    </Table>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(injectIntl(EmailSendLog))
