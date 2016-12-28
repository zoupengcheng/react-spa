'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Popconfirm, Popover, Table, Tag } from 'antd'

class Queue extends Component {
    constructor(props) {
        super(props)

        this.state = {
            extgroupObj: {},
            extgroupList: [],
            callQueueList: []
        }
    }
    componentDidMount () {
        this._getExtensionGroupList()
        this._getCallQueue()
    }
    _add = () => {
        browserHistory.push('/call-features/callQueue/add')
    }
    _controlPanel = () => {
        browserHistory.push('/call-features/callQueue/add')
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
                var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getExtensionGroups()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/call-features/callQueue/edit/' + record.extension)
    }
    _getExtensionGroupList = () => {
        let extgroupObj = {}
        let extgroupList = []

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getExtensionGroupList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                let response = res.response || {}

                extgroupList = response.extension_groups || []

                extgroupList.map(function(item) {
                    extgroupObj[item.group_id] = item
                })

                this.setState({
                    extgroupObj: extgroupObj,
                    extgroupList: extgroupList
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _getCallQueue = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueue',
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response || {}
                const callQueueList = response.queue || []

                this.setState({
                    callQueueList: callQueueList
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _loginSettings = () => {
        browserHistory.push('/call-features/callQueue/add')
    }
    _statistics = () => {
        browserHistory.push('/call-features/callQueue/add')
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG85"}),
                sorter: (a, b) => a.group_name - b.group_name
            }, {
                key: 'queue_name',
                dataIndex: 'queue_name',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.queue_name.length - b.queue_name.length
            }, {
                key: 'strategy',
                dataIndex: 'strategy',
                title: formatMessage({id: "LANG1137"}),
                sorter: (a, b) => a.strategy.length - b.strategy.length
            }, {
                key: 'members',
                dataIndex: 'members',
                title: formatMessage({id: "LANG128"}),
                render: (text, record, index) => {
                    const members = text ? text.split(',') : []

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
                                        const item = this.state.accountAryObj[members[value]]

                                        return <Tag key={ item.extension }>{ item.extension }</Tag>
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
                total: this.state.callQueueList.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG2800"})
                })

        return (
            <div className="app-content-main app-content-cdr">
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
                            icon="bar-chart"
                            type="primary"
                            size='default'
                            onClick={ this._statistics }
                        >
                            { formatMessage({id: "LANG8"}) }
                        </Button>
                        <Button
                            icon="phone"
                            type="primary"
                            size='default'
                            onClick={ this._controlPanel }
                        >
                            { formatMessage({id: "LANG5407"}) }
                        </Button>
                        <Button
                            icon="setting"
                            type="primary"
                            size='default'
                            onClick={ this._loginSettings }
                        >
                            { formatMessage({id: "LANG748"}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="extension"
                        columns={ columns }
                        pagination={ pagination }
                        dataSource={ this.state.callQueueList }
                        showHeader={ !!this.state.callQueueList.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(Queue)