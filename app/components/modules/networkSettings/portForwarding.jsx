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
const addZero = UCMGUI.addZero

class PortForwarding extends Component {
    constructor(props) {
        super(props)
        this.state = {
            portForwardingList: []
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _add = () => {
        browserHistory.push('/system-settings/portForwarding/add')
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
                "action": "deletePortForwarding",
                "id": record.id
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitData()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
 
    _edit = (record, index) => {
        browserHistory.push('/system-settings/portForwarding/edit/' + record.id + '/' + record.wan_port)
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listPortForwarding',
                sidx: 'id',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const portForwardingList = response.id || []

                    this.setState({
                        portForwardingList: portForwardingList
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
            selectedRowKeys
        })
    }
   _protocol = (text, record, index) => {
        let protocol
        const { formatMessage } = this.props.intl

        if (text === 0) {
            protocol = <span>{ formatMessage({ id: "LANG556" }) }</span>
        } else if (text === 1) {
            protocol = <span>{ formatMessage({ id: "LANG557" }) }</span>
        } else if (text === 2) {
            protocol = <span>{ formatMessage({ id: "LANG558" }) }</span>
        } else {
            protocol = <span>{ formatMessage({ id: "LANG2403" }) }</span>
        }
        return protocol
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'id',
                dataIndex: 'id',
                className: 'hidden',
                title: '',
                sorter: (a, b) => a.id - b.id
            }, {
                key: 'wan_port',
                dataIndex: 'wan_port',
                title: formatMessage({id: "LANG552"}),
                sorter: (a, b) => a.wan_port.length - b.wan_port.length
            }, {
                key: 'lan_ip',
                dataIndex: 'lan_ip',
                title: formatMessage({id: "LANG553"}),
                sorter: (a, b) => a.lan_ip.length - b.lan_ip.length
            }, {
                key: 'lan_port',
                dataIndex: 'lan_port',
                title: formatMessage({id: "LANG554"}),
                sorter: (a, b) => a.lan_port.length - b.lan_port.length
            }, {
                key: 'protocol',
                dataIndex: 'protocol',
                title: formatMessage({id: "LANG555"}),
                sorter: (a, b) => a.protocol - b.protocol,
                render: (text, record, index) => (
                    this._protocol(text, record, index)
                )
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
                total: this.state.portForwardingList.length,
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
                    1: formatMessage({id: "LANG3271"})
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
                            { formatMessage({id: "LANG4340"}, {
                                0: formatMessage({id: "LANG709"})
                            }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="id"
                        columns={ columns }
                        pagination={ pagination }
                        dataSource={ this.state.portForwardingList }
                        showHeader={ !!this.state.portForwardingList.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(PortForwarding)
