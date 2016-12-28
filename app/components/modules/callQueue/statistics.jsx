'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, message, Tabs } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import GenerateReport from './GenerateReport'
import ReportGenerated from './ReportGenerated'

const TabPane = Tabs.TabPane

class Stats extends Component {
    constructor(props) {
        super(props)

        const date = new Date()
        const current = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

        this.state = {
            accounts: {},
            queues: [],
            agents: [],
            period: 1,
            endDate: current,
            startDate: current,
            selectQueues: [],
            selectAgents: [],
            activeTabKey: '1',
            disableReport: true,
            QueueReport: [],
            QueueStatTotal: [],
            QueueStatDistributionByQueue: [],
            QueueStatDistributionByAgent: [],
            QueueStatDistributionByHour: [],
            QueueStatDistributionByDay: [],
            QueueStatDistributionByWeek: []
        }
    }
    componentWillMount() {
        this._getAccountList()
    }
    componentDidMount() {
        this._listQueue()
    }
    _daysBetween(start, end) {
        return Math.round((end - start) / (1000 * 60 * 60 * 24))
    }
    _getAccountList = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getAccountList' },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response || {}
                const accountList = response.extension || []
                let accounts = {}

                accountList.map(function(item) {
                    accounts[item.extension] = item
                })

                this.setState({
                    accounts: accounts
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _getStatsDetails = () => {
        this._getQueueReport()
        this._getQueueStatTotal()
        this._listQueueStatDistributionByQueue()
        this._listQueueStatDistributionByAgent()
        this._listQueueStatDistributionByHour()
        this._listQueueStatDistributionByDay()
        this._listQueueStatDistributionByWeek()
    }
    _getQueueReport = () => {
        const { formatMessage } = this.props.intl

        let QueueReport = [{
                key: '1',
                name: formatMessage({id: "LANG91"}),
                value: this.state.selectQueues.join()
            }, {
                key: '2',
                name: formatMessage({id: "LANG143"}),
                value: this.state.selectAgents.join()
            }, {
                key: '3',
                name: formatMessage({id: "LANG1048"}),
                value: this.state.startDate
            }, {
                key: '4',
                name: formatMessage({id: "LANG1049"}),
                value: this.state.endDate
            }, {
                key: '5',
                name: formatMessage({id: "LANG2261"}),
                value: this.state.period + ' ' + formatMessage({id: "LANG3594"}).toLowerCase()
            }]

        this.setState({
            QueueReport: QueueReport
        })
    }
    _getQueueStatTotal = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getQueueStatTotal' },
            type: 'json',
            // async: false,
            success: function(res) {
                const response = res.response || {}
                const total = response.distribution_total || {}

                let QueueStatTotal = [{
                        key: '1',
                        name: formatMessage({id: "LANG5362"}),
                        value: total.answered_calls + ' ' + formatMessage({id: "LANG142"}).toLowerCase()
                    }, {
                        key: '2',
                        name: formatMessage({id: "LANG5363"}),
                        value: total.unanswered_calls + ' ' + formatMessage({id: "LANG142"}).toLowerCase()
                    }, {
                        key: '3',
                        name: formatMessage({id: "LANG5364"}),
                        value: total.abandoned_calls + ' ' + formatMessage({id: "LANG142"}).toLowerCase()
                    }, {
                        key: '4',
                        name: formatMessage({id: "LANG5365"}),
                        value: total.answered_rate + ' %'
                    }, {
                        key: '5',
                        name: formatMessage({id: "LANG5366"}),
                        value: total.unanswered_rate + ' %'
                    }, {
                        key: '6',
                        name: formatMessage({id: "LANG5367"}),
                        value: total.abandoned_rate + ' %'
                    }, {
                        key: '7',
                        name: formatMessage({id: "LANG5368"}),
                        value: total.agent_login
                    }, {
                        key: '8',
                        name: formatMessage({id: "LANG5369"}),
                        value: total.agent_logoff
                    }, {
                        key: '9',
                        name: formatMessage({id: "LANG5370"}),
                        value: total.avg_talk + ' ' + formatMessage({id: "LANG5372"}).toLowerCase()
                    }, {
                        key: '10',
                        name: formatMessage({id: "LANG5371"}),
                        value: total.avg_wait + ' ' + formatMessage({id: "LANG5372"}).toLowerCase()
                    }]

                this.setState({
                    QueueStatTotal: QueueStatTotal
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _listQueueStatDistributionByQueue = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByQueue',
                sidx: 'queue',
                sord: 'asc'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const response = res.response || {}
                const QueueStatDistributionByQueue = response.distribution_by_queue || []

                this.setState({
                    QueueStatDistributionByQueue: QueueStatDistributionByQueue
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _listQueueStatDistributionByAgent = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByAgent',
                sidx: 'agent',
                sord: 'asc'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const response = res.response || {}
                const QueueStatDistributionByAgent = response.distribution_by_agent || []

                this.setState({
                    QueueStatDistributionByAgent: QueueStatDistributionByAgent
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _listQueueStatDistributionByHour = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByHour',
                sidx: 'hour',
                sord: 'asc'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const response = res.response || {}
                const QueueStatDistributionByHour = response.distribution_by_hour || []

                this.setState({
                    QueueStatDistributionByHour: QueueStatDistributionByHour
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _listQueueStatDistributionByDay = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByDay',
                sidx: 'date',
                sord: 'asc'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const response = res.response || {}
                const QueueStatDistributionByDay = response.distribution_by_day || []

                this.setState({
                    QueueStatDistributionByDay: QueueStatDistributionByDay
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _listQueueStatDistributionByWeek = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByWeek',
                sidx: 'week',
                sord: 'asc'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const response = res.response || {}
                const QueueStatDistributionByWeek = response.distribution_by_week || []

                this.setState({
                    QueueStatDistributionByWeek: QueueStatDistributionByWeek
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _listQueue = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueue',
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response || {}
                const queueList = response.queue || []
                const accounts = this.state.accounts || {}
                let queues = []
                let agents = []
                let members = []
                let obj = {}

                queueList.map(function(item) {
                    if (item.extension) {
                        queues.push({
                            key: item.extension,
                            title: item.extension
                        })
                    }

                    if (item.members) {
                        members = item.members.split(',')

                        members.map(function(member) {
                            if (agents.indexOf(member) === -1) {
                                obj = accounts[member] || {}

                                agents.push({
                                    key: member,
                                    title: (obj.extension + (obj.fullname ? ' "' + obj.fullname + '"' : ''))
                                })
                            }
                        })
                    }
                })

                this.setState({
                    queues: queues,
                    agents: agents
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _onAgentChange = (selectAgents, direction, moveKeys) => {
        this.setState({
            selectAgents: selectAgents
        })
    }
    _onQueueChange = (selectQueues, direction, moveKeys) => {
        this.setState({
            selectQueues: selectQueues
        })
    }
    _onSubmit = () => {
        const { formatMessage } = this.props.intl

        message.loading(formatMessage({ id: "LANG5360" }), 0)

        let action = {
            action: 'updateQueueReport',
            end_date: this.state.endDate,
            start_date: this.state.startDate,
            queue: this.state.selectQueues.join(),
            agent: this.state.selectAgents.join(),
            period: this.state.period
        }

        $.ajax({
            url: api.apiHost,
            method: "post",
            data: action,
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(formatMessage({ id: "LANG5361" }))

                    this.setState({
                        activeTabKey: '2',
                        disableReport: false
                    })

                    this._getStatsDetails()
                }
            }.bind(this)
        })
    }
    _onTabsChange = (activeTabKey) => {
        this.setState({ activeTabKey })
    }
    _onTimeChange = (date, dateString) => {
        this.setState({
            endDate: dateString[1],
            startDate: dateString[0],
            period: (1 + this._daysBetween(
                this._parseDate(dateString[0]),
                this._parseDate(dateString[1])
            ))
        })
    }
    _parseDate = (str) => {
        const ymd = str.split('-')

        return new Date(ymd[0], ymd[1] - 1, ymd[2])
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG5359"})})

        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG5359"}) } isDisplay='hidden' />
                <Tabs activeKey={ this.state.activeTabKey } onChange={ this._onTabsChange }>
                    <TabPane tab={ formatMessage({id: "LANG5373"}) } key="1">
                        <GenerateReport
                            queues={ this.state.queues }
                            agents={ this.state.agents }
                            endDate={ this.state.endDate }
                            startDate={ this.state.startDate }
                            selectQueues={ this.state.selectQueues }
                            selectAgents={ this.state.selectAgents }
                            onSubmit={ this._onSubmit }
                            onTimeChange={ this._onTimeChange }
                            onQueueChange={ this._onQueueChange }
                            onAgentChange={ this._onAgentChange }
                        />
                    </TabPane>
                    <TabPane tab={ formatMessage({id: "LANG5374"}) } disabled={ this.state.disableReport } key="2">
                        <ReportGenerated
                            QueueReport= { this.state.QueueReport }
                            QueueStatTotal= { this.state.QueueStatTotal }
                            QueueStatDistributionByQueue= { this.state.QueueStatDistributionByQueue }
                            QueueStatDistributionByAgent= { this.state.QueueStatDistributionByAgent }
                            QueueStatDistributionByHour= { this.state.QueueStatDistributionByHour }
                            QueueStatDistributionByDay= { this.state.QueueStatDistributionByDay }
                            QueueStatDistributionByWeek= { this.state.QueueStatDistributionByWeek }
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Form.create()(injectIntl(Stats))