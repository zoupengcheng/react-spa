'use strict'

import $ from 'jquery'
import api from "../../api/api"
import moment from "moment"
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
            pmsWakeup: [],
            pagination: {
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            },
            loading: false
        }
    }
    componentDidMount() {
        this._getAccountList()
        this._getPmsWakeup()
    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
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
                    browserHistory.push('/value-added-features/pms/3')
                },
                onCancel() {}
            })
        } else {
            browserHistory.push('/value-added-features/pmsWakeup/add')
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
                "action": "deletePMSWakeUp",
                "address": record.address
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getPmsWakeup()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/value-added-features/pmsWakeup/edit/' + record.address + '/' + record.address)
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
    _getPmsWakeup = (
        params = {                
                item_num: 10,
                sidx: "room",
                sord: "asc",
                page: 1 
            }
        ) => {
        const { formatMessage } = this.props.intl
        this.setState({loading: true})

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listWakeUp',
                ...params
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const pmsWakeup = response.pms_wakeup || []
                    const pagination = this.state.pagination
                    // Read total count from server
                    pagination.total = res.response.total_item

                    this.setState({
                        loading: false,
                        pmsWakeup: pmsWakeup,
                        pagination
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleTableChange = (pagination, filters, sorter) => {
        const pager = this.state.pagination

        pager.current = pagination.current

        this.setState({
            pagination: pager
        })

        this._getPmsWakeup({
            item_num: pagination.pageSize,
            page: pagination.current,
            sidx: sorter.field ? sorter.field : 'room',
            sord: sorter.order === "descend" ? "desc" : "asc",
            ...filters
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
                key: 'room',
                dataIndex: 'room',
                title: formatMessage({id: "LANG4854"}),
                sorter: (a, b) => a.room.length - b.room.length
            }, {
                key: 'w_action',
                dataIndex: 'w_action',
                title: formatMessage({id: "LANG4871"}),
                render: (text, record, index) => {
                    if (text === '0') {
                        return <span>{ formatMessage({id: "LANG4868"}) }</span>
                    } else if (text === '1') {
                        return <span>{ formatMessage({id: "LANG4869"}) }</span>
                    } else if (text === '2') {
                        return <span>{ formatMessage({id: "LANG4870"}) }</span>
                    } else {
                        return <span>{ formatMessage({id: "LANG2403"}) }</span>
                    }
                },
                sorter: (a, b) => a.w_action.length - b.w_action.length
            }, {
                key: 'w_type',
                dataIndex: 'w_type',
                title: formatMessage({id: "LANG1950"}),
                render: (text, record, index) => {
                    if (text === '1') {
                        return <span>{ formatMessage({id: "LANG4866"}) }</span>
                    } else if (text === '2') {
                        return <span>{ formatMessage({id: "LANG4867"}) }</span>
                    } else {
                        return <span>{ formatMessage({id: "LANG2403"}) }</span>
                    }
                },
                sorter: (a, b) => a.w_type.length - b.w_type.length
            }, {
                key: 'w_status',
                dataIndex: 'w_status',
                title: formatMessage({id: "LANG4862"}),
                render: (text, record, index) => {
                    if (record.w_action === '2') {
                        if (text === '1') {
                            return <span>{ formatMessage({id: "LANG4863"}) }</span>
                        } else if (text === '2') {
                            return <span>{ formatMessage({id: "LANG4864"}) }</span>
                        } else if (text === '3') {
                            return <span>{ formatMessage({id: "LANG2237"}) }</span>
                        } else if (text === '4') {
                            return <span>{ formatMessage({id: "LANG4865"}) }</span>
                        } else {
                            return <span>{ formatMessage({id: "LANG2403"}) }</span>
                        }
                    } else {
                        return <span>{ formatMessage({id: "LANG4948"}) }</span>
                    }
                },
                sorter: (a, b) => a.w_status.length - b.w_status.length
            }, {
                key: 'w_date',
                dataIndex: 'w_date',
                title: formatMessage({id: "LANG203"}),
                render: (text, record, index) => {
                    if (text.length === 8) {
                        return <span>{ moment(record.w_date, "YYYYMMDD").format("YYYY-MM-DD") }</span>
                    } else {
                        return <span>{ formatMessage({id: "LANG2403"}) }</span>
                    }
                },
                sorter: (a, b) => a.w_date.length - b.w_date.length
            }, {
                key: 'w_time',
                dataIndex: 'w_time',
                title: formatMessage({id: "LANG247"}),
                render: (text, record, index) => {
                    if (text.length === 4) {
                        return <span>{ moment(record.w_time, "HHmm").format("HH:mm") }</span>
                    } else {
                        return <span>{ formatMessage({id: "LANG2403"}) }</span>
                    }
                },
                sorter: (a, b) => a.w_time.length - b.w_time.length
            }, {
                key: 'send_status',
                dataIndex: 'send_status',
                title: formatMessage({id: "LANG4861"}),
                className: "hidden",
                render: (text, record, index) => {
                    if (text === '0') {
                        return <span>{ formatMessage({id: "LANG4153"}) }</span>
                    } else if (text === '1') {
                        return <span>{ formatMessage({id: "LANG4154"}) }</span>
                    } else {
                        return <span>{ formatMessage({id: "LANG2403"}) }</span>
                    }
                },
                sorter: (a, b) => a.send_status.length - b.send_status.length
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
                total: this.state.pmsWakeup.length,
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
                            { formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG4858"}) }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="room"
                        columns={ columns }
                        dataSource={ this.state.pmsWakeup }
                        showHeader={ !!this.state.pmsWakeup.length }
                        pagination={ this.state.pagination }
                        onChange={ this._handleTableChange }
                        loading={ this.state.loading}
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(pmsRooms)
