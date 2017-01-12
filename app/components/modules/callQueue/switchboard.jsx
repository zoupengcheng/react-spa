'use strict'

import $ from 'jquery'
import api from "../../api/api"
import { message, Tabs } from 'antd'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
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
            callQueueList: []
        }
    }
    componentWillMount () {
        this._getQueueByChairman()
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
    _onTabsChange = (activeTabKey) => {
        this.setState({ activeTabKey })

        this._getQueueMembers(activeTabKey)
    }
    render() {
        const { formatMessage } = this.props.intl
        const queueMembers = this.state.queueMembers
        const model_info = JSON.parse(localStorage.getItem('model_info'))

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
                <Tabs activeKey={ this.state.activeTabKey } onChange={ this._onTabsChange }>
                {
                    this.state.callQueueList.map(function(item) {
                        return <TabPane
                                    key={ item.extension }
                                    tab={ item.extension + ' (' + item.queuename + ')' }
                                >
                                    <SwitchBoardItem
                                        queueDetail={ item }
                                        queueMembers={ queueMembers }
                                    />
                                </TabPane>
                    })
                }
                </Tabs>
            </div>
        )
    }
}

export default injectIntl(SwitchBoard)