'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, Card, Col, Dropdown, Icon, Menu, message, Modal, Row, Table, Tag } from 'antd'

const confirm = Modal.confirm

class SwitchBoardItem extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
    }
    _createAgentOptions = (text, record, index) => {
        let status
        const { formatMessage } = this.props.intl
        const enableAgentLogin = this.props.queueDetail.enable_agent_login

        // console.log(text)
        // console.log(enableAgentLogin)

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
    _createMemberShip = (text, record, index) => {
        let status
        const { formatMessage } = this.props.intl
        const enableAgentLogin = this.props.queueDetail.enable_agent_login

        // console.log(text)
        // console.log(enableAgentLogin)

        if (enableAgentLogin === 'yes') {
            if (text && text === 'loggin') {
                status = formatMessage({ id: "LANG5186" })
            } else if (text && text === 'logoff') {
                status = formatMessage({ id: "LANG5187" })
            }
        } else {
            if (text && text === 'dynamic') {
                status = formatMessage({ id: "LANG5440" })
            } else if (text && text === 'static') {
                status = formatMessage({ id: "LANG220" })
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
                        <Tag>{ formatMessage({ id: "LANG113" }) }</Tag>
                    </div>
        } else if (text === 'Idle') {
            status = <div className="status-container idle">
                        <span
                            className="sprite sprite-status-idle"
                            title={ formatMessage({ id: "LANG2232" }) }
                        ></span>
                        <Tag>{ formatMessage({ id: "LANG2232" }) }</Tag>
                    </div>
        } else if (text === 'InUse') {
            status = <div className="status-container inuse">
                        <span
                            className="sprite sprite-status-inuse"
                            title={ formatMessage({ id: "LANG2242" }) }
                        ></span>
                        <Tag>{ formatMessage({ id: "LANG2242" }) }</Tag>
                    </div>
        } else if (text === 'Ringing') {
            status = <div className="status-container ringing">
                        <span
                            className="sprite sprite-status-ringing"
                            title={ formatMessage({ id: "LANG111" }) }
                        ></span>
                        <Tag>{ formatMessage({ id: "LANG111" }) }</Tag>
                    </div>
        } else if (text === 'Busy') {
            status = <div className="status-container busy">
                        <span
                            className="sprite sprite-status-busy"
                            title={ formatMessage({ id: "LANG2237" }) }
                        ></span>
                        <Tag>{ formatMessage({ id: "LANG2237" }) }</Tag>
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
        const enableAgentLogin = this.props.queueDetail.enable_agent_login

        let loginTime = {
                key: 'logintime',
                dataIndex: 'logintime',
                title: formatMessage({id: "LANG5435"})
            }

        let agentOptions = {
                key: 'option',
                dataIndex: 'option',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <span
                                className="sprite sprite-callcenter-loggin"
                            ></span>
                }
            }

        let generalColumns = [{
                key: 'status',
                dataIndex: 'status',
                title: formatMessage({id: "LANG5214"}),
                render: (text, record, index) => (
                    this._createStatus(text, record, index)
                )
            }, {
                key: 'member_extension',
                dataIndex: 'member_extension',
                title: formatMessage({id: "LANG85"})
            }, {
                key: 'answer',
                dataIndex: 'answer',
                title: formatMessage({id: "LANG5362"})
            }, {
                key: 'abandon',
                dataIndex: 'abandon',
                title: formatMessage({id: "LANG5364"})
            }, {
                key: 'talktime',
                dataIndex: 'talktime',
                title: formatMessage({id: "LANG2238"})
            }, {
                key: 'membership',
                dataIndex: 'membership',
                title: formatMessage({id: "LANG5439"}),
                render: (text, record, index) => (
                    this._createMemberShip(text, record, index)
                )
            }]

        if (enableAgentLogin === 'yes') {
            generalColumns.splice(4, 0, loginTime)
            generalColumns.push(agentOptions)
        }

        let answerColumns = [{
                key: 'status',
                dataIndex: 'status',
                title: formatMessage({id: "LANG81"}),
                render: (text, record, index) => {
                    return <span
                                title={ formatMessage({ id: "LANG4287" }) }
                                className="sprite sprite-callcenter-calling"
                            ></span>
                }
            }, {
                key: 'callerchannel',
                dataIndex: 'callerchannel',
                title: formatMessage({id: "LANG2646"})
            }, {
                key: 'calleechannel',
                dataIndex: 'calleechannel',
                title: formatMessage({id: "LANG2647"})
            }, {
                key: 'bridge_time',
                dataIndex: 'bridge_time',
                title: formatMessage({id: "LANG2238"})
            }, {
                key: 'option',
                dataIndex: 'option',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <span
                                title={ formatMessage({ id: "LANG74" }) }
                                className="sprite sprite-callcenter-options"
                            ></span>
                }
            }]

        let waitingColumns = [{
                key: 'status',
                dataIndex: 'status',
                title: formatMessage({id: "LANG81"}),
                render: (text, record, index) => {
                    return <span
                                title={ formatMessage({ id: "LANG111" }) }
                                className="sprite sprite-callcenter-ringing"
                            ></span>
                }
            }, {
                key: 'callerchannel',
                dataIndex: 'callerchannel',
                title: formatMessage({id: "LANG2646"})
            }, {
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG2647"}),
                render: (text, record, index) => {
                    return this.props.queueDetail.extension
                }
            }, {
                key: 'starttime',
                dataIndex: 'starttime',
                title: formatMessage({id: "LANG2238"})
            }, {
                key: 'option',
                dataIndex: 'option',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <span
                                title={ formatMessage({ id: "LANG3007" }) }
                                className="sprite sprite-callcenter-hangup"
                            ></span>
                }
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
                            columns={ generalColumns }
                            dataSource={ this.props.queueMembers }
                            showHeader={ !!this.props.queueMembers.length }
                            pagination={ this._pagination(this.props.queueMembers) }
                        />
                    </Card>
                    <Row gutter={ 32 }>
                        <Col className="gutter-row" span={ 12 } xs={ 24 } sm={ 12 } md={ 12 } lg={ 12 }>
                            <Card
                                style={{ 'marginTop': '10px' }}
                                className={ 'ant-card-custom-head' }
                                title={ formatMessage({id: "LANG111"}) }
                            >
                                <Table
                                    rowKey="position"
                                    pagination={ false }
                                    columns={ waitingColumns }
                                    style={{ height: '240px' }}
                                    dataSource={ this.props.waitingCallings }
                                />
                            </Card>
                        </Col>
                        <Col className="gutter-row" span={ 12 } xs={ 24 } sm={ 12 } md={ 12 } lg={ 12 }>
                            <Card
                                style={{ 'marginTop': '10px' }}
                                className={ 'ant-card-custom-head' }
                                title={ formatMessage({id: "LANG4287"}) }
                            >
                                <Table
                                    rowKey="channel1"
                                    pagination={ false }
                                    columns={ answerColumns }
                                    style={{ height: '240px' }}
                                    dataSource={ this.props.answerCallings }
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(SwitchBoardItem)