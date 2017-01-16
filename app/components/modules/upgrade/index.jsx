'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Input, message, Popover, Select, Upload, Icon, Spin } from 'antd'
import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item
const Option = Select.Option

class Upgrade extends Component {
    constructor(props) {
        super(props)
        this.state = {
            upgrade: {},
            loading: false
        }
    }
    componentDidMount() {
        this._getUpgradeValue()
    }
    _checkJBLen = (rule, value, callback) => {
        const form = this.props.form

        if (value) {
            form.validateFields(['gs_jbmax'], { force: true })
        }

        callback()
    }
    _checkJBMax = (rule, value, callback) => {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const len = form.getFieldValue('gs_jblen')

        if (value && len && value < len) {
            callback(formatMessage({id: "LANG2142"}, { 0: formatMessage({id: "LANG1655"}), 1: formatMessage({id: "LANG2460"}) }))
        } else {
            callback()
        }
    }
    _getUpgradeValue = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getUpgradeValue' },
            type: 'json',
            async: false,
            success: function(res) {
                let upgrade = res.response

                this.setState({
                    upgrade: upgrade
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleCancel = () => {
        browserHistory.push('/maintenance/upgrade')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values

                action.action = 'setUpgradeValue'

                action.gs_jbenable = (action.service_check_enable ? 'yes' : 'no')

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
    // Not Called
    // function preupload() {
    //     var checkFlag = false;

    //     $.ajax({
    //         type: 'POST',
    //         url: '../preupload?type=firmware',
    //         async: false,
    //         success: function(t) {
    //             if (typeof t == "string" && t.contains("Authentication failed")) {
    //                 UCMGUI.logoutFunction.doLogout();
    //                 return;
    //             }

    //             // take out blank space
    //             t = t.trim().toLowerCase();

    //             if (t.endsWith("0") || t.endsWith("ok")) {
    //                 checkFlag = true;
    //             }
    //         }
    //     });

    //     return checkFlag;
    // }
    // Parse response code, return the corresponding text.
    // _transUploadcode = (rescode) => {
    //     if (!isNaN(rescode)) {
    //         let rescode = parseInt(rescode)

    //         switch (rescode) {
    //             case 0:
    //                 return "LANG961"
    //             case 236:
    //                 return "LANG962"
    //             case 238:
    //                 return "LANG963"
    //             case 239:
    //                 return "LANG964"
    //             case 240:
    //                 return "LANG965"
    //             case 241:
    //                 return "LANG966"
    //             case 242:
    //                 return "LANG967"
    //             case 243:
    //             case 253:
    //                 return "LANG968"
    //             case 244:
    //             case 254:
    //                 return "LANG969"
    //             case 245:
    //                 return "LANG970"
    //             case 246:
    //                 return "LANG971"
    //             case 247:
    //             case 248:
    //                 return "LANG972"
    //             case 249:
    //             case 250:
    //             case 255:
    //                 return "LANG973"
    //             case 251:
    //                 return "LANG974"
    //             case 252:
    //                 return "LANG975"
    //             default:
    //                 return "LANG976"
    //         }
    //     } else {
    //         return "LANG976"
    //     }
    // }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const me = this

        let upgrade = this.state.upgrade || {}
        let via = upgrade['upgrade-via']
        let path = upgrade['firmware-server-path']
        let prefix = upgrade['firmware-file-prefix']
        let suffix = upgrade['firmware-file-suffix']
        let username = upgrade.username
        let password = upgrade.password

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG619"})})

        const props = {
            name: 'file',
            action: api.apiHost + 'action=uploadfile&type=firmware',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                // message.loading(formatMessage({ id: "LANG979" }), 0)

                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }
                if (info.file.status === 'done') {
                    // message.success(`${info.file.name} file uploaded successfully`)
                    let data = info.file.response

                    if (data) {
                        let status = data.status,
                            response = data.response

                        if (data.status === 0 && response && response.result === 0) {
                            // top.dialog.dialogConfirm({
                            //     confirmStr: $P.lang("LANG924"),
                            //     buttons: {
                            //         ok: function() {
                            //             UCMGUI.loginFunction.confirmReboot();
                            //         },
                            //         cancel: function() {
                            //             UCMGUI.loginFunction.checkTrigger();
                            //         }
                            //     }
                            // })
                            <Popconfirm title={
                                <FormattedHTMLMessage
                                    id='LANG924'
                                />} 
                                onConfirm={() => UCMGUI.loginFunction.confirmReboot()}>
                            </Popconfirm>
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
        const container = (
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover title={ formatMessage({id: "LANG1269"}) } content={ formatMessage({id: "LANG1270"}) }><span>{ formatMessage({id: "LANG1269"}) }</span></Popover>
                        </span>
                    )}>
                    { getFieldDecorator('upgrade-via', {
                        initialValue: via
                    })(
                        <Select>
                            <Option value="0">{ formatMessage({id: "LANG216"}) }</Option>
                            <Option value="1">{ formatMessage({id: "LANG217"}) }</Option>
                            <Option value="2">{ formatMessage({id: "LANG218"}) }</Option>
                        </Select>
                    ) }
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover title={ formatMessage({id: "LANG1271"}) } content={ formatMessage({id: "LANG1272"}) }><span>{ formatMessage({id: "LANG1271"}) }</span></Popover>
                        </span>
                    )}>
                    { getFieldDecorator('firmware-server-path', {
                        rules: [
                            { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                            { validator: this._checkJBLen }
                        ],
                        initialValue: path
                    })(
                        <Input />
                    ) }
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover title={ formatMessage({id: "LANG1273"}) } content={ formatMessage({id: "LANG1274"}) }><span>{ formatMessage({id: "LANG1273"}) }</span></Popover>
                        </span>
                    )}>
                    { getFieldDecorator('firmware-file-prefix', {
                        rules: [
                            { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                            { validator: this._checkJBMax }
                        ],
                        initialValue: prefix
                    })(
                        <Input />
                    ) }
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover title={ formatMessage({id: "LANG1275"}) } content={ formatMessage({id: "LANG1276"}) }><span>{ formatMessage({id: "LANG1275"}) }</span></Popover>
                        </span>
                    )}>
                    { getFieldDecorator('firmware-file-suffix', {
                        rules: [
                            { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                            { validator: this._checkJBMax }
                        ],
                        initialValue: suffix
                    })(
                        <Input />
                    ) }
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover title={ formatMessage({id: "LANG1277"}) } content={ formatMessage({id: "LANG1278"}) }><span>{ formatMessage({id: "LANG1277"}) }</span></Popover>
                        </span>
                    )}>
                    { getFieldDecorator('username', {
                        rules: [
                            { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                            { validator: this._checkJBMax }
                        ],
                        initialValue: username
                    })(
                        <Input />
                    ) }
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover title={ formatMessage({id: "LANG1279"}) } content={ formatMessage({id: "LANG1280"}) }><span>{ formatMessage({id: "LANG1279"}) }</span></Popover>
                        </span>
                    )}>
                    { getFieldDecorator('password', {
                        rules: [
                            { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                            { validator: this._checkJBMax }
                        ],
                        initialValue: password
                    })(
                        <Input />
                    ) }
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover title={ formatMessage({id: "LANG1284"}) } content={ formatMessage({id: "LANG1285"}) }><span>{ formatMessage({id: "LANG1284"}) }</span></Popover>
                        </span>
                    )}>
                    { getFieldDecorator('upload', {
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
            </Form>
        )
        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG619"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Spin spinning={this.state.loading}>{container}</Spin>
            </div>
        )
    }
}

export default Form.create()(injectIntl(Upgrade))