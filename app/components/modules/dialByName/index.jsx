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

class DialByName extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialByNameList: []
        }
    }
    componentDidMount() {
        this._getDialByNameList()
    }
    _add = () => {
        browserHistory.push('/call-features/dialByName/add')
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
                "action": "deleteDirectory",
                "directory": record.extension
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getDialByNameList()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/call-features/dialByName/edit/' + record.extension + '/' + record.name)
    }
    _getDialByNameList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listDirectory',
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const dialByNameList = response.directory || []

                    this.setState({
                        dialByNameList: dialByNameList
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
                title: formatMessage({id: "LANG85"}),
                sorter: (a, b) => a.extension - b.extension
            }, {
                key: 'name',
                dataIndex: 'name',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.name - b.name
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
                                        const item = members[value]

                                        return <Tag key={ item }>{ item }</Tag>
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
                total: this.state.dialByNameList.length,
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
                    1: formatMessage({id: "LANG2884"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG2884"}) }
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
                    </div>
                    <Table
                        rowKey="extension"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.dialByNameList}
                        showHeader={ !!this.state.dialByNameList.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(DialByName)