'use strict'

import $ from 'jquery'
import moment from 'moment'
import Filter from './filter'
import Report from './report'
import api from "../../api/api"
import '../../../css/call-queue'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Tooltip, Transfer } from 'antd'

const NewDate = new Date()
const FormItem = Form.Item
const Option = Select.Option
const AddZero = UCMGUI.addZero
const DateFormat = 'YYYY-MM-DD'
const CurrentDate = NewDate.getFullYear() + '-' + AddZero(NewDate.getMonth() + 1) + '-' + AddZero(NewDate.getDate())

class Statistics extends Component {
    constructor(props) {
        super(props)

        this.state = {
            queues: [],
            agents: [],
            period: '1',
            accounts: {},
            extgroupObj: {},
            QueueReport: [],
            selectQueues: [],
            selectAgents: [],
            QueueStatTotal: [],
            endDate: CurrentDate,
            startDate: CurrentDate,
            QueueStatDistributionByDay: [],
            QueueStatDistributionByHour: [],
            QueueStatDistributionByWeek: [],
            QueueStatDistributionByQueue: [],
            QueueStatDistributionByAgent: [],
            QueueStatDistributionByMonth: [],
            QueueStatDistributionByDayOfWeek: []
        }
    }
    componentWillMount() {
        this._getInitData()
    }
    componentDidMount() {
        this._getStatisticDetails()
    }
    _checkTimeFormat = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        value = value ? value.format(DateFormat) : ''

