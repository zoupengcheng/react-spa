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
import { injectIntl } from 'react-intl'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Badge, Button, Dropdown, Icon, Form, Input, Menu, message, Modal, Popconfirm, Popover, Table, Tag } from 'antd'

const FormItem = Form.Item
const Privilege = localStorage.getItem('role')
const FeatureLimits = JSON.parse(localStorage.getItem('featureLimits'))

class Extension extends Component {
    constructor(props) {
        super(props)
        this.state = {
            extensionList: [],
            selectedRowKeys: []
        }
    }
    componentDidMount() {
        this._getExtensionList()
    }
    componentWillUnmount() {
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
                    title={ formatMessage({id: "LANG841"}) }
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
            disabled = record.out_of_service,
            extension = record.extension

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
    _getExtensionList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listAccount',
                options: "extension,account_type,fullname,status,addr,out_of_service,email_to_user",
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response || {}

                this.setState({
                    extensionList: response.account || []
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _add = () => {
        browserHistory.push('/extension-trunk/extension/add')
    }
    _edit = (record) => {
        browserHistory.push('/extension-trunk/extension/edit/' + record.account_type.toLowerCase().slice(0, 3) + '/' + record.extension)
    }
    _reboot = (record) => {
        browserHistory.push('/extension-trunk/extension/add')
    }
    _delete = (record) => {
        browserHistory.push('/extension-trunk/extension/add')
    }
    _batchEdit = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _batchDelete = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _import = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _export = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _email = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ selectedRowKeys })
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
                },
                onChange: (current) => {
                    console.log('Current: ', current)
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
                        <Form inline>
                            <FormItem>
                                { getFieldDecorator('group_name', {
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
                                    }]
                                })(
                                    <Input
                                        size="default"
                                        disabled={ !this.state.extensionList.length }
                                        placeholder={ formatMessage({id: "LANG5415"}) }
                                    />
                                ) }
                            </FormItem>
                            <FormItem>
                                <Button
                                    size="default"
                                    type="primary"
                                    htmlType="submit"
                                    disabled={ !this.state.extensionList.length }
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
                            onClick={ this._email }
                            disabled={ !this.state.extensionList.length }
                        >
                            { formatMessage({id: "LANG3495"}) }
                        </Button>
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