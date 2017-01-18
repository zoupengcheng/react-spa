'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import { message, Tabs } from 'antd'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions/'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

import SwitchBoardItem from './switchboardItem'

const TabPane = Tabs.TabPane

class SwitchBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTabKey: '',
            queueMembers: [],
            callQueueList: [],
            answerCallings: [],
            waitingCallings: []
        }
    }
    componentWillMount () {
        // this._getQueueByChairman()
        this.props.getQueueByChairman()
    }
    _getQueueByChairman = (chairman) => {
        let data = {}
        const { formatMessage } = this.props.intl

        if (chairman) {
            data.chairman = chairman
        }

        data.action = 'getQueueByChairman'

        $.ajax({
            data: data,
            type: 'json',
            method: 'post',
            // async: false,
            url: api.apiHost,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const callQueueList = response.CallQueues || []
                    const activeTabKey = callQueueList.length ? callQueueList[0].extension : ''

                    this.setState({
                        activeTabKey: activeTabKey,
                        callQueueList: callQueueList
                    })

                    this._getQueueMembers(activeTabKey)
                    this._getQueueCallingAnswered(activeTabKey)
                    this._getQueueCallingWaiting(activeTabKey)
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getQueueMembers = (queue) => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                queuename: queue,
                action: 'getQueueByChairman'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const queueMembers = response.QueueMembers || []

                    this.setState({
                        queueMembers: queueMembers
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getQueueCallingAnswered = (queue) => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                role: 'answer',
                queuename: queue,
                action: 'getQueueCalling'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const answerCallings = response.CallQueues || []

                    this.setState({
                        answerCallings: answerCallings
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getQueueCallingWaiting = (queue) => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                role: '',
                queuename: queue,
                action: 'getQueueCalling'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const waitingCallings = response.CallQueues || []

                    this.setState({
                        waitingCallings: _.sortBy(waitingCallings, function(item) { return item.position })
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _onTabsChange = (activeTabKey) => {
        this.setState({ activeTabKey })

        this.props.getQueueMembers(activeTabKey)
        this.props.getQueueCallingAnswered(activeTabKey)
        this.props.getQueueCallingWaiting(activeTabKey)
    }
    render() {
        const { formatMessage } = this.props.intl
        const queueMembers = this.props.queueMembers
        const callQueueList = this.props.callQueueList
        const answerCallings = this.props.answerCallings
        const waitingCallings = this.props.waitingCallings
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const activeTabKey = (callQueueList && callQueueList.length ? callQueueList[0].extension : '')

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG5407"})
                })

        return (
            <div className="app-content-main app-content-cdr">
                <Title
                    headerTitle={ formatMessage({id: "LANG5407"}) }
                    isDisplay='hidden'
                />
                <Tabs
                    onChange={ this._onTabsChange }
                    activeKey={ this.state.activeTabKey ? this.state.activeTabKey : activeTabKey }
                >
                {
                    callQueueList.map(function(item) {
                        return <TabPane
                                    key={ item.extension }
                                    tab={ item.extension + ' (' + item.queuename + ')' }
                                >
                                    <SwitchBoardItem
                                        queueDetail={ item }
                                        queueMembers={ queueMembers }
                                        answerCallings={ answerCallings }
                                        waitingCallings={ waitingCallings }
                                    />
                                </TabPane>
                    })
                }
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    queueMembers: state.queueMembers,
    callQueueList: state.callQueueList,
    answerCallings: state.answerCallings,
    waitingCallings: state.waitingCallings
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SwitchBoard))