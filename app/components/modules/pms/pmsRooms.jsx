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

class pmsRooms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountList: [],
            accountAryObj: {},
            selectedRowKeys: [],
            pmsRooms: []
        }
    }
    componentDidMount() {
        this._getAccountList()
        this._getPmsRooms()
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
                    browserHistory.push('/value-added-features/pms/2')
                },
                onCancel() {}
            })
        } else {
            browserHistory.push('/value-added-features/pmsRooms/add')
        }
    }
    _batchadd = () => {
        let confirmContent = ''
        const { formatMessage } = this.props.intl

        confirmContent = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG880" })}}></span>

        if (!this.state.accountList.length) {
            confirm({
                title: '',
                content: confirmContent,
                onOk() {
                    browserHistory.push('/value-added-features/pms/2')
                },
                onCancel() {}
            })
        } else {
            browserHistory.push('/value-added-features/pmsRooms/batchadd')
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
                "action": "deletePMSRoom",
                "address": record.address
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getPmsRooms()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _batchdelete = (record) => {
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
                "action": "deletePMSRoom",
                "address": this.state.selectedRowKeys.join(',')
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getPmsRooms()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/value-added-features/pmsRooms/edit/' + record.address + '/' + record.address)
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
    _getPmsRooms = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listPMSRoom',
                sidx: 'address',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const pmsRooms = response.pms_room || []

                    this.setState({
                        pmsRooms: pmsRooms
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
            selectedRowKeys: selectedRowKeys
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'address',
                dataIndex: 'address',
                title: formatMessage({id: "LANG4893"}),
                sorter: (a, b) => a.address.length - b.address.length
            }, {
                key: 'room',
                dataIndex: 'room',
                title: formatMessage({id: "LANG4854"}),
                sorter: (a, b) => a.room.length - b.room.length
            }, {
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG85"}),
                sorter: (a, b) => a.extension.length - b.extension.length
            }, {
                key: 'status',
                dataIndex: 'status',
                title: formatMessage({id: "LANG4857"}),
                sorter: (a, b) => a.status.length - b.status.length
            }, {
                key: 'user_name',
                dataIndex: 'user_name',
                title: formatMessage({id: "LANG2809"}),
                sorter: (a, b) => a.user_name.length - b.user_name.length
            }, {
                key: 'account',
                dataIndex: 'account',
                title: formatMessage({id: "LANG4872"}),
                sorter: (a, b) => a.account.length - b.account.length
            }, {
                key: 'vipcode',
                dataIndex: 'vipcode',
                title: formatMessage({id: "LANG4873"}),
                sorter: (a, b) => a.vipcode.length - b.vipcode.length
            }, {
                key: 'credit',
                dataIndex: 'credit',
                title: formatMessage({id: "LANG4876"}),
                sorter: (a, b) => a.credit.length - b.credit.length
            }, {
                key: 'maid',
                dataIndex: 'maid',
                title: formatMessage({id: "LANG4963"}),
                sorter: (a, b) => a.maid.length - b.maid.length
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
                total: this.state.pmsRooms.length,
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
                            { formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG4856"}) }) }
                        </Button>
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._batchdelete }
                        >
                            { formatMessage({id: "LANG3872"}, {0: formatMessage({id: "LANG4969"}) }) }
                        </Button>
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._batchadd }
                        >
                            { formatMessage({id: "LANG4965"}, {0: formatMessage({id: "LANG4969"}) }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="address"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.pmsRooms }
                        showHeader={ !!this.state.pmsRooms.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(pmsRooms)
