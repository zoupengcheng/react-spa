'use strict'

import ByDay from './byDay'
import ByHour from './byHour'
import ByWeek from './byWeek'
import ByQueue from './byQueue'
import ByAgent from './byAgent'
import ByMonth from './byMonth'
import UCMGUI from "../../api/ucmgui"
import ByDayOfWeek from './byDayOfWeek'
import { Card, Col, Row, Table } from 'antd'
import React, { Component, PropTypes } from 'react'
import ReportInformation from './reportInformation'
import { FormattedMessage, injectIntl } from 'react-intl'
import TotalInformation from './totalInformation'
import '../../../css/call-queue'

class Report extends Component {
    render() {
        const { formatMessage } = this.props.intl
        const generalColumns = [{
                title: formatMessage({id: "LANG5409"}),
                dataIndex: 'received_calls',
                key: 'received_calls',
                sorter: (a, b) => a.received_calls - b.received_calls
            }, {
                title: formatMessage({id: "LANG5362"}),
                dataIndex: 'answered_calls',
                key: 'answered_calls',
                sorter: (a, b) => a.answered_calls - b.answered_calls
            }, {
                title: formatMessage({id: "LANG5363"}),
                dataIndex: 'unanswered_calls',
                key: 'unanswered_calls',
                sorter: (a, b) => a.unanswered_calls - b.unanswered_calls
            }, {
                title: formatMessage({id: "LANG5364"}),
                dataIndex: 'abandoned_calls',
                key: 'abandoned_calls',
                sorter: (a, b) => a.abandoned_calls - b.abandoned_calls
            }, {
                title: formatMessage({id: "LANG5410"}),
                dataIndex: 'transferred_calls',
                key: 'transferred_calls',
                sorter: (a, b) => a.transferred_calls - b.transferred_calls
            }, {
                title: '% ' + formatMessage({id: "LANG5365"}),
                dataIndex: 'answered_rate',
                key: 'answered_rate',
                sorter: (a, b) => a.answered_rate - b.answered_rate
            }, {
                title: '% ' + formatMessage({id: "LANG5366"}),
                dataIndex: 'unanswered_rate',
                key: 'unanswered_rate',
                sorter: (a, b) => a.unanswered_rate - b.unanswered_rate
            }, {
                title: '% ' + formatMessage({id: "LANG5367"}),
                dataIndex: 'abandoned_rate',
                key: 'abandoned_rate',
                sorter: (a, b) => a.abandoned_rate - b.abandoned_rate
            }, {
                title: '% ' + formatMessage({id: "LANG5411"}),
                dataIndex: 'transferred_rate',
                key: 'transferred_rate',
                sorter: (a, b) => a.transferred_rate - b.transferred_rate
            }, {
                title: formatMessage({id: "LANG2238"}),
                dataIndex: 'talk_time',
                key: 'talk_time',
                sorter: (a, b) => a.talk_time - b.talk_time,
                render: (text, record, index) => {
                    return UCMGUI.formatSeconds(text)
                }
            }, {
                title: formatMessage({id: "LANG1186"}),
                dataIndex: 'wait_time',
                key: 'wait_time',
                sorter: (a, b) => a.wait_time - b.wait_time,
                render: (text, record, index) => {
                    return UCMGUI.formatSeconds(text)
                }
            }, {
                title: formatMessage({id: "LANG5370"}),
                dataIndex: 'avg_talk',
                key: 'avg_talk',
                sorter: (a, b) => a.avg_talk - b.avg_talk,
                render: (text, record, index) => {
                    return UCMGUI.formatSeconds(text)
                }
            }, {
                title: formatMessage({id: "LANG5371"}),
                dataIndex: 'avg_wait',
                key: 'avg_wait',
                sorter: (a, b) => a.avg_wait - b.avg_wait,
                render: (text, record, index) => {
                    return UCMGUI.formatSeconds(text)
                }
            }, {
                title: formatMessage({id: "LANG5368"}),
                dataIndex: 'agent_login',
                key: 'agent_login',
                sorter: (a, b) => a.agent_login - b.agent_login
            }, {
                title: formatMessage({id: "LANG5369"}),
                dataIndex: 'agent_logoff',
                key: 'agent_logoff',
                sorter: (a, b) => a.agent_logoff - b.agent_logoff
            }]

        return (
            <div className="call-queue-report">
                <Row gutter={ 32 }>
                    <Col className="gutter-row" span={ 12 } xs={ 24 } sm={ 12 } md={ 12 } lg={ 12 }>
                        <Card title={ formatMessage({id: "LANG5352"}) }>
                            <ReportInformation
                                QueueReport={ this.props.QueueReport }
                            />
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={ 12 } xs={ 24 } sm={ 12 } md={ 12 } lg={ 12 }>
                        <Card title={ formatMessage({id: "LANG5353"}) }>
                            <TotalInformation
                                QueueStatTotal={ this.props.QueueStatTotal }
                            />
                        </Card>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col>
                        <Card title={ formatMessage({id: "LANG5354"}, {0: formatMessage({id: "LANG5355"})}) }>
                            <ByQueue
                                generalColumns={ generalColumns }
                                QueueStatDistributionByQueue={ this.props.QueueStatDistributionByQueue }
                            />
                        </Card>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col>
                        <Card title={ formatMessage({id: "LANG5354"}, {0: formatMessage({id: "LANG5356"})}) }>
                            <ByAgent
                                QueueStatDistributionByAgent={ this.props.QueueStatDistributionByAgent }
                            />
                        </Card>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col>
                        <Card title={ formatMessage({id: "LANG5354"}, {0: formatMessage({id: "LANG201"})}) }>
                            <ByHour
                                generalColumns={ generalColumns }
                                QueueStatDistributionByHour={ this.props.QueueStatDistributionByHour }
                            />
                        </Card>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col>
                        <Card title={ formatMessage({id: "LANG5354"}, {0: formatMessage({id: "LANG200"})}) }>
                            <ByDay
                                generalColumns={ generalColumns }
                                QueueStatDistributionByDay={ this.props.QueueStatDistributionByDay }
                            />
                        </Card>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col>
                        <Card title={ formatMessage({id: "LANG5354"}, {0: formatMessage({id: "LANG5358"})}) }>
                            <ByDayOfWeek
                                generalColumns={ generalColumns }
                                QueueStatDistributionByDayOfWeek={ this.props.QueueStatDistributionByDayOfWeek }
                            />
                        </Card>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col>
                        <Card title={ formatMessage({id: "LANG5354"}, {0: formatMessage({id: "LANG199"})}) }>
                            <ByWeek
                                generalColumns={ generalColumns }
                                QueueStatDistributionByWeek={ this.props.QueueStatDistributionByWeek } 
                            />
                        </Card>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col>
                        <Card title={ formatMessage({id: "LANG5354"}, {0: formatMessage({id: "LANG198"})}) }>
                            <ByMonth
                                generalColumns={ generalColumns }
                                QueueStatDistributionByMonth={ this.props.QueueStatDistributionByMonth }
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

module.exports = injectIntl(Report)