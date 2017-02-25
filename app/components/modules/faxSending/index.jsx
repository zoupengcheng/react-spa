'use strict'

import $ from 'jquery'
import api from "../../api/api"
import _ from 'underscore'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage, formatMessage } from 'react-intl'
import { Tooltip, Button, message, Modal, Popconfirm, Progress, Table, Tag, Form, Row, Col, Input, Upload, Icon } from 'antd'
import cookie from 'react-cookie'

const confirm = Modal.confirm
const FormItem = Form.Item

class FaxSending extends Component {
    constructor(props) {
        super(props)
        this.state = {
            faxItem: [],
            selectedRows: [],
            selectedRowKeys: [],
            callee: '',
            pagination: {
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            },
            loading: false
        }
    }
    componentDidMount() {
        this._getInitDate()
    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    _clearSelectRows = () => {
        this.setState({
            selectedRowKeys: []
        })
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
                "action": "deleteFaxRecords",
                "key": record.key
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitDate()
                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleTableChange = (pagination, filters, sorter) => {
        const pager = this.state.pagination

        pager.current = pagination.current

        this.setState({
            pagination: pager
        })
        let isCallee = 0
        if (this.state.callee === '') {
            isCallee = 0
        } else {
            isCallee = 1
        }

        this._getSendFax({
            item_num: pagination.pageSize,
            page: pagination.current,
            sidx: sorter.field ? sorter.field : 'd',
            sord: sorter.order === "ascend" ? "asc" : "desc",
            ...filters
        }, isCallee)
    }
    _getSendFax = (
        params = {                
                item_num: 10,
                sidx: "d",
                sord: "desc",
                page: 1 
            }, isCallee = 0) => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        this.setState({loading: true})

        let callee = this.state.callee
        let action = {}
        action.action = 'listSendFaxstatus'
        action.username = localStorage.username
        if (isCallee === 0) {
            callee = ''
        } else if (isCallee === 1) {
            callee = getFieldValue('callee')
            if (callee && callee !== "") {
                action.callee = callee
            }
        }
        _.extend(action, params)
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
                    const fax = response.fax || []
                    const pagination = this.state.pagination
                    // Read total count from server
                    pagination.total = res.response.total_item
                    pagination.current = params.page

                    this.setState({
                        loading: false,
                        faxItem: fax,
                        callee: callee,
                        pagination
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getInitDate = () => {
        this._getSendFax()
    }
    _searchFile = () => {
        this._getSendFax({                
                item_num: 10,
                sidx: "d",
                sord: "desc",
                page: 1 
            }, 1)
    }
    _showAll = () => {
        this._getSendFax()
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ 
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows
        })
    }
    _deleteAllSelectdOK = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4763" })}}></span>

        message.loading(loadingMessage)
        let faxKeysList = this.state.selectedRowKeys || []
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteFaxRecords",
                "key": faxKeysList.join(',')
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitDate()
                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _deleteAllSelectd = () => {
        const { formatMessage } = this.props.intl
        const __this = this
        if (this.state.selectedRowKeys.length === 0) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG823"}, {0: formatMessage({id: "LANG4064"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            let selectedNames = []
            let selectedRows = this.state.selectedRows || []
            selectedRows.map(function(item) {
                selectedNames.push(item.n)
            })
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML=
                                {{__html: formatMessage({id: "LANG818"}, {0: selectedNames.join('  ')})}}
                            ></span>,
                onOk() {
                    __this._deleteAllSelectdOK()
                },
                onCancel() {}
            })
        }
    }
    _deleteAllOK = () => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4763" })}}></span>

        let username = localStorage.username

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteFaxRecords",
                "username": username
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._searchFile()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _deleteAll = () => {
        const { formatMessage } = this.props.intl
        const __this = this
        if (this.state.faxItem.length === 0) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG129"}, {0: formatMessage({id: "LANG4064"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML=
                                {{__html: formatMessage({id: "LANG2794"})}}
                            ></span>,
                onOk() {
                    __this._deleteAllOK()
                },
                onCancel() {}
            })
        }
    }
    _createSendstatus = (text, record, index) => {
        if (record.send_status) {
            return <span>{ record.send_status }</span>
        } else {
            return <span>{ formatMessage({id: "LANG2403"}) }</span>
        }
    }
    _createCallee = (text, record, index) => {
        if (record.callee) {
            return <span>{ record.callee }</span>
        } else {
            return <span>{ formatMessage({id: "LANG2403"}) }</span>
        }
    }
    _createUsername = (text, record, index) => {
        if (record.username) {
            return <span>{ record.username }</span>
        } else {
            return <span>{ formatMessage({id: "LANG2403"}) }</span>
        }
    }
    _createProcess = (text, record, index) => {
        const { formatMessage } = this.props.intl
        if (text === 100) {
            return <span><Progress format={ () => formatMessage({id: "LANG4125"}) } percent={100} /></span>
        } else if (text >= 0 && text <= 99) {
            return <span><Progress percent={text} status="active" /></span>
        } else {
            return <span><Progress format={ () => formatMessage({id: "LANG4089"}) } percent={50} status="exception" /></span>
        }
    }
    _sendCancel = () => {
        browserHistory.push('/value-added-features/faxSending')
    }
    _sendFax = () => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4763" })}}></span>

        const timestamp = Date.parse(new Date()) + ""

        let id = getFieldValue("faxNum")
        let key = parseInt(timestamp.slice(7))
        $.ajax({
            url: api.apiHost + "action=uploadfile&type=SendFAX&id=" + id + '&key=' + key,
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitDate()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _hasFaxNum = (file) => {
        const { formatMessage } = this.props.intl
        let returnValue = false
        let hasValue = false
        let isType = false

        let type = file.type
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                hasValue = true
            }
        })
        if (file.type === 'application/pdf' ||
            file.type === 'image/tif' ||
            file.type === 'image/tiff') {
            isType = true
        } else {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4062"})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        }
        if (hasValue && isType) {
            returnValue = true
        }
        return returnValue
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, getFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'n',
                dataIndex: 'n',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.n.length - b.n.length
            }, {
                key: 'd',
                dataIndex: 'd',
                title: formatMessage({id: "LANG203"}),
                sorter: (a, b) => a.d.length - b.d.length
            }, {
                key: 'username',
                dataIndex: 'username',
                title: formatMessage({id: "LANG2056"}),
                sorter: (a, b) => a.username.length - b.username.length
            }, {
                key: 'callee',
                dataIndex: 'callee',
                title: formatMessage({id: "LANG4065"}),
                sorter: (a, b) => a.callee.length - b.callee.length
            }, {
                key: 'send_status',
                dataIndex: 'send_status',
                title: formatMessage({id: "LANG5199"}),
                sorter: (a, b) => a.send_status.length - b.send_status.length,
                render: (text, record, index) => (
                    this._createSendstatus(text, record, index)
                )
            }, {
                key: 'process',
                dataIndex: 'process',
                title: formatMessage({id: "LANG4087"}),
                sorter: (a, b) => a.process.length - b.process.length,
                render: (text, record, index) => (
                    this._createProcess(text, record, index)
                )
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
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
                total: this.state.faxItem.length,
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

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG4067"})
                })
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const me = this
        const timestamp = Date.parse(new Date()) + ""

        let id = getFieldValue("faxNum")
        let key = parseInt(timestamp.slice(7))

        const props_file = {
            name: 'file',
            action: api.apiHost + "action=uploadfile&type=SendFAX&id=" + id + '&key=' + key,
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                // message.loading(formatMessage({ id: "LANG979" }), 0)
                console.log(info.file.status)
            },
            onRemove() {
                me.props.setSpinLoading({loading: false})
                message.destroy()
            },
            beforeUpload: me._hasFaxNum
        }
        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG4067"}) }
                    isDisplay= "hidden"
                />
                <Form>
                    <div className="content">
                        <FormItem
                            ref="div_faxNum"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG4065" />}>
                                    <span>{formatMessage({id: "LANG4065"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('faxNum', {
                                rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }],
                                width: 100
                            })(
                                <Input maxLength='32' />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_fileUrl"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG4095" />}>
                                    <span>{formatMessage({id: "LANG4064"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('fileUrl', {
                                valuePropName: 'fileList',
                                normalize: this._normFile
                            })(
                                <Upload {...props_file}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                    </Button>
                                </Upload>
                            ) }
                        </FormItem>
                        <Row className='hidden' >
                            <Col span={3} >
                                <Button
                                    icon="cancel"
                                    type="primary"
                                    size='default'
                                    onClick={ this._sendCancel }
                                >
                                    { formatMessage({id: "LANG726"}) }
                                </Button>
                            </Col>
                            <Col span={3} >
                                <Button
                                    icon="search"
                                    type="primary"
                                    size='default'
                                    onClick={ this._sendFax }
                                >       
                                    { formatMessage({id: "LANG4068"}) }
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
                <div className="content">
                    <div className="section-title">
                        <p><span>
                                { formatMessage({id: "LANG4086" })}
                            </span>
                        </p>
                    </div>
                    <Row>
                        <Col span={ 9 } >
                            <FormItem
                                ref="div_callee"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG4065" />}>
                                        <span>{formatMessage({id: "LANG4065"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('callee', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength='127' />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={3} >
                            <Button
                                icon="search"
                                type="primary"
                                size='default'
                                onClick={ this._searchFile }
                            >
                                { formatMessage({id: "LANG803"}) }
                            </Button>
                        </Col>
                        <Col span={3} >
                            <Button
                                icon="search"
                                type="primary"
                                size='default'
                                onClick={ this._showAll }
                            >       
                                { formatMessage({id: "LANG4142"}, {0: formatMessage({id: "LANG4146"})}) }
                            </Button>
                        </Col>
                    </Row>
                    <div className="top-button">
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._deleteAllSelectd }
                        >
                            { formatMessage({id: "LANG3872"}, {0: formatMessage({id: "LANG4146"})}) }
                        </Button>
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._deleteAll }
                        >
                            { formatMessage({id: "LANG740"}) }
                        </Button>
                    </div>
                    
                    <Table
                        rowKey="key"
                        columns={ columns }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.faxItem }
                        showHeader={ !!this.state.faxItem.length }
                        pagination={ this.state.pagination }
                        onChange={ this._handleTableChange }
                        loading={ this.state.loading}
                    />
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(FaxSending))