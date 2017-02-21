'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions/'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Button, Checkbox, Form, Icon, Input, message, Popconfirm, Spin, Table, Tooltip, Upload } from 'antd'

const FormItem = Form.Item

class InboundBlackList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            settings: {},
            blacklist: [],
            uploadErrObj: {
                "1": "LANG890",
                "2": "LANG891",
                "3": "LANG892",
                "4": "LANG893",
                "5": "LANG894",
                "6": "LANG895",
                "7": "LANG896",
                "8": "LANG897",
                "9": "LANG898",
                "10": "LANG899"
            }
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _addBlackList = (e) => {
        // e.preventDefault()
        let action = {}
        let loadingMessage = ''
        let successMessage = ''
        const form = this.props.form
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG826" }) }}></span>
        successMessage = <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG844" }) }}></span>

        message.loading(loadingMessage)

        form.validateFields(['new_number'], { force: true }, (err, values) => {
            if (!err) {
                let action = {
                        number: values.new_number,
                        action: 'addInboundBlacklist'
                    }

                $.ajax({
                    data: action,
                    type: 'json',
                    method: "post",
                    url: api.apiHost,
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)

                            form.setFieldsValue({
                                new_number: ''
                            })

                            this._getInitData()
                        }
                    }.bind(this)
                })
            }
        })
    }
    _checkConflict = (rule, value, callback) => {
        let conflict
        let val = $.trim(value)
        const { formatMessage } = this.props.intl

        conflict = _.find(this.state.blacklist, function(data) {
            return data.number === val
        })

        if (val && conflict) {
            callback(formatMessage({id: "LANG2285"}))
        } else {
            callback()
        }
    }
    _deleteBlackList = (record) => {
        let action = {}
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG819" })}}></span>

        message.loading(loadingMessage)

        action = {
            'number': record.number,
            'action': 'deleteInboundBlacklist'
        }

        $.ajax({
            data: action,
            type: 'json',
            method: 'post',
            url: api.apiHost,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitData()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getInboundBlacklist = () => {
        let blacklist = []
        const form = this.props.form
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                sord: 'asc',
                sidx: 'number',
                action: 'listInboundBlacklist'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    blacklist = response.number || []

                    blacklist = _.map(blacklist, function(data, index) {
                        data.key = index

                        return data
                    })

                    this.setState({
                        blacklist: blacklist
                    })

                    let newNumber = form.getFieldValue('new_number')

                    if (newNumber) {
                        form.validateFields(['new_number'], { force: true })
                    }
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getInboundBlacklistSettings = () => {
        let settings = {}
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getInboundBlacklistSettings'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    settings = response.inbound_blacklist_settings || {}

                    this.setState({
                        settings: settings
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getInitData = () => {
        this._getInboundBlacklist()
        this._getInboundBlacklistSettings()
    }
    _handleCancel = (e) => {
        browserHistory.push('/extension-trunk/inboundRoute')
    }
    _handleSubmit = (e) => {
        // e.preventDefault()

        let loadingMessage = ''
        let successMessage = ''
        const form = this.props.form
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        form.validateFieldsAndScroll(['enable'], (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                values.enable = values.enable ? 'yes' : 'no'
                values.action = 'updateInboundBlacklistSettings'

                $.ajax({
                    data: values,
                    type: 'json',
                    method: 'post',
                    url: api.apiHost,
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)

                            this._handleCancel()
                        }
                    }.bind(this)
                })
            }
        })
    }
    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const settings = this.state.settings || {}
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }

        const formItemRowLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        const columns = [{
                width: 100,
                key: 'number',
                dataIndex: 'number',
                title: formatMessage({id: "LANG4342"}),
                sorter: (a, b) => a.number - b.number
            }, {
                width: 50,
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <div>
                            <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._deleteBlackList.bind(this, record) }
                            >
                                <span className="sprite sprite-del"></span>
                            </Popconfirm>
                        </div>
                }
            }]

        const pagination = {
                showSizeChanger: true,
                total: this.state.blacklist.length,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }

        const uploadProps = {
            name: 'file',
            showUploadList: false,
            headers: { authorization: 'authorization-text' },
            action: api.apiHost + 'action=uploadfile&type=importInboundBlacklist',
            onChange: (info) => {
                console.log(info.file.status)

                this.props.setSpinLoading({ loading: true, tip: formatMessage({id: "LANG905"}) })

                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }

                if (info.file.status === 'done') {
                    // message.success(`${info.file.name} file uploaded successfully`)
                    let data = info.file.response
                    let bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                    if (bool) {
                        if (data.response && data.response.result) {
                            this.props.setSpinLoading({ loading: false })

                            if (data.response.result === 0) {
                                message.success(formatMessage({id: "LANG815"}))
                            } else if (data.response.result === -1) {
                                message.error(formatMessage({id: "LANG3204"}))
                            } else {
                                let messageText = formatMessage({id: "LANG3165"})

                                if (parseInt(data.response.result) < 0) {
                                    messageText = formatMessage({id: this.state.uploadErrObj[Math.abs(parseInt(data.response.result)).toString()]})
                                } else if (parseInt(data.response.result) === 4) {
                                    messageText = formatMessage({id: "LANG915"})
                                } else if (data.response.body) {
                                    messageText = data.response.body
                                }

                                message.error(messageText)
                            }
                        } else {
                            message.error(formatMessage({id: "LANG916"}))
                        }
                    } else {
                        message.error(formatMessage({id: "LANG916"}))
                    }
                }

                if (info.file.status === 'error') {
                    // message.error(`${info.file.name} file upload failed.`)
                    message.error(formatMessage({id: "LANG916"}))
                }
            }
        }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG2316"})
                })

        return (
            <div className="app-content-main">
                <Title
                    isDisplay='display-block'
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    headerTitle={ formatMessage({id: "LANG2316"}) }
                />
                <div className="content">
                    <Form>
                        <div className="function-description">
                            <span>{ formatMessage({id: "LANG2291"}) }</span>
                        </div>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG2288" /> }>
                                        <span>{ formatMessage({id: "LANG2292"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator('enable', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: settings.enable ? (settings.enable === 'yes') : false
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <div className="section-title">
                            <span>{ formatMessage({id: "LANG2277"}) }</span>
                        </div>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG3500" /> }>
                                        <span>{ formatMessage({id: "LANG3499"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator('upload', {
                                valuePropName: 'fileList',
                                normalize: this._normFile
                            })(
                                <Upload {...uploadProps}>
                                    <Button type="ghost">
                                        <Icon type="upload" />{ formatMessage({id: "LANG1607"}) }
                                    </Button>
                                </Upload>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG2287" /> }>
                                        <span>{ formatMessage({id: "LANG2283"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator('new_number', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.minlength(data, value, callback, formatMessage, 2)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.alphanumericStarPlusPound(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: this._checkConflict
                                }],
                                initialValue: ''
                            })(
                                <Input />
                            ) }
                            <Icon
                                type="plus-circle-o"
                                style={{
                                    'top': '7px',
                                    'right': '-30px',
                                    'fontSize': '20px',
                                    'cursor': 'pointer',
                                    'position': 'absolute'
                                }}
                                onClick={ this._addBlackList }
                            />
                        </FormItem>
                        <FormItem
                            { ...formItemRowLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG2289" /> }>
                                        <span>{ formatMessage({id: "LANG2280"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            <Table
                                rowKey="key"
                                columns={ columns }
                                pagination={ pagination }
                                dataSource={ this.state.blacklist }
                            />
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    spinLoading: state.spinLoading
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(injectIntl(InboundBlackList)))