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
                const confoList = response.confoList || []

                this.setState({
                    confoList: confoList
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
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
                key: 'stime',
                dataIndex: 'start_time',
                title: formatMessage({id: "LANG1048"})
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"})
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
                        <Button icon="plus" type="primary" size="default">
                            { formatMessage({id: "LANG597"}) }
                        </Button>
                        <Button icon="setting" type="primary" size="default">
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