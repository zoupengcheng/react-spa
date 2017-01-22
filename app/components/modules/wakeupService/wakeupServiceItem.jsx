'use strict'

import $ from 'jquery'
import _ from 'underscore'
import moment from "moment"
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, DatePicker, TimePicker } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class WakeupServiceItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetKeys: [],
            accountList: [],
            fileList: [{
                val: "wakeup-call",
                text: "wakeup-call"
                }],
            wakeupServiceItem: {},
            dateShow: "display-block",
            weekShow: "hidden",
            customDateCheck: false,
            weekList: [],
            WeekBox: {
                "week_0": false,
                "week_1": false,
                "week_2": false,
                "week_3": false,
                "week_4": false,
                "week_5": false,
                "week_6": false,
                "week_all": false
            }
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
        let targetKeys = []
        let accountList = []
        let fileList = this.state.fileList
        let wakeupService = {}
        let customCheck = false
        let weekList = []
        let WeekBox = {}
        const __this = this
        const { formatMessage } = this.props.intl
        const wakeupServiceId = this.props.params.id

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
                    const disabled = formatMessage({id: "LANG273"})

                    accountList = extension
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        if (wakeupServiceId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getWakeupSchedule',
                    wakeup_index: wakeupServiceId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        wakeupService = res.response.wakeup_index || {}
                        if (wakeupService.custom_date.indexOf('-') > -1) {
                            customCheck = false
                        } else {
                            customCheck = true
                            weekList = wakeupService.custom_date.split(',')
                        }
                        weekList.map(function(item) {
                            if (item === "0") {
                                WeekBox.week_0 = true
                            }
                            if (item === "1") {
                                WeekBox.week_1 = true
                            }
                            if (item === "2") {
                                WeekBox.week_2 = true
                            }
                            if (item === "3") {
                                WeekBox.week_3 = true
                            }
                            if (item === "4") {
                                WeekBox.week_4 = true
                            }
                            if (item === "5") {
                                WeekBox.week_5 = true
                            }
                            if (item === "6") {
                                WeekBox.week_6 = true
                            }
                        })
                        if (weekList.length === 7) {
                            WeekBox.week_all = true
                        }
                        this.setState({
                            WeekBox: WeekBox
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            targetKeys: targetKeys,
            accountList: accountList,
            fileList: fileList,
            wakeupServiceItem: wakeupService,
            weekShow: (customCheck ? "display-block" : "hidden"),
            dateShow: (customCheck ? "hidden" : "display-block"),
            customDateCheck: customCheck,
            weekList: weekList
        })
    }
    _handleCancel = () => {
        browserHistory.push('/value-added-features/wakeupService')
    }
    _onCustomChange = (e) => {
        if (!e.target.checked) {
            this.setState({
                dateShow: "display-block",
                weekShow: "hidden"
            })
        } else {
            this.setState({
                dateShow: "hidden",
                weekShow: "display-block"
            })
        }
    }
    _onWeekallChange = (e) => {
        let WeekBox = this.state.WeekBox
        if (e.target.checked) {
            WeekBox.week_0 = true
            WeekBox.week_1 = true
            WeekBox.week_2 = true
            WeekBox.week_3 = true
            WeekBox.week_4 = true
            WeekBox.week_5 = true
            WeekBox.week_6 = true
        } else {
            WeekBox.week_0 = false
            WeekBox.week_1 = false
            WeekBox.week_2 = false
            WeekBox.week_3 = false
            WeekBox.week_4 = false
            WeekBox.week_5 = false
            WeekBox.week_6 = false
        }
        this.setState({
            WeekBox: WeekBox
        })
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const wakeupServiceId = this.props.params.id
        const wakeupServiceName = this.props.params.name

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

                action.wakeup_name = values.wakeup_name
                action.extension = values.extension
                action.wakeup_enable = values.wakeup_enable ? 1 : 0
                action.prompt = values.prompt
                action.time = values.time.format('HH:mm')
                if (values.custom) {
                    let weeklist = []
                    if (values.week_0) {
                        weeklist.push('0') 
                    }
                    if (values.week_1) {
                        weeklist.push('1') 
                    }
                    if (values.week_2) {
                        weeklist.push('2') 
                    }
                    if (values.week_3) {
                        weeklist.push('3') 
                    }
                    if (values.week_4) {
                        weeklist.push('4') 
                    }
                    if (values.week_5) {
                        weeklist.push('5') 
                    }
                    if (values.week_6) {
                        weeklist.push('6') 
                    }
                    action.custom_date = weeklist.join(',')
                } else {
                    action.custom_date = values.custom_date.format('YYYY-MM-DD')
                }

                if (wakeupServiceId) {
                    action.action = 'updateWakeupSchedule'
                    action.wakeup_index = wakeupServiceId
                } else {
                    action.action = 'addWakeupSchedule'
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
    _renderItem = (item) => {
        const customLabel = (
                <span className={ item.out_of_service === 'yes' ? 'out-of-service' : '' }>
                    { item.title }
                </span>
            )

        return {
                label: customLabel,  // for displayed item
                value: item.title   // for title and filter matching
            }
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
                    0: formatMessage({id: "LANG4858"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG4858"}) }))

        const wakeupServiceItem = this.state.wakeupServiceItem || {}
        const name = wakeupServiceItem.wakeup_name        

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
                            ref="div_wakeup_enable"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG5196" />}>
                                    <span>{formatMessage({id: "LANG5196"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('wakeup_enable', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: wakeupServiceItem.wakeup_enable !== undefined ? wakeupServiceItem.wakeup_enable === 1 : true
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_wakeup_name"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG135" />}>
                                    <span>{formatMessage({id: "LANG135"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('wakeup_name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.minlength(data, value, callback, formatMessage, 2)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: this._checkName
                                }],
                                initialValue: wakeupServiceItem.wakeup_name
                            })(
                                <Input placeholder={ formatMessage({id: "LANG135"}) } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_extension"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG85" />}>
                                    <span>{formatMessage({id: "LANG85"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('extension', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: wakeupServiceItem.extension ? wakeupServiceItem.extension : (this.state.accountList.length > 0 ? this.state.accountList[0].extension : "")
                            })(
                                <Select>
                                    <Option key={ '' } value={ '' }>
                                        { formatMessage({id: "LANG133"}) }
                                    </Option>
                                    {
                                        this.state.accountList.map(function(item) {
                                            return <Option
                                                    key={ item.extension }
                                                    value={ item.extension }
                                                    disabled={ item.out_of_service === 'yes' }>
                                                    { item.extension + (item.fullname ? ' "' + item.fullname + '"' : '') }
                                                </Option>
                                            }
                                        ) 
                                    }
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_prompt"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1484" />}>
                                    <span>{formatMessage({id: "LANG1484"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('prompt', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: wakeupServiceItem.prompt ? wakeupServiceItem.prompt : "wakeup-call"
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
                            ref="div_custom"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG203" />}>
                                    <span>{formatMessage({id: "LANG5198"}, { 0: formatMessage({id: "LANG203"}) })}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('custom', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.customDateCheck
                            })(
                                <Checkbox onChange={ this._onCustomChange } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_custom_date"
                            className={ this.state.dateShow }
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG203" />}>
                                    <span>{formatMessage({id: "LANG203"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('custom_date', {
                                rules: [{ type: 'object',
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: wakeupServiceItem.custom_date ? moment(wakeupServiceItem.custom_date, "YYYY-MM-DD") : null
                            })(
                                <DatePicker />
                            )}
                        </FormItem>
                        <FormItem
                            ref="div_weekBox"
                            className={ this.state.weekShow }
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG203" />}>
                                    <span>{formatMessage({id: "LANG203"})}</span>
                                </Tooltip>
                            )}>
                            <Col span={ 2 }>
                                { getFieldDecorator('week_0', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.WeekBox.week_0
                                })(
                                        <Checkbox />
                                ) }
                            </Col>
                            <Col span={ 6 }>{formatMessage({id: "LANG250"})}</Col>
                            <Col span={ 2 }>
                                { getFieldDecorator('week_1', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.WeekBox.week_1
                                })(
                                        <Checkbox />
                                ) }
                            </Col>
                            <Col span={ 6 }>{formatMessage({id: "LANG251"})}</Col>
                            <Col span={ 2 }>
                                { getFieldDecorator('week_2', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.WeekBox.week_2
                                })(
                                        <Checkbox />
                                ) }
                            </Col>
                            <Col span={ 6 }>{formatMessage({id: "LANG252"})}</Col>
                            <Col span={ 2 }>
                                { getFieldDecorator('week_3', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.WeekBox.week_3
                                })(
                                        <Checkbox />
                                ) }
                            </Col>
                            <Col span={ 6 }>{formatMessage({id: "LANG253"})}</Col>
                            <Col span={ 2 }>
                                { getFieldDecorator('week_4', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.WeekBox.week_4
                                })(
                                        <Checkbox />
                                ) }
                            </Col>
                            <Col span={ 6 }>{formatMessage({id: "LANG254"})}</Col>
                            <Col span={ 2 }>
                                { getFieldDecorator('week_5', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.WeekBox.week_5
                                })(
                                        <Checkbox />
                                ) }
                            </Col>
                            <Col span={ 6 }>{formatMessage({id: "LANG255"})}</Col>
                            <Col span={ 2 }>
                                { getFieldDecorator('week_6', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.WeekBox.week_6
                                })(
                                        <Checkbox />
                                ) }
                            </Col>
                            <Col span={ 6 }>{formatMessage({id: "LANG256"})}</Col>
                            <Col span={ 2 }>
                                { getFieldDecorator('week_all', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.WeekBox.week_all
                                })(
                                        <Checkbox onChange={ this._onWeekallChange } />
                                ) }
                            </Col>
                            <Col span={ 6 }>{formatMessage({id: "LANG104"})}</Col>
                        </FormItem>
                        <FormItem
                            ref="div_time"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG247" />}>
                                    <span>{formatMessage({id: "LANG247"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('time', {
                                rules: [{ type: 'object',
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: wakeupServiceItem.time ? moment(wakeupServiceItem.time, "HH:mm") : null
                            })(
                                <TimePicker showTime format="HH:mm"/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(WakeupServiceItem))