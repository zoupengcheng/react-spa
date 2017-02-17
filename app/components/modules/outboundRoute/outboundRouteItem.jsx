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
import { Button, Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Table, Tooltip, TreeSelect } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const SHOW_PARENT = TreeSelect.SHOW_PARENT

class OutBoundRouteItem extends Component {
    constructor(props) {
        super(props)

        const { formatMessage } = this.props.intl

        this.state = {
            members: [],
            treeData: [],
            pinSetList: [],
            accountList: [],
            pin_sets_id: '',
            failoverTrunk: [],
            timeCondition: [],
            enable_wlist: false,
            outBoundRouteItem: {},
            failoverTrunkMode: '',
            timeConditionMode: '',
            enable_out_limitime: false,
            permissionTooltipTitle: '',
            permissionTooltipVisible: false
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
    _addFailoverTrunk = () => {
        this.setState({
            failoverTrunkMode: 'add'
        })
    }
    _cancelFailoverTrunk = () => {
        this.setState({
            failoverTrunkMode: ''
        })
    }
    _editFailoverTrunk = () => {
        this.setState({
            failoverTrunkMode: 'edit'
        })
    }
    _deleteFailoverTrunk = () => {

    }
    _saveFailoverTrunk = () => {
        this.setState({
            failoverTrunkMode: ''
        })
    }
    _addTimeCondition = () => {
        this.setState({
            timeConditionMode: 'add'
        })
    }
    _cancelTimeCondition = () => {
        this.setState({
            timeConditionMode: ''
        })
    }
    _editTimeCondition = () => {
        this.setState({
            timeConditionMode: 'edit'
        })
    }
    _deleteTimeCondition = () => {

    }
    _saveTimeCondition = () => {
        this.setState({
            timeConditionMode: ''
        })
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        const outboundRouteId = this.props.params.id
        const outboundRouteName = this.props.params.name

        let pinSetList = []
        let accountList = []
        let outBoundRouteItem = {}
        let treeData = [{
            key: 'all',
            value: 'all',
            children: [],
            label: formatMessage({id: "LANG104"})
        }]

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listPinSets'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    pinSetList = response.pin_sets_id || []
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

                    accountList = extension.map(function(item) {
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
                action: 'getExtensionGroupList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const extgroupList = response.extension_groups || []
                    const extgroupLabel = formatMessage({id: "LANG2714"})

                    extgroupList.map(function(item) {
                        accountList.push({
                            key: item.group_id,
                            value: item.group_id,
                            label: (extgroupLabel + item.group_name)
                        })
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        treeData[0].children = accountList

        if (outboundRouteId) {
            let action = {}
            let params = ['outbound_rt_name', 'outbound_rt_index', 'default_trunk_index', 'pin_sets_id', 'permission',
                    'password', 'strip', 'prepend', 'pattern', 'members', 'enable_wlist', 'custom_member', 'limitime',
                    'out_of_service', 'failover_outbound_data'
                ]

            action.action = 'getOutboundRoute'
            action.outbound_route = outboundRouteId

            params.map(function(value) {
                action[value] = ''
            })

            $.ajax({
                data: action,
                type: 'json',
                async: false,
                method: 'post',
                url: api.apiHost,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        outBoundRouteItem = response.outbound_route || {}
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            treeData: treeData,
            pinSetList: pinSetList,
            accountList: accountList,
            outBoundRouteItem: outBoundRouteItem
        })
    }
    _handleCancel = () => {
        browserHistory.push('/extension-trunk/outboundRoute')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const extensionGroupId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                if (!this.state.targetKeys.length) {
                    message.error(errorMessage)

                    return
                }

                message.loading(loadingMessage)

                let action = values

                action.members = this.state.targetKeys.join()

                if (extensionGroupId) {
                    action.action = 'updateExtensionGroup'
                    action.extension_group = extensionGroupId
                } else {
                    action.action = 'addExtensiongroup'
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
    _onChangeLimitime = (e) => {
        this.setState({
            enable_out_limitime: e.target.checked
        })
    }
    _onChangePermission = (value) => {
        let title
        let visible
        const { formatMessage } = this.props.intl

        if (value === 'none') {
            visible = true
            title = formatMessage({id: "LANG3700"})
        } else if (value === 'internal') {
            visible = true
            title = formatMessage({id: "LANG2535"}, {
                    0: formatMessage({id: "LANG1071"})
                })
        } else {
            title = ''
            visible = false
        }

        this.setState({
            permissionTooltipTitle: title,
            permissionTooltipVisible: visible
        })
    }
    _onChangePinSet = (value) => {
        this.setState({
            pin_sets_id: value === 'none' ? '' : value
        })
    }
    _onChangeTreeSelect = (value) => {
        this.setState({
            members: value
        })
    }
    _onChangeWlist = (e) => {
        this.setState({
            enable_wlist: e.target.checked
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const settings = this.state.outBoundRouteItem || {}
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const treeSelectProps = {
            multiple: true,
            treeCheckable: true,
            value: this.state.members,
            treeDefaultExpandAll: true,
            treeData: this.state.treeData,
            showCheckedStrategy: SHOW_PARENT,
            onChange: this._onChangeTreeSelect,
            disabled: !!this.state.pin_sets_id
        }

        const failoverTrunkColumns = [{
                key: 'failover_trunk_index',
                dataIndex: 'failover_trunk_index',
                title: formatMessage({id: "LANG83"})
            }, {
                key: 'failover_strip',
                dataIndex: 'failover_strip',
                title: formatMessage({id: "LANG1547"})
            }, {
                key: 'failover_prepend',
                dataIndex: 'failover_prepend',
                title: formatMessage({id: "LANG1541"})
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <div>
                            <span
                                className="sprite sprite-edit"
                                onClick={ this._editFailoverTrunk.bind(this, record) }
                            >
                            </span>
                            <span
                                className="sprite sprite-del"
                                onClick={ this._deleteFailoverTrunk.bind(this, record) }>
                            ></span>
                        </div>
                }
            }]

        const timeConditionColumns = [{
                key: 'timetype',
                dataIndex: 'timetype',
                title: formatMessage({id: "LANG1557"})
            }, {
                key: 'time',
                dataIndex: 'time',
                title: formatMessage({id: "LANG247"})
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <div>
                            <span
                                className="sprite sprite-edit"
                                onClick={ this._editTimeCondition.bind(this, record) }
                            >
                            </span>
                            <span
                                className="sprite sprite-del"
                                onClick={ this._deleteTimeCondition.bind(this, record) }>
                            ></span>
                        </div>
                }
            }]

        const title = (this.props.params.id
                ? formatMessage({id: "LANG657"}, {
                    0: this.props.params.name
                })
                : formatMessage({id: "LANG768"}))

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
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1534" /> }>
                                                <span>{ formatMessage({id: "LANG1533"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('outbound_rt_name', {
                                        rules: [
                                            {
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }
                                        ],
                                        initialValue: settings.outbound_rt_name
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1560" /> }>
                                                <span>{ formatMessage({id: "LANG246"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('match', {
                                        rules: [
                                            {
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }
                                        ],
                                        initialValue: settings.match
                                    })(
                                        <Input placeholder={ formatMessage({id: "LANG5448"}) } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG5092" /> }>
                                                <span>{ formatMessage({id: "LANG5093"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('out_of_service', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: settings.out_of_service ? (settings.out_of_service === 'yes') : false
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4558" /> }>
                                                <span>{ formatMessage({id: "LANG4553"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('pin_sets_id', {
                                        rules: [],
                                        initialValue: this.state.pin_sets_id ? this.state.pin_sets_id : 'none'
                                    })(
                                        <Select
                                            onChange={ this._onChangePinSet }
                                        >
                                            <Option value='none'>{ formatMessage({id: "LANG133"}) }</Option>
                                            {
                                                this.state.pinSetList.map(function(item) {
                                                    return <Option
                                                                key={ item.pin_sets_id }
                                                                value={ item.pin_sets_id }
                                                            >
                                                                { item.pin_sets_name }
                                                            </Option>
                                                })
                                            }
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1540" /> }>
                                                <span>{ formatMessage({id: "LANG73"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('password', {
                                        rules: [],
                                        initialValue: settings.password
                                    })(
                                        <Input disabled={ !!this.state.pin_sets_id } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1544" /> }>
                                                <span>{ formatMessage({id: "LANG1543"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <Tooltip
                                        placement="bottomRight"
                                        trigger={ ['hover'] }
                                        overlayClassName="numeric-input"
                                        title={ this.state.permissionTooltipTitle }
                                        visible={ !this.state.pin_sets_id && !this.state.enable_wlist && this.state.permissionTooltipVisible }
                                    >
                                        { getFieldDecorator('permission', {
                                            rules: [],
                                            initialValue: settings.permission ? settings.permission : 'local'
                                        })(
                                            <Select
                                                onChange={ this._onChangePermission }
                                                disabled={ !!this.state.pin_sets_id || this.state.enable_wlist }
                                            >
                                                <Option value='none'>{ formatMessage({id: "LANG273"}) }</Option>
                                                <Option value='internal'>{ formatMessage({id: "LANG1071"}) }</Option>
                                                <Option value='local'>{ formatMessage({id: "LANG1072"}) }</Option>
                                                <Option value='national'>{ formatMessage({id: "LANG1073"}) }</Option>
                                                <Option value='international'>{ formatMessage({id: "LANG1074"}) }</Option>
                                            </Select>
                                        ) }
                                    </Tooltip>
                                </FormItem>
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG2699"}) }</span>
                                </div>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2700" /> }>
                                                <span>{ formatMessage({id: "LANG2699"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('enable_wlist', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: this.state.enable_wlist
                                    })(
                                        <Checkbox
                                            onChange={ this._onChangeWlist }
                                            disabled={ !!this.state.pin_sets_id }
                                        />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    className={ this.state.enable_wlist ? 'display-block' : 'hidden' }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4472" /> }>
                                                <span>{ formatMessage({id: "LANG2703"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('custom_member', {
                                        rules: [],
                                        initialValue: settings.custom_member
                                    })(
                                        <Input disabled={ !!this.state.pin_sets_id } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    className={ this.state.enable_wlist ? 'display-block' : 'hidden' }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2701" /> }>
                                                <span>{ formatMessage({id: "LANG2701"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <TreeSelect { ...treeSelectProps } />
                                </FormItem>
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG3025"}) }</span>
                                </div>
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
                                    { getFieldDecorator('enable_out_limitime', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: this.state.enable_out_limitime
                                    })(
                                        <Checkbox onChange={ this._onChangeLimitime } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ this.state.enable_out_limitime ? 'display-block' : 'hidden' }
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
                                        rules: [
                                            {
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }
                                        ],
                                        initialValue: settings.maximumTime
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ this.state.enable_out_limitime ? 'display-block' : 'hidden' }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3020" /> }>
                                                <span>{ formatMessage({id: "LANG3019"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('warningTime', {
                                        rules: [],
                                        initialValue: settings.warningTime
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ this.state.enable_out_limitime ? 'display-block' : 'hidden' }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3022" /> }>
                                                <span>{ formatMessage({id: "LANG3021"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('repeatTime', {
                                        rules: [],
                                        initialValue: settings.repeatTime
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG1553"}) }</span>
                                </div>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1552" /> }>
                                                <span>{ formatMessage({id: "LANG1551"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('default_trunk_index', {
                                        rules: [],
                                        initialValue: settings.default_trunk_index
                                    })(
                                        <Select>
                                            <Option value='none'>{ formatMessage({id: "LANG273"}) }</Option>
                                            <Option value='internal'>{ formatMessage({id: "LANG1071"}) }</Option>
                                            <Option value='local'>{ formatMessage({id: "LANG1072"}) }</Option>
                                            <Option value='national'>{ formatMessage({id: "LANG1073"}) }</Option>
                                            <Option value='international'>{ formatMessage({id: "LANG1074"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1548" /> }>
                                                <span>{ formatMessage({id: "LANG245"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('stripx', {
                                        rules: [],
                                        initialValue: settings.stripx
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1542" /> }>
                                                <span>{ formatMessage({id: "LANG1541"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('prepend', {
                                        rules: [],
                                        initialValue: settings.prepend
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1550" /> }>
                                        <span>{ formatMessage({id: "LANG1549"}) }</span>
                                    </Tooltip>
                                </div>
                            </Col>
                            <div
                                className={ this.state.failoverTrunkMode ? 'display-block' : 'hidden' }
                            >
                                <Col span={ 12 }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={(
                                            <span>
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG1550" /> }>
                                                    <span>{ formatMessage({id: "LANG1536"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('failover_trunk', {
                                            rules: [],
                                            initialValue: settings.failover_trunk
                                        })(
                                            <Select>
                                                <Option value='none'>{ formatMessage({id: "LANG273"}) }</Option>
                                                <Option value='internal'>{ formatMessage({id: "LANG1071"}) }</Option>
                                                <Option value='local'>{ formatMessage({id: "LANG1072"}) }</Option>
                                                <Option value='national'>{ formatMessage({id: "LANG1073"}) }</Option>
                                                <Option value='international'>{ formatMessage({id: "LANG1074"}) }</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={(
                                            <span>
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG1548" /> }>
                                                    <span>{ formatMessage({id: "LANG245"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('failover_stripx', {
                                            rules: [],
                                            initialValue: settings.failover_stripx
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
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG1542" /> }>
                                                    <span>{ formatMessage({id: "LANG1541"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('failover_prepend', {
                                            rules: [],
                                            initialValue: settings.failover_prepend
                                        })(
                                            <Input />
                                        ) }
                                    </FormItem>
                                </Col>
                            </div>
                            <Col span={ 24 } style={{ 'padding': '0 0 10px 0' }}>
                                <Button
                                    icon="plus"
                                    type="primary"
                                    onClick={ this._addFailoverTrunk }
                                    className={ !this.state.failoverTrunkMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG769"}) }
                                </Button>
                                <Button
                                    icon="check"
                                    type="primary"
                                    onClick={ this._saveFailoverTrunk }
                                    className={ this.state.failoverTrunkMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG728"}) }
                                </Button>
                                <Button
                                    icon="cross"
                                    type="primary"
                                    onClick={ this._cancelFailoverTrunk }
                                    className={ this.state.failoverTrunkMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG726"}) }
                                </Button>
                            </Col>
                            <Col span={ 24 }>
                                <Table
                                    pagination={ false }
                                    rowKey="failover_trunk_index"
                                    columns={ failoverTrunkColumns }
                                    dataSource={ this.state.failoverTrunk }
                                />
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG1557"}) }</span>
                                </div>
                            </Col>
                            <div
                                className={ this.state.timeConditionMode ? 'display-block' : 'hidden' }
                            >
                                <Col span={ 24 }>
                                    <div className="function-description">
                                        <span>{ formatMessage({id: "LANG1532"}) }</span>
                                    </div>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={(
                                            <span>
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG1557" /> }>
                                                    <span>{ formatMessage({id: "LANG1557"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('office', {
                                            rules: [],
                                            initialValue: settings.office ? settings.office : '1'
                                        })(
                                            <Select>
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
                            </div>
                            <Col span={ 24 } style={{ 'padding': '0 0 10px 0' }}>
                                <Button
                                    icon="plus"
                                    type="primary"
                                    onClick={ this._addTimeCondition }
                                    className={ !this.state.timeConditionMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG769"}) }
                                </Button>
                                <Button
                                    icon="check"
                                    type="primary"
                                    onClick={ this._saveTimeCondition }
                                    className={ this.state.timeConditionMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG728"}) }
                                </Button>
                                <Button
                                    icon="cross"
                                    type="primary"
                                    onClick={ this._cancelTimeCondition }
                                    className={ this.state.timeConditionMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG726"}) }
                                </Button>
                            </Col>
                            <Col span={ 24 }>
                                <Table
                                    rowKey="sequence"
                                    pagination={ false }
                                    columns={ timeConditionColumns }
                                    dataSource={ this.state.timeCondition }
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(OutBoundRouteItem))