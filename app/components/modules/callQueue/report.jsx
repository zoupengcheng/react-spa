'use strict'

import React, { Component, PropTypes } from 'react'
import { Card, Col, Row, Table } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import ReportInfo from './reportInfo'
import TotalInfo from './totalInfo'
import ByQueue from './byQueue'
import ByAgent from './byAgent'
import ByHour from './byHour'
import ByDay from './byDay'
import ByWeek from './byWeek'
import '../../../css/call-queue'

class Report extends Component {
    render() {
        const { formatMessage } = this.props.intl
        const generalColumns = [{
                title: formatMessage({id: "LANG5362"}),
                dataIndex: 'answered_calls',
                key: 'answered_calls',
                sorter: (a, b) => a.answered_calls - b.answered_calls
            }, {
                title: '% ' + formatMessage({id: "LANG5365"}),
                dataIndex: 'answered_rate',
                key: 'answered_rate',
                sorter: (a, b) => a.answered_rate - b.answered_rate
            }, {
                title: formatMessage({id: "LANG5363"}),
                dataIndex: 'unanswered_calls',
                key: 'unanswered_calls',
                sorter: (a, b) => a.unanswered_calls - b.unanswered_calls
            }, {
                title: '% ' + formatMessage({id: "LANG5366"}),
                dataIndex: 'unanswered_rate',
                key: 'unanswered_rate',
                sorter: (a, b) => a.unanswered_rate - b.unanswered_rate
            }, {
                title: formatMessage({id: "LANG5370"}),
                dataIndex: 'avg_talk',
                key: 'avg_talk',
                sorter: (a, b) => a.avg_talk - b.avg_talk
            }, {
                title: formatMessage({id: "LANG5371"}),
                dataIndex: 'avg_wait',
                key: 'avg_wait',
                sorter: (a, b) => a.avg_wait - b.avg_wait
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
                            <ReportInfo
                                QueueReport={ this.props.QueueReport }
                            />
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={ 12 } xs={ 24 } sm={ 12 } md={ 12 } lg={ 12 }>
                        <Card title={ formatMessage({id: "LANG5353"}) }>
                            <TotalInfo
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
                            <ByWeek
                                generalColumns={ generalColumns }
                                QueueStatDistributionByWeek={ this.props.QueueStatDistributionByWeek }
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

module.exports = injectIntl(Report)