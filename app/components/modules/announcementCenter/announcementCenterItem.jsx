'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, InputNumber } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class AnnouncementCenter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
            centerItem: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _removeSuffix = (filename) => {
        let name = filename.toLocaleLowerCase(),
            file_suffix = [".mp3", ".wav", ".gsm", ".ulaw", ".alaw"]

        for (let i = 0; i < file_suffix.length; i++) {
            let num = name.lastIndexOf(file_suffix[i])

            if (num !== -1 && name.endsWith(file_suffix[i])) {
                filename = filename.substring(0, num)

                return filename
            }
        }
    }
    _getInitData = () => {
        const centerId = this.props.params.id
        const centerName = this.props.params.name
        let fileList = []
        let centerItem = {}
        const __this = this

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listFile',
                type: 'ivr',
                filter: '{"list_dir":0,"list_file":1,"file_suffix":["mp3","wav","gsm","ulaw","alaw"]}',
                sidx: 'n',
                sord: 'desc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    response.ivr.map(function(item) {
                        let obj = { 
                            text: item.n,
                            val: "record/" + __this._removeSuffix(item.n)
                        }
                        fileList.push(obj)
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        if (centerId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getCodeblueCode',
                    codeblue_code: centerId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        centerItem = res.response.codeblue_code || {}
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            fileList: fileList,
            centerItem: centerItem
        })
    }
    _handleCancel = () => {
        browserHistory.push('/value-added-features/announcementCenter')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const centerId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = {}
                action.code_name = values.code_name
                action.code_prompt = values.code_prompt
                action.code_timeout = values.code_timeout

                if (centerId) {
                    action.action = 'updateCodeblueCode'
                    action.codeblue_code = centerId
                } else {
                    action.action = 'addCodeblueCode'
                    action.extension = values.codeblue_code
                }

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
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, setFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG4338"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG4338"}) }))

        const centerItem = this.state.centerItem || {}

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

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
                            ref="div_code_name"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG135" />}>
                                    <span>{formatMessage({id: "LANG135"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('code_name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: centerItem.code_name
                            })(
                                <Input maxLength="128" />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_codeblue_code"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG4344" />}>
                                    <span>{formatMessage({id: "LANG4341"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('codeblue_code', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: centerItem.extension
                            })(
                                <Input maxLength="128" disabled={ this.props.params.id ? true : false } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_code_prompt"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG4343" />}>
                                    <span>{formatMessage({id: "LANG28"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('code_prompt', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: centerItem.code_prompt ? centerItem.code_prompt : (this.state.fileList.length > 0 ? this.state.fileList[0].text : "")
                            })(
                                <Select>
                                    {
                                        this.state.fileList.map(function(item) {
                                            return <Option
                                                    key={ item.text }
                                                    value={ item.val }>
                                                    { item.text }
                                                </Option>
                                            }
                                        ) 
                                    }
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_code_timeout"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1598" />}>
                                    <span>{formatMessage({id: "LANG1598"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('code_timeout', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: centerItem.code_timeout ? centerItem.code_timeout : 30
                            })(
                                <InputNumber min={3} max={600} maxLength="3" />
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(AnnouncementCenter))