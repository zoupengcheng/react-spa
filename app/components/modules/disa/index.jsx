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

class DISA extends Component {
    constructor(props) {
        super(props)
        this.state = {
            disaList: []
        }
    }
    componentDidMount() {
        this._getDISAList()
    }
    _add = () => {
        browserHistory.push('/call-features/disa/add')
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
                "action": "deleteDISA",
                "disa": record.disa_id
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getDISAList()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/call-features/disa/edit/' + record.disa_id + '/' + record.display_name)
    }
    _getDISAList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listDISA',
                sidx: 'display_name',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const disaList = response.disa || []

                    this.setState({
                        disaList: disaList
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
   _permission = (text, record, index) => {
        let permission
        const { formatMessage } = this.props.intl

        if (text === 'internal') {
            permission = <span>{ formatMessage({ id: "LANG1071" }) }</span>
        } else if (text === 'internal-local') {
            permission = <span>{ formatMessage({ id: "LANG1072" }) }</span>
        } else if (text === 'internal-local-national') {
            permission = <span>{ formatMessage({ id: "LANG1073" }) }</span>
        } else if (text === 'internal-local-national-international') {
            permission = <span>{ formatMessage({ id: "LANG1074" }) }</span>
        } else {
            permission = <span>{ formatMessage({ id: "LANG271" }) }</span>
        }
        return permission
    }
    _hangup = (text, record, index) => {
        let hangup
        const { formatMessage } = this.props.intl

        if (text === 'yes') {
            hangup = <span>{ formatMessage({ id: "LANG136" }) }</span>
        } else {
            hangup = <span>{ formatMessage({ id: "LANG137" }) }</span>
        }

        return hangup
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'display_name',
                dataIndex: 'display_name',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.display_name.length - b.display_name.length
            }, {
                key: 'permission',
                dataIndex: 'permission',
                title: formatMessage({id: "LANG1069"}),
                sorter: (a, b) => a.permission.length - b.permission.length,
                render: (text, record, index) => (
                    this._permission(text, record, index)
                )
            }, {
                key: 'response_timeout',
                dataIndex: 'response_timeout',
                title: formatMessage({id: "LANG2358"}),
                sorter: (a, b) => a.response_timeout - b.response_timeout
            }, {
                key: 'digit_timeout',
                dataIndex: 'digit_timeout',
                title: formatMessage({id: "LANG2360"}),
                sorter: (a, b) => a.digit_timeout - b.digit_timeout
            }, {
                key: 'hangup',
                dataIndex: 'hangup',
                title: formatMessage({id: "LANG2363"}),
                sorter: (a, b) => a.hangup.length - b.hangup.length,
                render: (text, record, index) => (
                    this._hangup(text, record, index)
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
                total: this.state.disaList.length,
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
                    1: formatMessage({id: "LANG2353"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG2353"}) }
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
                        rowKey="disa_id"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.disaList}
                        showHeader={ !!this.state.disaList.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(DISA)