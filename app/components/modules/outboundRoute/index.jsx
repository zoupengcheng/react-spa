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

class OutboundRoute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountList: [],
            accountAryObj: {},
            selectedRowKeys: [],
            outboundRoutes: []
        }
    }
    componentDidMount() {
        // this._getAccountList()
        this._getOutboundRoutes()
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

                    this._getoutboundRoutes()
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
    _createName = (text, record, index) => {
        const { formatMessage } = this.props.intl

        let name,
            disabled = record.out_of_service

        if (disabled === 'yes') {
            name = <div className="status-container unavailable">
                        <span
                            className="sprite sprite-status-unavailable"
                            title={ formatMessage({ id: "LANG273" }) }
                        ></span>
                        { text }
                    </div>
        } else {
            name = text
        }

        return name
    }
    _createPattern = (text, record, index) => {
        const pattern = text.split(',')
        const { formatMessage } = this.props.intl

        if (pattern.length <= 1) {
            return <div>
                    <Tag key={ pattern[0] }>{ pattern[0] }</Tag>
                </div>
        } else {
            const content = <div>
                        {
                            pattern.map(function(value, index) {
                                if (index >= 1) {
                                    return <Tag key={ value }>{ value }</Tag>
                                }
                            }.bind(this))
                        }
                    </div>

            return <div>
                    <Tag key={ pattern[0] }>{ pattern[0] }</Tag>
                    <Popover
                        title=""
                        content={ content }
                    >
                        <Badge
                            overflowCount={ 10 }
                            count={ pattern.length - 1 }
                            style={{ backgroundColor: '#87d068', cursor: 'pointer' }}
                        />
                    </Popover>
                </div>
        }
    }
    _createPermission = (text, record, index) => {
        let permission
        const { formatMessage } = this.props.intl

        if (text === 'internal') {
            permission = <span>{ formatMessage({ id: "LANG1071" }) }</span>
        } else if (text === 'local') {
            permission = <span>{ formatMessage({ id: "LANG1072" }) }</span>
        } else if (text === 'national') {
            permission = <span>{ formatMessage({ id: "LANG1073" }) }</span>
        } else if (text === 'international') {
            permission = <span>{ formatMessage({ id: "LANG1074" }) }</span>
        } else {
            permission = <span>{ formatMessage({ id: "LANG273" }) }</span>
        }

        return permission
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
    _getOutboundRoutes = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listOutboundRoute',
                options: 'outbound_rt_name,outbound_rt_index,permission,sequence,pattern,out_of_service',
                sidx: 'sequence',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const outboundRoutes = response.outbound_route || []

                    this.setState({
                        outboundRoutes: outboundRoutes
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
                key: 'sequence',
                dataIndex: 'sequence',
                title: formatMessage({id: "LANG240"}),
                sorter: (a, b) => a.sequence - b.sequence
            }, {
                key: 'outbound_rt_name',
                dataIndex: 'outbound_rt_name',
                title: formatMessage({id: "LANG656"}),
                sorter: (a, b) => a.outbound_rt_name - b.outbound_rt_name,
                render: (text, record, index) => (
                    this._createName(text, record, index)
                )
            }, {
                key: 'pattern',
                dataIndex: 'pattern',
                title: formatMessage({id: "LANG246"}),
                sorter: (a, b) => a.pattern.length - b.pattern.length,
                render: (text, record, index) => (
                    this._createPattern(text, record, index)
                )
            }, {
                key: 'permission',
                dataIndex: 'permission',
                title: formatMessage({id: "LANG1543"}),
                sorter: (a, b) => a.permission.length - b.permission.length,
                render: (text, record, index) => (
                    this._createPermission(text, record, index)
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
                total: this.state.outboundRoutes.length,
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
                    1: formatMessage({id: "LANG655"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG655"}) }
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
                            { formatMessage({id: "LANG5336"}) }
                        </Button>
                    </div>
                    <div className="function-description">
                        <span>{ formatMessage({id: "LANG1532"}) }</span>
                    </div>
                    <Table
                        columns={ columns }
                        pagination={ pagination }
                        rowKey="outbound_rt_index"
                        rowSelection={ rowSelection }
                        dataSource={ this.state.outboundRoutes }
                        showHeader={ !!this.state.outboundRoutes.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(OutboundRoute)