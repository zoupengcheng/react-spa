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
const addZero = UCMGUI.addZero

class DHCPClient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            DHCPClientList: [],
            selectedRowKeys: [],
            selectedRows: []
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _add = () => {
        const { formatMessage } = this.props.intl
        const dhcpEnable = this.props.dataDHCPEnable

        if (dhcpEnable === false) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5034"})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            browserHistory.push('/system-settings/dhcpClient/add')
        }
    }
    _clearSelectRows = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRow: []
        })
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
                "action": "deleteDHCPClient",
                "mac": record.mac
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitData()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
 
    _edit = (record, index) => {
        browserHistory.push('/system-settings/dhcpClient/edit/' + record.mac + '/' + record.ip)
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listDHCPClient',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const DHCPClientList = response.dhcp_client_list || []

                    this.setState({
                        DHCPClientList: DHCPClientList
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

        this.setState({ 
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows
        })
    }
    _batchadd = () => {
        const { formatMessage } = this.props.intl
        const dhcpEnable = this.props.dataDHCPEnable

        if (dhcpEnable === false) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5034"})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            this._bindAddDel('addBatchDHCPClient', 'yes', 'LANG4689')
        }
    }
    _batchdelete= () => {
        this._bindAddDel('deleteBatchDHCPClient', 'no', 'LANG5068')
    }
    _bindAddDel = (sAction, isbind, sMacInfo) => {
        const { formatMessage } = this.props.intl
        const __this = this
        if (this.state.selectedRowKeys.length === 0) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG823"}, {0: formatMessage({id: "LANG3271"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML=
                                {{__html: formatMessage({id: sMacInfo}, {0: this.state.selectedRowKeys.join('  ')})}}
                            ></span>,
                onOk() {
                    __this._bindAddDelOk(sAction, isbind)
                },
                onCancel() {}
            })
        }
    }
    _bindAddDelOk = (sAction, isbind) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        let selectConditionIndex = []
        let selectedRows = this.state.selectedRows || []
        selectedRows.map(function(item) {
            selectConditionIndex.push(item.condition_index)
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": sAction,
                "isbind": isbind,
                "mac": this.state.selectedRowKeys.join(',')
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitData()
                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
   _showbind = (text, record, index) => {
        let bind
        const { formatMessage } = this.props.intl

        if (text === 'yes') {
            bind = <span>{ formatMessage({ id: "LANG4681" }) }</span>
        } else {
            bind = <span>{ formatMessage({ id: "LANG4682" }) }</span>
        }
        return bind
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'mac',
                dataIndex: 'mac',
                title: formatMessage({id: "LANG154"}),
                sorter: (a, b) => a.id.length - b.id.length
            }, {
                key: 'ip',
                dataIndex: 'ip',
                title: formatMessage({id: "LANG155"}),
                sorter: (a, b) => a.ip.length - b.ip.length
            }, {
                key: 'client',
                dataIndex: 'client',
                className: 'hidden',
                title: formatMessage({id: "LANG4584"}),
                sorter: (a, b) => a.client.length - b.client.length
            }, {
                key: 'status',
                dataIndex: 'status',
                className: 'hidden',
                title: formatMessage({id: "LANG4652"}),
                sorter: (a, b) => a.status.length - b.status.length
            }, {
                key: 'isbind',
                dataIndex: 'isbind',
                title: formatMessage({id: "LANG4585"}),
                sorter: (a, b) => a.isbind.length - b.isbind.length,
                render: (text, record, index) => (
                    this._showbind(text, record, index)
                )
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <div>
                            <span
                                className="sprite sprite-edit"
                                title={ formatMessage({id: "LANG738"}) }
                                onClick={ this._edit.bind(this, record) }>
                            </span>
                            <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._delete.bind(this, record) }
                            >
                                <span className="sprite sprite-del" title={ formatMessage({id: "LANG739"}) }></span>
                            </Popconfirm>
                        </div>
                }
            }]
        const pagination = {
                total: this.state.DHCPClientList.length,
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
                    1: formatMessage({id: "LANG4587"})
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
                            { formatMessage({id: "LANG4587"}) }
                        </Button>
                        <Button
                            icon="add"
                            type="primary"
                            size='default'
                            onClick={ this._batchadd }
                            disabled={ !this.state.selectedRowKeys.length }
                        >
                            { formatMessage({id: "LANG4687"}) }
                        </Button>
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._batchdelete }
                            disabled={ !this.state.selectedRowKeys.length }
                        >
                            { formatMessage({id: "LANG5067"}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="mac"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.DHCPClientList }
                        showHeader={ !!this.state.DHCPClientList.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(DHCPClient)
