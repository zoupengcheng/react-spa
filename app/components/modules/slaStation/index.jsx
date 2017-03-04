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
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: this._showTotal
            },
            accountList: [],
            SLAStations: [],
            postData: {},
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
                    async: true,
                    type: 'json',
                    method: 'post',
                    url: api.apiHost,
                    data: {
                        "action": "deleteSLAStation",
                        "sla_station": idList.join(',')
                    },
                    success: function(res) {
                        const bool = UCMGUI.errorHandler(res, null, __this.props.intl.formatMessage)

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
                        message.error(e.statusText)
                    }
                })
            },
            onCancel() {}
        })
    }
    _clearSelectRows = () => {
        this.setState({
            selectedRowKeys: []
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
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

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
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/extension-trunk/slaStation/edit/' + record.station + '/' + record.station_name)
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getSLATrunkNameList'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    let slaTrunkNameList = response.trunk_name || []

                    this.setState({
                        slaTrunkNameList: slaTrunkNameList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getSIPAccountList'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    let accountList = response.extension || []

                    this.setState({
                        accountList: accountList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getSLAStations = (params = {
            page: 1,
            sord: 'asc',
            item_num: 10,
            sidx: 'station'
        }) => {
            const { formatMessage } = this.props.intl

            let data = {
                    ...params,
                    action: 'listSLAStation',
                    options: 'station_name,station,trunks'
                }

            this.setState({
                loading: true,
                postData: data
            })

            $.ajax({
                data: data,
                type: 'json',
                method: 'post',
                url: api.apiHost,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        let pager = _.clone(this.state.pagination)

                        // Read total count from server
                        pager.current = data.page
                        pager.total = res.response.total_item

                        this.setState({
                            loading: false,
                            pagination: pager,
                            SLAStations: response.sla_station || []
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
    }
    _handleTableChange = (pagination, filters, sorter) => {
        this._getSLAStations({
            page: pagination.current,
            item_num: pagination.pageSize,
            sidx: sorter.field ? sorter.field : 'station',
            sord: sorter.order === 'ascend' ? 'asc' : 'desc',
            ...filters
        })

        this._clearSelectRows()
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log('selectedRow changed: ', selectedRows)
        console.log('selectedRowKeys changed: ', selectedRowKeys)

        this.setState({ selectedRowKeys })
    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const columns = [{
                key: 'station_name',
                dataIndex: 'station_name',
                title: formatMessage({id: "LANG3228"})
            }, {
                key: 'station',
                dataIndex: 'station',
                title: formatMessage({id: "LANG3229"})
            }, {
                key: 'trunks',
                dataIndex: 'trunks',
                title: formatMessage({id: "LANG3230"})
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

        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG3225"})
                })

        return (
            <div className="app-content-main">
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
                        rowKey="station"
                        columns={ columns }
                        rowSelection={ rowSelection }
                        loading={ this.state.loading }
                        pagination={ this.state.pagination }
                        onChange={ this._handleTableChange }
                        dataSource={ this.state.SLAStations }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(SLAStation)