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
import { Col, Form, Input, Row, message, Transfer, Tooltip, Checkbox, Icon, Modal, Button, Table, Upload } from 'antd'
import ZEROCONFIG from './parser/ZCDataSource'
const FormItem = Form.Item
const uploadErrObj = {
    "-1": "LANG4144",
    "-2": "LANG4145"
}   

class TemplateManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            baseVersion: null,
            remoteTemplateList: [],
            currentModal: null
        }
    }
    componentDidMount() {
        this._getVersionInfo()
        this._fetchRemoteTemplateList()
    }
    componentWillUnmount() {
    }
    onChange(activeKey) {
        if (activeKey === "1") {

        } else {            
            
        }
    }
    _getVersionInfo() {
        $.ajax({
            method: "post",
            url: api.apiHost,
            data: {
                action: "getZeroConfigVersionInfo"
            },
            async: true,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, function () {
                })

                if (bool) {
                    const version_info = data.response.zc_model.base_version
                    this.setState({
                        baseVersion: version_info                       
                    })
                }
            }.bind(this)
        })
    }
    _fetchRemoteTemplateList() {
        $.ajax({
            method: "post",
            url: api.apiHost,
            data: {
                action: "fetchRemoteTemplateList",
                sord: "asc",
                sidx: "model"
            },
            async: true,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                message.destroy()

                let bool = UCMGUI.errorHandler(data, function () {
                })

                if (bool) {
                    let template_list = data.response.template_list
                    this.setState({
                        remoteTemplateList: template_list                       
                    })
                }
            }.bind(this)
        })
    }
    _reloadData() {
        const { formatMessage } = this.props.intl
        const me = this
        message.loading(formatMessage({id: "LANG3717"}))
                               
        ZEROCONFIG.reset()
        ZEROCONFIG.init(() => {
            let checkReady = () => {
                if (ZEROCONFIG.isDataReady() === 1) {
                    message.success(formatMessage({id: "LANG4143"}))
                    me._fetchRemoteTemplateList()
                }
            }
            checkReady()
        })       
    }
    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }    
    _renderModalTitle = () => {
        const { formatMessage } = this.props.intl
        let type = this.state.type

        if (type === "upload") {
            return formatMessage({id: "LANG4116"})
        } else if (type === "downloadReleaseNote") {
            return "Updates"
        }
    }
    _handleOk = () => {
    }
    _handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    _renderModalOkText = () => {
        const { formatMessage } = this.props.intl

        let type = this.state.type
        
        if (type === "upload") {
            return formatMessage({ id: "LANG4116" })
        } else if (type === "downloadReleaseNote") {
            return formatMessage({ id: "LANG727" })
        } else {
            return formatMessage({id: "LANG728"})
        }
    }
    _renderModalCancelText = () => {
        const { formatMessage } = this.props.intl
        
        return formatMessage({id: "LANG726"})
    }
    _downloadModelTemplate(record) {
        const { formatMessage } = this.props.intl

        /* if (record.update !== null && record.update.length > 0) {
            this._downloadReleaseNotes()
        } else { */
            const filename = record.filename
            message.destroy()
            if (!filename) {
                message.error(formatMessage({ id: "LANG916" }))
                return
            }
            message.loading(formatMessage({ id: "LANG904" }))
            $.ajax({
                method: "post",
                url: api.apiHost,
                data: {
                    action: "fetchRemoteTemplatePackage",
                    "model_template": filename
                },
                async: true,
                error: function(e) {
                    message.error(e.statusText)
                },
                success: function (data) {
                    message.destroy()
                    if (data.hasOwnProperty('response') && data.response.hasOwnProperty('result') && data.response.result === 0) {
                        this._reloadData()
                    } else if (data.hasOwnProperty('response') && data.response.hasOwnProperty('result') && uploadErrObj.hasOwnProperty(data.response.result)) {
                        message.error(uploadErrObj[data.response.result])
                    } else {
                        message.error(formatMessage({id: "LANG4144"}))
                    }
                }.bind(this)
            })
       //  }
    }
    _downloadReleaseNotes() {

    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const me = this
             
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }  
        const baseVersion = this.state.baseVersion
      
        const uploadProps = {
            name: 'file',
            action: api.apiHost + 'action=uploadfile&type=zc_model_package',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                // message.loading(formatMessage({ id: "LANG979" }), 0)
                console.log("WL onchage:", info)
                if (info.file.status === 'uploading') {
                    message.loading(formatMessage({ id: "LANG905" }), 0)
                }

                if (info.file.status === 'removed') {
                }

                if (info.file.status === 'done') {
                    let data = info.file.response
                    message.destroy()                            
                    if (data) {
                        let status = data.status,
                            response = data.response

                        if (status === 0 && response && response.result === 0) {
                            me._reloadData()
                        } else if (response && uploadErrObj.hasOwnProperty(response.result)) {
                            message.error(uploadErrObj[response.result])
                        } else {
                            message.error(formatMessage({id: "LANG4144"}))
                        }
                    } else {
                        message.error(formatMessage({id: "LANG916"}))
                    }
                } 
                if (info.file.status === 'error') {
                    message.error(formatMessage({id: "LANG916"}))
                }
            },
            onRemove() {
            }
        }
        const columns = [
            {
                title: formatMessage({id: "LANG1299"}),
                dataIndex: 'vendor'
            }, {
                title: formatMessage({id: "LANG1295"}),
                dataIndex: 'model'
            }, {
                title: formatMessage({id: "LANG1298"}),
                dataIndex: 'version'
            }, {
                title: formatMessage({id: "LANG2257"}),
                dataIndex: 'size'
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: 'update', 
                key: 'x', 
                render: (text, record, index) => (
                    // TODO: change icon according to status
                    <span>
                        <span className="sprite sprite-download" onClick={this._downloadModelTemplate.bind(this, record)}></span>
                    </span>
                ) 
            }
        ]
        
        const pagination = {
            total: this.state.remoteTemplateList.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            },
            onChange(current) {
                console.log('Current: ', current)
            }
        }
        
        // rowSelection object indicates the need for row selection
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            },
            onSelect(record, selected, selectedRows) {
                console.log(record, selected, selectedRows)
            },
            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selected, selectedRows, changeRows)
            }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <div className="section-title">{formatMessage({id: "LANG4765"})}</div>
                <Row>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG4767" />}>
                                <span>{formatMessage({id: "LANG4766"})}</span>
                            </Tooltip>
                        )}>
                        <span>
                            {baseVersion}
                        </span>
                    </FormItem>
                </Row>
                <div className="section-title">{formatMessage({id: "LANG4116"})}</div>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <Tooltip title={<FormattedHTMLMessage id="LANG4118" />}>
                            <span>{formatMessage({id: "LANG4117"})}</span>
                        </Tooltip>
                    )}>
                    { getFieldDecorator('upload', {
                        valuePropName: 'fileList',
                        normalize: this._normFile
                    })(
                        <Upload {...uploadProps}>
                            <Button type="ghost">
                                <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                            </Button>
                        </Upload>
                    ) }
                </FormItem>
                <div className="section-title">{formatMessage({id: "LANG4119"})}</div>
                <Table
                    bordered
                    rowSelection={ rowSelection }
                    columns={ columns }
                    dataSource={ this.state.remoteTemplateList }
                    pagination={ pagination }
                />
                <Modal 
                    title={ this._renderModalTitle() }
                    visible={ this.state.visible }
                    onOk={ this._handleOk } 
                    onCancel={ this._handleCancel }
                    okText={ this._renderModalOkText() }
                    cancelText={ this._renderModalCancelText() }>
                    <Form>
                        <div ref="showReleaseNotes" className={ this.state.type === "showReleaseNotes" ? "display-block" : "hidden" }>
                            <FormItem
                                { ...formItemLayout }
                                label="Release Notes for { this.state.currentModal }">
                                { (
                                   <span>Release Notes Here</span> 
                                ) }
                            </FormItem>                            
                        </div>
                    </Form>
                </Modal> 
            </div>
        )
    }
}

TemplateManagement.propTypes = {
}

export default Form.create()(injectIntl(TemplateManagement))