'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, Card, message, Modal, Popconfirm, Popover, Table, Tag } from 'antd'

const confirm = Modal.confirm

class SwitchBoardItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountList: [],
            accountAryObj: {},
            extensionGroups: []
        }
    }
    componentDidMount() {
    }
    _createMemberShip = (text, record, index) => {
        let status
        const { formatMessage } = this.props.intl

        if (!text || text === 'Unavailable') {
            status = <div className="status-container unavailable">
                        <span
                            className="sprite sprite-status-unavailable"
                            title={ formatMessage({ id: "LANG113" }) }
                        ></span>
                        { formatMessage({ id: "LANG113" }) }
                    </div>
        } else if (text === 'Idle') {
            status = <div className="status-container idle">
                        <span
                            className="sprite sprite-status-idle"
                            title={ formatMessage({ id: "LANG2232" }) }
                        ></span>
                        { formatMessage({ id: "LANG2232" }) }
                    </div>
        } else if (text === 'InUse') {
            status = <div className="status-container inuse">
                        <span
                            className="sprite sprite-status-inuse"
                            title={ formatMessage({ id: "LANG2242" }) }
                        ></span>
                        { formatMessage({ id: "LANG2242" }) }
                    </div>
        } else if (text === 'Ringing') {
            status = <div className="status-container ringing">
                        <span
                            className="sprite sprite-status-ringing"
                            title={ formatMessage({ id: "LANG111" }) }
                        ></span>
                        { formatMessage({ id: "LANG111" }) }
                    </div>
        } else if (text === 'Busy') {
            status = <div className="status-container busy">
                        <span
                            className="sprite sprite-status-busy"
                            title={ formatMessage({ id: "LANG2237" }) }
                        ></span>
                        { formatMessage({ id: "LANG2237" }) }
                    </div>
        }

        return status
    }
    _createStatus = (text, record, index) => {
        let status
        const { formatMessage } = this.props.intl

        if (!text || text === 'Unavailable') {
            status = <div className="status-container unavailable">
                        <span
                            className="sprite sprite-status-unavailable"
                            title={ formatMessage({ id: "LANG113" }) }
                        ></span>
                        { formatMessage({ id: "LANG113" }) }
                    </div>
        } else if (text === 'Idle') {
            status = <div className="status-container idle">
                        <span
                            className="sprite sprite-status-idle"
                            title={ formatMessage({ id: "LANG2232" }) }
                        ></span>
                        { formatMessage({ id: "LANG2232" }) }
                    </div>
        } else if (text === 'InUse') {
            status = <div className="status-container inuse">
                        <span
                            className="sprite sprite-status-inuse"
                            title={ formatMessage({ id: "LANG2242" }) }
                        ></span>
                        { formatMessage({ id: "LANG2242" }) }
                    </div>
        } else if (text === 'Ringing') {
            status = <div className="status-container ringing">
                        <span
                            className="sprite sprite-status-ringing"
                            title={ formatMessage({ id: "LANG111" }) }
                        ></span>
                        { formatMessage({ id: "LANG111" }) }
                    </div>
        } else if (text === 'Busy') {
            status = <div className="status-container busy">
                        <span
                            className="sprite sprite-status-busy"
                            title={ formatMessage({ id: "LANG2237" }) }
                        ></span>
                        { formatMessage({ id: "LANG2237" }) }
                    </div>
        }

        return status
    }
    render() {
        const { formatMessage } = this.props.intl

        const columns = [{
                key: 'status',
                dataIndex: 'status',
                title: formatMessage({id: "LANG81"}),
                render: (text, record, index) => (
                    this._createStatus(text, record, index)
                )
            }, {
                key: 'member_extension',
                dataIndex: 'member_extension',
                title: formatMessage({id: "LANG85"})
            }, {
                key: 'membership',
                dataIndex: 'membership',
                title: formatMessage({id: "LANG81"}),
                render: (text, record, index) => (
                    this._createMemberShip(text, record, index)
                )
            }, {
                key: 'answer',
                dataIndex: 'answer',
                title: formatMessage({id: "LANG5362"})
            }, {
                key: 'abandon',
                dataIndex: 'abandon',
                title: formatMessage({id: "LANG5364"})
            }, {
                key: 'logintime',
                dataIndex: 'logintime',
                title: formatMessage({id: "LANG5435"})
            }, {
                key: 'talktime',
                dataIndex: 'talktime',
                title: formatMessage({id: "LANG2238"})
            }]

        const pagination = {
                total: this.props.queueMembers.length,
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
                    <Card
                        className={ 'ant-card-custom-head' }
                        title={ formatMessage({id: "LANG143"}) }
                    >
                        <Table
                            rowKey="member_extension"
                            columns={ columns }
                            pagination={ pagination }
                            dataSource={ this.props.queueMembers }
                            showHeader={ !!this.props.queueMembers.length }
                        />
                    </Card>
                    <Card
                        className={ 'ant-card-custom-head' }
                        title={ formatMessage({id: "LANG4907"}) }
                    >
                        <Table
                            rowKey="member_extension"
                            columns={ columns }
                            pagination={ pagination }
                            dataSource={ this.props.queueMembers }
                            showHeader={ !!this.props.queueMembers.length }
                        />
                    </Card>
                </div>
            </div>
        )
    }
}

export default injectIntl(SwitchBoardItem)