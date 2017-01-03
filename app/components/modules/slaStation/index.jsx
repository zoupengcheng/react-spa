'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Modal, Popconfirm, Popover, Table, Tag } from 'antd'

const confirm = Modal.confirm

class SLAStation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountList: [],
            SLAStations: [],
            // selectedRows: [],
            selectedRowKeys: [],
            slaTrunkNameList: []
        }
    }
    componentDidMount () {
        this._getInitData()
        this._getSLAStations()
    }
    _add = () => {
        let confirmContent = ''
        let warningMessage = ''
        const { formatMessage } = this.props.intl

        confirmContent = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4492" })}}></span>
        warningMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4493" })}}></span>

        if (!this.state.slaTrunkNameList.length) {
            confirm({
                title: '',
                content: confirmContent,
                onOk() {
                    browserHistory.push('/extension-trunk/analogTrunk')
                },
                onCancel() {}
            })
        } else if (this.state.SLAStations.length === this.state.accountList.length) {
            message.warning(warningMessage, 2)
        } else {
            browserHistory.push('/extension-trunk/slaStation/add')
        }
    }
    _batchDelete = () => {
        let __this = this
        let modalContent = ''
        let loadingMessage = ''
        let successMessage = ''
        let idList = this.state.selectedRowKeys
        const { formatMessage } = this.props.intl

        modalContent = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG3512"})}}></span>
        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5414"})}}></span>

        confirm({
            title: '',
            content: modalContent,
            onOk() {
                message.loading(loadingMessage)

                $.ajax({
                    url: api.apiHost,
                    method: 'post',
                    data: {
                        "action": "deleteSLAStation",
                        "sla_station": idList.join(',')
                    },
                    type: 'json',
                    async: true,
                    success: function(res) {
                        var bool = UCMGUI.errorHandler(res, null, __this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)

                            __this._getSLAStations()

                            __this.setState({
                                selectedRowKeys: []
                            })
                        }
                    },
                    error: function(e) {
                        message.error(e.toString())
                    }
                })
            },
            onCancel() {}
        })
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
                "action": "deleteSLAStation",
                "sla_station": record.station
            },
            type: 'json',
            async: true,
            success: function(res) {
                var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getSLAStations()

                    this.setState({
                        selectedRowKeys: _.without(this.state.selectedRowKeys, record.station)
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/extension-trunk/slaStation/edit/' + record.station + '/' + record.station_name)
    }
    _getInitData = () => {
        let accountList = []
        let slaTrunkNameList = []
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getSLATrunkNameList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response || {}

                slaTrunkNameList = response.trunk_name || []
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getSIPAccountList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response || {}

                accountList = response.extension || []
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })

        this.setState({
            accountList: accountList,
            slaTrunkNameList: slaTrunkNameList
        })
    }
    _getSLAStations = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listSLAStation',
                options: "station_name,station,trunks",
                sidx: 'station',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response || {}

                this.setState({
                    SLAStations: response.sla_station || []
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
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
                key: 'station_name',
                dataIndex: 'station_name',
                title: formatMessage({id: "LANG3228"}),
                sorter: (a, b) => a.station_name.length - b.station_name.length
            }, {
                key: 'station',
                dataIndex: 'station',
                title: formatMessage({id: "LANG3229"}),
                sorter: (a, b) => a.station - b.station
            }, {
                key: 'trunks',
                dataIndex: 'trunks',
                title: formatMessage({id: "LANG3230"}),
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
                total: this.state.SLAStations.length,
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
                    1: formatMessage({id: "LANG3225"})
                })

        return (
            <div className="app-content-main app-content-cdr">
                <Title
                    isDisplay='hidden'
                    headerTitle={ formatMessage({id: "LANG3225"}) }
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
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._batchDelete }
                            disabled={ !this.state.selectedRowKeys.length }
                        >
                            { formatMessage({id: "LANG739"}) }
                        </Button>
                    </div>
                    <Table
                        bordered
                        rowKey="station"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.SLAStations }
                        showHeader={ !!this.state.SLAStations.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(SLAStation)