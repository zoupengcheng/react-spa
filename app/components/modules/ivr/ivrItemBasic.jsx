'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class BasicSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isDialTrunk: false,
            permissionShow: false,
            alertinfoShow: false,
            ivrblackwhiteShow: false,
            fileList: [],
            accountList: [],
            select_alertinfo: "",
            custom_alertinfo: "",
            targetKeys: [],
            dialBox: {
                dial_extension: true,
                dial_conference: false,
                dial_queue: false,
                dial_ringgroup: false,
                dial_paginggroup: false,
                dial_vmgroup: false,
                dial_fax: false,
                dial_directory: false,
                dial_all: false
            }
        }
    }
    componentWillMount() {
        this._getInitDate()
        this._getLanguages()
    }
    componentDidMount() {
    }
    _getInitDate = () => {
        const ivrItem = this.props.ivrItem || {}

        let accountList = this.props.accountList
        let fileList = this.props.fileList

        let ivrblackwhiteShow = false
        let isDialTrunk = false
        let permissionShow = false
        let alertinfoShow = false
        let select_alertinfo = ""
        let custom_alertinfo = ""
        let targetKeys = ivrItem.ivr_blackwhite_list ? ivrItem.ivr_blackwhite_list.split(',') || [] : []
        let dialBox = this.state.dialBox || {}

        if (ivrItem.dial_extension) {
            dialBox.dial_extension = ivrItem.dial_extension === "yes"
            dialBox.dial_conference = ivrItem.dial_conference === "yes"
            dialBox.dial_queue = ivrItem.dial_queue === "yes"
            dialBox.dial_ringgroup = ivrItem.dial_ringgroup === "yes"
            dialBox.dial_paginggroup = ivrItem.dial_paginggroup === "yes"
            dialBox.dial_vmgroup = ivrItem.dial_vmgroup === "yes"
            dialBox.dial_fax = ivrItem.dial_fax === "yes"
            dialBox.dial_directory = ivrItem.dial_directory === "yes"
        }

        if (dialBox.dial_extension === true &&
                dialBox.dial_conference === true &&
                dialBox.dial_queue === true &&
                dialBox.dial_ringgroup === true &&
                dialBox.dial_paginggroup === true &&
                dialBox.dial_vmgroup === true &&
                dialBox.dial_fax === true &&
                dialBox.dial_directory === true) {
            dialBox.dial_all = true
        }

        if (ivrItem.switch === 'black' || ivrItem.switch === "white") {
            ivrblackwhiteShow = true
        }
        if (ivrItem.dial_trunk === 'yes') {
            permissionShow = true
            isDialTrunk = true
        }
        if (ivrItem.alertinfo && ivrItem.alertinfo.slice(0, 7) === 'custom_') {
            alertinfoShow = true
            select_alertinfo = "custom"
            custom_alertinfo = ivrItem.alertinfo.slice(7)
        }
        this.setState({
            accountList: accountList,
            fileList: fileList,
            ivrblackwhiteShow: ivrblackwhiteShow,
            alertinfoShow: alertinfoShow,
            permissionShow: permissionShow,
            isDialTrunk: isDialTrunk,
            select_alertinfo: select_alertinfo,
            custom_alertinfo: custom_alertinfo,
            targetKeys: targetKeys,
            dialBox: dialBox
        })
    }
    _getLanguages = () => {
        const { formatMessage } = this.props.intl

        let languages = UCMGUI.isExist.getList('getLanguage')

        this.setState({
            languages: languages
        })
    }
    _onChangeExtensionType = (value) => {
        if (value === 'fxs') {
            this.setState({
                add_method: 'single'
            })

            // setState for select does not work
            this.props.form.setFieldsValue({
                add_method: 'single'
            })
        }

        this.props.onExtensionTypeChange(value)
    }
    _onChangeAddMethod = (value) => {
        this.setState({
            add_method: value
        })
    }
    _onFocus = (e) => {
        e.preventDefault()

        const form = this.props.form

        form.validateFields([e.target.id], { force: true })
    }
    _onDialallChange = (e) => {
        let dialBox = this.state.dialBox || {}
        if (e.target.checked) {
            dialBox.dial_extension = true
            dialBox.dial_conference = true
            dialBox.dial_queue = true
            dialBox.dial_ringgroup = true
            dialBox.dial_paginggroup = true
            dialBox.dial_vmgroup = true
            dialBox.dial_fax = true
            dialBox.dial_directory = true
        } else {
            dialBox.dial_extension = false
            dialBox.dial_conference = false
            dialBox.dial_queue = false
            dialBox.dial_ringgroup = false
            dialBox.dial_paginggroup = false
            dialBox.dial_vmgroup = false
            dialBox.dial_fax = false
            dialBox.dial_directory = false
        }
        this.setState({
            dialBox: dialBox
        })
    }
    _onChangeDialTrunk = (e) => {
        if (e.target.checked) {
            this.setState({
                permissionShow: true,
                isDialTrunk: true
            })
        } else {
            this.setState({
                permissionShow: false,
                isDialTrunk: false
            })
        }
    }
    _onChangeAlertInfo = (e) => {
        if (e === "custom") {
            this.setState({
                alertinfoShow: true
            })
        } else {
            this.setState({
                alertinfoShow: false
            })
        }
    }
    _onChangeIvrBlackWhite = (e) => {
        if (e === "no") {
            this.setState({
                ivrblackwhiteShow: false
            })
        } else {
            this.setState({
                ivrblackwhiteShow: true
            })
        }
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _handleTransferChange = (targetKeys, direction, moveKeys) => {
        this.setState({
            targetKeys: targetKeys
        })

        console.log('targetKeys: ', targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        // this.setState({ targetContactKeys: nextTargetKeys })
        console.log('sourceSelectedKeys: ', sourceSelectedKeys)
        console.log('targetSelectedKeys: ', targetSelectedKeys)
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
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const settings = this.props.settings || {}
        const { getFieldDecorator } = this.props.form
        const currentEditId = this.props.currentEditId
        const ivrItem = this.props.ivrItem || {}
        const dialBox = this.state.dialBox || {}

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemLayoutTime = {
            labelCol: { span: 3 },
            wrapperCol: { span: 1 }
        }

        const formItemLayoutRow = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }

        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        return (
            <div className="content">
                <Form>
                    <FormItem
                        ref="div_ivr_name"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1459" />}>
                                <span>{formatMessage({id: "LANG135"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('ivr_name', {
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
                            initialValue: ivrItem.ivr_name
                        })(
                            <Input placeholder={ formatMessage({id: "LANG135"}) } />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_extension"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1451" />}>
                                <span>{formatMessage({id: "LANG85"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('extension', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            width: 100,
                            initialValue: ivrItem.extension
                        })(
                            <Input maxLength='127' />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_dial_trunk"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1448" />}>
                                <span>{formatMessage({id: "LANG1447"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('dial_trunk', {
                            rules: [],
                            valuePropName: 'checked',
                            initialValue: (ivrItem.dial_trunk === "yes" ? true : false)
                        })(
                            <Checkbox onChange={ this._onChangeDialTrunk }/>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_permission"
                        className={ this.state.permissionShow ? "display-block" : "hidden" }
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1070" />}>
                                <span>{formatMessage({id: "LANG1069"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('permission', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: ivrItem.permission
                        })(
                            <Select>
                                <Option value="internal">{ formatMessage({id: "LANG1071"}) }</Option>
                                <Option value="internal-local">{ formatMessage({id: "LANG1072"}) }</Option>
                                <Option value="internal-local-national">{ formatMessage({id: "LANG1073"}) }</Option>
                                <Option value="internal-local-national-international">{ formatMessage({id: "LANG1074"}) }</Option>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_dial_extension"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1446" />}>
                                <span>{formatMessage({id: "LANG1445"})}</span>
                            </Tooltip>
                        )}>
                        <Col span={ 2 }>
                            { getFieldDecorator('dial_extension', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dialBox.dial_extension
                            })(
                                <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG85"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('dial_conference', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dialBox.dial_conference
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG18"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('dial_queue', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dialBox.dial_queue
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG607"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('dial_ringgroup', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dialBox.dial_ringgroup
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG600"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('dial_paginggroup', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dialBox.dial_paginggroup
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG604"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('dial_vmgroup', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dialBox.dial_vmgroup
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG21"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('dial_fax', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dialBox.dial_fax
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG1268"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('dial_directory', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dialBox.dial_directory
                            })(
                                    <Checkbox onChange={ this._onWeekallChange } />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG2884"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('dial_all', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: dialBox.dial_all
                            })(
                                    <Checkbox onChange={ this._onDialallChange } />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG104"})}</Col>
                    </FormItem>
                    <FormItem
                        ref="div_switch"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG5328" />}>
                                <span>{formatMessage({id: "LANG5327"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('switch', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: (ivrItem.switch ? ivrItem.switch : "no")
                        })(
                            <Select onChange={ this._onChangeIvrBlackWhite }>
                                <Option value="no">{ formatMessage({id: "LANG5332"}) }</Option>
                                <Option value="black">{ formatMessage({id: "LANG2292"}) }</Option>
                                <Option value="white">{ formatMessage({id: "LANG5333"}) }</Option>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        className={ this.state.ivrblackwhiteShow ? "display-block" : "hidden" }
                        { ...formItemTransferLayout }
                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG5350" />}>
                                <span>{formatMessage({id: "LANG5331"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('ivr_blackwhite_list', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: this.state.targetKeys
                        })(
                        <Transfer
                            showSearch
                            render={ this._renderItem }
                            targetKeys={ this.state.targetKeys }
                            dataSource={ this.state.accountList }
                            onChange={ this._handleTransferChange }
                            filterOption={ this._filterTransferOption }
                            notFoundContent={ formatMessage({id: "LANG133"}) }
                            onSelectChange={ this._handleTransferSelectChange }
                            searchPlaceholder={ formatMessage({id: "LANG803"}) }
                            titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                        />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_ivr_out_blackwhite_list"
                        className={ this.state.ivrblackwhiteShow ? "display-block" : "hidden" }
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG5330" />}>
                                <span>{formatMessage({id: "LANG5329"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('ivr_out_blackwhite_list', {
                            rules: [],
                            initialValue: ivrItem.ivr_out_blackwhite_list
                        })(
                            <Input type="textarea" disabled={ this.state.isDialTrunk ? false : true } />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_replace_caller_id"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG5075" />}>
                                <span>{formatMessage({id: "LANG5071"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('replace_caller_id', {
                            rules: [],
                            valuePropName: 'checked',
                            initialValue: (ivrItem.replace_caller_id === "yes" ? true : false)
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_alertinfo"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG3249" />}>
                                <span>{formatMessage({id: "LANG3248"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('alertinfo', {
                            rules: [],
                            initialValue: this.state.select_alertinfo
                        })(
                            <Select onChange={ this._onChangeAlertInfo }>
                                <Option value="">{ formatMessage({id: "LANG133"}) }</Option>
                                <Option value="ring1">Ring 1</Option>
                                <Option value="ring2">Ring 2</Option>
                                <Option value="ring3">Ring 3</Option>
                                <Option value="ring4">Ring 4</Option>
                                <Option value="ring5">Ring 5</Option>
                                <Option value="ring6">Ring 6</Option>
                                <Option value="ring7">Ring 7</Option>
                                <Option value="ring8">Ring 8</Option>
                                <Option value="ring9">Ring 9</Option>
                                <Option value="ring10">Ring 10</Option>
                                <Option value="Bellcore-dr1">Bellcore-dr1</Option>
                                <Option value="Bellcore-dr2">Bellcore-dr2</Option>
                                <Option value="Bellcore-dr3">Bellcore-dr3</Option>
                                <Option value="Bellcore-dr4">Bellcore-dr4</Option>
                                <Option value="Bellcore-dr5">Bellcore-dr5</Option>
                                <Option value="custom">{ formatMessage({id: "LANG231"}) }</Option>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_custom_alert_info"
                        className={ this.state.alertinfoShow ? "display-block" : "hidden" }
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG3250" />}>
                                <span>{formatMessage({id: "LANG3250"}) }</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('custom_alert_info', {
                            rules: [{
                                required: (this.state.select_alertinfo === "custom" ? true : false),
                                message: formatMessage({id: "LANG2150"})
                            }],
                            width: 100,
                            initialValue: this.state.custom_alertinfo
                        })(
                            <Input maxLength="128" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_welcome_prompt"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1484" />}>
                                <span>{formatMessage({id: "LANG1484"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('welcome_prompt', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            width: 100,
                            initialValue: (ivrItem.welcome_prompt ? ivrItem.welcome_prompt : "welcome")
                        })(
                            <Select>
                                <Option value="welcome">welcome</Option>  
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
                        ref="div_digit_timeout"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG2541" />}>
                                <span>{formatMessage({id: "LANG2360"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('digit_timeout', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            width: 10,
                            initialValue: (ivrItem.digit_timeout ? ivrItem.digit_timeout : 3)
                        })(
                            <InputNumber min={1} max={60} />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_response_timeout"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1479" />}>
                                <span>{formatMessage({id: "LANG2540"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('response_timeout', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            width: 10,
                            initialValue: (ivrItem.response_timeout ? ivrItem.response_timeout : 10)
                        })(
                            <InputNumber min={1} max={180} />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_timeout_prompt"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1475" />}>
                                <span>{formatMessage({id: "LANG1474"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('timeout_prompt', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            width: 100,
                            initialValue: (ivrItem.timeout_prompt ? ivrItem.timeout_prompt : "ivr-create-timeout")
                        })(
                            <Select>
                                <Option value="ivr-create-timeout">ivr-create-timeout</Option>  
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
                        ref="div_invalid_prompt"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1454" />}>
                                <span>{formatMessage({id: "LANG1453"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('invalid_prompt', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            width: 100,
                            initialValue: (ivrItem.invalid_prompt ? ivrItem.invalid_prompt : "invalid")
                        })(
                            <Select>
                                <Option value="invalid">invalid</Option>
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
                        ref="div_tloop"
                        { ...formItemLayoutTime }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1477" />}>
                                <span>{formatMessage({id: "LANG1476"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('tloop', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            width: 100,
                            initialValue: (ivrItem.tloop ? ivrItem.tloop : 3)
                        })(
                            <Select>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="5">5</Option>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_iloop"
                        { ...formItemLayoutTime }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1456" />}>
                                <span>{formatMessage({id: "LANG1455"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('iloop', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            width: 100,
                            initialValue: ivrItem.iloop ? ivrItem.iloop : 3
                        })(
                            <Select>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="5">5</Option>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_language"
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG2545" />}>
                                <span>{formatMessage({id: "LANG1458"})}</span>
                            </Tooltip>
                        )}>
                        { getFieldDecorator('language', {
                            rules: [],
                            width: 100,
                            initialValue: ivrItem.language ? ivrItem.language : ""
                        })(
                            <Select>
                                <Option value="">{ formatMessage({id: "LANG257"}) }</Option>
                                <Option value="zh">中文</Option>
                                <Option value="en">English</Option>
                            </Select>
                        ) }
                    </FormItem>

                </Form>
            </div>
        )
    }
}

export default injectIntl(BasicSettings)