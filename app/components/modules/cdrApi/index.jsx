'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, message, Row, Tooltip, Button, Upload, Icon } from 'antd'

const FormItem = Form.Item
let uuid = 1

class CdrApi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cdrSettings: {},
            cdrAccounts: {},
            ipList: [],
            netmaskList: []
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _getInitData = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getCDRAPISettings'
            },
            type: 'json',
            async: false,
            success: function(res) {
                let response = res.response.http_settings || {}

                this.setState({
                    cdrSettings: response
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getCDRAPIAccount'
            },
            type: 'json',
            async: false,
            success: function(res) {
                let response = res.response.cdrapi_accounts || {}
                let cdrapiPermits = res.response.cdrapi_permits || []
                let ipList = [],
                    netmaskList = []

                _.each(cdrapiPermits, function(value, key) {
                    let permit = value.permit

                    ipList.push(permit.split('\/')[0])
                    netmaskList.push(permit.split('\/')[1])
                })

                if (ipList.length > 0) {
                    uuid = ipList.length - 1
                }

                this.setState({
                    cdrAccounts: response,
                    ipList: ipList,
                    netmaskList: netmaskList
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _removeIP = (k) => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')

        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        })
    }
    _addIP = () => {
        uuid++
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(uuid)
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys
        })
    }
    _handleCancel = () => {
        browserHistory.push('/cdr/cdrApi')
    }
    _handleSubmit = () => {
        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        const extensionId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let actionSettings = {},
                    actionAccounts = {}

                actionSettings.action = 'updateCDRAPISettings'
                actionSettings.tlsenable = actionSettings.enabled = (values.enabled ? 'yes' : 'no')
                actionSettings.tlsbindaddr = values.tlsbindaddr

                let ipList = []

                ipList.push(values.permitIP0 + '/' + values.permitNetmask0)
                const keys = getFieldValue('keys')
                keys.map((k, index) => {
                    let ip = `permitIP${k}`
                    let netmask = `permitNetmask${k}`
                    ipList.push(values[ip] + '/' + values[netmask])
                })
                actionAccounts.permit = ipList.join(';')
                actionAccounts.action = 'updateCDRAPIAccount'
                actionAccounts.username = values.username
                actionAccounts.secret = values.secret

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: actionSettings,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            $.ajax({
                                url: api.apiHost,
                                method: "post",
                                data: actionAccounts,
                                type: 'json',
                                error: function(e) {
                                    message.error(e.statusText)
                                },
                                success: function(data) {
                                    var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                                    if (bool) {
                                        message.destroy()
                                        message.success(successMessage)
                                    }
                                }.bind(this)
                            })
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
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, setFieldValue, getFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemIPLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        const formItemIPWithoutLabelLayout = {
            wrapperCol: { span: 18, offset: 3 }
        }

        let cdrSettings = this.state.cdrSettings
        let cdrAccounts = this.state.cdrAccounts
        let ipList = this.state.ipList
        let netmaskList = this.state.netmaskList

        const title = formatMessage({id: "LANG2998"})

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        const me = this

        const props = {
            name: 'filename',
            action: api.apiHost + 'action=uploadfile&type=cdr_tls_key',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                // message.loading(formatMessage({ id: "LANG979" }), 0)
                console.log(info.file.status)
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }

                if (info.file.status === 'removed') {
                    return
                }

                if (info.file.status === 'done') {
                    // message.success(`${info.file.name} file uploaded successfully`)
                    let data = info.file.response
                    if (data) {
                        let status = data.status,
                            response = data.response

                        if (data.status === 0 && response && response.result === 0) {
                        } else if (data.status === 4) {
                            message.error(formatMessage({id: "LANG915"}))
                        } else if (!_.isEmpty(response)) {
                            message.error(formatMessage({id: UCMGUI.transUploadcode(response.result)}))
                        } else {
                            message.error(formatMessage({id: "LANG916"}))
                        }
                    } else {
                        message.error(formatMessage({id: "LANG916"}))
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`)
                }
            },
            onRemove() {
                message.destroy()
            }
        }

        let keyList = []
        for (let k = 1; k < ipList.length; k++) {
            keyList.push(k)
        }

        getFieldDecorator('keys', { initialValue: keyList })

        const keys = getFieldValue('keys')

        const formIPItems = keys.map((k, index) => {
            return (
            <FormItem key={ k }
                { ...formItemIPWithoutLabelLayout }
            >
                <Col span="8">
                    <FormItem>
                        {getFieldDecorator(`permitIP${k}`, {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: ipList[k]
                            })(
                                <Input placeholder={ formatMessage({id: "LANG1915"}) } />
                        )}
                    </FormItem>
                </Col>
                <Col span="1">
                    <p className="ant-form-split">/</p>
                </Col>
                <Col span="8" style={{ marginRight: 10 }}>
                    <FormItem>
                        {getFieldDecorator(`permitNetmask${k}`, {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: netmaskList[k]
                            })(
                                <Input placeholder={ formatMessage({id: "LANG1902"}) } />
                        )}
                    </FormItem>
                </Col>
                <Col span="1">
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={ () => this._removeIP(k) }
                    />
                </Col>
            </FormItem>
            )
        })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'/>
                <div className="content">
                    <Form>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2784" /> }>
                                    <span>{ formatMessage({id: "LANG274"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('enabled', {
                                valuePropName: 'checked',
                                initialValue: cdrSettings.enabled === 'yes'
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2790" /> }>
                                    <span>{ formatMessage({id: "LANG1856"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('tlsbindaddr', {
                                initialValue: cdrSettings.tlsbindaddr
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2999" /> }>
                                    <span>{ formatMessage({id: "LANG3000"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('tlsprivatekey', {
                                valuePropName: 'fileList',
                                normalize: this._normFile
                            })(
                                <Upload {...props}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                    </Button>
                                </Upload>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG3001" /> }>
                                    <span>{ formatMessage({id: "LANG3002"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('tlscertfile', {
                                valuePropName: 'fileList',
                                normalize: this._normFile
                            })(
                                <Upload {...props}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                    </Button>
                                </Upload>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2779" /> }>
                                    <span>{ formatMessage({id: "LANG72"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('username', {
                                initialValue: cdrAccounts.username || 'cdrapi'
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2780" /> }>
                                    <span>{ formatMessage({id: "LANG73"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('secret', {
                                initialValue: cdrAccounts.secret || '12345'
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemIPLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3826" />}>
                                    <span>{formatMessage({id: "LANG2776"})}</span>
                                </Tooltip>
                            )}>
                            <Col span="8">
                                <FormItem>
                                    {getFieldDecorator("permitIP0", {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: ipList[0] ? ipList[0] : ""
                                        })(
                                            <Input placeholder={ formatMessage({id: "LANG1915"}) } />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="1">
                                <p className="ant-form-split">/</p>
                            </Col>
                            <Col span="8" style={{ marginRight: 10 }}>
                                <FormItem>
                                    {getFieldDecorator("permitNetmask0", {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: netmaskList[0] ? netmaskList[0] : ""
                                        })(
                                            <Input placeholder={ formatMessage({id: "LANG1902"}) } />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="1">
                                <Icon
                                    className="dynamic-plus-button"
                                    type="plus-circle-o"
                                    onClick={ this._addIP }
                                />
                            </Col>
                        </FormItem>
                        { formIPItems }
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(CdrApi))