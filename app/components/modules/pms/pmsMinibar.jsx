'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Modal, Popconfirm, Popover, Table, Tag } from 'antd'

const confirm = Modal.confirm

class ExtensionGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountList: [],
            accountAryObj: {},
            selectedRowKeys: [],
            extensionGroups: [],
            miniBar: [],
            miniBarWaiter: [],
            miniBarGoods: []
        }
    }
    componentDidMount() {
        this._getMiniBar()
        this._getMiniBarWaiter()
        this._getMiniBarGoods()
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

                    this._getExtensionGroups()
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
    _getAccountList = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getAccountList' },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    let obj = {}
                    let response = res.response || {}
                    let extension = response.extension || []

                    extension.map(function(item) {
                        obj[item.extension] = item
                    })

                    this.setState({
                        accountAryObj: obj,
                        accountList: extension
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getExtensionGroups = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listExtensionGroup',
                sidx: 'group_id',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const extensionGroups = response.extension_group || []

                    this.setState({
                        extensionGroups: extensionGroups
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getMiniBar = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listMiniBar',
                sidx: 'minibar_name',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const miniBar = response.minibar_settings || []

                    this.setState({
                        miniBar: miniBar
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getMiniBarWaiter = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listMiniBarWaiter',
                sidx: 'waiter_id',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const miniBarWaiter = response.minibar_waiter || []

                    this.setState({
                        miniBarWaiter: miniBarWaiter
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getMiniBarGoods = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listMiniBarGoods',
                sidx: 'goods_name',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const miniBarGoods = response.minibar_goods || []

                    this.setState({
                        miniBarGoods: miniBarGoods
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ selectedRowKeys })
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG4341"}),
                width: 100,
                sorter: (a, b) => a.extension.length - b.extension.length
            }, {
                key: 'minibar_name',
                dataIndex: 'minibar_name',
                title: formatMessage({id: "LANG135"}),
                width: 100,
                sorter: (a, b) => a.minibar_name.length - b.minibar_name.length
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                width: 100,
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
        const columns_waiter = [{
                key: 'waiter_id',
                dataIndex: 'waiter_id',
                title: formatMessage({id: "LANG4963"}),
                width: 100,
                sorter: (a, b) => a.waiter_id.length - b.waiter_id.length
            }, {
                key: 'secret',
                dataIndex: 'secret',
                title: formatMessage({id: "LANG127"}),
                width: 100,
                sorter: (a, b) => a.secret.length - b.secret.length
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                width: 100,
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
        const columns_goods = [{
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG4341"}),
                width: 100,
                sorter: (a, b) => a.extension.length - b.extension.length
            }, {
                key: 'goods_name',
                dataIndex: 'goods_name',
                title: formatMessage({id: "LANG135"}),
                width: 100,
                sorter: (a, b) => a.goods_name.length - b.goods_name.length
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                width: 100,
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
                total: this.state.miniBar.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }
        const pagination_waiter = {
                total: this.state.miniBarWaiter.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }
        const pagination_goods = {
                total: this.state.miniBarGoods.length,
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
                    1: formatMessage({id: "LANG4855"})
                })

        return (
            <div className="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._add }
                        >
                            { formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG5056"}) }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="extension"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.miniBar }
                        showHeader={ !!this.state.miniBar.length }
                    />
                </div>
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._add }
                        >
                            { formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG5057"}) }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="waiter_id"
                        columns={ columns_waiter }
                        pagination={ pagination_waiter }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.miniBarWaiter }
                        showHeader={ !!this.state.miniBarWaiter.length }
                    />
                </div>
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._add }
                        >
                            { formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG5050"}) }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="extension"
                        columns={ columns_goods }
                        pagination={ pagination_goods }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.miniBarGoods }
                        showHeader={ !!this.state.miniBarGoods.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(ExtensionGroup)