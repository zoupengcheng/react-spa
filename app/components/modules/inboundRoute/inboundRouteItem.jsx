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

class InBoundRouteItem extends Component {
    constructor(props) {
        super(props)

        const { formatMessage } = this.props.intl

        this.state = {
            members: [],
            otherTC: [],
            treeData: [],
            defaultTC: [],
            otherTCMode: '',
            accountList: [],
            defaultTCMode: '',
            outBoundRouteItem: {}
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
    _addDefaultTC = () => {
        this.setState({
            defaultTCMode: 'add'
        })
    }
    _cancelDefaultTC = () => {
        this.setState({
            defaultTCMode: ''
        })
    }
    _editDefaultTC = () => {
        this.setState({
            defaultTCMode: 'edit'
        })
    }
    _deleteDefaultTC = () => {

    }
    _saveDefaultTC = () => {
        this.setState({
            defaultTCMode: ''
        })
    }
    _addOtherTC = () => {
        this.setState({
            otherTCMode: 'add'
        })
    }
    _cancelOtherTC = () => {
        this.setState({
            otherTCMode: ''
        })
    }
    _editOtherTC = () => {
        this.setState({
            otherTCMode: 'edit'
        })
    }
    _deleteOtherTC = () => {

    }
    _saveOtherTC = () => {
        this.setState({
            otherTCMode: ''
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
        browserHistory.push('/extension-trunk/inboundRoute')
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

        const formItemRowLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
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

        const defaultTCColumns = [{
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
                                onClick={ this._editDefaultTC.bind(this, record) }
                            >
                            </span>
                            <span
                                className="sprite sprite-del"
                                onClick={ this._deleteDefaultTC.bind(this, record) }>
                            ></span>
                        </div>
                }
            }]

        const otherTCColumns = [{
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
                                onClick={ this._editOtherTC.bind(this, record) }
                            >
                            </span>
                            <span
                                className="sprite sprite-del"
                                onClick={ this._deleteOtherTC.bind(this, record) }>
                            ></span>
                        </div>
                }
            }]

        const title = (this.props.params.id
                ? formatMessage({id: "LANG659"})
                : formatMessage({id: "LANG771"}))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    isDisplay='display-block'
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                />
                <div className="content">
                    <Form>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3493" /> }>
                                                <span>{ formatMessage({id: "LANG83"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('trunk_index', {
                                        rules: [
                                            {
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }
                                        ],
                                        initialValue: settings.trunk_index
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1560" /> }>
                                                <span>{ formatMessage({id: "LANG246"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('did_pattern_match', {
                                        rules: [
                                            {
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }
                                        ],
                                        initialValue: settings.did_pattern_match
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1560" /> }>
                                                <span>{ formatMessage({id: "LANG2748"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('did_pattern_allow', {
                                        rules: [
                                            {
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }
                                        ],
                                        initialValue: settings.did_pattern_allow
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2749" /> }>
                                                <span>{ formatMessage({id: "LANG2745"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('prepend_trunk_name', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: settings.prepend_trunk_name ? (settings.prepend_trunk_name === 'yes') : false
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG5033" /> }>
                                                <span>{ formatMessage({id: "LANG5032"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <Col span={ 2 }>
                                        { getFieldDecorator('prepend_inbound_name_enable', {
                                            rules: [],
                                            valuePropName: 'checked',
                                            initialValue: settings.prepend_inbound_name_enable ? (settings.prepend_inbound_name_enable === 'yes') : false
                                        })(
                                            <Checkbox />
                                        ) }
                                    </Col>
                                    <Col span={ 21 } offset={ 1 }>
                                        { getFieldDecorator('prepend_inbound_name', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: formatMessage({id: "LANG2150"})
                                                }
                                            ],
                                            initialValue: settings.prepend_inbound_name
                                        })(
                                            <Input />
                                        ) }
                                    </Col>
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4291" /> }>
                                                <span>{ formatMessage({id: "LANG4290"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('en_multi_mode', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: settings.en_multi_mode ? (settings.en_multi_mode === 'yes') : false
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3249" /> }>
                                                <span>{ formatMessage({id: "LANG3248"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('alertinfo', {
                                        rules: [],
                                        initialValue: settings.alertinfo
                                    })(
                                        <Select>
                                            <Option value='none'>{ formatMessage({id: "LANG133"}) }</Option>
                                            <Option value='ring1'>{ 'Ring 1' }</Option>
                                            <Option value='ring2'>{ 'Ring 2' }</Option>
                                            <Option value='ring3'>{ 'Ring 3' }</Option>
                                            <Option value='ring4'>{ 'Ring 4' }</Option>
                                            <Option value='ring5'>{ 'Ring 5' }</Option>
                                            <Option value='ring6'>{ 'Ring 6' }</Option>
                                            <Option value='ring7'>{ 'Ring 7' }</Option>
                                            <Option value='ring8'>{ 'Ring 8' }</Option>
                                            <Option value='ring9'>{ 'Ring 9' }</Option>
                                            <Option value='ring10'>{ 'Ring 10' }</Option>
                                            <Option value="Bellcore-dr1">{ 'Bellcore-dr1' }</Option>
                                            <Option value="Bellcore-dr2">{ 'Bellcore-dr2' }</Option>
                                            <Option value="Bellcore-dr3">{ 'Bellcore-dr3' }</Option>
                                            <Option value="Bellcore-dr4">{ 'Bellcore-dr4' }</Option>
                                            <Option value="Bellcore-dr5">{ 'Bellcore-dr5' }</Option>
                                            <Option value="custom">{ formatMessage({id: "LANG231"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3250" /> }>
                                                <span>{ formatMessage({id: "LANG3250"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('custom_alert_info', {
                                        rules: [],
                                        initialValue: settings.custom_alert_info
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG5305" /> }>
                                                <span>{ formatMessage({id: "LANG5295"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <TreeSelect { ...treeSelectProps } />
                                </FormItem>
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG4288"}) }</span>
                                </div>
                            </Col>
                            <Col span={ 24 }>
                                <FormItem
                                    { ...formItemRowLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2389" /> }>
                                                <span>{ formatMessage({id: "LANG1558"}) }</span>
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
                            <div
                                className={ this.state.defaultTCMode ? 'display-block' : 'hidden' }
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
                                    onClick={ this._addDefaultTC }
                                    className={ !this.state.defaultTCMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG769"}) }
                                </Button>
                                <Button
                                    icon="check"
                                    type="primary"
                                    onClick={ this._saveDefaultTC }
                                    className={ this.state.defaultTCMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG728"}) }
                                </Button>
                                <Button
                                    icon="cross"
                                    type="primary"
                                    onClick={ this._cancelDefaultTC }
                                    className={ this.state.defaultTCMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG726"}) }
                                </Button>
                            </Col>
                            <Col span={ 24 }>
                                <Table
                                    rowKey="sequence"
                                    pagination={ false }
                                    columns={ defaultTCColumns }
                                    dataSource={ this.state.defaultTC }
                                />
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG4289"}, {0: '1'}) }</span>
                                </div>
                            </Col>
                            <Col span={ 24 }>
                                <FormItem
                                    { ...formItemRowLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2389" /> }>
                                                <span>{ formatMessage({id: "LANG1558"}) }</span>
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
                            <div
                                className={ this.state.otherTCMode ? 'display-block' : 'hidden' }
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
                                    onClick={ this._addOtherTC }
                                    className={ !this.state.otherTCMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG769"}) }
                                </Button>
                                <Button
                                    icon="check"
                                    type="primary"
                                    onClick={ this._saveOtherTC }
                                    className={ this.state.otherTCMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG728"}) }
                                </Button>
                                <Button
                                    icon="cross"
                                    type="primary"
                                    onClick={ this._cancelOtherTC }
                                    className={ this.state.otherTCMode ? 'display-inline' : 'hidden' }
                                >
                                    { formatMessage({id: "LANG726"}) }
                                </Button>
                            </Col>
                            <Col span={ 24 }>
                                <Table
                                    rowKey="sequence"
                                    pagination={ false }
                                    columns={ otherTCColumns }
                                    dataSource={ this.state.otherTC }
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(InBoundRouteItem))