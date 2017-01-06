'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Badge, Button, Col, Form, message, Modal, Row, Popconfirm, Popover, Select, Table, Tag, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
const AddZero = UCMGUI.addZero

class InboundRoute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inboundMode: 0,
            inboundRoutes: [],
            selectedRowKeys: [],
            officeTimeType: ["LANG133", "LANG3271", "LANG3275",
                    "LANG3266", "LANG3286", "LANG3287", "LANG3288"]
        }
    }
    componentWillMount() {
        this._getInitData()
        this._getInboundMode()
    }
    componentWillUnmount() {
        clearTimeout(this.state.setTimeout)
    }
    componentDidMount() {
        if (this.state.trunkList.length) {
            this._getInboundRoutes(this.state.trunkList[0].trunk_index)
        } else {
            this._getInboundRoutes('0')
        }
    }
    _add = () => {
        let confirmContent = ''
        const { formatMessage } = this.props.intl

        confirmContent = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG880" })}}></span>

        if (!this.state.accountList.length) {
            confirm({
                title: '',
                content: confirmContent,
                onOk() {
                    browserHistory.push('/extension-trunk/extension')
                },
                onCancel() {}
            })
        } else {
            browserHistory.push('/extension-trunk/extensionGroup/add')
        }
    }
    _blacklist = (record) => {
        browserHistory.push('/extension-trunk/extensionGroup/edit/' + record.group_id + '/' + record.group_name)
    }
    _delete = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteExtensionGroup",
                "extension_group": record.group_id
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInboundRoutes()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/extension-trunk/extensionGroup/edit/' + record.group_id + '/' + record.group_name)
    }
    _createDestination = (text, record, index) => {
        const __this = this
        const { formatMessage } = this.props.intl

        return <span
                    className="status-container"
                    // style={{ 'text-align': 'center' }}
                >
                    {
                        record.members.map(function(item, index) {
                            if (!item || (!item.timetype && item.timetype !== '0') ||
                                (item.inbound_mode === '1' && item.en_multi_mode === 'no') ||
                                (item.tc && item.tc === '1' && item.timetype === '0')) {
                                return false
                            }

                            return __this._translateDestination(undefined, undefined, item, index)
                        })
                    }
                </span>
    }
    _createMode = (text, record, index) => {
        let mode
        const { formatMessage } = this.props.intl

        if (this.state.inboundMode === 1) {
            mode = <span className="status-container ringing">{ formatMessage({id: "LANG4289"}, {0: 1}) }</span>
        } else {
            mode = <span className="status-container idle">{ formatMessage({id: "LANG4288"}) }</span>
        }

        return mode
    }
    _createPattern = (text, record, index) => {
        let pattern
        const { formatMessage } = this.props.intl

        if (text) {
            const patternList = text.split(',')
            const disabled = (record.out_of_service === 'yes')
            const className = (disabled ? 'status-container unavailable' : 'status-container')
            const disabledIcon = (disabled
                        ? <span className="sprite sprite-status-unavailable"
                                title={ formatMessage({ id: "LANG273" }) }
                            ></span>
                        : '')

            pattern = <div className={ className }>
                            <div style={{ 'display': 'inline-block' }}>
                                { patternList.map(function(value, index) {
                                    return <span key={ index } style={{ 'display': 'block' }}>
                                                { disabledIcon }
                                                { value }
                                            </span>
                                }) }
                            </div>
                        </div>
        } else {
            pattern = formatMessage({ id: "LANG2750" })
        }

        return pattern
    }
    _createTime = (text, record, index) => {
        const { formatMessage } = this.props.intl

        return <span
                    className="status-container"
                    // style={{ 'text-align': 'center' }}
                >
                    {
                        record.members.map(function(item, index) {
                            if (!item || (!item.timetype && item.timetype !== '0') ||
                                (item.inbound_mode === '1' && item.en_multi_mode === 'no') ||
                                (item.tc && item.tc === '1' && item.timetype === '0')) {
                                return false
                            } else if (item.timetype === '0') {
                                return <span key={ index } style={{ 'display': 'block' }}>{ formatMessage({ id: 'LANG257'}) }</span>
                            } else if (item.timetype > 0 && item.timetype <= 5) {
                                return <span key={ index } style={{ 'display': 'block' }}>{ '--' }</span>
                            }

                            let stime_hour = AddZero(item.start_hour),
                                stime_minute = AddZero(item.start_min),
                                ftime_hour = AddZero(item.end_hour),
                                ftime_minute = AddZero(item.end_min),
                                tempTime = (stime_hour + ':' + stime_minute + '-' + ftime_hour + ':' + ftime_minute)

                            return <span key={ index } style={{ 'display': 'block' }}>{ tempTime }</span>
                        })
                    }
                </span>
    }
    _createTimeType = (text, record, index) => {
        const { formatMessage } = this.props.intl
        const officeTimeType = this.state.officeTimeType

        return <span
                    className="status-container"
                    // style={{ 'text-align': 'center' }}
                >
                    {
                        record.members.map(function(item, index) {
                            if (!item || (!item.timetype && item.timetype !== '0') ||
                                (item.inbound_mode === '1' && item.en_multi_mode === 'no') ||
                                (item.tc && item.tc === '1' && item.timetype === '0')) {
                                return false
                            } else if (item.timetype === '0') {
                                return <span key={ index } style={{ 'display': 'block' }}>{ '--' }</span>
                            } else {
                                const timetype = item.timetype

                                return <span key={ index } style={{ 'display': 'block' }}>
                                            { formatMessage({ id: officeTimeType[(timetype > 5 ? 6 : timetype)] }) }
                                        </span>
                            }
                        })
                    }
                </span>
    }
    _createType = (text, record, index) => {
        const { formatMessage } = this.props.intl

        return <span
                    className="status-container"
                    // style={{ 'text-align': 'center' }}
                >
                    {
                        record.members.map(function(item, index) {
                            if (!item || (!item.timetype && item.timetype !== '0') ||
                                (item.inbound_mode === '1' && item.en_multi_mode === 'no') ||
                                (item.tc && item.tc === '1' && item.timetype === '0')) {
                                return false
                            } else if (item.timetype === '0' || (item.timetype > 0 && item.timetype <= 5)) {
                                return <span key={ index } style={{ 'display': 'block' }}>{ '--' }</span>
                            }

                            return <span key={ index } style={{ 'display': 'block' }}>
                                        { formatMessage({ id: (item.mode === 'byWeek') ? 'LANG199' : 'LANG200' }) }
                                    </span>
                        })
                    }
                </span>
    }
    _getDisplayName = (type, id_key, id_value, display_key) => {
        let display_name = ''

        _.each(this.state.destinationTypeValue[type], function(item) {
            if (item[id_key] === id_value) {
                display_name = item[display_key]
            }
        })

        return display_name
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl

        let trunkList = UCMGUI.isExist.getList("getTrunkList", formatMessage)
        let slaTrunkNameList = UCMGUI.isExist.getList("getSLATrunkNameList", formatMessage)
        let destinationTypeValue = {
                'byDID': [],
                'external_number': [],
                'account': UCMGUI.isExist.getList("getAccountList", formatMessage),
                'voicemail': UCMGUI.isExist.getList("getVoicemailList", formatMessage),
                'conference': UCMGUI.isExist.getList("getConferenceList", formatMessage),
                'queue': UCMGUI.isExist.getList("getQueueList", formatMessage),
                'ringgroup': UCMGUI.isExist.getList("getRinggroupList", formatMessage),
                'paginggroup': UCMGUI.isExist.getList("getPaginggroupList", formatMessage),
                'vmgroup': UCMGUI.isExist.getList("getVMgroupList", formatMessage),
                'fax': UCMGUI.isExist.getList("getFaxList", formatMessage),
                'disa': UCMGUI.isExist.getList("getDISAList", formatMessage),
                'ivr': UCMGUI.isExist.getList("getIVRList", formatMessage),
                'directory': UCMGUI.isExist.getList("getDirectoryList", formatMessage),
                'callback': UCMGUI.isExist.getList("getCallbackList", formatMessage)
            }

        this.setState({
                trunkList: trunkList,
                slaTrunkNameList: slaTrunkNameList,
                destinationTypeValue: destinationTypeValue
            })
    }
    _getInboundRoutes = (index) => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                sord: 'asc',
                trunk_index: index,
                sidx: 'inbound_rt_index',
                action: 'listInboundRoute',
                options: 'inbound_rt_index,did_pattern_match,did_pattern_allow,out_of_service'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const inboundRoutes = response.inbound_route || []

                    this.setState({
                        inboundRoutes: inboundRoutes
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getInboundMode = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getInboundMode',
                'auto-refresh': Math.random()
            },
            type: 'json',
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const inboundMode = response.inbound_mode.inbound_mode

                    this.setState({
                        inboundMode: inboundMode,
                        setTimeout: setTimeout(this._getInboundMode, 5000)
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _onChangeTrunk = (value) => {
        this._getInboundRoutes(value)
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ selectedRowKeys })
    }
    _showDestination = (lang, val, type, inbondModeText, index) => {
        let destination = ''
        const { formatMessage } = this.props.intl

        if (!val) {
            destination = <span key={ index } style={{ 'display': 'block' }}>
                                { inbondModeText }
                                { formatMessage({ id: lang }) + ' ' + formatMessage({ id: 'LANG2886' }) }
                            </span>
        } else if (type === 'account' || type === 'voicemail') {
            let item = _.find(this.state.destinationTypeValue[type], function(data) {
                            return data.extension === val
                        }),
                fullname = item.fullname,
                disable = item.out_of_service

            if (disable && disable === 'yes') {
                destination = <span key={ index } style={{ 'display': 'block' }}>
                                { inbondModeText }
                                <span className="out-of-service">
                                    {
                                        formatMessage({ id: lang }) + ' -- ' + val +
                                            (fullname ? ' "' + fullname + '"' : '') +
                                            ' <' + formatMessage({ id: 'LANG273' }) + '>'
                                    }
                                </span>
                            </span>
            } else {
                destination = <span key={ index } style={{ 'display': 'block' }}>
                                { inbondModeText }
                                <span>
                                    {
                                        formatMessage({ id: lang }) + ' -- ' + val +
                                            (fullname ? ' "' + fullname + '"' : '')
                                    }
                                </span>
                            </span>
            }
        } else {
            destination = <span key={ index } style={{ 'display': 'block' }}>
                                { inbondModeText }
                                { formatMessage({ id: lang }) + ' -- ' + val }
                            </span>
        }

        return destination
    }
    _translateDestination = (cellvalue, options, rowObject, index) => {
        let type = rowObject.destination_type,
            destination = '',
            display_name = '',
            inbondModeText = ''

        const { formatMessage } = this.props.intl

        if (rowObject.inbound_mode === '1') {
            inbondModeText = <span
                                key={ index }
                                className="status-container ringing"
                                style={{ 'marginRight': '10px' }}
                            >{ formatMessage({id: "LANG4289"}, {0: 1}) }</span>
        } else {
            inbondModeText = <span
                                key={ index }
                                className="status-container idle"
                                style={{ 'marginRight': '10px' }}
                            >{ formatMessage({id: "LANG4288"}) }</span>
        }   

        switch (type) {
            case 'byDID':
                destination = <span
                                key={ index }
                                style={{ 'display': 'block' }}
                            >
                                { inbondModeText }
                                { formatMessage({ id: 'LANG1563' }) + ' -- Strip ' + rowObject.did_strip }
                            </span>
                break
            case 'account':
                destination = this._showDestination('LANG248', rowObject[type], type, inbondModeText, index)
                break
            case 'voicemail':
                destination = this._showDestination('LANG249', rowObject[type], type, inbondModeText, index)
                break
            case 'conference':
                destination = this._showDestination('LANG98', rowObject[type], undefined, inbondModeText, index)
                break
            case 'queue':
                display_name = this._getDisplayName(type, 'extension', rowObject[type], 'queue_name')

                destination = this._showDestination('LANG91', display_name, undefined, inbondModeText, index)
                break
            case 'ringgroup':
                display_name = this._getDisplayName(type, 'extension', rowObject[type], 'ringgroup_name')

                destination = this._showDestination('LANG600', display_name, undefined, inbondModeText, index)
                break
            case 'paginggroup':
                display_name = this._getDisplayName(type, 'extension', rowObject[type], 'paginggroup_name')

                destination = this._showDestination('LANG94', display_name, undefined, inbondModeText, index)
                break
            case 'vmgroup':
                display_name = this._getDisplayName(type, 'extension', rowObject[type], 'vmgroup_name')

                destination = this._showDestination('LANG89', display_name, undefined, inbondModeText, index)
                break
            case 'fax':
                display_name = this._getDisplayName(type, 'extension', rowObject[type], 'fax_name')

                destination = this._showDestination('LANG95', display_name, undefined, inbondModeText, index)
                break
            case 'disa':
                display_name = this._getDisplayName(type, 'disa_id', rowObject[type], 'display_name')

                destination = this._showDestination('LANG2353', display_name, undefined, inbondModeText, index)
                break
            case 'ivr':
                display_name = this._getDisplayName(type, 'ivr_id', rowObject[type], 'ivr_name')

                destination = this._showDestination('LANG134', display_name, undefined, inbondModeText, index)
                break
            case 'directory':
                display_name = this._getDisplayName(type, 'extension', rowObject[type], 'name')

                destination = this._showDestination('LANG2884', display_name, undefined, inbondModeText, index)
                break
            case 'external_number':
                // display_name = this._getDisplayName(type, 'external_number', rowObject[type], 'name')

                destination = this._showDestination('LANG3458', rowObject[type], undefined, inbondModeText, index)
                break
            case 'callback':
                display_name = this._getDisplayName(type, 'callback_id', rowObject[type], 'name')

                destination = this._showDestination('LANG3741', display_name, undefined, inbondModeText, index)
                break
            default:
                destination = <span>{ '--' }</span>
                break
        }

        return destination
    }
    render() {
        const { formatMessage } = this.props.intl
        const slaTrunkNameList = this.state.slaTrunkNameList
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
                labelCol: { span: 3 },
                wrapperCol: { span: 6 }
            }

        const columns = [{
                key: 'did_pattern_match',
                dataIndex: 'did_pattern_match',
                title: formatMessage({id: "LANG246"}),
                sorter: (a, b) => a.did_pattern_match.length - b.did_pattern_match.length,
                render: (text, record, index) => (
                    this._createPattern(text, record, index)
                )
            }, {
                key: 'did_pattern_allow',
                dataIndex: 'did_pattern_allow',
                title: formatMessage({id: "LANG2748"}),
                sorter: (a, b) => a.did_pattern_allow.length - b.did_pattern_allow.length,
                render: (text, record, index) => (
                    this._createPattern(text, record, index)
                )
            }, {
                key: 'mode',
                dataIndex: 'mode',
                title: formatMessage({id: "LANG4294"}),
                render: (text, record, index) => (
                    this._createMode(text, record, index)
                )
            }, {
                key: 'time_type',
                dataIndex: 'time_type',
                title: formatMessage({id: "LANG1557"}),
                render: (text, record, index) => (
                    this._createTimeType(text, record, index)
                )
            }, {
                key: 'time',
                dataIndex: 'time',
                title: formatMessage({id: "LANG247"}),
                render: (text, record, index) => (
                    this._createTime(text, record, index)
                )
            }, {
                key: 'type',
                dataIndex: 'type',
                title: formatMessage({id: "LANG84"}),
                render: (text, record, index) => (
                    this._createType(text, record, index)
                )
            }, {
                key: 'destination',
                dataIndex: 'destination',
                title: formatMessage({id: "LANG168"}),
                render: (text, record, index) => (
                    this._createDestination(text, record, index)
                )
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <div>
                            <span
                                className="sprite sprite-edit"
                                onClick={ this._edit.bind(this, record) }>
                            </span>
                            <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._delete.bind(this, record) }
                            >
                                <span className="sprite sprite-del"></span>
                            </Popconfirm>
                        </div>
                }
            }]

        const pagination = {
                total: this.state.inboundRoutes.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }

        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG658"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG658"}) }
                    isDisplay='hidden'
                />
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._add }
                        >
                            { formatMessage({id: "LANG769"}) }
                        </Button>
                        <Button
                            icon="solution"
                            type="primary"
                            size='default'
                            onClick={ this._blacklist }
                        >
                            { formatMessage({id: "LANG2278"}) }
                        </Button>
                        <Button
                            icon="setting"
                            type="primary"
                            size='default'
                            onClick={ this._inboundModeSettings }
                        >
                            { formatMessage({id: "LANG4543"}) }
                        </Button>
                    </div>
                    <Row
                        className={ this.state.trunkList.length ? 'display-block' : 'hidden' }
                    >
                        <Col span={ 24 }>
                            <FormItem
                                { ...formItemLayout }
                                style={{ 'margin': '10px 14px 14px' }}
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage
                                                            id="LANG83"
                                                            defaultMessage="LANG83"
                                                        /> }>
                                            <span>{ formatMessage({id: "LANG83"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                <Select
                                    style={{ 'width': '100%' }}
                                    onChange={ this._onChangeTrunk }
                                    defaultValue= { this.state.trunkList.length
                                                    ? (this.state.trunkList[0].trunk_index + '')
                                                    : '0'
                                                }
                                >
                                    { this.state.trunkList.map(function(item, index) {
                                        let title = '',
                                            name = item.trunk_name,
                                            value = item.trunk_index + '',
                                            technology = item.technology,
                                            isSLA = (slaTrunkNameList.indexOf(name) > -1),
                                            disabled = (item.out_of_service && item.out_of_service === 'yes')

                                        if (technology === 'Analog') {
                                            title += formatMessage({id: "LANG105"})
                                        } else if (technology === 'SIP') {
                                            title += formatMessage({id: "LANG108"})
                                        } else if (technology === 'IAX') {
                                            title += formatMessage({id: "LANG107"})
                                        } else if (technology === 'BRI') {
                                            title += formatMessage({id: "LANG2835"})
                                        } else if (technology === 'PRI' || technology === 'SS7' || technology === 'MFC/R2' || technology === 'EM' || technology === 'EM_W') {
                                            title += technology
                                        }

                                        title += ' ' + formatMessage({id: "LANG83"}) + ' -- ' + name

                                        if (disabled) {
                                            title += ' -- ' + formatMessage({id: "LANG273"})
                                        } else if (isSLA) {
                                            title += ' -- ' + formatMessage({id: "LANG3218"})
                                        }

                                        return <Option
                                                    key={ value }
                                                    value={ value }
                                                    technology={ technology }
                                                    className={ (disabled || isSLA) ? 'out-of-service' : '' }
                                                >{ title }</Option>
                                    }) }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Table
                        columns={ columns }
                        pagination={ pagination }
                        rowKey="inbound_rt_index"
                        rowSelection={ rowSelection }
                        dataSource={ this.state.inboundRoutes }
                        showHeader={ !!this.state.inboundRoutes.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(InboundRoute)