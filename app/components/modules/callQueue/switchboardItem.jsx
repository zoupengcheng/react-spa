'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, Card, Dropdown, Icon, Menu, message, Modal, Table, Tag } from 'antd'

const confirm = Modal.confirm

class SwitchBoardItem extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
    }
    _createMemberShip = (text, record, index) => {
        let status
        const { formatMessage } = this.props.intl
        const enableAgentLogin = this.props.queueDetail.enable_agent_login

        console.log(text)
        console.log(enableAgentLogin)

        if (enableAgentLogin === 'yes') {
            if (text && text === 'loggin') {
                const menu = (
                        <Menu onClick={ this._handleMenuClick(record) }>
                            <Menu.Item key="loggin" disabled>{ formatMessage({ id: "LANG269" }) }</Menu.Item>
                            <Menu.Item key="logoff">{ formatMessage({ id: "LANG259" }) }</Menu.Item>
                        </Menu>
                    )

                status = <Dropdown.Button
                            type="ghost"
                            overlay={ menu }
                            onClick={ this._handleButtonClick(record) } 
                        >
                            { formatMessage({ id: "LANG5186" }) }
                        </Dropdown.Button>
            } else if (text && text === 'logoff') {
                const menu = (
                        <Menu onClick={ this._handleMenuClick(record) }>
                            <Menu.Item key="loggin">{ formatMessage({ id: "LANG269" }) }</Menu.Item>
                            <Menu.Item key="logoff" disabled>{ formatMessage({ id: "LANG259" }) }</Menu.Item>
                        </Menu>
                    )

                status = <Dropdown.Button
                            type="ghost"
                            overlay={ menu }
                            onClick={ this._handleButtonClick(record) } 
                        >
                            { formatMessage({ id: "LANG5187" }) }
                        </Dropdown.Button>
            }
        } else {
            if (text && text === 'dynamic') {
                status = 'Dynamic'
            } else if (text && text === 'static') {
                status = 'Static'
            }
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
                        { record.member_extension + ' ( ' + formatMessage({ id: "LANG113" }) + ' )' }
                    </div>
        } else if (text === 'Idle') {
            status = <div className="status-container idle">
                        <span
                            className="sprite sprite-status-idle"
                            title={ formatMessage({ id: "LANG2232" }) }
                        ></span>
                        { record.member_extension + ' ( ' + formatMessage({ id: "LANG2232" }) + ' )' }
                    </div>
        } else if (text === 'InUse') {
            status = <div className="status-container inuse">
                        <span
                            className="sprite sprite-status-inuse"
                            title={ formatMessage({ id: "LANG2242" }) }
                        ></span>
                        { record.member_extension + ' ( ' + formatMessage({ id: "LANG2242" }) + ' )' }
                    </div>
        } else if (text === 'Ringing') {
            status = <div className="status-container ringing">
                        <span
                            className="sprite sprite-status-ringing"
                            title={ formatMessage({ id: "LANG111" }) }
                        ></span>
                        { record.member_extension + ' ( ' + formatMessage({ id: "LANG111" }) + ' )' }
                    </div>
        } else if (text === 'Busy') {
            status = <div className="status-container busy">
                        <span
                            className="sprite sprite-status-busy"
                            title={ formatMessage({ id: "LANG2237" }) }
                        ></span>
                        { record.member_extension + ' ( ' + formatMessage({ id: "LANG2237" }) + ' )' }
                    </div>
        }

        return status
    }
    _handleButtonClick = (text, record, index) => {
        console.log(text)
        console.log(record)
    }
    _handleMenuClick = (text, record, index) => {
        console.log(text)
        console.log(record)
    }
    _pagination = (dataSource) => {
        return {
                total: dataSource.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }
    }
    render() {
        const { formatMessage } = this.props.intl

        const columns = [{
                key: 'status',
                dataIndex: 'status',
                title: formatMessage({id: "LANG85"}),
                render: (text, record, index) => (
                    this._createStatus(text, record, index)
                )
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
                            dataSource={ this.props.queueMembers }
                            showHeader={ !!this.props.queueMembers.length }
                            pagination={ this._pagination(this.props.queueMembers) }
                        />
                    </Card>
                    <Card
                        className={ 'ant-card-custom-head' }
                        title={ formatMessage({id: "LANG5441"}) }
                        style={{ 'marginTop': '10px' }}
                    >
                        <Table
                            rowKey="callerid1"
                            columns={ columns }
                            dataSource={ this.props.answerCallings }
                            showHeader={ !!this.props.answerCallings.length }
                            pagination={ this._pagination(this.props.answerCallings) }
                        />
                    </Card>
                    <Card
                        className={ 'ant-card-custom-head' }
                        title={ formatMessage({id: "LANG5440"}) }
                        style={{ 'marginTop': '10px' }}
                    >
                        <Table
                            rowKey="extension"
                            columns={ columns }
                            dataSource={ this.props.waitingCallings }
                            showHeader={ !!this.props.waitingCallings.length }
                            pagination={ this._pagination(this.props.waitingCallings) }
                        />
                    </Card>
                </div>
            </div>
        )
    }
}

export default injectIntl(SwitchBoardItem)