        if (value && !/^\d{4}\-\d{2}\-\d{2}$/.test(value)) {
            callback(formatMessage({id: "LANG2767"}))
        } else {
            callback()
        }
    }
    _daysBetween(start, end) {
        return Math.round((end - start) / (1000 * 60 * 60 * 24))
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _getInitData = () => {
        let queues = []
        let agents = []
        let accounts = {}
        let extgroupObj = {}
        let queueReport = {
                queue: [],
                agent: [],
                period: '1',
                end_date: CurrentDate,
                start_date: CurrentDate
            }

        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getAccountList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const accountList = response.extension || []

                    accountList.map(function(item) {
                        accounts[item.extension] = item
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getExtensionGroupList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const extgroupList = response.extension_groups || []

                    extgroupList.map(function(item) {
                        extgroupObj[item.group_id] = item
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

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
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    let obj = {}
                    let members = []
                    let agentKeys = []
                    const response = res.response || {}
                    const queueList = response.queue || []
                    const disabled = formatMessage({id: "LANG273"})
                    const extgroupLabel = formatMessage({id: "LANG2714"})

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
                                if (agentKeys.indexOf(member) === -1) {
                                    obj = extgroupObj[member] || accounts[member] || {}

                                    if (obj.out_of_service) {
                                        agents.push({
                                            key: member,
                                            out_of_service: obj.out_of_service,
                                            title: (obj.extension +
                                                    (obj.fullname ? ' "' + obj.fullname + '"' : '') +
                                                    (obj.out_of_service === 'yes' ? ' <' + disabled + '>' : ''))
                                        })
                                    } else {
                                        agents.push({
                                            key: member,
                                            title: extgroupLabel + " -- " + obj.group_name
                                        })
                                    }

                                    agentKeys.push(member)
                                }
                            })
                        }
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getQueueReport'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    queueReport = response.queue_report_info || {}

                    queueReport.start_date = queueReport.start_date ? queueReport.start_date : CurrentDate
                    queueReport.end_date = queueReport.end_date ? queueReport.end_date : CurrentDate
                    queueReport.period = queueReport.period ? queueReport.period : '1'
                    queueReport.queue = queueReport.queue ? queueReport.queue.split(',') : []
                    queueReport.agent = queueReport.agent ? queueReport.agent.split(',') : []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        this.setState({
            queues: queues,
            agents: agents,
            accounts: accounts,
            extgroupObj: extgroupObj,
            period: queueReport.period,
            endDate: queueReport.end_date,
            selectQueues: queueReport.queue,
            selectAgents: queueReport.agent,
            startDate: queueReport.start_date
        })
    }
    _getStatisticDetails = () => {
        this._getQueueReport()
        this._getQueueStatTotal()
        this._listQueueStatDistributionByQueue()
        this._listQueueStatDistributionByAgent()
        this._listQueueStatDistributionByHour()
        this._listQueueStatDistributionByDay()
        this._listQueueStatDistributionByWeek()
        this._listQueueStatDistributionByMonth()
        this._listQueueStatDistributionByDayOfWeek()
    }
    _getQueueReport = () => {
        const { formatMessage } = this.props.intl

        let QueueReport = [{
                key: '1',
                queue: this.state.selectQueues.join(),
                agent: this.state.selectAgents.join(),
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                period: this.state.period + ' ' + formatMessage({id: "LANG3594"}).toLowerCase()
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
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const total = response.distribution_total || {}

                    let QueueStatTotal = [{
                            key: '1',
                            agent_login: total.agent_login,
                            agent_logoff: total.agent_logoff,
                            avg_talk: UCMGUI.formatSeconds(total.avg_talk),
                            avg_wait: UCMGUI.formatSeconds(total.avg_wait),
                            answered_rate: parseFloat(total.answered_rate).toFixed(2) + ' %',
                            abandoned_rate: parseFloat(total.abandoned_rate).toFixed(2) + ' %',
                            unanswered_rate: parseFloat(total.unanswered_rate).toFixed(2) + ' %',
                            transferred_rate: parseFloat(total.transferred_rate).toFixed(2) + ' %',
                            received_calls: total.received_calls + ' ' + formatMessage({id: "LANG142"}).toLowerCase(),
                            answered_calls: total.answered_calls + ' ' + formatMessage({id: "LANG142"}).toLowerCase(),
                            abandoned_calls: total.abandoned_calls + ' ' + formatMessage({id: "LANG142"}).toLowerCase(),
                            unanswered_calls: total.unanswered_calls + ' ' + formatMessage({id: "LANG142"}).toLowerCase(),
                            transferred_calls: total.transferred_calls + ' ' + formatMessage({id: "LANG142"}).toLowerCase()
                        }]

                    this.setState({
                        QueueStatTotal: QueueStatTotal
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleAgentChange = (targetKeys, direction, moveKeys) => {
        const { form } = this.props

        this.setState({
            selectAgents: targetKeys
        })

        form.setFieldsValue({
            agent: targetKeys
        })

        form.validateFields(['agent'], { force: true })

        console.log('targetKeys: ', targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleQueueChange = (targetKeys, direction, moveKeys) => {
        const { form } = this.props

        this.setState({
            selectQueues: targetKeys
        })

        form.setFieldsValue({
            queue: targetKeys
        })

        form.validateFields(['queue'], { force: true })

        console.log('targetKeys: ', targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        // this.setState({ targetContactKeys: nextTargetKeys })
        console.log('sourceSelectedKeys: ', sourceSelectedKeys)
        console.log('targetSelectedKeys: ', targetSelectedKeys)
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/callQueue')
    }
    _handleSubmit = () => {
        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG5360" }), 0)

                const selectQueues = values.queue
                const selectAgents = values.agent
                const endDate = this._parseDateToString(values.end_date._d)
                const startDate = this._parseDateToString(values.start_date._d)
                const period = (1 + this._daysBetween(
                            values.start_date._d,
                            values.end_date._d
                        ))

                this.setState({
                    period: period,
                    endDate: endDate,
                    startDate: startDate
                })

                let action = {
                    period: period,
                    end_date: endDate,
                    start_date: startDate,
                    queue: selectQueues.join(),
                    agent: selectAgents.join(),
                    action: 'updateQueueReport'
                }

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(formatMessage({ id: "LANG5361" }))

                            this._getStatisticDetails()
                        }
                    }.bind(this)
                })
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
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const QueueStatDistributionByQueue = response.distribution_by_queue || []

                    this.setState({
                        QueueStatDistributionByQueue: QueueStatDistributionByQueue
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
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
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const QueueStatDistributionByAgent = response.distribution_by_agent || []

                    this.setState({
                        QueueStatDistributionByAgent: QueueStatDistributionByAgent
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _listQueueStatDistributionByHour = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByHour'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const QueueStatDistributionByHour = response.distribution_by_hour || []

                    this.setState({
                        QueueStatDistributionByHour: QueueStatDistributionByHour
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _listQueueStatDistributionByDay = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByDay'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const QueueStatDistributionByDay = response.distribution_by_day || []

                    this.setState({
                        QueueStatDistributionByDay: QueueStatDistributionByDay
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _listQueueStatDistributionByDayOfWeek = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByDayOfWeek'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const QueueStatDistributionByDayOfWeek = response.distribution_by_day_of_week || []

                    this.setState({
                        QueueStatDistributionByDayOfWeek: QueueStatDistributionByDayOfWeek
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _listQueueStatDistributionByWeek = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByWeek'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const QueueStatDistributionByWeek = response.distribution_by_week || []

                    this.setState({
                        QueueStatDistributionByWeek: QueueStatDistributionByWeek
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _listQueueStatDistributionByMonth = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueueStatDistributionByMonth'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const QueueStatDistributionByMonth = response.distribution_by_month || []

                    this.setState({
                        QueueStatDistributionByMonth: QueueStatDistributionByMonth
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _onFocus = (e) => {
        e.preventDefault()

        const form = this.props.form

        form.validateFields([e.target.id], { force: true })
    }
    _parseStringToDate = (str) => {
        const ymd = str.split('-')

        return new Date(ymd[0], ymd[1] - 1, ymd[2])
    }
    _parseDateToString = (date) => {
        return (date.getFullYear() + '-' + AddZero(date.getMonth() + 1) + '-' + AddZero(date.getDate()))
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        const formItemLayoutTransfer = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG5359"})
                })

        return (
            <div className="app-content-main app-content-queue-stat">
                <Title
                    isDisplay='display-block'
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit }
                    headerTitle={ formatMessage({id: "LANG5359"}) }
                />
                <Form>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG1048"}) }>
                                            <span>{ formatMessage({id: "LANG1048"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('start_date', {
                                    rules: [{
                                        type: 'object',
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }, {
                                        validator: this._checkTimeFormat
                                    }, {
                                        validator: (data, value, callback) => {
                                            const thisLabel = formatMessage({id: "LANG1048"})
                                            const otherInputValue = form.getFieldValue('end_date')
                                            const otherInputLabel = formatMessage({id: "LANG1049"})

                                            Validator.smallerTime(data, value, callback,
                                                    formatMessage, thisLabel, otherInputValue, otherInputLabel)
                                        }
                                    }],
                                    initialValue: moment(this.state.startDate, DateFormat)
                                })(
                                    <DatePicker
                                        allowClear={ false }
                                        format={ DateFormat }
                                        style={{ 'width': '100%' }}
                                        placeholder={ formatMessage({id: "LANG5373"}) }
                                    />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG1049"}) }>
                                            <span>{ formatMessage({id: "LANG1049"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('end_date', {
                                    rules: [{
                                        type: 'object',
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }, {
                                        validator: this._checkTimeFormat
                                    }, {
                                        validator: (data, value, callback) => {
                                            const thisLabel = formatMessage({id: "LANG1049"})
                                            const otherInputValue = form.getFieldValue('start_date')
                                            const otherInputLabel = formatMessage({id: "LANG1048"})

                                            Validator.biggerTime(data, value, callback,
                                                    formatMessage, thisLabel, otherInputValue, otherInputLabel)
                                        }
                                    }],
                                    initialValue: moment(this.state.endDate, DateFormat)
                                })(
                                    <DatePicker
                                        allowClear={ false }
                                        format={ DateFormat }
                                        style={{ 'width': '100%' }}
                                        placeholder={ formatMessage({id: "LANG5373"}) }
                                    />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayoutTransfer }
                                className="transfer-formitem"
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG91"}) }>
                                            <span>{ formatMessage({id: "LANG91"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('queue', {
                                    rules: [{
                                        type: 'array',
                                        required: true,
                                        message: formatMessage({id: "LANG4762"}, {0: formatMessage({id: "LANG2377"}).toLowerCase()})
                                    }],
                                    initialValue: this.state.selectQueues
                                })(
                                    <Input className="hidden" />
                                ) }
                                <Transfer
                                    showSearch
                                    render={ item => item.title }
                                    dataSource={ this.state.queues }
                                    onChange={ this._handleQueueChange }
                                    targetKeys={ this.state.selectQueues }
                                    filterOption={ this._filterTransferOption }
                                    notFoundContent={ formatMessage({id: "LANG133"}) }
                                    onSelectChange={ this._handleTransferSelectChange }
                                    searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                    titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                                />
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayoutTransfer }
                                className="transfer-formitem"
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG143"}) }>
                                            <span>{ formatMessage({id: "LANG143"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('agent', {
                                    rules: [{
                                        type: 'array',
                                        required: true,
                                        message: formatMessage({id: "LANG4762"}, {0: formatMessage({id: "LANG143"}).toLowerCase()})
                                    }],
                                    initialValue: this.state.selectAgents
                                })(
                                    <Input className="hidden" />
                                ) }
                                <Transfer
                                    showSearch
                                    render={ item => item.title }
                                    dataSource={ this.state.agents }
                                    onChange={ this._handleAgentChange }
                                    targetKeys={ this.state.selectAgents }
                                    filterOption={ this._filterTransferOption }
                                    notFoundContent={ formatMessage({id: "LANG133"}) }
                                    onSelectChange={ this._handleTransferSelectChange }
                                    searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                    titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div className="content">
                    <Card title={ formatMessage({id: "LANG5374"}) }>
                        <Report
                            QueueReport= { this.state.QueueReport }
                            ExtensionGroup= { this.state.extgroupObj }
                            QueueStatTotal= { this.state.QueueStatTotal }
                            QueueStatDistributionByQueue= { this.state.QueueStatDistributionByQueue }
                            QueueStatDistributionByAgent= { this.state.QueueStatDistributionByAgent }
                            QueueStatDistributionByHour= { this.state.QueueStatDistributionByHour }
                            QueueStatDistributionByDay= { this.state.QueueStatDistributionByDay }
                            QueueStatDistributionByWeek= { this.state.QueueStatDistributionByWeek }
                            QueueStatDistributionByMonth= { this.state.QueueStatDistributionByMonth }
                            QueueStatDistributionByDayOfWeek= { this.state.QueueStatDistributionByDayOfWeek }
                        />
                    </Card>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(Statistics))