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

class VoicemailGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vmGroupList: [],
            selectedRowKeys: []
        }
    }
    componentDidMount() {
        this._getVMgroupList()
    }
    _add = () => {
        browserHistory.push('/call-features/voicemailgroup/add')
    }
    _delete = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const vmgroup = record.extension

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteVMgroup",
                "vmgroup": vmgroup
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getVMgroupList()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/call-features/voicemailgroup/edit/' + record.extension + '/' + record.vmgroup_name)
    }

    _createOptions = (text, record, index) => {
        const { formatMessage } = this.props.intl

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
    _getVMgroupList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listVMgroup',
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const vmGroupList = response.vmgroup || []

                    this.setState({
                        vmGroupList: vmGroupList
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

        this.setState({ selectedRowKeys })
    }
    _createMembers = (text, record, index) => {
        let members = text ? text.split(',') : []
        const { formatMessage } = this.props.intl

        if (members.length <= 5) {
            return <div>
                    {
                        members.map(function(value, index) {
                            return <Tag key={ value }>{ value }</Tag>
                        }.bind(this))
                    }
                </div>
        } else {
            const content = <div>
                        {
                            members.map(function(value, index) {
                                if (index >= 4) {
                                    return <Tag key={ value }>{ value }</Tag>
                                }
                            }.bind(this))
                        }
                    </div>

            return <div>
                    {
                        [0, 1, 2, 3].map(function(value, index) {
                            return <Tag key={ members[value] }>{ members[value] }</Tag>
                        }.bind(this))
                    }
                    <Popover
                        title=""
                        content={ content }
                    >
                        <Badge
                            overflowCount={ 10 }
                            count={ members.length - 4 }
                            style={{ backgroundColor: '#87d068', cursor: 'pointer' }}
                        />
                    </Popover>
                </div>
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const columns = [{
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG85"}),
                sorter: (a, b) => a.extension - b.extension
            }, {
                key: 'vmgroup_name',
                dataIndex: 'vmgroup_name',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.vmgroup_name.length - b.vmgroup_name.length
            }, {
                key: 'members',
                dataIndex: 'members',
                title: formatMessage({id: "LANG128"}),
                render: (text, record, index) => (
                    this._createMembers(text, record, index)
                )
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => (
                    this._createOptions(text, record, index)
                )
            }]

        const pagination = {
                total: this.state.vmGroupList.length,
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
                    1: formatMessage({id: "LANG600"})
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
                            { formatMessage({id: "LANG772"}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="name"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.vmGroupList }
                        showHeader={ !!this.state.vmGroupList.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(VoicemailGroup)