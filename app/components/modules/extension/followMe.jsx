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
import { Checkbox, Col, Form, Input, Icon, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class FollowMe extends Component {
    constructor(props) {
        super(props)

        const cc_mode = this.props.settings.cc_mode
        const strategy_ipacl = this.props.settings.strategy_ipacl
        const presence_status = this.props.settings.presence_status
        const dnd = this.props.settings.dnd === 'yes' ? true : false
        const presence_dst_type = this.props.settings.presence_dst_type
        const bypass_outrt_auth = this.props.settings.bypass_outrt_auth
        const callbarging_monitor = this.props.settings.callbarging_monitor
        const enable_cc = this.props.settings.enable_cc === 'yes' ? true : false
        const en_hotline = this.props.settings.en_hotline === 'yes' ? true : false
        const en_ringboth = this.props.settings.en_ringboth === 'yes' ? true : false
        const out_limitime = this.props.settings.out_limitime === 'yes' ? true : false
        const seamless_transfer_members = this.props.settings.seamless_transfer_members

        this.state = {
            dnd: dnd,
            accountList: [],
            cc_mode: cc_mode,
            enable_cc: enable_cc,
            en_hotline: en_hotline,
            en_ringboth: en_ringboth,
            out_limitime: out_limitime,
            bypass_outrt_auth: bypass_outrt_auth,
            mohNameList: ['default', 'ringbacktone_default'],
            strategy_ipacl: strategy_ipacl ? strategy_ipacl + '' : '0',
            presence_status: presence_status ? presence_status : 'not_set',
            presence_dst_type: presence_dst_type ? presence_dst_type : '0',
            targetKeysCallbarging: callbarging_monitor ? callbarging_monitor.split(',') : [],
            targetKeysSeamless: seamless_transfer_members ? seamless_transfer_members.split(',') : []
        }
    }
    componentWillMount() {
        const { formatMessage } = this.props.intl
        const disabled = formatMessage({id: "LANG273"})

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getAccountList'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    let extension = response.extension || []

                    extension = extension.map(function(item) {
                        return {
                                key: item.extension,
                                value: item.extension,
                                out_of_service: item.out_of_service,
                                // disabled: (item.out_of_service === 'yes'),
                                label: (item.extension +
                                        (item.fullname ? ' "' + item.fullname + '"' : '') +
                                        (item.out_of_service === 'yes' ? ' <' + disabled + '>' : ''))
                            }
                    })

                    this.setState({
                        accountList: extension
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getMohNameList'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    let mohNameList = response.moh_name || []

                    this.setState({
                        mohNameList: mohNameList ? mohNameList : ['default', 'ringbacktone_default']
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    componentDidMount() {
    }
    _addWhiteList = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl

        // can use data-binding to get
        const whiteLists = form.getFieldValue('whiteLists')

        if (whiteLists.length <= 8) {
            const newWhiteLists = whiteLists.concat(this._generateWhiteListID(whiteLists))

            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                whiteLists: newWhiteLists
            })
        } else {
            message.warning(formatMessage({id: "LANG809"}, {
                    0: '',
                    1: 10
                }))

            return false
        }
    }
    _filterCodecsSource = () => {
        const currentEditId = this.props.currentEditId

        if (currentEditId) {
            return _.filter(this.state.accountList, function(item) {
                    return item.key !== currentEditId
                })
        } else {
            return this.state.accountList
        }
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _generateWhiteListID = (existIDs) => {
        let newID = 2
        const keyList = _.pluck(existIDs, 'key')

        if (keyList && keyList.length) {
            newID = _.find([2, 3, 4, 5, 6, 7, 8, 9, 10], function(key) {
                    return !_.contains(keyList, key)
                })
        }

        return {
                new: true,
                key: newID
            }
    }
    _handleCallbargingChange = (targetKeys, direction, moveKeys) => {
        const { form } = this.props

        this.setState({
            targetKeysCallbarging: targetKeys
        })

        form.setFieldsValue({
            callbarging_monitor: targetKeys.toString()
        })

        console.log('targetKeys: ', targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleSeamlessChange = (targetKeys, direction, moveKeys) => {
        const { form } = this.props

        this.setState({
            targetKeysSeamless: targetKeys
        })

        form.setFieldsValue({
            seamless_transfer_members: targetKeys.toString()
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
    _onChangePresenceStatus = (value) => {
        this.setState({
            presence_status: value
        })
    }
    _onChangePresenceDesType = (value) => {
        this.setState({
            presence_dst_type: value
        })
    }
    _onChangeCCMode = (value) => {
        this.setState({
            cc_mode: value
        })
    }
    _onChangeDND = (e) => {
        this.setState({
            dnd: e.target.checked
        })
    }
    _onChangeEnableCC = (e) => {
        this.setState({
            enable_cc: e.target.checked
        })
    }
    _onChangeHotLine = (e) => {
        this.setState({
            en_hotline: e.target.checked
        })
    }
    _onChangeLimiTime = (e) => {
        this.setState({
            out_limitime: e.target.checked
        })
    }
    _onChangeRingBoth = (e) => {
        this.setState({
            en_ringboth: e.target.checked
        })
    }
    _onChangeStrategy = (value) => {
        this.setState({
            strategy_ipacl: value
        })
    }
    _onChangeTrunkAuth = (value) => {
        this.setState({
            bypass_outrt_auth: value
        })
    }
    _onFocus = (e) => {
        e.preventDefault()

        const form = this.props.form

        form.validateFields([e.target.id], { force: true })
    }
    _renderItem = (item) => {
        const customLabel = (
                <span className={ item.out_of_service === 'yes' ? 'out-of-service' : '' }>
                    { item.label }
                </span>
            )

        return {
                label: customLabel,  // for displayed item
                value: item.value   // for title and filter matching
            }
    }
    _removeWhiteList = (k) => {
        let fieldsValue = {}
        const { form } = this.props
        // can use data-binding to get
        const whiteLists = form.getFieldValue('whiteLists')

        fieldsValue['whitelist' + k] = ''
        fieldsValue.whiteLists = whiteLists.filter(item => item.key !== k)

        // can use data-binding to set
        form.setFieldsValue(fieldsValue)
    }
    render() {
        let whiteListIds = []
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const settings = this.props.settings || {}
        const currentEditId = this.props.currentEditId
        const extension_type = this.props.extensionType
        const callbarging_monitor = settings.callbarging_monitor
        const { getFieldDecorator, getFieldValue } = this.props.form
        const seamless_transfer_members = settings.seamless_transfer_members
        const dndwhitelist = settings.dndwhitelist ? settings.dndwhitelist.split(',') : []

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const formItemLayoutRow = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        }

        const formItemLayoutTransfer = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        _.map(dndwhitelist, function(value, key) {
            if (key > 0) {
                whiteListIds.push({
                    key: parseInt(key + 1)
                })
            }
        })

        getFieldDecorator('whiteLists', { initialValue: whiteListIds })
        getFieldDecorator('callbarging_monitor', { initialValue: callbarging_monitor })
        getFieldDecorator('seamless_transfer_members', { initialValue: seamless_transfer_members })

        const whiteLists = getFieldValue('whiteLists')
        const whiteListFormItems = whiteLists.map((item, index) => {
            return (
                <Col
                    key={ item.key }
                    span={ 12 }
                    className={ this.state.dnd ? 'display-block' : 'hidden' }
                >
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG5177" /> }>
                                    <span>{ formatMessage({id: "LANG5178"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator(`whitelist${item.key}`, {
                            rules: [],
                            initialValue: item.new ? '' : dndwhitelist[item.key - 1],
                            className: this.state.dnd ? 'display-block' : 'hidden'
                        })(
                            <Input />
                        ) }
                        <Icon
                            type="minus-circle-o"
                            onClick={ () => this._removeWhiteList(item.key) }
                            className="dynamic-network-button"
                        />
                    </FormItem>
                </Col>
            )
        })

        return (
            <div className="content">
                <div className="ant-form">
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1980" /> }>
                                            <span>{ formatMessage({id: "LANG274"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('fm_enable_followme', {
                                    rules: [],
                                    initialValue: settings.fm_enable_followme === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4043" /> }>
                                            <span>{ formatMessage({id: "LANG1142"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('fm_bypass_outrt_auth', {
                                    rules: [],
                                    initialValue: settings.fm_bypass_outrt_auth === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1086" /> }>
                                            <span>{ formatMessage({id: "LANG1085"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfn', {
                                    rules: [],
                                    initialValue: settings.cfn
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3374" /> }>
                                            <span>{ formatMessage({id: "LANG3371"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfu_timetype', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cfu_timetype ? settings.cfu_timetype + '' : '0'
                                })(
                                    <Select>
                                        <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1088" /> }>
                                            <span>{ formatMessage({id: "LANG1087"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfb', {
                                    rules: [],
                                    initialValue: settings.cfb
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3376" /> }>
                                            <span>{ formatMessage({id: "LANG3373"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfb_timetype', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cfb_timetype ? settings.cfb_timetype + '' : '0'
                                })(
                                    <Select>
                                        <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5179" /> }>
                                            <span>{ formatMessage({id: "LANG4768"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('dnd', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.dnd ? (settings.dnd === 'yes') : false
                                })(
                                    <Checkbox onChange={ this._onChangeDND } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5180" /> }>
                                            <span>{ formatMessage({id: "LANG4769"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('dnd_timetype', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.dnd_timetype ? settings.dnd_timetype + '' : '0'
                                })(
                                    <Select disabled={ !this.state.dnd }>
                                        <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ this.state.dnd ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5177" /> }>
                                            <span>{ formatMessage({id: "LANG5178"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('whitelist1', {
                                    rules: [],
                                    initialValue: dndwhitelist.length ? dndwhitelist[0] : '',
                                    className: this.state.dnd ? 'display-block' : 'hidden'
                                })(
                                    <Input />
                                ) }
                                <Icon
                                    type="plus-circle-o"
                                    onClick={ this._addWhiteList }
                                    className="dynamic-network-button"
                                />
                            </FormItem>
                        </Col>
                        { whiteListFormItems }
                    </Row>
                    <Row
                        className={ extension_type === 'iax' ? 'hidden' : 'display-block' }
                    >
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG3725"}) }</span>
                            </div>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3727" /> }>
                                            <span>{ formatMessage({id: "LANG3726"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('enable_cc', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.enable_cc ? (settings.enable_cc === 'yes') : false,
                                    className: extension_type === 'iax' ? 'hidden' : 'display-block'
                                })(
                                    <Checkbox onChange={ this._onChangeEnableCC } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ this.state.enable_cc && extension_type === 'sip'
                                            ? 'display-block'
                                            : 'hidden'
                                        }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3729" /> }>
                                            <span>{ formatMessage({id: "LANG3728"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cc_mode', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cc_mode ? settings.cc_mode : 'normal',
                                    className: this.state.enable_cc && extension_type === 'sip'
                                            ? 'display-block'
                                            : 'hidden'
                                })(
                                    <Select onChange={ this._onChangeCCMode } >
                                        <Option value='normal'>Normal</Option>
                                        <Option value='trunk'>For Trunk</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' && this.state.enable_cc && this.state.cc_mode === 'trunk'
                                            ? 'display-block'
                                            : 'hidden'
                                        }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3734" /> }>
                                            <span>{ formatMessage({id: "LANG3733"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cc_max_agents', {
                                    rules: [
                                        {
                                            // type: 'integer',
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cc_max_agents ? settings.cc_max_agents : 10,
                                    className: (extension_type === 'sip' && this.state.enable_cc && this.state.cc_mode === 'trunk')
                                            ? 'display-block'
                                            : 'hidden'
                                })(
                                    <Input min={ 1 } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' && this.state.enable_cc && this.state.cc_mode === 'trunk'
                                            ? 'display-block'
                                            : 'hidden'
                                        }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3740" /> }>
                                            <span>{ formatMessage({id: "LANG3739"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cc_max_monitors', {
                                    rules: [
                                        {
                                            // type: 'integer',
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cc_max_monitors ? settings.cc_max_monitors : 10,
                                    className: (extension_type === 'sip' && this.state.enable_cc && this.state.cc_mode === 'trunk')
                                            ? 'display-block'
                                            : 'hidden'
                                })(
                                    <Input min={ 1 } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG1062"}) }</span>
                            </div>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3760" /> }>
                                            <span>{ formatMessage({id: "LANG1062"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('en_ringboth', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.en_ringboth ? (settings.en_ringboth === 'yes') : false
                                })(
                                    <Checkbox onChange={ this._onChangeRingBoth } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3761" /> }>
                                            <span>{ formatMessage({id: "LANG3458"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('external_number', {
                                    rules: [
                                        this.state.en_ringboth
                                            ? {
                                                    required: true,
                                                    message: formatMessage({id: "LANG2150"})
                                                }
                                            : {}
                                    ],
                                    initialValue: settings.external_number
                                })(
                                    <Input disabled={ !this.state.en_ringboth } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3763" /> }>
                                            <span>{ formatMessage({id: "LANG3762"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('ringboth_timetype', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.ringboth_timetype ? settings.ringboth_timetype + '' : '0'
                                })(
                                    <Select disabled={ !this.state.en_ringboth }>
                                        <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row
                        className={ extension_type === 'fxs' ? 'display-block' : 'hidden' }
                    >
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG4182"}) }</span>
                            </div>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4183" /> }>
                                            <span>{ formatMessage({id: "LANG4183"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('en_hotline', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.en_hotline ? (settings.en_hotline === 'yes') : false,
                                    className: extension_type === 'fxs' ? 'display-block' : 'hidden'
                                })(
                                    <Checkbox onChange={ this._onChangeHotLine } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4184" /> }>
                                            <span>{ formatMessage({id: "LANG4184"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('hotline_number', {
                                    rules: [
                                        this.state.en_hotline
                                            ? {
                                                    required: true,
                                                    message: formatMessage({id: "LANG2150"})
                                                }
                                            : {}
                                    ],
                                    initialValue: settings.hotline_number,
                                    className: extension_type === 'fxs' ? 'display-block' : 'hidden'
                                })(
                                    <Input disabled={ !this.state.en_hotline } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4188" /> }>
                                            <span>{ formatMessage({id: "LANG4185"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('hotline_type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.hotline_type ? settings.hotline_type : '1',
                                    className: extension_type === 'fxs' ? 'display-block' : 'hidden'
                                })(
                                    <Select disabled={ !this.state.en_hotline }>
                                        <Option value='1'>{ formatMessage({id: "LANG4186"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG4187"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row
                        className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                    >
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG5450"}) }</span>
                            </div>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5452" /> }>
                                            <span>{ formatMessage({id: "LANG5450"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('presence_status', {
                                    rules: [],
                                    initialValue: this.state.presence_status,
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
                                })(
                                    <Select onChange={ this._onChangePresenceStatus }>
                                        <Option value='not_set'>{ formatMessage({id: "LANG257"}) }</Option>
                                        <Option value='unavailable'>{ formatMessage({id: "LANG113"}) }</Option>
                                        <Option value='available'>{ formatMessage({id: "LANG116"}) }</Option>
                                        <Option value='away'>{ formatMessage({id: "LANG5453"}) }</Option>
                                        <Option value='chat'>{ formatMessage({id: "LANG5465"}) }</Option>
                                        <Option value='dnd'>{ formatMessage({id: "LANG4768"}) }</Option>
                                        <Option value='userdef1'>{ formatMessage({id: "LANG5451"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ (extension_type === 'sip' && this.state.presence_status === 'userdef1')
                                            ? 'display-block'
                                            : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5451" /> }>
                                            <span>{ formatMessage({id: "LANG5451"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('presence_def_script', {
                                    rules: [
                                        (extension_type === 'sip' && this.state.presence_status === 'userdef1')
                                            ? {
                                                    required: true,
                                                    message: formatMessage({id: "LANG2150"})
                                                }
                                            : {}
                                    ],
                                    initialValue: settings.presence_def_script,
                                    className: (extension_type === 'sip' && this.state.presence_status === 'userdef1')
                                            ? 'display-block'
                                            : 'hidden'
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5454" /> }>
                                            <span>{ formatMessage({id: "LANG5454"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('presence_dst_type', {
                                    rules: [],
                                    initialValue: this.state.presence_dst_type,
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
                                })(
                                    <Select onChange={ this._onChangePresenceDesType }>
                                        <Option value='0'>{ formatMessage({id: "LANG133"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG85"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3458"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG20"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ (extension_type === 'sip' && (this.state.presence_dst_type === '1' || this.state.presence_dst_type === '3'))
                                            ? 'display-block'
                                            : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5456" /> }>
                                            <span>{ formatMessage({id: "LANG1535"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('presence_dst_account_voicemail', {
                                    rules: [],
                                    initialValue: settings.presence_dst_account
                                })(
                                    <Select>
                                        {
                                            this.state.accountList.map(function(obj) {
                                                return <Option
                                                            key={ obj.key }
                                                            value={ obj.value }
                                                            className={ obj.out_of_service === 'yes' ? 'out-of-service' : '' }>
                                                            { obj.label }
                                                        </Option>
                                            })
                                        }
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ (extension_type === 'sip' && this.state.presence_dst_type === '2')
                                            ? 'display-block'
                                            : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5456" /> }>
                                            <span>{ formatMessage({id: "LANG1535"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('presence_dst_external_number', {
                                    rules: [
                                        (extension_type === 'sip' && this.state.presence_dst_type === '2')
                                            ? {
                                                    required: true,
                                                    message: formatMessage({id: "LANG2150"})
                                                }
                                            : {}
                                    ],
                                    initialValue: settings.presence_dst_account
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG5079"}) }</span>
                            </div>
                        </Col>
                        <Col
                            span={ 24 }
                        >
                            <FormItem
                                { ...formItemLayoutRow }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5081" /> }>
                                            <span>{ formatMessage({id: "LANG5080"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                <Transfer
                                    showSearch
                                    render={ this._renderItem }
                                    dataSource={ this._filterCodecsSource() }
                                    onChange={ this._handleCallbargingChange }
                                    filterOption={ this._filterTransferOption }
                                    targetKeys={ this.state.targetKeysCallbarging }
                                    notFoundContent={ formatMessage({id: "LANG133"}) }
                                    onSelectChange={ this._handleTransferSelectChange }
                                    searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                    titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG5294"}) }</span>
                            </div>
                        </Col>
                        <Col
                            span={ 24 }
                        >
                            <FormItem
                                { ...formItemLayoutRow }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5296" /> }>
                                            <span>{ formatMessage({id: "LANG5295"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                <Transfer
                                    showSearch
                                    render={ this._renderItem }
                                    onChange={ this._handleSeamlessChange }
                                    dataSource={ this._filterCodecsSource() }
                                    filterOption={ this._filterTransferOption }
                                    targetKeys={ this.state.targetKeysSeamless }
                                    notFoundContent={ formatMessage({id: "LANG133"}) }
                                    onSelectChange={ this._handleTransferSelectChange }
                                    searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                    titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG629"}) }</span>
                            </div>
                        </Col>
                        {/* <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1066" /> }>
                                            <span>{ formatMessage({id: "LANG1065"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('fullname', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.fullname
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ 'TIP_USERS_28' }>
                                            <span>{ 'Trunk Authority Password' }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('trunk_secret', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.trunk_secret
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col> */}
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1599" /> }>
                                            <span>{ formatMessage({id: "LANG1598"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('ring_timeout', {
                                    rules: [],
                                    initialValue: settings.ring_timeout
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2544" /> }>
                                            <span>{ formatMessage({id: "LANG2543"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('auto_record', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.auto_record ? (settings.auto_record === 'yes') : false
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        {/* <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ 'TIP_USERS_12' }>
                                            <span>{ 'ADA User' }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cti', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.cti
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col> */}
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4047" /> }>
                                            <span>{ formatMessage({id: "LANG1142"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('bypass_outrt_auth', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.bypass_outrt_auth ? settings.bypass_outrt_auth : 'no'
                                })(
                                    <Select onChange={ this._onChangeTrunkAuth }>
                                        <Option value='no'>{ formatMessage({id: "LANG137"}) }</Option>
                                        <Option value='yes'>{ formatMessage({id: "LANG136"}) }</Option>
                                        <Option value='bytime'>{ formatMessage({id: "LANG4044"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2747" /> }>
                                            <span>{ formatMessage({id: "LANG2746"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('user_outrt_passwd', {
                                    rules: [],
                                    initialValue: settings.user_outrt_passwd
                                })(
                                    <Input disabled={ this.state.bypass_outrt_auth === 'yes' } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ this.state.bypass_outrt_auth === 'bytime' ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4046" /> }>
                                            <span>{ formatMessage({id: "LANG4045"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('skip_auth_timetype', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.skip_auth_timetype ? settings.skip_auth_timetype + '' : '0',
                                    className: this.state.bypass_outrt_auth === 'bytime' ? 'display-block' : 'hidden'
                                })(
                                    <Select>
                                        <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2690" /> }>
                                            <span>{ formatMessage({id: "LANG2689"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('enablehotdesk', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.enablehotdesk ? (settings.enablehotdesk === 'yes') : false,
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4136" /> }>
                                            <span>{ formatMessage({id: "LANG4135"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('enable_ldap', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.enable_ldap ? (settings.enable_ldap === 'yes') : true
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4452" /> }>
                                            <span>{ formatMessage({id: "LANG4393"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('enable_webrtc', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.enable_webrtc ? (settings.enable_webrtc === 'yes') : false,
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1800" /> }>
                                            <span>{ formatMessage({id: "LANG1178"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('mohsuggest', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.mohsuggest ? settings.mohsuggest : 'default'
                                })(
                                    <Select>
                                        {
                                            this.state.mohNameList.map(function(value) {
                                                return <Option
                                                            key={ value }
                                                            value={ value }
                                                        >
                                                            { value }
                                                        </Option>
                                            })
                                        }
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4879" /> }>
                                            <span>{ formatMessage({id: "LANG4878"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('room', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.room ? (settings.room === 'yes') : false,
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3026" /> }>
                                            <span>{ formatMessage({id: "LANG3025"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('out_limitime', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.out_limitime ? settings.out_limitime : false
                                })(
                                    <Checkbox onChange={ this._onChangeLimiTime } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ this.state.out_limitime ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3018" /> }>
                                            <span>{ formatMessage({id: "LANG3017"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('maximumTime', {
                                    rules: [],
                                    initialValue: settings.maximumTime,
                                    className: this.state.out_limitime ? 'display-block' : 'hidden'
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5049" /> }>
                                            <span>{ formatMessage({id: "LANG5048"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('custom_autoanswer', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: settings.custom_autoanswer ? (settings.custom_autoanswer === 'yes') : false,
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(FollowMe)