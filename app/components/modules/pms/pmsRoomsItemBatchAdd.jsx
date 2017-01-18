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
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class RoomBatchAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomList: [],
            availableAccountList: []
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
        const roomId = this.props.params.id
        const roomName = this.props.params.name
        let accountList = []
        let roomList = []
        let usedList = []
        let availableAccountList = []

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listPMSRoom',
                options: 'room,status,extension,address',
                sidx: 'room',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    roomList = response.pms_room
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getAccountList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const extension = response.extension || []

                    accountList = extension
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        accountList.map(function(item) {
            let found = 0
            roomList.map(function(item2) {
                if (item.extension === item2.extension && found === 0) {
                    if (roomId && item2.address === roomId) {
                        found = 0
                    } else {
                        found = 1
                    }
                }
            })
            if (found === 0 && item.account_type === "SIP") {
                availableAccountList.push(item)
            }
        })

        this.setState({
            accountList: accountList,
            availableAccountList: availableAccountList
        })
    }
    _handleCancel = () => {
        browserHistory.push('/value-added-features/pms/2')
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

                let action = {}
                let startRoom = parseInt(values.batch_room),
                    startAddress = parseInt(values.batch_address),
                    startExtension = parseInt(values.batch_extension),
                    batchNumber = parseInt(values.batch_number),
                    batchextensionList = [],
                    batchaddressList = [],
                    batchroomList = []

                for (var i = 0; i < batchNumber; i++) {
                    batchroomList.push(startRoom + i)
                    batchaddressList.push(startAddress + i)
                    batchextensionList.push(startExtension + i)
                }

                action["extension"] = batchextensionList.join(',')
                action["address"] = batchaddressList.join(',')
                action["pms_room"] = batchroomList.join(',')
                action.action = 'addPMSRoom'

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

        const title = formatMessage({id: "LANG4965"}, {0: formatMessage({id: "LANG4969"}) })

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
                            ref="div_batch_address"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG5040" />}>
                                    <span>{formatMessage({id: "LANG5040"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('batch_address', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: this.state.availableAccountList.length > 0 ? this.state.availableAccountList[0].extension : ""
                            })(
                                <Input maxLength="128" />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_batch_room"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG4988" />}>
                                    <span>{formatMessage({id: "LANG4988"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('batch_room', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: this.state.availableAccountList.length > 0 ? this.state.availableAccountList[0].extension : ""
                            })(
                                <Input maxLength="128" />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_batch_extension"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1155" />}>
                                    <span>{formatMessage({id: "LANG1155"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('batch_extension', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: this.state.availableAccountList.length > 0 ? this.state.availableAccountList[0].extension : ""
                            })(
                                <Select >
                                    {
                                        this.state.availableAccountList.map(function(item) {
                                            return <Option
                                                    key={ item.extension }
                                                    value={ item.extension }>
                                                    { item.extension }
                                                </Option>
                                            }
                                        ) 
                                    }
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_batch_number"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1157" />}>
                                    <span>{formatMessage({id: "LANG1157"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('batch_number', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: 5
                            })(
                                <Input maxLength="128" />
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(RoomBatchAdd))