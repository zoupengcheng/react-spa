'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Button, Checkbox, Input, InputNumber, message, Tooltip, Select, Upload, Icon, Modal } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item
const Option = Select.Option

class HttpServer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            httpserver: {}
        }
    }
    componentDidMount () {
        this._getHttpServerSettings()
    }
    _getHttpServerSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getHttpServer' },
            type: 'json',
            async: false,
            success: function(res) {
                let httpserver = res.response.httpserver

                this.setState({
                    httpserver: httpserver
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _jumpTo = () => {
        const { formatMessage } = this.props.intl

        message.loading(formatMessage({ id: "LANG806" }), 0)

        $.ajax({
            type: "POST",
            url: api.apiHost,
            data: "action=reloadHttpServer&reflush_server=0"
        })

        setTimeout(function() {
            message.destroy()

            var webHttps = $("#web_https option:selected").text(),
                webPort = $('#web_port').val()

            if (webHttps.toLowerCase() === "http") {
                location.href = "http://" + top.location.hostname + ":" + webPort + top.location.pathname
            } else if (webHttps.toLowerCase() === "https") {
                location.href = "https://" + top.location.hostname + ":" + webPort + top.location.pathname
            }
        }, 5000)
    }
    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }
    _resetCert = () => {
        const { formatMessage } = this.props.intl

        Modal.confirm({
            title: formatMessage({id: "LANG543" }),
            content: formatMessage({id: "LANG4238" }),
            okText: formatMessage({id: "LANG727" }),
            cancelText: formatMessage({id: "LANG726" }),
            onOk() {
                message.loading(formatMessage({ id: "LANG806" }), 0)

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: api.apiHost,
                    data: "action=resetHttpServer&reflush_server=0"
                })

                setTimeout(function() {
                    message.destroy()

                    var webHttps = $("#web_https option:selected").text(),
                        webPort = $('#web_port').val()

                    if (webHttps.toLowerCase() === "http") {
                        location.href = "http://" + top.location.hostname + ":" + webPort + top.location.pathname
                    } else if (webHttps.toLowerCase() === "https") {
                        location.href = "https://" + top.location.hostname + ":" + webPort + top.location.pathname
                    }
                }, 5000)
            },
            onCancel() {}
        })
    }
    _handleCancel = () => {
        browserHistory.push('/system-settings/httpServer')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values

                action.action = 'updateHttpServer'

                action.web_https = (action.web_https === 'disable' ? '0' : '1')

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(formatMessage({ id: "LANG815" }))
                            this._jumpTo()
                        }
                    }.bind(this)
                })
            }
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        let httpserver = this.state.httpserver || {}
        let web_https = (httpserver.web_https === 1 ? 'enable' : 'disable')
        let web_port = httpserver.web_port
        let web_redirect = String(httpserver.web_redirect)

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG716"})})

        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG716"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ formatMessage({id: "LANG571"}) }>
                                    <span>{ formatMessage({id: "LANG571"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('web_redirect', {
                            initialValue: web_redirect
                        })(
                            <Select>
                                <Option value="1">{ formatMessage({id: "LANG274"}) }</Option>
                                <Option value="0">{ formatMessage({id: "LANG273"}) }</Option>
                            </Select>
                        ) }
                    </FormItem>

                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ formatMessage({id: "LANG617"}) }>
                                    <span>{ formatMessage({id: "LANG617"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('web_https', {
                            initialValue: web_https
                        })(
                            <Select>
                                <Option value="disable">{ formatMessage({id: "LANG217"}) }</Option>
                                <Option value="enable">{ formatMessage({id: "LANG218"}) }</Option>
                            </Select>
                        ) }
                    </FormItem>

                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ formatMessage({id: "LANG618"}) }>
                                    <span>{ formatMessage({id: "LANG618"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('web_port', {
                            initialValue: web_port
                        })(
                            <Input />
                        ) }
                    </FormItem>

                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ formatMessage({id: "LANG2999"}) }>
                                    <span>{ formatMessage({id: "LANG3000"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('tlsprivatekey', {
                            valuePropName: 'fileList',
                            normalize: this._normFile
                        })(
                            <Upload name="logo" action="/upload.do" listType="picture" onChange={ this.handleUpload }>
                                <Button type="ghost">
                                    <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                </Button>
                            </Upload>
                        ) }
                    </FormItem>

                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ formatMessage({id: "LANG3001"}) }>
                                    <span>{ formatMessage({id: "LANG3002"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('tlscertfile', {
                            valuePropName: 'fileList',
                            normalize: this._normFile
                        })(
                            <Upload name="logo" action="/upload.do" listType="picture" onChange={ this.handleUpload }>
                                <Button type="ghost">
                                    <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                </Button>
                            </Upload>
                        ) }
                    </FormItem>

                    <div>
                        <Button type="primary" onClick={ this._resetCert }>{formatMessage({id: "LANG4229"})}</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(HttpServer))