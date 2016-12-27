'use strict'

import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { Table } from 'antd'

class DistributionByAgent extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { formatMessage } = this.props.intl
        const agentColumns = [{
                title: formatMessage({id: "LANG143"}),
                dataIndex: 'agent',
                key: 'agent',
                sorter: (a, b) => a.agent - b.agent
            }, {
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
                title: formatMessage({id: "LANG2238"}),
                dataIndex: 'talk_time',
                key: 'talk_time',
                sorter: (a, b) => a.talk_time - b.talk_time
            }, {
                title: '% ' + formatMessage({id: "LANG5357"}),
                dataIndex: 'talk_time_rate',
                key: 'talk_time_rate',
                sorter: (a, b) => a.talk_time_rate - b.talk_time_rate
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
        const pagination = {
                total: this.props.QueueStatDistributionByAgent.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }

        return (
            <Table
                rowKey="agent"
                columns={ agentColumns }
                pagination={ pagination }
                dataSource={ this.props.QueueStatDistributionByAgent }
            />
        )
    }
}

module.exports = injectIntl(DistributionByAgent)