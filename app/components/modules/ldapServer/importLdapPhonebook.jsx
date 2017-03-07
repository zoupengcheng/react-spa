'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Modal, Button, Row, Col, Checkbox, message, Tooltip, Select, Tabs, Spin, Upload, Popover, Icon } from 'antd'
import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import Validator from "../../api/validator"
import Title from '../../../views/title'
import UCMGUI from "../../api/ucmgui"

const FormItem = Form.Item
const Option = Select.Option
const baseServerURl = api.apiHost

class ImportLdapPhonebook extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this._handleSave = () => {
            this.props.handleOk()
        }
        this._handleCancel = () => {
            this.props.handleCancel()
        }
    }
    componentDidMount() {
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        let me = this

        const props = {
            name: 'file',
            action: baseServerURl + 'action=uploadfile&type=firmware',
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

                        if (data.status === 0 && response && response.result === 0) {
                            Modal.confirm({
                                title: formatMessage({id: "LANG924"}),
                                content: '',
                                okText: 'OK',
                                cancelText: 'Cancel',
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
                                }
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
                message.destroy()
            }
        }
        return (
            <div className="content">
                <div className="section-title">{ formatMessage({ id: "LANG2735" })}</div>
                <div className="lite-desc">
                    { formatMessage({ id: "LANG3201" }) }
                    { formatMessage({ id: "LANG3918" }) }
                </div>
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG1321"}) }>
                        { getFieldDecorator('lead_type', {
                            rules: [],
                            initialValue: "csv"
                        })(
                            <Select>
                                <Option value='csv'>CSV</Option>
                                <Option value='vcf'>VCF</Option>
                            </Select>
                        )}
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
                    <div className="app-ant-modal-footer">
                        <Button type="primary" onClick= { this._handleCancel }>
                            {formatMessage({id: "LANG726"})}
                        </Button>
                        <Button type="primary" onClick= { this._handleSave }>
                            {formatMessage({id: "LANG728"})}
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}

module.exports = Form.create()(injectIntl(ImportLdapPhonebook))