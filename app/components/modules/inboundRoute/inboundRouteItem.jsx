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
import { Button, Checkbox, Col, Form, Input, message, Row, Select, Table, Tooltip, TreeSelect } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const SHOW_PARENT = TreeSelect.SHOW_PARENT

class InBoundRouteItem extends Component {
    constructor(props) {
        super(props)

        const { formatMessage } = this.props.intl

        this.state = {
            otherTC: [],
            defaultTC: [],
            otherTCMode: '',
            accountList: [],
            defaultTCMode: '',
            DIDDesTreeData: [],
            diddes_members: [],
            seamlessTreeData: [],
            seamless_members: [],
            outBoundRouteItem: {},
            destinationType: 'byDID',
            currentInAddMode: this.props.route.path.indexOf('add') === 0,
            DIDParams: [
                    'ext_fax',
                    'ext_local',
                    'ext_group',
                    'ext_queues',
                    'ext_paging',
                    'voicemenus',
                    'ext_conference',
                    'voicemailgroups',
                    'ext_directory'
                ]
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
        const trunkIndex = this.props.params.id
        const { formatMessage } = this.props.intl

        let accountList = []
        let diddes_members = []
        let seamless_members = []
        let inBoundRouteItem = {}

        let DIDDesTreeData = [{
            key: 'all',
            value: 'all',
            children: [],
            label: formatMessage({id: "LANG104"})
        }]

        let seamlessTreeData = [{
            key: 'all',
            value: 'all',
            children: [],
            label: formatMessage({id: "LANG104"})
        }]

        let trunkList = UCMGUI.isExist.getList('getTrunkList', formatMessage)
        let extensionPrefSettings = UCMGUI.isExist.getRange('', formatMessage)
        let slaTrunkNameList = UCMGUI.isExist.getList('getSLATrunkNameList', formatMessage)
        let holidayList = UCMGUI.isExist.getList('listTimeConditionHoliday', formatMessage)
        let officeTimeList = UCMGUI.isExist.getList('listTimeConditionOfficeTime', formatMessage)

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

        seamlessTreeData[0].children = accountList
        DIDDesTreeData[0].children = [{
            key: 'ext_local',
            value: 'ext_local',
            label: formatMessage({id: "LANG85"})
        }, {
            key: 'ext_conference',
            value: 'ext_conference',
            label: formatMessage({id: "LANG18"})
        }, {
            key: 'ext_queues',
            value: 'ext_queues',
            label: formatMessage({id: "LANG607"})
        }, {
            key: 'ext_group',
            value: 'ext_group',
            label: formatMessage({id: "LANG600"})
        }, {
            key: 'ext_paging',
            value: 'ext_paging',
            label: formatMessage({id: "LANG604"})
        }, {
            key: 'voicemenus',
            value: 'voicemenus',
            label: formatMessage({id: "LANG19"})
        }, {
            key: 'voicemailgroups',
            value: 'voicemailgroups',
            label: formatMessage({id: "LANG21"})
        }, {
            key: 'ext_fax',
            value: 'ext_fax',
            label: formatMessage({id: "LANG1268"})
        }, {
            key: 'ext_directory',
            value: 'ext_directory',
            label: formatMessage({id: "LANG2884"})
        }]

        if (!this.state.currentInAddMode) {
            let action = {}
            let params = ["trunk_index", "did_pattern_match", "did_pattern_allow", "en_multi_mode",
                        "destination_type", "prepend_trunk_name", "prepend_inbound_name_enable",
                        "prepend_inbound_name", "account", "voicemail", "conference",
                        "vmgroup", "ivr", "ringgroup", "queue", "paginggroup", "fax", "disa", "directory",
                        "external_number", "callback", "did_strip", "permission", "dial_trunk", "ext_local",
                        "ext_fax", "voicemailgroups", "voicemenus", "ext_conference", "ext_queues", "ext_group",
                        "ext_paging", "ext_directory", "alertinfo", "incoming_prepend", "out_of_service", 'seamless_transfer_did_whitelist'
                    ]

            action.action = 'getInboundRoute'
            action.inbound_route = this.props.params.id

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
                        let inboundDIDDestination = response.inbound_did_destination || {}

                        inBoundRouteItem = response.inbound_routes || {}

                        _.map(inboundDIDDestination, function(value, key) {
                            inBoundRouteItem[key] = value
                        })

                        seamless_members = inBoundRouteItem.seamless_transfer_did_whitelist
                        seamless_members = seamless_members ? seamless_members.split(',') : []

                        _.map(this.state.DIDParams, (value) => {
                            if (inBoundRouteItem[value] === 'yes') {
                                diddes_members.push(value)
                            }
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            trunkList: trunkList,
            accountList: accountList,
            holidayList: holidayList,
            diddes_members: diddes_members,
            officeTimeList: officeTimeList,
            DIDDesTreeData: DIDDesTreeData,
            seamlessTreeData: seamlessTreeData,
            seamless_members: seamless_members,
            slaTrunkNameList: slaTrunkNameList,
            inBoundRouteItem: inBoundRouteItem,
            extensionPrefSettings: extensionPrefSettings,
            destinationType: inBoundRouteItem.destination_type ? inBoundRouteItem.destination_type : 'byDID'
        })
    }
    _handleCancel = () => {
        browserHistory.push('/extension-trunk/inboundRoute')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        const form = this.props.form
        const { formatMessage } = this.props.intl
        const getFieldInstance = form.getFieldInstance
        const outboundRouteIndex = this.props.params.id

        let loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        let successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                let permissionDisabled = !!this.state.pin_sets_id || this.state.enable_wlist

                const doSubmit = () => {
                    let action = {}

                    if (!this.state.currentInAddMode) {
                        action.action = 'updateInboundRoute'
                        action.inbound_route = this.props.params.id
                    } else {
                        action.action = 'addInboundRoute'
                        action.trunk_index = values.trunk_index
                    }

                    _.map(values, function(value, key) {
                        let fieldInstance = getFieldInstance(key)

                        if (key === 'trunk_index' || key === 'custom_alert_info' ||
                            key === 'did_pattern_match' || key === 'did_pattern_allow' ||
                            key === 'destination_value' || key === 'tc_destination_type' || key === 'tc_timetype' ||
                            key === 'tc_mode1_destination_type' || key === 'tc_mode1_timetype' || key === 'mode1_destination_type') {
                            return false
                        }

                        action[key] = (value !== undefined ? UCMGUI.transCheckboxVal(value) : '')
                    })

                    let trueMatch = []
                    let trueAllow = []
                    let matchAry = values.did_pattern_match ? values.did_pattern_match.split(',') : []
                    let allowAry = values.did_pattern_allow ? values.did_pattern_allow.split(',') : []

                    _.map(matchAry, (value) => {
                        let match = $.trim(value)

                        if (!match) {
                            return false
                        } else {
                            trueMatch.push((match.indexOf('_') === 0) ? match : '_' + match)
                        }
                    })

                    _.map(allowAry, (value) => {
                        let allow = $.trim(value)

                        if (!allow) {
                            return false
                        } else {
                            trueAllow.push((allow.indexOf('_') === 0) ? allow : '_' + allow)
                        }
                    })

                    _.map(this.state.DIDParams, (value) => {
                        if (this.state.diddes_members.indexOf(value) > -1 || (this.state.diddes_members.length === 1 && this.state.diddes_members[0] === 'all')) {
                            action[value] = 'yes'
                        } else {
                            action[value] = 'no'
                        }
                    })

                    action.multi_mode = JSON.stringify([])
                    action.account = values.destination_value
                    action.time_condition = JSON.stringify([])
                    action.did_pattern_allow = trueAllow.toString()
                    action.did_pattern_match = trueMatch.toString()
                    action.seamless_transfer_did_whitelist = this.state.seamless_members.join()
                    action.alertinfo = values.alertinfo === 'none'
                                            ? values.alertinfo === 'custom'
                                                ? ('custom_' + values.custom_alert_info)
                                                : values.alertinfo
                                            : ''

                    // console.log('Received values of form: ', action)
                    // console.log('Received values of form: ', values)

                    message.loading(formatMessage({ id: "LANG826" }), 0)

                    $.ajax({
                        data: action,
                        type: 'json',
                        method: "post",
                        url: api.apiHost,
                        error: function(e) {
                            message.error(e.statusText)
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(successMessage, 2)

                                this._handleCancel()
                            }
                        }.bind(this)
                    })
                }

                // if (values.permission === 'internal' && !permissionDisabled) {
                //     confirm({
                //         title: '',
                //         onCancel() {},
                //         onOk() { doSubmit() },
                //         content: <span dangerouslySetInnerHTML=
                //                         {{ __html: formatMessage({ id: "LANG2534" }, {
                //                                 0: formatMessage({ id: "LANG1071" }),
                //                                 1: formatMessage({ id: "LANG1071" })
                //                             })
                //                         }}
                //                     ></span>
                //     })
                // } else if (values.permission === 'none' && !permissionDisabled) {
                //     confirm({
                //         title: '',
                //         onCancel() {},
                //         onOk() { doSubmit() },
                //         content: <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG3701" }) }}></span>
                //     })
                // } else {
                    doSubmit()
                // }
            }
        })
    }
    _onChangeDestinationType = (value) => {
        this.setState({
            destinationType: value
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
    _onChangeSeamlessSelect = (value) => {
        this.setState({
            seamless_members: value
        })
    }
    _onChangeDIDDesSelect = (value) => {
        this.setState({
            diddes_members: value
        })
    }
    _onChangeWlist = (e) => {
        this.setState({
            enable_wlist: e.target.checked
        })
    }
    _renderTrunkOptions = () => {
        let trunkList = this.state.trunkList
        const { formatMessage } = this.props.intl
        let slaTrunkNameList = this.state.slaTrunkNameList

        return <Select>
                {
                    // Pengcheng Zou Moved. Set Trunk Options First.
                    _.map(trunkList, (data, index) => {
                        let text
                        let option
                        let hasClass
                        let name = data.trunk_name
                        let technology = data.technology
                        let value = data.trunk_index + ''
                        let isSLA = slaTrunkNameList.indexOf(name) > -1
                        let disabled = (data.out_of_service && data.out_of_service === 'yes')

                        // Pengcheng Zou Added. locale="{0}{1}{2}{3}" or locale="{0}{1}{2}{3}{4}{5}"
                        // locale = (disabled || isSLA) ? 'LANG564' : 'LANG2696';

                        if (technology === 'Analog') {
                            text = formatMessage({id: "LANG105"})
                        } else if (technology === 'SIP') {
                            text = formatMessage({id: "LANG108"})
                        } else if (technology === 'IAX') {
                            text = formatMessage({id: "LANG107"})
                        } else if (technology === 'BRI') {
                            text = formatMessage({id: "LANG2835"})
                        } else if (technology === 'PRI' || technology === 'SS7' || technology === 'MFC/R2' || technology === 'EM' || technology === 'EM_W') {
                            text = technology
                        }

                        text += formatMessage({id: "LANG83"}) + ' -- ' + name

                        if (disabled) {
                            text += ' -- ' + formatMessage({id: "LANG273"})
                        } else if (isSLA) {
                            text += ' -- ' + formatMessage({id: "LANG3218"})
                        }

                        hasClass = (disabled || isSLA) ? 'out-of-service' : ''

                        return <Option
                                    key={ value }
                                    value={ value }
                                    className={ hasClass }
                                    technology={ technology }
                                >
                                    { text }
                                </Option>
                    })
                }
            </Select>
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const settings = this.state.inBoundRouteItem || {}
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const formItemRowLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }

        const diddesProps = {
            multiple: true,
            treeCheckable: true,
            treeDefaultExpandAll: true,
            showCheckedStrategy: SHOW_PARENT,
            value: this.state.diddes_members,
            treeData: this.state.DIDDesTreeData,
            onChange: this._onChangeDIDDesSelect
        }

        const seamlessProps = {
            multiple: true,
            treeCheckable: true,
            treeDefaultExpandAll: true,
            showCheckedStrategy: SHOW_PARENT,
            value: this.state.seamless_members,
            treeData: this.state.seamlessTreeData,
            onChange: this._onChangeSeamlessSelect
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

        const title = (this.state.currentInAddMode
                ? formatMessage({id: 'LANG771'})
                : formatMessage({id: 'LANG659'}))

        document.title = formatMessage({id: 'LANG584'}, {
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
                            <Col
                                span={ 12 }
                                className={ this.state.currentInAddMode ? 'display-block' : 'hidden' }
                            >
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
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: !this.state.currentInAddMode
                                                ? settings.trunk_index + ''
                                                : this.props.params.id
                                    })(
                                        this._renderTrunkOptions()
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
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
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
                                        rules: [],
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
                                        initialValue: settings.out_of_service === 'yes'
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
                                        initialValue: settings.prepend_trunk_name === 'yes'
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
                                            initialValue: settings.prepend_inbound_name_enable === 'yes'
                                        })(
                                            <Checkbox />
                                        ) }
                                    </Col>
                                    <Col span={ 21 } offset={ 1 }>
                                        { getFieldDecorator('prepend_inbound_name', {
                                            rules: [],
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
                                        initialValue: settings.en_multi_mode === 'yes'
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
                                        initialValue: settings.alertinfo ? settings.alertinfo : 'none'
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1566" /> }>
                                                <span>{ formatMessage({id: "LANG1447"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('dial_trunk', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: settings.dial_trunk === 'yes'
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1544" /> }>
                                                <span>{ formatMessage({id: "LANG1543"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('permission', {
                                        rules: [],
                                        initialValue: settings.permission ? settings.permission : 'internal'
                                    })(
                                        <Select>
                                            <Option value='internal'>{ formatMessage({id: "LANG1071"}) }</Option>
                                            <Option value='internal-local'>{ formatMessage({id: "LANG1072"}) }</Option>
                                            <Option value='internal-local-national'>{ formatMessage({id: "LANG1073"}) }</Option>
                                            <Option value='internal-local-national-international'>{ formatMessage({id: "LANG1074"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG5305" /> }>
                                                <span>{ formatMessage({id: "LANG1564"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <TreeSelect { ...diddesProps } />
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1565" /> }>
                                                <span>{ formatMessage({id: "LANG5295"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <TreeSelect { ...seamlessProps } />
                                </FormItem>
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG4288"}) }</span>
                                </div>
                            </Col>
                            <Col span={ 24 }>
                                <Col span={ 12 }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={(
                                            <span>
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG2389" /> }>
                                                    <span>{ formatMessage({id: "LANG1558"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('destination_type', {
                                            rules: [],
                                            initialValue: this.state.destinationType
                                        })(
                                            <Select onChange={ this._onChangeDestinationType }>
                                                <Option value="byDID">{ formatMessage({id: "LANG1563"}) }</Option>
                                                <Option value="account">{ formatMessage({id: "LANG85"}) }</Option>
                                                <Option value="voicemail">{ formatMessage({id: "LANG90"}) }</Option>
                                                <Option value="conference">{ formatMessage({id: "LANG98"}) }</Option>
                                                <Option value="vmgroup">{ formatMessage({id: "LANG89"}) }</Option>
                                                <Option value="ivr">IVR</Option>
                                                <Option value="ringgroup">{ formatMessage({id: "LANG600"}) }</Option>
                                                <Option value="queue">{ formatMessage({id: "LANG91"}) }</Option>
                                                <Option value="paginggroup">{ formatMessage({id: "LANG94"}) }</Option>
                                                <Option value="fax">{ formatMessage({id: "LANG95"}) }</Option>
                                                <Option value="disa">{ formatMessage({id: "LANG2353"}) }</Option>
                                                <Option value="directory">{ formatMessage({id: "LANG2884"}) }</Option>
                                                <Option value="external_number">{ formatMessage({id: "LANG3458"}) }</Option>
                                                <Option value="callback">{ formatMessage({id: "LANG3741"}) }</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 4 }>
                                    <FormItem
                                        className={ this.state.destinationType === 'byDID' ? 'hidden' : 'display-block' }
                                    >
                                        { getFieldDecorator('destination_value', {
                                            rules: [{
                                                message: formatMessage({id: "LANG2150"}),
                                                required: this.state.destinationType !== 'byDID'
                                            }],
                                            initialValue: settings.account
                                        })(
                                            <Select>
                                                { 
                                                    this.state.accountList.map((item) => {
                                                        return <Option
                                                                    key={ item.key }
                                                                    value={ item.value }
                                                                    className={ item.out_of_service === 'yes' ? 'out-of-service' : '' }
                                                                >
                                                                    { item.label }
                                                                </Option>
                                                    })
                                                }
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Col>
                            <div
                                className={ this.state.defaultTCMode ? 'display-block' : 'hidden' }
                            >
                                <Col span={ 24 }>
                                    <div className="function-description">
                                        <span>{ formatMessage({id: "LANG1532"}) }</span>
                                    </div>
                                </Col>
                                <Col span={ 24 }>
                                    <FormItem
                                        { ...formItemRowLayout }
                                        label={(
                                            <span>
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG1557" /> }>
                                                    <span>{ formatMessage({id: "LANG1557"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('tc_timetype', {
                                            rules: [],
                                            initialValue: settings.tc_timetype ? settings.tc_timetype : '1'
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
                                <Col span={ 24 }>
                                    <FormItem
                                        { ...formItemRowLayout }
                                        label={(
                                            <span>
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG168" /> }>
                                                    <span>{ formatMessage({id: "LANG168"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('tc_destination_type', {
                                            rules: [],
                                            initialValue: settings.tc_destination_type ? settings.tc_destination_type : 'account'
                                        })(
                                            <Select>
                                                <Option value="byDID">{ formatMessage({id: "LANG1563"}) }</Option>
                                                <Option value="account">{ formatMessage({id: "LANG85"}) }</Option>
                                                <Option value="voicemail">{ formatMessage({id: "LANG90"}) }</Option>
                                                <Option value="conference">{ formatMessage({id: "LANG98"}) }</Option>
                                                <Option value="vmgroup">{ formatMessage({id: "LANG89"}) }</Option>
                                                <Option value="ivr">IVR</Option>
                                                <Option value="ringgroup">{ formatMessage({id: "LANG600"}) }</Option>
                                                <Option value="queue">{ formatMessage({id: "LANG91"}) }</Option>
                                                <Option value="paginggroup">{ formatMessage({id: "LANG94"}) }</Option>
                                                <Option value="fax">{ formatMessage({id: "LANG95"}) }</Option>
                                                <Option value="disa">{ formatMessage({id: "LANG2353"}) }</Option>
                                                <Option value="directory">{ formatMessage({id: "LANG2884"}) }</Option>
                                                <Option value="external_number">{ formatMessage({id: "LANG3458"}) }</Option>
                                                <Option value="callback">{ formatMessage({id: "LANG3741"}) }</Option>
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
                            {/* <Col span={ 24 }>
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
                                    { getFieldDecorator('mode1_destination_type', {
                                        rules: [],
                                        initialValue: settings.mode1_destination_type ? settings.mode1_destination_type : 'account'
                                    })(
                                        <Select>
                                            <Option value="byDID">{ formatMessage({id: "LANG1563"}) }</Option>
                                            <Option value="account">{ formatMessage({id: "LANG85"}) }</Option>
                                            <Option value="voicemail">{ formatMessage({id: "LANG90"}) }</Option>
                                            <Option value="conference">{ formatMessage({id: "LANG98"}) }</Option>
                                            <Option value="vmgroup">{ formatMessage({id: "LANG89"}) }</Option>
                                            <Option value="ivr">IVR</Option>
                                            <Option value="ringgroup">{ formatMessage({id: "LANG600"}) }</Option>
                                            <Option value="queue">{ formatMessage({id: "LANG91"}) }</Option>
                                            <Option value="paginggroup">{ formatMessage({id: "LANG94"}) }</Option>
                                            <Option value="fax">{ formatMessage({id: "LANG95"}) }</Option>
                                            <Option value="disa">{ formatMessage({id: "LANG2353"}) }</Option>
                                            <Option value="directory">{ formatMessage({id: "LANG2884"}) }</Option>
                                            <Option value="external_number">{ formatMessage({id: "LANG3458"}) }</Option>
                                            <Option value="callback">{ formatMessage({id: "LANG3741"}) }</Option>
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
                                <Col span={ 24 }>
                                    <FormItem
                                        { ...formItemRowLayout }
                                        label={(
                                            <span>
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG1557" /> }>
                                                    <span>{ formatMessage({id: "LANG1557"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('tc_mode1_timetype', {
                                            rules: [],
                                            initialValue: settings.tc_mode1_timetype ? settings.tc_mode1_timetype : '1'
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
                                <Col span={ 24 }>
                                    <FormItem
                                        { ...formItemRowLayout }
                                        label={(
                                            <span>
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG168" /> }>
                                                    <span>{ formatMessage({id: "LANG168"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('tc_mode1_destination_type', {
                                            rules: [],
                                            initialValue: settings.tc_mode1_destination_type ? settings.tc_mode1_destination_type : 'account'
                                        })(
                                            <Select>
                                                <Option value="byDID">{ formatMessage({id: "LANG1563"}) }</Option>
                                                <Option value="account">{ formatMessage({id: "LANG85"}) }</Option>
                                                <Option value="voicemail">{ formatMessage({id: "LANG90"}) }</Option>
                                                <Option value="conference">{ formatMessage({id: "LANG98"}) }</Option>
                                                <Option value="vmgroup">{ formatMessage({id: "LANG89"}) }</Option>
                                                <Option value="ivr">IVR</Option>
                                                <Option value="ringgroup">{ formatMessage({id: "LANG600"}) }</Option>
                                                <Option value="queue">{ formatMessage({id: "LANG91"}) }</Option>
                                                <Option value="paginggroup">{ formatMessage({id: "LANG94"}) }</Option>
                                                <Option value="fax">{ formatMessage({id: "LANG95"}) }</Option>
                                                <Option value="disa">{ formatMessage({id: "LANG2353"}) }</Option>
                                                <Option value="directory">{ formatMessage({id: "LANG2884"}) }</Option>
                                                <Option value="external_number">{ formatMessage({id: "LANG3458"}) }</Option>
                                                <Option value="callback">{ formatMessage({id: "LANG3741"}) }</Option>
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
                            </Col> */}
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(InBoundRouteItem))