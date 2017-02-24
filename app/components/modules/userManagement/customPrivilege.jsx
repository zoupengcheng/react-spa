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

class UserList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            privilegeList: [],
            selectedRowKeys: [],
            pagination: {
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            },
            loading: false
        }
    }
    componentDidMount() {
        this._getPrivilegeList()
    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    _add = () => {
        let confirmContent = ''
        const { formatMessage } = this.props.intl

        confirmContent = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG880" })}}></span>

        browserHistory.push('/maintenance/customPrivilege/add')
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
                "action": "deleteCustomPrivilege",
                "privilege_id": record.privilege_id
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getUserList()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/maintenance/customPrivilege/edit/' + record.privilege_id + "/" + record.privilege_name)
    }
    _getPrivilegeList = (
            params = {                
                item_num: 10000,
                sidx: "privilege_id",
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
                action: 'listCustomPrivilege',
                ...params
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const tmp_privilegeList = response.privilege_id || []
                    const pagination = this.state.pagination
                    // Read total count from server
                    pagination.total = res.response.total_item - 1
                    let privilegeList = []
                    tmp_privilegeList.map(function(item) {
                        if (item.privilege_id !== 2) {
                            privilegeList.push(item)
                        }
                    })

                    this.setState({
                        loading: false,
                        privilegeList: privilegeList,
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

        this._getUserList({
            item_num: pagination.pageSize,
            page: pagination.current,
            sidx: sorter.field ? sorter.field : 'privilege_id',
            sord: sorter.order === "descend" ? "desc" : "asc",
            ...filters
        })
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ selectedRowKeys })
    }
    _createOption(text, record, index) {
        const { formatMessage } = this.props.intl
        if (record.privilege_id >= 4) {
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
        } else if (record.privilege_id === 3 && record.level === 0) {
            return <div>
                    <span
                        className="sprite sprite-edit"
                        title={ formatMessage({id: "LANG738"}) }
                        onClick={ this._edit.bind(this, record) }>
                    </span>
                    <span
                        className="sprite sprite-del sprite-del-disabled"
                        title={ formatMessage({id: "LANG739"}) }>
                    </span>
                </div>
        } else {
            return <div>
                    <span
                        className="sprite sprite-edit sprite-edit-disabled"
                        title={ formatMessage({id: "LANG738"}) }>
                    </span>
                    <span
                        className="sprite sprite-del sprite-del-disabled"
                        title={ formatMessage({id: "LANG739"}) }>
                    </span>
                </div>
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'privilege_name',
                dataIndex: 'privilege_name',
                title: formatMessage({id: "LANG5168"})
            }, {
                key: 'privilege_id',
                dataIndex: 'privilege_id',
                title: formatMessage({id: "LANG5172"}),
                render: (text, record, index) => {
                    if (text === 0) {
                        return <span>{ formatMessage({id: "LANG3860"}) }</span>
                    } else if (text === 1) {
                        return <span>{ formatMessage({id: "LANG1047"}) }</span>
                    } else if (text === 2) {
                        return <span>{ formatMessage({id: "LANG5173"}) }</span>
                    } else if (text === 3) {
                        return <span>{ formatMessage({id: "LANG2863"}) }</span>
                    } else {
                        return <span>{ formatMessage({id: "LANG5167"}) }</span>
                    }
                }
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return this._createOption(text, record, index)
                }
            }]

        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG5167"})
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
                            { formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG5167"})}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="privilege_id"
                        columns={ columns }
                        dataSource={ this.state.privilegeList }
                        showHeader={ !!this.state.privilegeList.length }
                        pagination={ this.state.pagination }
                        onChange={ this._handleTableChange }
                        loading={ this.state.loading}
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(UserList)