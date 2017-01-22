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
            userList: [],
            selectedRowKeys: []
        }
    }
    componentDidMount() {
        this._getUserList()
    }
    _add = () => {
        let confirmContent = ''
        const { formatMessage } = this.props.intl

        confirmContent = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG880" })}}></span>

        browserHistory.push('/maintenance/userManagement/add')
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
                "action": "deleteUser",
                "user_id": record.user_id
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
        browserHistory.push('/maintenance/userManagement/edit/' + record.user_id + "/" + record.user_name)
    }
    _getUserList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listUser',
                sidx: 'privilege',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const userList = response.user_id || []

                    this.setState({
                        userList: userList
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
                key: 'user_name',
                dataIndex: 'user_name',
                title: formatMessage({id: "LANG2809"}),
                sorter: (a, b) => a.user_name.length - b.user_name.length
            }, {
                key: 'privilege',
                dataIndex: 'privilege',
                title: formatMessage({id: "LANG2811"}),
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
                        return <span>{ }</span>
                    }
                },
                sorter: (a, b) => a.privilege.length - b.privilege.length
            }, {
                key: 'login_time',
                dataIndex: 'login_time',
                title: formatMessage({id: "LANG2819"}),
                sorter: (a, b) => a.login_time.length - b.login_time.length
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
                total: this.state.userList.length,
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
                    1: formatMessage({id: "LANG2802"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG2802"}) }
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
                            { formatMessage({id: "LANG2807"}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="user_id"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.userList }
                        showHeader={ !!this.state.userList.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(UserList)