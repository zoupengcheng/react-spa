'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Popconfirm, Popover, Table, Tag } from 'antd'

let subMeetmeList = []

class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confoList: [],
            pagination: {            
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            }
        }
    }
    componentDidMount() {
        this._getConfoList()
    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    _handleTableChange = (pagination, filters, sorter) => {
        let params = {
            page: pagination.current,
            item_num: pagination.pageSize,
            ...filters
        }

        if (sorter.field) {
            params.sidx = sorter.field
            params.sord = sorter.order === 'ascend' ? 'asc' : 'desc'
        } else {
            params.sidx = 'starttime'
            params.sord = 'asc'
        }

        this._getConfoList(params)
    }
    _getConfoList = (
        params = {
            item_num: 10,
            sidx: "starttime",
            sord: "asc",
            page: 1
        }) => {
        let data = {
                    ...params,
                    action: 'listMeetme'
                }

        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(res) {
                let response = res.response || {},
                    confoList = response.bookid || []

                const pagination = this.state.pagination
                    pagination.total = res.response.total_item

                this.setState({
                    confoList: confoList,
                    pagination
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getMeetme = (bookid) => {
        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                action: 'getMeetme',
                bookid: bookid
            },
            async: false,
            dataType: 'json',
            success: function(data) {
                subMeetmeList = data.response.bookid.members || []
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _cleanSettings = () => {
        browserHistory.push('/call-features/conference/cleanSettings/')
    }
    _scheduleSettings = () => {
        browserHistory.push('/call-features/conference/scheduleIndex')
    }
    _edit = (record) => {
        browserHistory.push('/call-features/conference/editSchedule/' + record.bookid)
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
            type: 'post',
            data: {
                "action": "deleteMeetme",
                "bookid": record.bookid
            },
            dataType: 'json',
            async: true,
            success: function(res) {
                var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getConfoList()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _refreshGoogle = () => {
        const { formatMessage } = this.props.intl

        message.loading(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG905" })}}></span>, 0)

        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                "action": "manualUpdateState",
                "updatestate": 'yes'
            },
            dataType: 'json',
            async: true,
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()

                    if (data.response.updatestate.match(/error|timeout/)) {
                        message.error(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2981" })}}></span>)
                    } else {
                        message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG3795" })}}></span>)
                        this._getConfoList()
                    }
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _renderOptions = (record) => {
        const { formatMessage } = this.props.intl

        return (
            <div>
                <span className="sprite sprite-edit" onClick={ this._edit.bind(this, record) }></span>
                <Popconfirm
                    title={ formatMessage({id: "LANG841"}) }
                    okText={ formatMessage({id: "LANG727"}) }
                    cancelText={ formatMessage({id: "LANG726"}) }
                    onConfirm={ this._delete.bind(this, record) }
                >
                    <span className="sprite sprite-del"></span>
                </Popconfirm>
            </div>
        )
    }
    render() {
        const { formatMessage } = this.props.intl
        const columns = [{
                key: 'confno',
                dataIndex: 'confno',
                title: formatMessage({id: "LANG3784"}),
                sorter: true
            }, {
                key: 'confname',
                dataIndex: 'confname',
                title: formatMessage({id: "LANG3783"}),
                sorter: true
            }, {
                key: 'starttime',
                dataIndex: 'starttime',
                title: formatMessage({id: "LANG1048"}),
                sorter: true
            }, {
                key: 'endtime',
                dataIndex: 'endtime',
                title: formatMessage({id: "LANG1049"}),
                sorter: true
            }, {
                key: 'status',
                dataIndex: 'status',
                title: formatMessage({id: "LANG3802"}),
                sorter: false
            }, {
                key: 'open_calendar',
                dataIndex: 'open_calendar',
                title: formatMessage({id: "LANG3791"}),
                sorter: true
            }, {
                key: 'recurringevent',
                dataIndex: 'recurringevent',
                title: formatMessage({id: "LANG3803"}),
                sorter: true
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return this._renderOptions(record)
                },
                sorter: false
            }]

        const expandedRowRender = (e) => {
            const columns = [
                {
                    title: formatMessage({id: "LANG186"}),
                    dataIndex: 'state'
                }, {
                    title: formatMessage({id: "LANG2026"}),
                    dataIndex: 'member_name'
                }, {
                    title: formatMessage({id: "LANG3781"}),
                    dataIndex: 'member_extension'
                }, {
                    title: formatMessage({id: "LANG2032"}),
                    dataIndex: 'email'
                }, {
                    title: formatMessage({id: "LANG3782"}),
                    dataIndex: 'send_email'
                }, {
                    title: formatMessage({id: "LANG3792"}),
                    dataIndex: 'comment'
                }
            ]

            this._getMeetme(e.bookid)

            return (
                <Table
                    columns={ columns }
                    dataSource={ subMeetmeList }
                    pagination={ false } />
            )
        }

        return (
            <div className="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button icon="plus" type="primary" size="default" onClick={ this._scheduleSettings }>
                            { formatMessage({id: "LANG3776"}) }
                        </Button>
                        <Button icon="setting" type="primary" size="default" onClick={ this._cleanSettings }>
                            { formatMessage({id: "LANG4277"}) }
                        </Button>
                        <Button icon="setting" type="primary" size="default" onClick={ this._refreshGoogle }>
                            { formatMessage({id: "LANG2740"}) }
                        </Button>
                    </div>
                    <div className="lite-desc">{ formatMessage({id: "LANG4467"}) }</div>
                    <Table
                        rowKey={ record => record.bookid }
                        columns={ columns }
                        pagination={ this.state.pagination }
                        dataSource={ this.state.confoList }
                        showHeader={ !!this.state.confoList.length }
                        expandedRowRender = { expandedRowRender }
                        onChange={ this._handleTableChange } />
                </div>
            </div>
        )
    }
}

export default injectIntl(Schedule)