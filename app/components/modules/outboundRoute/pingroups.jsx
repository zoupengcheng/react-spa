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

class PinGroups extends Component {
    constructor(props) {
        super(props)

        this.state = {
            postData: {},
            pingroups: [],
            loading: false,
            pagination: {
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: this._showTotal
            }
        }
    }
    componentDidMount() {
        this._getPinSets()
    }
    _add = () => {
        browserHistory.push('/extension-trunk/outboundRoute/pingroups/add')
    }
    _delete = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            async: true,
            type: 'post',
            url: api.apiHost,
            data: {
                'action': 'deletePinSets',
                'pin_sets_id': record.pin_sets_id
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._reloadTableList(1)
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/extension-trunk/outboundRoute/pingroups/edit/' + record.pin_sets_id + '/' + record.pin_sets_name)
    }
    _expandedRowRender = (record) => {
        return this._renderRowData(this._getRowData(record))
    }
    _getRowData = (record) => {
        const { formatMessage, formatHTMLMessage } = this.props.intl
        
        let members = []

        $.ajax({
            type: 'post',
            async: false,
            url: api.apiHost,
            data: {
                'action': 'getPinSets',
                'pin_sets_id': record.pin_sets_id
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    members = data.response.members
                }
            }.bind(this)
        })

        return members
    }
    _getPinSets = (params = {
            page: 1,
            sord: 'asc',
            item_num: 10,
            sidx: 'pin_sets_id'
        }) => {
            const { formatMessage } = this.props.intl

            let data = {
                    ...params
                }

            data.action = 'listPinSets'

            this.setState({
                loading: true,
                postData: data
            })

            $.ajax({
                data: data,
                type: 'post',
                url: api.apiHost,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        const pingroups = response.pin_sets_id || []

                        let pager = _.clone(this.state.pagination)

                        // Read total count from server
                        pager.current = data.page
                        pager.total = res.response.total_item

                        this.setState({
                            loading: false,
                            pagination: pager,
                            pingroups: pingroups
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
    }
    _handleTableChange = (pagination, filters, sorter) => {
        let params = {
            ...filters,
            page: pagination.current,
            item_num: pagination.pageSize
        }

        if (sorter.field) {
            params.sidx = sorter.field
            params.sord = sorter.order === 'ascend' ? 'asc' : 'desc'
        } else {
            params.sord = 'asc'
            params.sidx = 'pin_sets_id'
        }

        this._getPinSets(params)
    }
    _reloadTableList = (selectedRowLenth) => {
        let params = _.clone(this.state.postData),
            total = this.state.pagination.total,
            current = this.state.pagination.current,
            pageSize = this.state.pagination.pageSize

        pageSize = pageSize ? pageSize : this.state.pagination.defaultPageSize

        let page = current,
            surplus = total % pageSize,
            totalPage = Math.ceil(total / pageSize),
            lastPageNumber = surplus === 0 ? pageSize : surplus

        if ((totalPage === current) && (totalPage > 1) && (lastPageNumber === selectedRowLenth)) {
            page = current - 1
        }

        params.page = page

        this._getPinSets(params)
    }
    _renderRowData = (members) => {
        const { formatMessage, formatHTMLMessage } = this.props.intl

        const columns = [{
                key: 'pin',
                dataIndex: 'pin',
                title: formatMessage({id: "LANG4555"})
            }, {
                key: 'pin_name',
                dataIndex: 'pin_name',
                title: formatMessage({id: "LANG4556"})
            }]

        return (
            <Table
                columns={ columns }
                pagination={ false }
                dataSource={ members }
            />
        )
    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                sorter: true,
                key: 'pin_sets_name',
                dataIndex: 'pin_sets_name',
                title: formatMessage({id: "LANG135"})
            }, {
                sorter: true,
                key: 'record_in_cdr',
                dataIndex: 'record_in_cdr',
                title: formatMessage({id: "LANG4559"})
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

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG4553"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG4553"}) }
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
                        columns={ columns }
                        rowKey="pin_sets_id"
                        loading={ this.state.loading }
                        dataSource={ this.state.pingroups }
                        pagination={ this.state.pagination }
                        onChange={ this._handleTableChange }
                        expandedRowRender={ this._expandedRowRender }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(PinGroups)