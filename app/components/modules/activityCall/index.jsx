'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import { message, Button, Row, Col } from 'antd'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions/'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

class ActivityCall extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        this.props.loadBridgeChannel()
    }
    _hangUpAll = () => {

    }
    _transChannelData = (data) => {
        var arr = []

        for (var i = 0; i < data.length; i++) {
            var channelIndex = data[i]

            if (channelIndex["alloc_time"]) {
                var state = channelIndex.state.toLocaleLowerCase(),
                    service = channelIndex.service.toLocaleLowerCase(),
                    channel = channelIndex.channel.toLocaleLowerCase()

                if (state === "rsrvd" || state === "down" || state === "ring" ||
                    (channel.indexOf('local') === 0 && (service === "normal" || service === "queue" || service === "confbridge"))) {
                    continue
                } else {
                    channelIndex["type"] = "unbridge"
                }

                if (state === "ringing") {
                    var tmp_name = channelIndex.callername,
                        tmp_num = channelIndex.callernum

                    channelIndex.callername = channelIndex.connectedname
                    channelIndex.callernum = channelIndex.connectednum

                    channelIndex.connectedname = tmp_name
                    channelIndex.connectednum = tmp_num
                }
            } else if (channelIndex["bridge_time"]) {
                channelIndex["type"] = "bridge"
            }

            arr.push(channelIndex)
        }

        return arr
    }
    _checkConnectState = (allocTime, callerState, connectednum) => {
        var matchArr = allocTime.match(/\d+/g),
            connectState = "connected"

        if (matchArr && parseInt(matchArr[0])) {
            connectState = "connectedWarning"
        } else if (matchArr && parseInt(matchArr[1]) > 30) {
            connectState = "connectedLongTime"
        } else if (callerState === "dialing" || callerState === "ring" || callerState === "ringing") {
            if (connectednum && connectednum === "s") {
                connectState = "connected"
            } else {
                connectState = "connectRinging"
            }
        }

        return connectState
    }
    _checkCalleeState = (channelIndex) => {
        var callerState = channelIndex.state.toLowerCase(),
            service = channelIndex.service.toLowerCase()

        if (service === "normal") {
            if (callerState === "dialing" || callerState === "pre-ring" || callerState === "ring" || callerState === "ringing") {
                service = "ringing"
            }
            if (callerState === "up") {
                service = "up"
            }
        }

        if (service === "macro-dial") {
            service = "normal"
        }
        return service || "unknown"
    }
    _getActivityTime = (currentTime, time) => {
        currentTime = currentTime.replace(/-/g, "/")

        var startTime = Date.parse(time.replace(/-/g, "/")),
            timeAry = currentTime.split(' '),
            milliseconds = Date.parse(timeAry[0] + " " + timeAry[1]) - startTime,
            activity

        if (milliseconds < 0) {
            milliseconds = 0
        }

        var days = UCMGUI.addZero(Math.floor(milliseconds / (24 * 3600 * 1000)))

        var leave1 = milliseconds % (24 * 3600 * 1000),
            hours = UCMGUI.addZero(Math.floor(leave1 / (3600 * 1000)))

        var leave2 = leave1 % (3600 * 1000),
            minutes = UCMGUI.addZero(Math.floor(leave2 / (60 * 1000)))

        var leave3 = leave2 % (60 * 1000),
            seconds = UCMGUI.addZero(Math.round(leave3 / 1000))

        if (days === 0) {
            activity = hours + ":" + minutes + ":" + seconds
        } else {
            activity = days + " " + hours + ":" + minutes + ":" + seconds
        }

        return activity
    }
    _getCurrentTime = () => {
        var currentTime = '1970-01-01 00:00:00 UTC+08:00'

        $.ajax({
                type: 'json',
                method: 'post',
                url: api.apiHost,
                data: {
                    "action": 'checkInfo'
                },
                success: function(data) {
                    if (data && data.status === 0) {
                        currentTime = data.response.current_time
                    }
                },
                error: function(e) {
                    console.log(e.statusText)
                }
            })

        return currentTime
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        let activeCallStatus = this.props.activeCallStatus
        activeCallStatus = activeCallStatus.sort(UCMGUI.bySort("bridge_time ? alloc_time", "down"))
        let transChannel = this._transChannelData(activeCallStatus)
        let self = this

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG3006"})
                })

        var unknown = formatMessage({id: "LANG2403"}),
            channel1 = "",
            callerid1 = unknown,
            channel2 = unknown,
            callerid2 = unknown,
            time = unknown,
            callerState = "unknown",
            calleeState = "unknown",
            connectState = "",
            service = "",
            callerName,
            calleeName,
            allocTime,
            currentTime = this._getCurrentTime()

        return (
            <div className="app-content-main app-content-cdr">
                <Title
                    headerTitle={ formatMessage({id: "LANG3006"}) }
                    isDisplay='hidden'/>
                <div className="content">
                    <div className="top-button">
                        <Button
                            type="primary"
                            size="default"
                            onClick={ this._hangUpAll }>
                            { formatMessage({id: "LANG3009"}) }
                        </Button>
                    </div>
                    <Row>
                        {
                            activeCallStatus.map(function(channelIndex, key) {
                                if (channelIndex["type"] === "unbridge") {
                                    channel1 = channelIndex.channel
                                    callerid1 = channelIndex.callernum
                                    callerName = channelIndex.callername
                                    allocTime = self._getActivityTime(currentTime, channelIndex.alloc_time)
                                    // time = checkTime(allocTime)
                                    callerid2 = channelIndex.connectednum || unknown
                                    calleeName = channelIndex.connectedname
                                    callerState = channelIndex.state.toLowerCase() || unknown
                                    calleeState = self._checkCalleeState(channelIndex)
                                    if (channelIndex.connectedname === "Call Bargin") {
                                        connectState = "connectBargin"
                                    } else {
                                        connectState = self._checkConnectState(allocTime, callerState, callerid2)
                                    }
                                } else if (channelIndex["type"] === "bridge") {
                                    channel1 = channelIndex.channel1
                                    callerid1 = channelIndex.callerid1
                                    callerName = channelIndex.name1
                                    time = self._getActivityTime(currentTime, channelIndex.bridge_time)
                                    connectState = self._checkConnectState(time, "busy")
                                    // time = checkTime(time)
                                    channel2 = channelIndex.channel2
                                    callerid2 = channelIndex.callerid2
                                    calleeName = channelIndex.name2
                                    callerState = "busy"
                                    calleeState = "busy"
                                }
                                return (
                                    <Col className="gutter-row" span={ 6 } key={ key }>
                                        <div>
                                            <span>{ callerid1 }</span>
                                            <span>{ time }</span>
                                            <span>{ callerid2 }</span>
                                        </div>
                                        <div>
                                            <Button
                                                type="primary"
                                                size="default">
                                                { formatMessage({id: "LANG3007"}) }
                                            </Button>
                                            <Button
                                                type="primary"
                                                size="default">
                                                { formatMessage({id: "LANG3007"}) }
                                            </Button>
                                        </div>
                                    </Col>
                                )
                            }) 
                        }
                    </Row>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activeCallStatus: state.activeCallStatus
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActivityCall))