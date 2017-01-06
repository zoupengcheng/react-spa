'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Popconfirm, Popover, Table, Tag } from 'antd'

class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confoList: []
        }
    }
    componentDidMount() {
        this._getConfoList()
    }
    _add = () => {
        browserHistory.push('/call-features/conference/add')
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
                "action": "deleteConference",
                "conference": record.extension
            },
            type: 'json',
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
    _edit = (record) => {
        browserHistory.push('/call-features/conference/edit/' + record.extension)
    }
    _conferenceSettings = () => {
browserHistory.push('/call-features/conference/conferenceSettings')
    }
    _getConfoList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listConfStatus'
            },
            type: 'json',
            success: function(res) {
                const response = res.response || {}
                const confoList = response.conference || []

                this.setState({
                    confoList: confoList
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _renderTime = (record) => {
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
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG1045"})
            }, {
                key: 'attend_count',
                dataIndex: 'attend_count',
                title: formatMessage({id: "LANG1046"})
            }, {
                key: 'admin_count',
                dataIndex: 'admin_count',
                title: formatMessage({id: "LANG1047"})
            }, {
                key: 'start_time',
                dataIndex: 'start_time',
                title: formatMessage({id: "LANG1048"})
            }, {
                key: 'time',
                dataIndex: 'start_time',
                title: formatMessage({id: "LANG1050"}),
                render: (text, record, index) => {
                    return this._renderTime(record)
                }
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
                        <Button icon="plus" type="primary" size="default" onClick={ this._add }>
                            { formatMessage({id: "LANG597"}) }
                        </Button>
                        <Button icon="setting" type="primary" size="default" onClick={ this._conferenceSettings }>
                            { formatMessage({id: "LANG5097"}) }
                        </Button>
                    </div>
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

export default injectIntl(Room)