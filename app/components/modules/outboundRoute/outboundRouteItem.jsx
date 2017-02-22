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
import { Button, Checkbox, Col, Form, Input, InputNumber, message, Modal, Row, Select, Table, Tooltip, TreeSelect } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
const AddZero = UCMGUI.addZero
const SHOW_PARENT = TreeSelect.SHOW_PARENT
const officeTimeType = ["LANG133", "LANG3271", "LANG3275", "LANG3266", "LANG3286", "LANG3287", "LANG3288"]

class OutBoundRouteItem extends Component {
    constructor(props) {
        super(props)

        const { formatMessage } = this.props.intl

        this.state = {
            members: [],
            treeData: [],
            trunkList: [],
            pinSetList: [],
            accountList: [],
            pin_sets_id: '',
            holidayList: [],
            timeCondition: [],
            failoverTrunk: [],
            officeTimeList: [],
            slaTrunkNameList: [],
            enable_wlist: false,
            outBoundRouteItem: {},
            failoverTrunkMode: '',
            timeConditionMode: '',
            extensionPrefSettings: [],
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
    _customDynamicMember = (value) => {
        let i
        let str
        let length
        let results = []
        let customMember = value ? value : ''
        let customMemberList = customMember.split(',')

        for (i = 0, length = customMemberList.length; i < length; i++) {
            str = $.trim(customMemberList[i])

            if (str) {
                if (str[0] !== '_') {
                    str = '_' + str
                }

                results.push(str)
            }
        }

        return results.toString()
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
        let extgroupList = []
        let failoverTrunk = []
        let timeCondition = []
        let outBoundRouteItem = {}
        let permissionTooltipTitle = ''
        let permissionTooltipVisible = false
        let treeData = [{
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
                    const extgroupLabel = formatMessage({id: "LANG2714"})

                    extgroupList = response.extension_groups || []

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
                        let matchs = []
                        let outLimitimeArr = []
                        let response = res.response || {}
                        let pattern = res.response.pattern || []
                        let failover = res.response.failover_outbound_data || []

                        outBoundRouteItem = response.outbound_route || {}

                        outBoundRouteItem.default_trunk_index = outBoundRouteItem.default_trunk_index + ''
                        outBoundRouteItem.members = outBoundRouteItem.members ? outBoundRouteItem.members.split(',') : []

                        outLimitimeArr = outBoundRouteItem.limitime ? outBoundRouteItem.limitime.match(/\d+/g) : []

                        if (outLimitimeArr.length) {
                            outBoundRouteItem.enable_out_limitime = true
                            outBoundRouteItem.maximumTime = (outLimitimeArr[0] ? (parseInt(outLimitimeArr[0] / 1000) + '') : "")
                            outBoundRouteItem.warningTime = (outLimitimeArr[1] ? (parseInt(outLimitimeArr[1] / 1000) + '') : "")
                            outBoundRouteItem.repeatTime = (outLimitimeArr[2] ? (parseInt(outLimitimeArr[2] / 1000) + '') : "")
                        }

                        _.map(pattern, (data) => {
                            matchs.push(data.match)
                        })

                        _.map(failover, (data, index) => {
                            let strip = data.failover_strip
                            let prepend = data.failover_prepend
                            let trunk = data.failover_trunk_index
                            let name = this._getTrunkName(trunkList, trunk)

                            failoverTrunk.push({
                                'key': index,
                                'name': name,
                                'strip': strip,
                                'trunk': trunk,
                                'prepend': prepend
                            })
                        })

                        outBoundRouteItem.match = matchs.join()
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })

            $.ajax({
                type: 'json',
                async: false,
                method: 'post',
                url: api.apiHost,
                data: {
                    'page': 1,
                    'sidx': 'sequence',
                    'item_num': 1000000,
                    'outbound_route': outboundRouteId,
                    'action': 'listOutboundTimeCondition',
                    'options': 'condition_index,timetype,sequence,start_hour,start_min,end_hour,end_min,mode,week_day,month,day'
                },
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        const tc = _.sortBy((response.time_condition || []), function(data) {
                                return data.sequence
                            })

                        for (let i = 0; i < tc.length; i++) {
                            if (tc[i].timetype) {
                                let obj = tc[i]

                                obj.index = i
                                obj.end_min = AddZero(obj.end_min)
                                obj.end_hour = AddZero(obj.end_hour)
                                obj.start_min = AddZero(obj.start_min)
                                obj.start_hour = AddZero(obj.start_hour)

                                if (obj.start_hour === "" && obj.start_min === "" &&
                                    obj.end_hour === "" && obj.end_min === "") {
                                    obj.time = "00:00-23:59"
                                } else {
                                    obj.time = obj.start_hour + ':' + obj.start_min + '-' +
                                        obj.end_hour + ':' + obj.end_min
                                }

                                timeCondition.push(obj)
                            }
                        }
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        if (outBoundRouteItem.permission === 'none') {
            permissionTooltipVisible = true
            permissionTooltipTitle = formatMessage({id: "LANG3700"})
        } else if (outBoundRouteItem.permission === 'internal') {
            permissionTooltipVisible = true
            permissionTooltipTitle = formatMessage({id: "LANG2535"}, {
                    0: formatMessage({id: "LANG1071"})
                })
        } else {
            permissionTooltipTitle = ''
            permissionTooltipVisible = false
        }

        this.setState({
            treeData: treeData,
            trunkList: trunkList,
            pinSetList: pinSetList,
            holidayList: holidayList,
            accountList: accountList,
            extgroupList: extgroupList,
            failoverTrunk: failoverTrunk,
            timeCondition: timeCondition,
            officeTimeList: officeTimeList,
            slaTrunkNameList: slaTrunkNameList,
            outBoundRouteItem: outBoundRouteItem,
            extensionPrefSettings: extensionPrefSettings,
            permissionTooltipTitle: permissionTooltipTitle,
            permissionTooltipVisible: permissionTooltipVisible,
            enable_wlist: outBoundRouteItem.enable_wlist === 'yes',
            members: outBoundRouteItem.members ? outBoundRouteItem.members : [],
            pin_sets_id: outBoundRouteItem.pin_sets_id ? outBoundRouteItem.pin_sets_id : '',
            enable_out_limitime: outBoundRouteItem.enable_out_limitime ? outBoundRouteItem.enable_out_limitime : false
        })
    }
    _getTrunkName = (datasource, trunkIndex) => {
        let trunkName
        const { formatMessage } = this.props.intl

        _.map(datasource, function(data, index) {
            if (data.trunk_index === trunkIndex) {
                if (data.technology === 'Analog') {
                    trunkName = <span
                                    className={ data.out_of_service === 'yes' ? 'out-of-service' : '' }
                                >
                                    {
                                        formatMessage({id: 'LANG105'}) + ' ' + formatMessage({id: 'LANG83'}) + ' -- ' + data.trunk_name +
                                        (data.out_of_service === 'yes' ? ' -- ' + formatMessage({id: 'LANG273'}) : '')
                                    }
                                </span>
                } else {
                    trunkName = <span
                                    className={ data.out_of_service === 'yes' ? 'out-of-service' : '' }
                                >
                                    {
                                        data.technology + ' ' + formatMessage({id: 'LANG83'}) + ' -- ' + data.trunk_name +
                                        (data.out_of_service === 'yes' ? ' -- ' + formatMessage({id: 'LANG273'}) : '')
                                    }
                                </span>
                }
            }
        })

        return trunkName
    }
    _handleCancel = () => {
        browserHistory.push('/extension-trunk/outboundRoute')
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
                    let pattern = '['
                    let match = values.match.split(',') || []

                    match = _.filter(match, function(value) {
                        return value
                    })

                    if (outboundRouteIndex) {
                        action.action = 'updateOutboundRoute'
                        action.outbound_route = outboundRouteIndex
                    } else {
                        action.action = 'addOutboundRoute'
                    }

                    _.map(values, function(value, key) {
                        let fieldInstance = getFieldInstance(key)

                        if (key === 'enable_out_limitime' || key === 'office' || key === 'match' ||
                            key === 'maximumTime' || key === 'repeatTime' || key === 'warningTime' ||
                            key === 'failover_prepend' || key === 'failover_strip' || key === 'failover_trunk') {
                            return false
                        }

                        action[key] = (value !== undefined ? UCMGUI.transCheckboxVal(value) : '')
                    })

                    _.map(match, function(value, index) {
                        if (!value) {
                            return
                        }

                        value = (value[0] !== '_') ? '_' + value : value

                        if (index < match.length - 1) {
                            pattern += '{"match": "' + value + '"}, '
                        } else {
                            pattern += '{"match": "' + value + '"}]'
                        }
                    })

                    if (values.enable_out_limitime) {
                        let maximumTime = values.maximumTime
                        let warningTime = values.warningTime
                        let repeatTime = values.repeatTime

                        maximumTime = maximumTime ? (parseInt(maximumTime) * 1000) : ''
                        warningTime = warningTime ? (parseInt(warningTime) * 1000) : ''
                        repeatTime = repeatTime ? (parseInt(repeatTime) * 1000) : ''

                        action.limitime = 'L(' + maximumTime + ':' + warningTime + ':' + repeatTime + ')'
                    } else {
                        action.limitime = ''
                    }

                    action.pattern = pattern
                    action.members = this.state.members.join()
                    action.time_condition = JSON.stringify([])
                    action.failover_outbound_data = JSON.stringify([])
                    action.custom_member = this._customDynamicMember(action.custom_member)
                    action.pin_sets_id = action.pin_sets_id === 'none' ? '' : action.pin_sets_id

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

                if (values.permission === 'internal' && !permissionDisabled) {
                    confirm({
                        title: '',
                        onCancel() {},
                        onOk() { doSubmit() },
                        content: <span dangerouslySetInnerHTML=
                                        {{ __html: formatMessage({ id: "LANG2534" }, {
                                                0: formatMessage({ id: "LANG1071" }),
                                                1: formatMessage({ id: "LANG1071" })
                                            })
                                        }}
                                    ></span>
                    })
                } else if (values.permission === 'none' && !permissionDisabled) {
                    confirm({
                        title: '',
                        onCancel() {},
                        onOk() { doSubmit() },
                        content: <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG3701" }) }}></span>
                    })
                } else {
                    doSubmit()
                }
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
    _renderTrunkOptions = (isFailoverTrunk) => {
        let trunkList = this.state.trunkList
        const { formatMessage } = this.props.intl
        let slaTrunkNameList = this.state.slaTrunkNameList

        if (isFailoverTrunk) {
            trunkList = _.filter(trunkList, (data, index) => {
                return slaTrunkNameList.indexOf(data.trunk_name) === -1
            })
        }

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
                key: 'name',
                dataIndex: 'name',
                title: formatMessage({id: "LANG83"}),
                render: (text, record, index) => {
                    return record.name || ''
                }
            }, {
                key: 'strip',
                dataIndex: 'strip',
                title: formatMessage({id: "LANG1547"})
            }, {
                key: 'prepend',
                dataIndex: 'prepend',
                title: formatMessage({id: "LANG1541"}),
                render: (text, record, index) => {
                    return record.prepend || ''
                }
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
                                onClick={ this._deleteFailoverTrunk.bind(this, record) }
                            ></span>
                        </div>
                }
            }]

        const timeConditionColumns = [{
                key: 'timetype',
                dataIndex: 'timetype',
                title: formatMessage({id: "LANG1557"}),
                render: (text, record, index) => {
                    return formatMessage({id: (record.timetype >= 6 ? officeTimeType[6] : officeTimeType[record.timetype])})
                }
            }, {
                key: 'time',
                dataIndex: 'time',
                title: formatMessage({id: "LANG247"}),
                render: (text, record, index) => {
                    return ((record.timetype >= 6) ? (record.time || '--') : '--')
                }
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
                                onClick={ this._deleteTimeCondition.bind(this, record) }
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
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
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
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
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
                                        rules: [{
                                            message: formatMessage({id: "LANG2150"}),
                                            required: this.state.enable_wlist ? true : false
                                        }],
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
                                        rules: [{
                                            message: formatMessage({id: "LANG2150"}),
                                            required: this.state.enable_out_limitime ? true : false
                                        }],
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
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: settings.default_trunk_index
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1548" /> }>
                                                <span>{ formatMessage({id: "LANG245"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('strip', {
                                        rules: [],
                                        initialValue: settings.strip
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
                                            this._renderTrunkOptions(true)
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
                                        { getFieldDecorator('failover_strip', {
                                            rules: [],
                                            initialValue: settings.failover_strip
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