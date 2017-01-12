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
            pmsWakeup: []
        }
    }
    componentDidMount() {
        this._getPmsWakeup()
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

                    this._getPmsWakeup()
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
    _getPmsWakeup = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listWakeUp',
                sidx: 'room',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const pmsWakeup = response.pms_wakeup || []

                    this.setState({
                        pmsWakeup: pmsWakeup
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
                key: 'room',
                dataIndex: 'room',
                title: formatMessage({id: "LANG4854"}),
                sorter: (a, b) => a.room.length - b.room.length
            }, {
                key: 'w_action',
                dataIndex: 'w_action',
                title: formatMessage({id: "LANG4871"}),
                sorter: (a, b) => a.w_action.length - b.w_action.length
            }, {
                key: 'w_type',
                dataIndex: 'w_type',
                title: formatMessage({id: "LANG1950"}),
                sorter: (a, b) => a.w_type.length - b.w_type.length
            }, {
                key: 'w_status',
                dataIndex: 'w_status',
                title: formatMessage({id: "LANG4862"}),
                sorter: (a, b) => a.w_status.length - b.w_status.length
            }, {
                key: 'w_date',
                dataIndex: 'w_date',
                title: formatMessage({id: "LANG203"}),
                sorter: (a, b) => a.w_date.length - b.w_date.length
            }, {
                key: 'w_time',
                dataIndex: 'w_time',
                title: formatMessage({id: "LANG247"}),
                sorter: (a, b) => a.w_time.length - b.w_time.length
            }, {
                key: 'send_status',
                dataIndex: 'send_status',
                title: formatMessage({id: "LANG4861"}),
                sorter: (a, b) => a.send_status.length - b.send_status.length
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
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.pmsWakeup }
                        showHeader={ !!this.state.pmsWakeup.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(pmsRooms)
