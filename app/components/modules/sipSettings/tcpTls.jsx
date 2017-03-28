'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Button, Row, Col, Checkbox, message, Tooltip, Select, Upload, Icon, Modal } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
import _ from 'underscore'

const CustomizedForm = injectIntl(Form.create({
    onFieldsChange(props, changedFields) {
        // this.props.dataSource["form"] = this.props.form
        props.onChange(changedFields)
    },
    mapPropsToFields(props) {
        return {
            username: {
            }
        }
    }
})((props) => {
    const { getFieldDecorator } = props.form
    const { formatMessage } = props.intl
    const sipTcpSettings = props.dataSource
    const upgradeLoading = props.upgradeLoading
    const sipTLSCa = props.sipTLSCa
    const sipTLSCrt = props.sipTLSCrt
    const sipTLSKey = props.sipTLSKey
    const normFile = props.normFile
    const onRemoveFile = props.onRemoveFile
    const checkCaFile = props.checkCaFile
    const checkCrtFile = props.checkCrtFile
    const checkKeyFile = props.checkKeyFile
    const caList = props.caList || []
    const me = this
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    }

    const propsTLSCa = {
        name: 'file',
        action: api.apiHost + 'action=uploadfile&type=sip_tls_ca_file',
        headers: {
            authorization: 'authorization-text'
        },
        onChange(info) {
            // message.loading(formatMessage({ id: "LANG979" }), 0)
            console.log(info.file.status)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (upgradeLoading) {
                props.setUpgradeLoading()
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
                        message.success(formatMessage({id: "LANG906"}))
                        props.checkFiles()
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
        },
        beforeUpload: checkCaFile
    }

    const propsTLSCrt = {
        name: 'file',
        action: api.apiHost + 'action=uploadfile&type=sip_tls_crt',
        headers: {
            authorization: 'authorization-text'
        },
        onChange(info) {
            // message.loading(formatMessage({ id: "LANG979" }), 0)
            console.log(info.file.status)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (upgradeLoading) {
                props.setUpgradeLoading()
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
                        message.success(formatMessage({id: "LANG906"}))
                        props.checkFiles()
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
        },
        beforeUpload: checkCrtFile
    }

    const propsTLSKey = {
        name: 'file',
        action: api.apiHost + 'action=uploadfile&type=sip_tls_key',
        headers: {
            authorization: 'authorization-text'
        },
        onChange(info) {
            // message.loading(formatMessage({ id: "LANG979" }), 0)
            console.log(info.file.status)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (upgradeLoading) {
                props.setUpgradeLoading()
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
                        message.success(formatMessage({id: "LANG906"}))
                        props.checkFiles()
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
        },
        beforeUpload: checkKeyFile
    }
    const propsTLSCaList = {
        name: 'file',
        action: api.apiHost + 'action=uploadfile&type=sip_tls_ca_dir',
        headers: {
            authorization: 'authorization-text'
        },
        onChange(info) {
            // message.loading(formatMessage({ id: "LANG979" }), 0)
            console.log(info.file.status)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (upgradeLoading) {
                props.setUpgradeLoading()
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
                        message.success(formatMessage({id: "LANG906"}))
                        props.checkFiles()
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
        },
        beforeUpload: checkCaFile
    }
    const spanCaList = caList.map((item, index) => {
        return (
            <row>
                <Col span={12}>
                    <span>{item}</span>
                </Col>
                <Col span={12}>
                    <Button
                        icon="delete"
                        type="primary"
                        size='default'
                        onClick={ onRemoveFile.bind(this, item) }>
                        { formatMessage({id: "LANG739"}) }
                    </Button>
                </Col>
            </row>
            )
    })
    return (
        <Form>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1854" /> }>
                            <span>{ formatMessage({id: "LANG1853"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tcpenable', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: sipTcpSettings.tcpenable === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1854" /> }>
                            <span>{ formatMessage({id: "LANG1851"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tcpbindaddr', {
                    rules: [],
                    initialValue: sipTcpSettings.tcpbindaddr
                })(
                    <Input type="text" maxLength="127" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG5126" /> }>
                            <span>{ formatMessage({id: "LANG5125"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tcpbindaddr6', {
                    rules: [],
                    initialValue: sipTcpSettings.tcpbindaddr6
                })(
                    <Input type="text" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1867" /> }>
                            <span>{ formatMessage({id: "LANG1868"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsenable', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: sipTcpSettings.tlsenable === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1855" /> }>
                            <span>{ formatMessage({id: "LANG5204"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsbindaddr', {
                    rules: [],
                    initialValue: sipTcpSettings.tlsbindaddr
                })(
                    <Input type="text" maxLength="127" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG5128" /> }>
                            <span>{ formatMessage({id: "LANG5127"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsbindaddr6', {
                    rules: [],
                    initialValue: sipTcpSettings.tlsbindaddr6
                })(
                    <Input type="text" maxLength="127" />
                )}
            </FormItem>
            <FormItem
                className="hidden"
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1865" /> }>
                            <span>{ formatMessage({id: "LANG1866"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsclientmethod', {
                    rules: [],
                    initialValue: sipTcpSettings.tlsclientmethod
                })(
                    <Select style={{ width: 200 }}>
                        <Option value="tlsv1">TLSv1</Option>
                        <Option value="sslv3">SSLv3</Option>
                        <Option value="sslv2">SSLv2</Option>
                    </Select>
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1869" /> }>
                            <span>{ formatMessage({id: "LANG1870"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('tlsdontverifyserver', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: sipTcpSettings.tlsdontverifyserver === "yes" ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }

                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1861" /> }>
                            <span>{ formatMessage({id: "LANG1862"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                <Col span={12}>
                { getFieldDecorator('tls_ca_file', {
                    valuePropName: 'fileList',
                    normalize: normFile
                })(
                    <Upload {...propsTLSCa} disabled= {sipTLSCa !== ""}>
                        <Button type="ghost">
                            <Icon type="upload" />{sipTLSCa === "" ? formatMessage({id: "LANG1607"}) : "TLS.ca"}
                        </Button>
                    </Upload>
                ) }
                </Col>
                <Col span={6}>
                    <Button
                        icon="delete"
                        type="primary"
                        size='default'
                        disabled= {sipTLSCa === ""}
                        onClick={ onRemoveFile.bind(this, sipTLSCa) }>
                        { formatMessage({id: "LANG739"}) }
                    </Button>
                </Col>
            </FormItem>
            <FormItem
                { ...formItemLayout }

                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1863" /> }>
                            <span>{ formatMessage({id: "LANG1864"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                <Col span={12}>
                { getFieldDecorator('tls_crt_file', {
                    valuePropName: 'fileList',
                    normalize: normFile
                })(
                    <Upload {...propsTLSCrt} disabled= {sipTLSCrt !== ""}>
                        <Button type="ghost">
                            <Icon type="upload" />{sipTLSCrt === "" ? formatMessage({id: "LANG1607"}) : "TLS.crt"}
                        </Button>
                    </Upload>
                ) }
                </Col>
                <Col span={6}>
                    <Button
                        icon="delete"
                        type="primary"
                        size='default'
                        disabled= {sipTLSCrt === ""}
                        onClick={ onRemoveFile.bind(this, sipTLSCrt) }>
                        { formatMessage({id: "LANG739"}) }
                    </Button>
                </Col>
            </FormItem>
            <FormItem
                { ...formItemLayout }

                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG4165" /> }>
                            <span>{ formatMessage({id: "LANG4166"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                <Col span={12}>
                { getFieldDecorator('tls_key_file', {
                    valuePropName: 'fileList',
                    normalize: normFile
                })(
                    <Upload {...propsTLSKey} disabled= {sipTLSKey !== ""}>
                        <Button type="ghost">
                            <Icon type="upload" />{sipTLSKey === "" ? formatMessage({id: "LANG1607"}) : "TLS.key"}
                        </Button>
                    </Upload>
                ) }
                </Col>
                <Col span={6}>
                    <Button
                        icon="delete"
                        type="primary"
                        size='default'
                        disabled= {sipTLSKey === ""}
                        onClick={ onRemoveFile.bind(this, sipTLSKey) }>
                        { formatMessage({id: "LANG739"}) }
                    </Button>
                </Col>
            </FormItem>
            <FormItem
                { ...formItemLayout }

                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1859" /> }>
                            <span>{ formatMessage({id: "LANG1860"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                <Col>
                { getFieldDecorator('tls_ca_dir', {
                    valuePropName: 'fileList',
                    normalize: normFile
                })(
                    <Upload {...propsTLSCaList} >
                        <Button type="ghost">
                            <Icon type="upload" />{formatMessage({id: "LANG1607"})}
                        </Button>
                    </Upload>
                ) }
                </Col>
                <Row>
                    {spanCaList}
                </Row>
            </FormItem>
        </Form>
    )
}))

class TcpTls extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sipTLSCa: "",
            sipTLSCrt: "",
            sipTLS: ""
        }
    }
    componentDidMount() {
        this._checkFiles()
    }
    componentWillUnmount() {

    }
    _checkFiles = () => {
        const { formatMessage } = this.props.intl
        let sipTLSCa = ""
        let sipTLSCrt = ""
        let sipTLSKey = ""
        let type = ""
        let me = this
        let caList = []

        type = "sip_tls_ca_file"
        $.ajax({
            type: "post",
            url: "/cgi",
            async: false,
            data: {
                "action": "checkFile",
                "type": type
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                if (data && data.hasOwnProperty("status")) {
                     if (data.status === 0) {
                        sipTLSCa = type
                     }
                } else {
                    message.error(formatMessage({ id: "LANG3868" }))
                }
            }
        })

        type = "sip_tls_crt"
        $.ajax({
            type: "post",
            url: "/cgi",
            async: false,
            data: {
                "action": "checkFile",
                "type": type
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                if (data && data.hasOwnProperty("status")) {
                     if (data.status === 0) {
                        sipTLSCrt = type
                     }
                } else {
                    message.error(formatMessage({ id: "LANG3868" }))
                }
            }
        })

        type = "sip_tls_key"
        $.ajax({
            type: "post",
            url: "/cgi",
            async: false,
            data: {
                "action": "checkFile",
                "type": type
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                if (data && data.hasOwnProperty("status")) {
                     if (data.status === 0) {
                        sipTLSKey = type
                     }
                } else {
                    message.error(formatMessage({ id: "LANG3868" }))
                }
            }
        })

        $.ajax({
            type: "post",
            url: "/cgi",
            async: false,
            data: {
                "action": "listFile",
                "type": "sip_tls_ca_dir",
                "page": 1,
                "item_num": 1000000,
                "sidx": "d",
                "sord": "desc"
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                if (data && data.hasOwnProperty("status") && data.status === 0 && data.response.result === 0) {
                    let fileList = data.response.sip_tls_ca_dir
                    fileList.map((item, i) => {
                        caList.push(item.n)
                    })
                } else {
                    message.error(formatMessage({ id: "LANG3868" }))
                }
            }
        })
        this.setState({
            sipTLSCa: sipTLSCa,
            sipTLSCrt: sipTLSCrt,
            sipTLSKey: sipTLSKey,
            caList: caList
        })
    }
    _checkFile = (type, msg, file) => {
        const { formatMessage } = this.props.intl

        let filename = file.name
        filename = filename.toLowerCase()
        if (filename.slice(-type.length) !== type) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG911"}, {0: type, 1: formatMessage({id: msg})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
            return false
        } else {
            return true
        }
    }
    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }
    _onRemoveFileOK = (type) => {
        let successMessage = ''
        const { formatMessage } = this.props.intl
        let me = this

        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2798" })}}></span>
        let data = {
            action: "removeFile"
        }
        if (type !== "sip_tls_ca_file" && type !== "sip_tls_crt" && type !== "sip_tls_key") {
            data.type = "sip_tls_ca_dir"
            data.data = type
        } else {
            data.type = type
        }

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: data,
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                    confirm({
                        title: formatMessage({id: "LANG543"}),
                        content: formatMessage({ id: "LANG926" }),
                        okText: formatMessage({id: "LANG727"}),
                        cancelText: formatMessage({id: "LANG726"}),
                        onOk: me.props.reboot,
                        onCancel: me._checkFiles.bind(this)
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _onRemoveFile = (type) => {
        let successMessage = ''
        const { formatMessage } = this.props.intl
        let me = this
        confirm({
            title: (formatMessage({id: "LANG543"})),
            content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG938"})}} ></span>,
            onOk() {
                me._onRemoveFileOK(type)
            },
            onCancel() {},
            okText: formatMessage({id: "LANG727"}),
            cancelText: formatMessage({id: "LANG726"})
        })
    }
    _setUpgradeLoading= () => {
        this.setState({upgradeLoading: false})
    }
    _handleFormChange = (changedFields) => {
        _.extend(this.props.dataSource, changedFields)
    }
    render() {
        const {formatMessage} = this.props.intl
        let sipTcpSettings = this.props.dataSource
        let reboot = this.props.reboot

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) }
                    dataSource={sipTcpSettings}
                    sipTLSCa={this.state.sipTLSCa}
                    sipTLSCrt={this.state.sipTLSCrt}
                    sipTLSKey={this.state.sipTLSKey}
                    upgradeLoading={this.state.upgradeLoading}
                    setUpgradeLoading={this._setUpgradeLoading}
                    normFile={this._normFile}
                    checkFiles={this._checkFiles}
                    checkCaFile={this._checkFile.bind(this, ".ca", "LANG1860")}
                    checkCrtFile={this._checkFile.bind(this, ".crt", "LANG1864")}
                    checkKeyFile={this._checkFile.bind(this, ".key", "LANG4166")}
                    onRemoveFile={this._onRemoveFile}
                    caList={this.state.caList}
                    reboot={reboot}
                />
            </div>
        )
    }
}

TcpTls.propTypes = {
}

export default injectIntl(TcpTls)
