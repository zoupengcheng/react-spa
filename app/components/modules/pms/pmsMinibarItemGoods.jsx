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
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class GoodsItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            goodsItem: {},
            fileList: []
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
        const goodsId = this.props.params.id
        let goodsItem = {}
        let fileList = []
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

        if (goodsId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getMiniBarGoods',
                    extension: goodsId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        goodsItem = res.response.extension || {}
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            goodsItem: goodsItem,
            fileList: fileList
        })
    }
    _handleCancel = () => {
        browserHistory.push('/value-added-features/pms/4')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const goodsId = this.props.params.id

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

                if (goodsId) {
                    action.action = 'updateMiniBarGoods'
                    action.extension = goodsId
                } else {
                    action.action = 'addMiniBarGoods'
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
                    0: formatMessage({id: "LANG5057"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG5057"}) }))

        const goodsItem = this.state.goodsItem || {}

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
                            ref="div_extension"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG4341" />}>
                                    <span>{formatMessage({id: "LANG4341"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('extension', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: goodsItem.extension
                            })(
                                <Input maxLength="128" disabled={ this.props.params.id ? true : false }/>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_goods_name"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG127" />}>
                                    <span>{formatMessage({id: "LANG127"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('goods_name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: goodsItem.goods_name
                            })(
                                <Input maxLength="128" />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_prompt_success"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG5053" />}>
                                    <span>{formatMessage({id: "LANG5053"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('prompt_success', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: goodsItem.prompt_success ? goodsItem.prompt_success : (this.state.fileList[0] ? this.state.fileList[0].text : "")
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
                            ref="div_prompt_error"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG5054" />}>
                                    <span>{formatMessage({id: "LANG5054"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('prompt_error', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: goodsItem.prompt_error ? goodsItem.prompt_error : (this.state.fileList[0] ? this.state.fileList[0].text : "")
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
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(GoodsItem))