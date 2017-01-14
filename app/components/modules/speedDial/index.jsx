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

class SpeedDial extends Component {
    constructor(props) {
        super(props)
        this.state = {
            speedDialList: []
        }
    }
    componentDidMount() {
        this._getSpeedDialList()
    }
    _add = () => {
        browserHistory.push('/call-features/speedDial/add')
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
                "action": "deleteSpeedDial",
                "speed_dial": record.speed_dial
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getSpeedDialList()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/call-features/speedDial/edit/' + record.extension)
    }
    _getSpeedDialList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listSpeedDial',
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const speedDialList = response.speed_dial || []

                    this.setState({
                        speedDialList: speedDialList
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
   _enable_destination = (text, record, index) => {
        let enable_destination
        const { formatMessage } = this.props.intl

        if (text === 'yes') {
            enable_destination = <span>{ formatMessage({ id: "LANG274" }) }</span>
        } else if (text === 'no') {
            enable_destination = <span>{ formatMessage({ id: "LANG273" }) }</span>
        } else {
            enable_destination = <span>{ formatMessage({ id: "LANG274" }) }</span>
        }
        return enable_destination
    }
   destination_type = (text, record, index) => {
        let destination_type
        const { formatMessage } = this.props.intl

        if (text === 'account') {
            destination_type = <span>{ formatMessage({ id: "LANG85" }) }</span>
        } else if (text === 'voicemail') {
            destination_type = <span>{ formatMessage({ id: "LANG90" }) }</span>
        } else if (text === 'conference') {
            destination_type = <span>{ formatMessage({ id: "LANG98" }) }</span>
        } else if (text === 'vmgroup') {
            destination_type = <span>{ formatMessage({ id: "LANG89" }) }</span>
        } else if (text === 'ivr') {
            destination_type = <span>{ formatMessage({ id: "LANG19" }) }</span>
        } else if (text === 'ringgroup') {
            destination_type = <span>{ formatMessage({ id: "LANG600" }) }</span>
        } else if (text === 'queue') {
            destination_type = <span>{ formatMessage({ id: "LANG91" }) }</span>
        } else if (text === 'paginggroup') {
            destination_type = <span>{ formatMessage({ id: "LANG94" }) }</span>
        } else if (text === 'fax') {
            destination_type = <span>{ formatMessage({ id: "LANG95" }) }</span>
        } else if (text === 'disa') {
            destination_type = <span>{ formatMessage({ id: "LANG2353" }) }</span>
        } else if (text === 'directory') {
            destination_type = <span>{ formatMessage({ id: "LANG2884" }) }</span>
        } else if (text === 'external_number') {
            destination_type = <span>{ formatMessage({ id: "LANG2884" }) }</span>
        } else {
            destination_type = <span></span>
        }
        return destination_type
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
                key: 'enable_destination',
                dataIndex: 'enable_destination',
                title: formatMessage({id: "LANG3501"}),
                sorter: (a, b) => a.enable_destination.length - b.enable_destination.length,
                render: (text, record, index) => (
                    this._enable_destination(text, record, index)
                )
            }, {
                key: 'destination_type',
                dataIndex: 'destination_type',
                title: formatMessage({id: "LANG1558"}),
                sorter: (a, b) => a.destination_type.length - b.destination_type.length,
                render: (text, record, index) => (
                    this.destination_type(text, record, index)
                )
            }, {
                key: 'destination_num',
                dataIndex: 'destination_num',
                title: formatMessage({id: "LANG1558"}),
                sorter: (a, b) => a.destination_num - b.destination_num
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
                total: this.state.speedDialList.length,
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
                    1: formatMessage({id: "LANG3501"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG3501"}) }
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
                        rowKey="speed_dial"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.speedDialList}
                        showHeader={ !!this.state.speedDialList.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(SpeedDial)