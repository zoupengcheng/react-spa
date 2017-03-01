'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import '../../../css/extension'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
// import * as Actions from './actions/'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Badge, Button, Dropdown, Icon, Form, Input, Menu, message, Modal, Popconfirm, Popover, Table, Tag, Tooltip } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm

class Extension extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: this._showTotal
            },
            loading: false,
            rebootList: [],
            requestData: {},
            selectedRows: [],
            autoRefresh: null,
            extensionList: [],
            selectedRowKeys: [],
            zeroConfigSettings: {},
            selectedRebootRows: [],
            selectedRebootRowKeys: [],
            rebootModalVisible: false,
            sendEmailModalVisible: false,
            batchDeleteModalVisible: false
        }
    }
    componentDidMount() {
        this.setState({
            autoRefresh: setInterval(this._autoRefresh, 3000)
        })
    }
    componentWillMount() {
        this._getExtensionList()
        this._getZeroConfigSettings()
    }
    componentWillUnmount() {
        clearInterval(this.state.autoRefresh)
    }
    _add = () => {
        const { formatMessage } = this.props.intl
        const featureLimits = JSON.parse(localStorage.getItem('featureLimits'))
        const maxExtension = (featureLimits && featureLimits.extension ? parseInt(featureLimits.extension) : 500)

        if (this.state.extensionList.length >= maxExtension) {
            const warningMessage = <span dangerouslySetInnerHTML=
                                        {{ __html: formatMessage({ id: "LANG809" }, {
                                                0: formatMessage({ id: "LANG85" }),
                                                1: maxExtension
                                            })
                                        }}
                                    ></span>

            message.warning(warningMessage, 2)
        } else {
            browserHistory.push('/extension-trunk/extension/add')
        }
    }
    _autoRefresh = () => {
        let data = _.clone(this.state.requestData)

        data['auto-refresh'] = Math.random()

        $.ajax({
            data: data,
            type: 'json',
            method: 'post',
            url: api.apiHost,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    let pager = this.state.pagination
                    const response = res.response || {}

                    // Read total count from server
                    pager.current = data.page
                    pager.total = res.response.total_item

                    this.setState({
                        pagination: pager,
                        extensionList: response.account || []
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _batchEdit = () => {
        let typeList = []
        const { formatMessage } = this.props.intl

        this.state.selectedRows.map(function(item) {
            typeList.push(item.account_type.toLowerCase().slice(0, 3))
        })

        if (_.without(typeList, typeList[0]).length) {
            message.warning(<span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG2871" }) }}></span>, 2)

            return false
        }

        if (_.indexOf(typeList, 'fxs') > -1) {
            message.warning(<span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG2870" }) }}></span>, 2)

            return false
        }

        browserHistory.push('/extension-trunk/extension/batchEdit/' + typeList[0] + '/' + this.state.selectedRowKeys.join(','))
    }
    _batchDelete = () => {
        this.setState({ batchDeleteModalVisible: true })
    }
    _clearSelectRows = () => {
        this.setState({
            selectedRows: [],
            selectedRowKeys: []
        })
    }
    _createAddr = (text, record, index) => {
        const { formatMessage } = this.props.intl

        if (!text || text === '-' || text === '1' || text === '2') {
            return '--'
        } else {
            const members = text.split(',')

            if (members.length <= 1) {
                return <div>
                        <Tag key={ members[0] }>{ members[0] }</Tag>
                    </div>
            } else {
                const content = <div>
                            {
                                members.map(function(value, index) {
                                    if (index >= 1) {
                                        return <Tag key={ value }>{ value }</Tag>
                                    }
                                }.bind(this))
                            }
                        </div>

                return <div>
                        <Tag key={ members[0] }>{ members[0] }</Tag>
                        <Popover
                            title=""
                            content={ content }
                        >
                            <Badge
                                overflowCount={ 10 }
                                count={ members.length - 1 }
                                style={{ backgroundColor: '#87d068', cursor: 'pointer' }}
                            />
                        </Popover>
                    </div>
            }
        }
    }
    _createEmailStatus = (text, record, index) => {
        let status
        const { formatMessage } = this.props.intl

        if (text && text === 'yes') {
            status = <div className="status-container email-status-sent">
                        <span
                            className="sprite sprite-email-status-sent"
                            title={ formatMessage({ id: "LANG4153" }) }
                        ></span>
                        { formatMessage({ id: "LANG4153" }) }
                    </div>
        } else {
            status = <div className="status-container email-status-disabled">
                        <span
                            className="sprite sprite-email-status-disabled"
                            title={ formatMessage({ id: "LANG4154" }) }
                        ></span>
                        { formatMessage({ id: "LANG4154" }) }
                    </div>
        }

        return status
    }
    _createOption = (text, record, index) => {
        let reboot
        const { formatMessage } = this.props.intl
        const privilege = localStorage.getItem('role')

        if (privilege === 'privilege_0' || privilege === 'privilege_1') {
            if (!record.addr ||
                record.addr === '-' ||
                record.addr === '1' ||
                record.addr === '2' ||
                UCMGUI.isIPv6(record.addr) ||
                record.account_type !== "SIP") {
                reboot = <span
                            className="sprite sprite-reboot-disabled"
                        ></span>
            } else {
                reboot = <span
                            className="sprite sprite-reboot"
                            title={ formatMessage({ id: "LANG737" }) }
                            onClick={ this._reboot.bind(this, record) }
                        ></span>
            }
        }

        return <div>
                <span
                    className="sprite sprite-edit"
                    onClick={ this._edit.bind(this, record) }>
                </span>
                { reboot }
                <Popconfirm
                    placement="left"
                    title={ <span dangerouslySetInnerHTML=
                                {{ __html: formatMessage({ id: "LANG824" }, { 0: record.extension }) }}
                            ></span> }
                    okText={ formatMessage({id: "LANG727"}) }
                    cancelText={ formatMessage({id: "LANG726"}) }
                    onConfirm={ this._delete.bind(this, record) }
                >
                    <span className="sprite sprite-del"></span>
                </Popconfirm>
            </div>
    }
    _createPresenceStatus = (text, record, index) => {
        const { formatMessage } = this.props.intl

        let result,
            type = record.account_type,
            presenceStatus = record.presence_status

        if (type !== 'SIP') {
            result = '--'
        } else {
            if (presenceStatus === 'not_set') {
                result = formatMessage({ id: "LANG257" })
            } else if (presenceStatus === 'unavailable') {
                result = formatMessage({ id: "LANG113" })
            } else if (presenceStatus === 'available') {
                result = formatMessage({ id: "LANG116" })
            } else if (presenceStatus === 'away') {
                result = formatMessage({ id: "LANG5453" })
            } else if (presenceStatus === 'chat') {
                result = formatMessage({ id: "LANG4287" })
            } else if (presenceStatus === 'dnd') {
                result = formatMessage({ id: "LANG4768" })
            } else if (presenceStatus === 'userdef1') {
                result = formatMessage({ id: "LANG5451" })
            }
        }

        return result
    }
    _createStatus = (text, record, index) => {
        const { formatMessage } = this.props.intl

        let status,
            disabled = record.out_of_service

        if (disabled === 'yes') {
            status = <div className="status-container unavailable">
                        <span
                            className="sprite sprite-status-unavailable"
                            title={ formatMessage({ id: "LANG273" }) }
                        ></span>
                        { formatMessage({ id: "LANG273" }) }
                    </div>
        } else if (!text || text === 'Unavailable') {
            status = <div className="status-container unavailable">
                        <span
                            className="sprite sprite-status-unavailable"
                            title={ formatMessage({ id: "LANG113" }) }
                        ></span>
                        { formatMessage({ id: "LANG113" }) }
                    </div>
        } else if (text === 'Idle') {
            status = <div className="status-container idle">
                        <span
                            className="sprite sprite-status-idle"
                            title={ formatMessage({ id: "LANG2232" }) }
                        ></span>
                        { formatMessage({ id: "LANG2232" }) }
                    </div>
        } else if (text === 'InUse') {
            status = <div className="status-container inuse">
                        <span
                            className="sprite sprite-status-inuse"
                            title={ formatMessage({ id: "LANG2242" }) }
                        ></span>
                        { formatMessage({ id: "LANG2242" }) }
                    </div>
        } else if (text === 'Ringing') {
            status = <div className="status-container ringing">
                        <span
                            className="sprite sprite-status-ringing"
                            title={ formatMessage({ id: "LANG111" }) }
                        ></span>
                        { formatMessage({ id: "LANG111" }) }
                    </div>
        } else if (text === 'Busy') {
            status = <div className="status-container busy">
                        <span
                            className="sprite sprite-status-busy"
                            title={ formatMessage({ id: "LANG2237" }) }
                        ></span>
                        { formatMessage({ id: "LANG2237" }) }
                    </div>
        }

        return status
    }
    _delete = (record) => {
        const { formatMessage } = this.props.intl
        const loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteUser",
                "user_name": record.extension
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._autoRefresh()

                    this.setState({
                        selectedRowKeys: _.without(this.state.selectedRowKeys, record.extension),
                        selectedRows: this.state.selectedRows.filter(function(item) { return item.extension !== record.extension })
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/extension-trunk/extension/edit/' + record.account_type.toLowerCase().slice(0, 3) + '/' + record.extension)
    }
    _export = (e) => {
        const type = e.key

        window.open("/cgi?action=downloadFile&type=export_" + type + "_extensions&data=export_" + type + "_extensions.csv", '_self')
    }
    _getExtensionList = (
        params = {
            page: 1,
            sord: 'asc',
            item_num: 10,
            sidx: 'extension'
        }, ext_num) => {
            const { formatMessage } = this.props.intl

            let data = {
                    ...params,
                    action: 'listAccount',
                    options: "extension,account_type,fullname,status,addr,out_of_service,email_to_user,presence_status"
                }

            if (ext_num) {
                data.ext_num = ext_num
            }

            this.setState({
                loading: true,
                requestData: data
            })

            $.ajax({
                data: data,
                type: 'json',
                method: 'post',
                url: api.apiHost,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        let pager = this.state.pagination

                        // Read total count from server
                        pager.current = data.page
                        pager.total = res.response.total_item

                        this.setState({
                            loading: false,
                            pagination: pager,
                            extensionList: response.account || []
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
    }
    _getZeroConfigSettings = () => {
        const { formatMessage } = this.props.intl

        let zeroConfigSettings = UCMGUI.isExist.getList("getZeroConfigSettings", formatMessage)

        this.setState({
            zeroConfigSettings: zeroConfigSettings
        })
    }
    _handleBatchDeleteCancel = () => {
        this.setState({ batchDeleteModalVisible: false })
    }
    _handleBatchDeleteOk = () => {
        const { formatMessage } = this.props.intl
        const loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG5414" })}}></span>

        this.setState({ batchDeleteModalVisible: false })

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                'action': 'deleteUser',
                'user_name': this.state.selectedRowKeys.join(',')
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._autoRefresh()

                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleRebootCancel = () => {
        this.setState({ rebootModalVisible: false })
    }
    _handleRebootOk = () => {
        let __this = this
        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG829" })}}></span>
        const confirmMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG834" })}}></span>
        const warningMessage = <span dangerouslySetInnerHTML=
                                        {{ __html: formatMessage({ id: "LANG3531" }, {
                                                0: '1',
                                                1: formatMessage({ id: "LANG155" }).toLowerCase()
                                            })
                                        }}
                                    ></span>

        if (!this.state.selectedRebootRowKeys.length) {
            message.warning(warningMessage)
        } else {
            let ipLists = []

            this._handleRebootCancel()

            this.state.selectedRebootRows.map(function(item) {
                ipLists.push(item.key + '@' + item.ip)
            })

            confirm({
                title: '',
                content: confirmMessage,
                onOk() {
                    $.ajax({
                        url: api.apiHost,
                        method: 'post',
                        data: {
                            'ip': ipLists.join(','),
                            'action': 'rebootDevice'
                        },
                        type: 'json',
                        success: function(res) {
                            const bool = UCMGUI.errorHandler(res, null, __this.props.intl.formatMessage)

                            if (bool) {
                                const rebootDevice = res.response.rebootDevice

                                if (rebootDevice === "Send REBOOT !") {
                                    message.success(successMessage)
                                } else {
                                    // res.lChop("ZCERROR_")
                                    const num = rebootDevice.substr(8)
                                    const localeID = __this.props.zeroconfigErr[num] ? __this.props.zeroconfigErr[num] : "LANG909"

                                    message.error(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: localeID })}}></span>)
                                }
                            }
                        },
                        error: function(e) {
                            message.error(e.statusText)
                        }
                    })
                },
                onCancel() {}
            })
        }
    }
    _handleSendEmailCancel = () => {
        this.setState({ sendEmailModalVisible: false })
    }
    _handleSendEmailJump = () => {
        browserHistory.push('/system-settings/emailSettings')
    }
    _handleSendEmailOk = () => {
        const { formatMessage } = this.props.intl
        const loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG3496" })}}></span>
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG3497" })}}></span>
        const sendExtensions = this.state.selectedRowKeys.length ? this.state.selectedRowKeys.join(',') : ''

        this.setState({ sendEmailModalVisible: false })

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                'extension': sendExtensions,
                'action': 'sendAccount2User'
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleSearchSubmit(e) {
        e.preventDefault()

        const { formatMessage } = this.props.intl
        const loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG3773" })}}></span>
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                // message.loading(loadingMessage)

                this._getExtensionList({
                        page: 1,
                        sord: 'asc',
                        item_num: 10,
                        sidx: 'extension'
                    }, values.ext_num)

                // message.destroy()
                // message.success(successMessage)

                this._clearSelectRows()
            }
        })
    }
    _handleTableChange = (pagination, filters, sorter) => {
        this._getExtensionList({
            sidx: sorter.field,
            page: pagination.current,
            item_num: pagination.pageSize,
            sord: sorter.order === 'ascend' ? 'asc' : 'desc',
            ...filters
        })

        this._clearSelectRows()
    }
    _import = () => {
        // browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ selectedRowKeys, selectedRows })
    }
    _onSelectRebootChange = (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({
            selectedRebootRows: selectedRows,
            selectedRebootRowKeys: selectedRowKeys
        })
    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    _reboot = (record) => {
        const { formatMessage } = this.props.intl
        const confirmContent = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG828" })}}></span>

        if (this.state.zeroConfigSettings && this.state.zeroConfigSettings.enable_zeroconfig !== '1') {
            confirm({
                title: '',
                content: confirmContent,
                onOk() {
                    browserHistory.push('/value-added-features/zeroConfig')
                },
                onCancel() {}
            })
        } else {
            let extension = record.extension
            let rebootList = record.addr ? record.addr.split(',') : []

            rebootList = rebootList.map(function(value) {
                let rebootIP

                if (UCMGUI.isIPv6(value)) {
                    rebootIP = value.split(']:')[0] + ']'
                } else {
                    rebootIP = value.split(':')[0]
                }

                return {
                        ip: rebootIP,
                        key: extension
                    }
            })

            this.setState({
                rebootList: rebootList,
                selectedRebootRows: [],
                rebootModalVisible: true,
                selectedRebootRowKeys: []
            })
        }
    }
    _sendEmail = () => {
        const { formatMessage } = this.props.intl
        const disabledExtensions = this.state.selectedRows.filter(function(item) { return item.out_of_service === 'yes' })

        if (disabledExtensions.length) {
            message.warning(<span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG5059" }) }}></span>, 2)

            return false
        }

        this.setState({ sendEmailModalVisible: true })
    }
    _validateCallerNumFormate = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && !/^[0-9\+]*x*.{0,1}$/i.test(value)) {
            callback(formatMessage({id: "LANG2767"}))
        } else {
            callback()
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const columns = [{
                key: 'status',
                dataIndex: 'status', 
                title: formatMessage({id: "LANG81"}),
                render: (text, record, index) => (
                    this._createStatus(text, record, index)
                )
            }, {
                key: 'presence_status',
                dataIndex: 'presence_status', 
                title: formatMessage({id: "LANG5450"}),
                render: (text, record, index) => (
                    this._createPresenceStatus(text, record, index)
                )
            }, {
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG85"})
            }, {
                key: 'fullname',
                dataIndex: 'fullname',
                title: formatMessage({id: "LANG1065"})
            }, {
                key: 'account_type',
                dataIndex: 'account_type',
                title: formatMessage({id: "LANG623"})
            }, {
                key: 'addr',
                dataIndex: 'addr',
                title: formatMessage({id: "LANG624"}),
                render: (text, record, index) => (
                    this._createAddr(text, record, index)
                )
            }, {
                key: 'email_to_user',
                dataIndex: 'email_to_user',
                title: formatMessage({id: "LANG4152"}),
                render: (text, record, index) => (
                    this._createEmailStatus(text, record, index)
                )
            }, { 
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => (
                    this._createOption(text, record, index)
                ) 
            }]
        
        const pagination = {
                showSizeChanger: true,
                total: this.state.extensionList.length,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)

                    this._clearSelectRows()
                },
                onChange: (current) => {
                    console.log('Current: ', current)

                    this._clearSelectRows()
                }
            }

        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }

        const rebootColumns = [{
                key: 'ip',
                dataIndex: 'ip', 
                title: formatMessage({id: "LANG155"})
            }]

        const rebootRowSelection = {
                onChange: this._onSelectRebootChange,
                selectedRowKeys: this.state.selectedRebootRowKeys
            }

        const exportMenu = (
                <Menu onClick={ this._export }>
                    <Menu.Item key="sip">{ formatMessage({id: "LANG2927"}) }</Menu.Item>
                    <Menu.Item key="iax">{ formatMessage({id: "LANG2929"}) }</Menu.Item>
                    <Menu.Item key="fxs">{ formatMessage({id: "LANG2928"}) }</Menu.Item>
                </Menu>
            )

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG622"})
                })

        return (
            <div className="app-content-main app-content-extension">
                <Title
                    isDisplay='hidden'
                    headerTitle={ formatMessage({id: "LANG622"}) }
                />
                <div className="content">
                    <div className="top-button">
                        <Form inline onSubmit={ this._handleSearchSubmit.bind(this) }>
                            <Tooltip
                                placement="bottom"
                                title={ <FormattedHTMLMessage id="LANG5175" /> }
                            >
                                <FormItem>
                                    { getFieldDecorator('ext_num', {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                Validator.noSpaces(data, value, callback, formatMessage)
                                            }
                                        }, {
                                            validator: (data, value, callback) => {
                                                Validator.maxlength(data, value, callback, formatMessage, 18)
                                            }
                                        }, {
                                            validator: this._validateCallerNumFormate
                                        }]
                                    })(
                                        <Input
                                            size="default"
                                            placeholder={ formatMessage({id: "LANG5415"}) }
                                        />
                                    ) }
                                </FormItem>
                            </Tooltip>
                            <FormItem>
                                <Button
                                    size="default"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    { formatMessage({id: "LANG803"}) }
                                </Button>
                            </FormItem>
                        </Form>
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={ this._add }
                        >
                            { formatMessage({id: "LANG769"}) }
                        </Button>
                        <Button
                            icon="edit"
                            type="primary"
                            onClick={ this._batchEdit }
                            disabled={ !this.state.selectedRowKeys.length }
                        >
                            { formatMessage({id: "LANG738"}) }
                        </Button>
                        <Button
                            icon="delete"
                            type="primary"
                            onClick={ this._batchDelete }
                            disabled={ !this.state.selectedRowKeys.length }
                        >
                            { formatMessage({id: "LANG739"}) }
                        </Button>
                        <Modal
                            onOk={ this._handleBatchDeleteOk }
                            onCancel={ this._handleBatchDeleteCancel }
                            title={ formatMessage({id: "LANG735"}) }
                            okText={ formatMessage({id: "LANG727"}) }
                            cancelText={ formatMessage({id: "LANG726"}) }
                            visible={ this.state.batchDeleteModalVisible }
                        >
                            <span dangerouslySetInnerHTML=
                                {{ __html: formatMessage({ id: "LANG824" }, { 0: this.state.selectedRowKeys.join('  ') }) }}
                            ></span>
                        </Modal>
                        <Button
                            icon="upload"
                            type="primary"
                            onClick={ this._import }
                        >
                            { formatMessage({id: "LANG2733"}) }
                        </Button>
                        
                        <Dropdown
                            overlay={ this.state.extensionList.length ? exportMenu : '' }
                        >
                            <Button
                                icon="export"
                                type="primary"
                                disabled={ !this.state.extensionList.length }
                            >
                                { formatMessage({id: "LANG2734"}) }
                                <Icon type="down" />
                            </Button>
                        </Dropdown>
                        <Button
                            icon="mail"
                            type="primary"
                            onClick={ this._sendEmail }
                            disabled={ !this.state.extensionList.length }
                        >
                            { formatMessage({id: "LANG3495"}) }
                        </Button>
                        <Modal
                            onOk={ this._handleSendEmailOk }
                            onCancel={ this._handleSendEmailCancel }
                            title={ formatMessage({id: "LANG3495"}) }
                            visible={ this.state.sendEmailModalVisible }
                            footer={ [
                                <Button key="back" type="ghost" size="large" onClick={ this._handleSendEmailCancel }>
                                    { formatMessage({id: "LANG726"}) }
                                </Button>,
                                <Button key="jump" type="primary" size="large" onClick={ this._handleSendEmailJump }>
                                    { formatMessage({id: "LANG4576"}) }
                                </Button>,
                                <Button key="submit" type="primary" size="large" onClick={ this._handleSendEmailOk }>
                                    { formatMessage({id: "LANG727"}) }
                                </Button>
                            ] }
                        >
                            <FormattedHTMLMessage id="LANG3498" />
                        </Modal>
                        <Modal
                            onOk={ this._handleRebootOk }
                            onCancel={ this._handleRebootCancel }
                            title={ formatMessage({id: "LANG737"}) }
                            okText={ formatMessage({id: "LANG737"}) }
                            visible={ this.state.rebootModalVisible }
                            cancelText={ formatMessage({id: "LANG726"}) }
                        >
                            <Table
                                bordered
                                rowKey="extension"
                                pagination={ false }
                                columns={ rebootColumns }
                                rowSelection={ rebootRowSelection }
                                dataSource={ this.state.rebootList }
                                showHeader={ !!this.state.rebootList.length }
                            />
                        </Modal>
                    </div>
                    <div className="clearfix">
                        <Table
                            rowKey="extension"
                            columns={ columns }
                            rowSelection={ rowSelection }
                            loading={ this.state.loading}
                            pagination={ this.state.pagination }
                            onChange={ this._handleTableChange }
                            dataSource={ this.state.extensionList }
                        />
                    </div>
                </div>
            </div>
        )
    }
}

Extension.defaultProps = {
    zeroconfigErr: {
        "1": "LANG918",
        "2": "LANG919",
        "3": "LANG920",
        "4": "LANG2538"
    }
}

export default Form.create()(injectIntl(Extension))