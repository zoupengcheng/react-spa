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

class StaticRoute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            staticRouteList: [],
            staticRouteIpv6List: []
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _add = () => {
        browserHistory.push('/system-settings/staticRoute/add')
    }
    _addIpv6 = () => {
        browserHistory.push('/system-settings/staticRoute/addIpv6')
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
                "action": "deleteStaticRoute",
                "route_index": record.route_index,
                "route_dest": record.route_dest,
                "route_netmask": record.route_netmask,
                "route_gateway": record.route_gateway,
                "route_iface": record.route_iface,
                "route_active": record.route_active,
                "route_enabled": record.route_enabled
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
    _deleteIpv6 = (record) => {
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
                "action": "deleteIpv6StaticRoute",
                "ipv6_route_index": record.ipv6_route_index,
                "ipv6_route_dest": record.ipv6_route_dest,
                "ipv6_route_gateway": record.ipv6_route_gateway,
                "ipv6_route_iface": record.ipv6_route_iface,
                "ipv6_route_active": record.ipv6_route_active,
                "ipv6_route_enabled": record.ipv6_route_enabled
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
        browserHistory.push('/system-settings/staticRoute/edit/' + record.route_index + '/' + record.route_dest)
    }
    _editIpv6 = (record, index) => {
        browserHistory.push('/system-settings/staticRoute/editIpv6/' + record.ipv6_route_index + '/' + record.ipv6_route_dest)
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        let staticRouteList = []
        let staticRouteIpv6List = []

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listStaticRoutes',
                sidx: 'route_index',
                sord: 'asc',
                options: "route_index,route_dest,route_netmask,route_gateway,route_iface,route_active,route_enabled"
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    staticRouteList = response.static_routes || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listIpv6StaticRoutes',
                sidx: 'ipv6_route_index',
                sord: 'asc',
                options: "ipv6_route_index,ipv6_route_dest,ipv6_route_gateway,ipv6_route_iface,ipv6_route_active,ipv6_route_enabled"
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    staticRouteIpv6List = response.ipv6_static_routes || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        }) 
        this.setState({
            staticRouteList: staticRouteList,
            staticRouteIpv6List: staticRouteIpv6List
        })
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ 
            selectedRowKeys
        })
    }
   _routeIface = (cellvalue, record, index) => {
        let display_iface
        const { formatMessage } = this.props.intl
        let modeVal = this.props.dataMethod

        if (cellvalue === "1") {
            if (modeVal === 2) {
                display_iface = "LAN2"
            } else if (modeVal === 1) {
                display_iface = "LAN"
            } else {
                display_iface = "WAN"
            }
        } else if (cellvalue === "2") {
            display_iface = "DataTrunk1"
        } else {
            if (modeVal === 2) {
                display_iface = "LAN1"
            } else {
                display_iface = "LAN"
            }
        }

        return display_iface
    }
   _routeStatus = (test, record, index) => {
        let value
        const { formatMessage } = this.props.intl
        let modeVal = this.props.dataMethod

        if (test === 1) {
            value = <span>{ formatMessage({ id: "LANG136" }) }</span>
        } else {
            value = <span>{ formatMessage({ id: "LANG137" }) }</span>
        }

        return value
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'route_index',
                dataIndex: 'route_index',
                className: 'hidden',
                title: '',
                sorter: (a, b) => a.id - b.id
            }, {
                key: 'route_dest',
                dataIndex: 'route_dest',
                title: formatMessage({id: "LANG3049"}),
                sorter: (a, b) => a.route_dest.length - b.route_dest.length
            }, {
                key: 'route_netmask',
                dataIndex: 'route_netmask',
                title: formatMessage({id: "LANG3051"}),
                sorter: (a, b) => a.lan_ip.route_netmask - b.route_netmask.length
            }, {
                key: 'route_gateway',
                dataIndex: 'route_gateway',
                title: formatMessage({id: "LANG3053"}),
                sorter: (a, b) => a.route_gateway.length - b.route_gateway.length
            }, {
                key: 'route_iface',
                dataIndex: 'route_iface',
                title: formatMessage({id: "LANG3055"}),
                sorter: (a, b) => a.route_iface - b.route_iface,
                render: (text, record, index) => (
                    this._routeIface(text, record, index)
                )
            }, {
                key: 'route_active',
                dataIndex: 'route_active',
                title: formatMessage({id: "LANG3061"}),
                sorter: (a, b) => a.route_active - b.route_active,
                render: (text, record, index) => (
                    this._routeStatus(text, record, index)
                )
            }, {
                key: 'route_enabled',
                dataIndex: 'route_enabled',
                title: formatMessage({id: "LANG2772"}),
                sorter: (a, b) => a.route_enabled - b.route_enabled,
                render: (text, record, index) => (
                    this._routeStatus(text, record, index)
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

        const columnsIpv6 = [{
                key: 'ipv6_route_index',
                dataIndex: 'ipv6_route_index',
                className: 'hidden',
                title: '',
                sorter: (a, b) => a.id - b.id
            }, {
                key: 'ipv6_route_dest',
                dataIndex: 'ipv6_route_dest',
                title: formatMessage({id: "LANG3049"}),
                sorter: (a, b) => a.ipv6_route_dest.length - b.ipv6_route_dest.length
            }, {
                key: 'ipv6_route_gateway',
                dataIndex: 'ipv6_route_gateway',
                title: formatMessage({id: "LANG3053"}),
                sorter: (a, b) => a.ipv6_route_gateway.length - b.ipv6_route_gateway.length
            }, {
                key: 'ipv6_route_iface',
                dataIndex: 'ipv6_route_iface',
                title: formatMessage({id: "LANG3055"}),
                sorter: (a, b) => a.ipv6_route_iface.length - b.ipv6_route_iface.length,
                render: (text, record, index) => (
                    this._routeIface(text, record, index)
                )
            }, {
                key: 'ipv6_route_active',
                dataIndex: 'ipv6_route_active',
                title: formatMessage({id: "LANG3061"}),
                sorter: (a, b) => a.ipv6_route_active - b.ipv6_route_active,
                render: (text, record, index) => (
                    this._routeStatus(text, record, index)
                )
            }, {
                key: 'ipv6_route_enabled',
                dataIndex: 'ipv6_route_enabled',
                title: formatMessage({id: "LANG2772"}),
                sorter: (a, b) => a.ipv6_route_enabled - b.ipv6_route_enabled,
                render: (text, record, index) => (
                    this._routeStatus(text, record, index)
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
                                onClick={ this._editIpv6.bind(this, record) }>
                            </span>
                            <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._deleteIpv6.bind(this, record) }
                            >
                                <span className="sprite sprite-del" title={ formatMessage({id: "LANG739"}) }></span>
                            </Popconfirm>
                        </div>
                }
            }]
        const pagination = {
                total: this.state.staticRouteList.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }
        const paginationIpv6 = {
                total: this.state.staticRouteIpv6List.length,
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
                                0: formatMessage({id: "LANG3048"})
                            }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="route_index"
                        columns={ columns }
                        pagination={ pagination }
                        dataSource={ this.state.staticRouteList }
                        showHeader={ !!this.state.staticRouteList.length }
                    />
                </div>
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._addIpv6 }
                        >
                            { formatMessage({id: "LANG4340"}, {
                                0: formatMessage({id: "LANG5234"})
                            }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="ipv6_route_index"
                        columns={ columnsIpv6 }
                        pagination={ paginationIpv6 }
                        dataSource={ this.state.staticRouteIpv6List }
                        showHeader={ !!this.state.staticRouteIpv6List.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(StaticRoute)
