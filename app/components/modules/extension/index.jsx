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
const Privilege = localStorage.getItem('role')
const FeatureLimits = JSON.parse(localStorage.getItem('featureLimits'))

class Extension extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRows: [],
            extensionList: [],
            selectedRowKeys: [],
            sendEmailModalVisible: false,
            batchDeleteModalVisible: false
        }
    }
    componentDidMount() {
        this._getExtensionList()
    }
    componentWillUnmount() {
    }
    _add = () => {
        const { formatMessage } = this.props.intl
        const maxExtension = FeatureLimits.extension ? parseInt(FeatureLimits.extension) : 500

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

        if (Privilege === 'privilege_0' || Privilege === 'privilege_1') {
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

                    this._getExtensionList()

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
    _getExtensionList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            async: true,
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                sord: 'asc',
                sidx: 'extension',
                action: 'listAccount',
                options: "extension,account_type,fullname,status,addr,out_of_service,email_to_user"
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    this.setState({
                        extensionList: response.account || []
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
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

                    this._getExtensionList()

                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
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
                'action': 'sendAccount2User',
                'extension': sendExtensions
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
                let action = {
                        sord: 'asc',
                        sidx: 'extension',
                        action: 'listAccount',
                        options: "extension,account_type,fullname,status,addr,out_of_service,email_to_user"
                    }

                if (values.ext_num) {
                    action.ext_num = values.ext_num
                }

                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                $.ajax({
                    async: true,
                    data: action,
                    type: 'json',
                    method: 'post',
                    url: api.apiHost,
                    success: function(res) {
                        const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                        if (bool) {
                            const response = res.response || {}

                            this.setState({
                                extensionList: response.account || []
                            })

                            message.destroy()
                            // message.success(successMessage)

                            this._clearSelectRows()
                        }
                    }.bind(this),
                    error: function(e) {
                        message.error(e.statusText)
                    }
                })
            }
        })
    }
    _import = () => {
        // browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ selectedRowKeys, selectedRows })
    }
    _reboot = (record) => {
        browserHistory.push('/extension-trunk/extension/add')
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

        const columns = [
            {
                key: 'status',
                dataIndex: 'status', 
                title: formatMessage({id: "LANG81"}),
                sorter: (a, b) => a.status.length - b.status.length,
                render: (text, record, index) => (
                    this._createStatus(text, record, index)
                )
            }, {
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG85"}),
                sorter: (a, b) => a.extension - b.extension
            }, {
                key: 'fullname',
                dataIndex: 'fullname',
                title: formatMessage({id: "LANG1065"}),
                sorter: (a, b) => a.fullname.length - b.fullname.length
            }, {
                key: 'account_type',
                dataIndex: 'account_type',
                title: formatMessage({id: "LANG623"}),
                sorter: (a, b) => a.account_type.length - b.account_type.length
            }, {
                key: 'addr',
                dataIndex: 'addr',
                title: formatMessage({id: "LANG624"}),
                sorter: (a, b) => a.addr.length - b.addr.length,
                render: (text, record, index) => (
                    this._createAddr(text, record, index)
                )
            }, {
                key: 'email_to_user',
                dataIndex: 'email_to_user',
                title: formatMessage({id: "LANG4152"}),
                sorter: (a, b) => a.email_to_user.length - b.email_to_user.length,
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
            }
        ]
        
        const pagination = {
                total: this.state.extensionList.length,
                showSizeChanger: true,
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
                    </div>
                    <Table
                        bordered
                        rowKey="extension"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.extensionList }
                        showHeader={ !!this.state.extensionList.length }
                    />
                </div>
            </div>
        )
    }
}

Extension.defaultProps = {}

export default Form.create()(injectIntl(Extension))