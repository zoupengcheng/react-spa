'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Popconfirm, Popover, Table, Tag } from 'antd'

class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confoList: []
        }
    }
    componentDidMount() {
        this._getConfoList()
    }
    _getConfoList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                action: 'listMeetme'
            },
            dataType: 'json',
            success: function(res) {
                const response = res.response || {}
                const confoList = response.bookid || []

                this.setState({
                    confoList: confoList
                })
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
                title: formatMessage({id: "LANG3784"})
            }, {
                key: 'confname',
                dataIndex: 'confname',
                title: formatMessage({id: "LANG3783"})
            }, {
                key: 'starttime',
                dataIndex: 'starttime',
                title: formatMessage({id: "LANG1048"})
            }, {
                key: 'endtime',
                dataIndex: 'endtime',
                title: formatMessage({id: "LANG1049"})
            }, {
                key: 'status',
                dataIndex: 'status',
                title: formatMessage({id: "LANG3802"})
            }, {
                key: 'open_calendar',
                dataIndex: 'open_calendar',
                title: formatMessage({id: "LANG3791"})
            }, {
                key: 'recurringevent',
                dataIndex: 'recurringevent',
                title: formatMessage({id: "LANG3803"})
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return this._renderOptions(record)
                }   
            }]
        const pagination = {
                total: this.state.confoList.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
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
                        rowKey="extension"
                        columns={ columns }
                        pagination={ pagination }
                        dataSource={ this.state.confoList }
                        showHeader={ !!this.state.confoList.length }
                    >
                    </Table>
                </div>
            </div>
        )
    }
}

export default injectIntl(Schedule)