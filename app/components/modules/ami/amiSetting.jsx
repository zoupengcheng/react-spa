'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage, formatMessage } from 'react-intl'
import { Col, Form, Input, message, Tooltip, Checkbox, Upload, Icon, Modal, Button } from 'antd'

const FormItem = Form.Item

class RoomAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomList: [],
            availableAccountList: [],
            roomItem: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkName = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && _.indexOf(this.state.groupNameList, value) > -1) {
            callback(formatMessage({id: "LANG2137"}))
        } else {
            callback()
        }
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _getInitData = () => {
        let amiItem = {}

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getAmiSettings'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    amiItem = response.ami_settings
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        this.setState({
            amiItem: amiItem
        })
    }
    _handleCancel = () => {
        browserHistory.push('/value-added-features/ami')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const roomId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = values
                action.tlsenable = values.tlsenable ? 'yes' : 'no'
                action.timestampevents = values.timestampevents ? 'yes' : 'no'
                action.action = "updateAmiSettings"

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)
                        }

                        this._handleCancel()
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
        const { getFieldDecorator, setFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const amiItem = this.state.amiItem || {}

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const title = formatMessage({id: "LANG3827"})

        const roomItem = this.state.roomItem || {}

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })
        const me = this
        const props_key = {
            name: 'file',
            action: api.apiHost + 'action=uploadfile&type=ami_tls_key',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                // message.loading(formatMessage({ id: "LANG979" }), 0)
                console.log(info.file.status)
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }
                if (me.state.upgradeLoading) {
                    me.props.setSpinLoading({loading: true, tip: formatMessage({id: "LANG979"})})
                    me.setState({upgradeLoading: false})
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

                        me.props.setSpinLoading({loading: false})

                        if (data.status === 0 && response && response.result === 0) {
                            Modal.confirm({
                                title: formatMessage({id: "LANG924"}),
                                content: '',
                                onOk: () => {
                                    me.setState({
                                        visible: false
                                    })
                                    UCMGUI.loginFunction.confirmReboot() 
                                },
                                onCancel: () => {
                                    me.setState({
                                        visible: false
                                    }) 
                                },
                                okText: formatMessage({id: "LANG727"}),
                                cancelText: formatMessage({id: "LANG726"})
                            })
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
                me.props.setSpinLoading({loading: false})
                message.destroy()
            }
        }
        const props_cert = {
            name: 'file',
            action: api.apiHost + 'action=uploadfile&type=ami_tls_cert',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                // message.loading(formatMessage({ id: "LANG979" }), 0)
                console.log(info.file.status)
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }
                if (me.state.upgradeLoading) {
                    me.props.setSpinLoading({loading: true, tip: formatMessage({id: "LANG979"})})
                    me.setState({upgradeLoading: false})
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

                        me.props.setSpinLoading({loading: false})

                        if (data.status === 0 && response && response.result === 0) {
                            Modal.confirm({
                                title: formatMessage({id: "LANG924"}),
                                content: '',
                                onOk: () => {
                                    me.setState({
                                        visible: false
                                    })
                                    UCMGUI.loginFunction.confirmReboot() 
                                },
                                onCancel: () => {
                                    me.setState({
                                        visible: false
                                    }) 
                                },
                                okText: formatMessage({id: "LANG727"}),
                                cancelText: formatMessage({id: "LANG726"})
                            })
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
                me.props.setSpinLoading({loading: false})
                message.destroy()
            }
        }

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'
                />
                <div className="content">
                    <Form>
                        <FormItem
                            ref="div_port"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3828" />}>
                                    <span>{formatMessage({id: "LANG3835"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('port', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: amiItem.port ? amiItem.port : "7777"
                            })(
                                <Input min={1024} max={65535} />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_tlsenable"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3831" />}>
                                    <span>{formatMessage({id: "LANG1868"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('tlsenable', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                valuePropName: 'checked',
                                initialValue: amiItem.tlsenable === "yes" ? true : false
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_tlsbindport"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3833" />}>
                                    <span>{formatMessage({id: "LANG3832"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('tlsbindport', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: amiItem.tlsbindport ? amiItem.tlsbindport : "5039"
                            })(
                                <Input min={1024} max={65535} />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_writetimeout"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG4571" />}>
                                    <span>{formatMessage({id: "LANG4570"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('writetimeout', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: amiItem.writetimeout ? amiItem.writetimeout : "100"
                            })(
                                <Input min={100} max={10000} />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_tlsbindaddr"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3834" />}>
                                    <span>{formatMessage({id: "LANG1856"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('tlsbindaddr', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: amiItem.tlsbindaddr ? amiItem.tlsbindaddr : "0.0.0.0"
                            })(
                                <Input maxLength="128" />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_timestampevents"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG4575" />}>
                                    <span>{formatMessage({id: "LANG4574"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('timestampevents', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                valuePropName: 'checked',
                                initialValue: amiItem.timestampevents === "yes" ? true : false
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_tlsprivatekey"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3847" />}>
                                    <span>{formatMessage({id: "LANG3000"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('tlsprivatekey', {
                                valuePropName: 'fileList',
                                normalize: this._normFile
                            })(
                                <Upload {...props_key}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                    </Button>
                                </Upload>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_tlscertfile"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3863" />}>
                                    <span>{formatMessage({id: "LANG3002"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('tlscertfile', {
                                valuePropName: 'fileList',
                                normalize: this._normFile
                            })(
                                <Upload {...props_cert}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                    </Button>
                                </Upload>
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(RoomAdd))
