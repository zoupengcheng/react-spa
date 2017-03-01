'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import { message, Button, Row, Col, Popconfirm, Modal, Select, Input, Checkbox, Form, Tooltip } from 'antd'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions/'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'

const FormItem = Form.Item
const Option = Select.Option

let channel1Array = [],
    channel2Array = []

class ActivityCall extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            callList: []
        }
    }
    componentDidMount() {
        this.props.loadBridgeChannel()
    }
    _hangUpAll = () => {
        const { formatMessage } = this.props.intl
        let successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG3011" })}}></span>
        let warningMessage = <span
                                dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG129" }, { 0: formatMessage({id: "LANG3006"}) })}}>
                            </span>
        if (this.props.activeCallStatus.length !== 0) {
            _.each(channel1Array, function(item, key) {
                let channel1 = item,
                    channel2 = channel2Array[key]

                $.ajax({
                    url: api.apiHost,
                    method: 'post',
                    data: {
                        action: 'Hangup',
                        Channel: channel1
                    },
                    type: 'json',
                    async: false,
                    success: function(res) {
                        if (channel2) {
                            $.ajax({
                                url: api.apiHost,
                                method: "post",
                                data: {
                                    action: 'Hangup',
                                    Channel: channel2
                                },
                                type: 'json',
                                async: false,
                                error: function(e) {
                                    message.error(e.statusText)
                                },
                                success: function(data) {
                                }.bind(this)
                            })
                        }
                    }.bind(this),
                    error: function(e) {
                        message.error(e.statusText)
                    }
                })
            })

            message.success(successMessage)
            this.props.loadBridgeChannel()
        } else {
            message.warning(warningMessage)
        }
    }
    _hangUp = (channel1, channel2) => {
        let self = this
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG905" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG3011" })}}></span>

        message.loading(loadingMessage, 0)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "Hangup",
                "Channel": channel1
            },
            type: 'json',
            success: function(res) {
                var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool && channel2) {
                    $.ajax({
                        url: api.apiHost,
                        method: 'post',
                        data: {
                            "action": "Hangup",
                            "Channel": channel2
                        },
                        type: 'json',
                        success: function(res) {
                            var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(successMessage)
                                self.props.loadBridgeChannel()
                            }
                        }.bind(this),
                        error: function(e) {
                            message.error(e.statusText)
                        }
                    })
                } else {
                    message.destroy()
                    message.success(successMessage)
                    self.props.loadBridgeChannel()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _monitor = () => {
        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let edit_extension = values.edit_extension.split('@'),
                    channel

                let action = {
                    action: 'callbarge',
                    channel: edit_extension[0],
                    exten: edit_extension[1],
                    mode: values.edit_mode, 
                    'barge-exten': values.create_user_id + '@' + (values.need_confirm ? '1' : '0')
                }

                $.ajax({
                    url: api.apiHost,
                    method: 'post',
                    data: action,
                    type: 'json',
                    async: false,
                    success: function(data) {
                        if (data && data.status === 0) {
                            message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4751" })}}></span>)
                            this.setState({
                                visible: false
                            })
                        } else {
                            message.error(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2198" })}}></span>)
                        }
                    }.bind(this),
                    error: function(e) {
                        message.error(e.statusText)
                    }
                })
            } 
        })
    }
    _monitorCancel = () => {
        this.setState({
            visible: false
        })
    }
    _showMonitor = (callerid1, callerid2, channel1, channel2, unknown) => {
        if (channel2 === unknown) {
            channel2 = ''
        }

        let callList = [
            {
                'val': channel1,
                'text': callerid1
            }
        ]

        if (channel2 !== '') {
            callList.push({
                'val': channel2,
                'text': callerid2
            })
        }

        this.setState({
            visible: true,
            callList: callList
        })
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

        if (days === '00') {
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
                async: false,
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
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        let activeCallStatus = this.props.activeCallStatus
        activeCallStatus = activeCallStatus.sort(UCMGUI.bySort("bridge_time ? alloc_time", "down"))
        activeCallStatus = this._transChannelData(activeCallStatus)
        let self = this
        let callList = this.state.callList

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
            currentTime = this._getCurrentTime(),
            sliceCallerid1 = '',
            sliceCallerName = '',
            sliceCalleeName = ''

        return (
            <div className="app-content-main app-content-cdr">
                <Title
                    headerTitle={ formatMessage({id: "LANG3006"}) }
                    isDisplay='hidden'/>
                <div className="content">
                    <div className="top-button">
                        <Popconfirm
                            title={ formatMessage({id: "LANG3012"}) }
                            okText={ formatMessage({id: "LANG727"}) }
                            cancelText={ formatMessage({id: "LANG726"}) }
                            onConfirm={ this._hangUpAll }
                        >
                            <Button
                                type="primary"
                                size="default">
                                { formatMessage({id: "LANG3009"}) }
                            </Button>
                        </Popconfirm>
                    </div>
                    <Row>
                        {
                            activeCallStatus.map(function(channelIndex, key) {
                                if (channelIndex["type"] === "unbridge") {
                                    channel1 = channelIndex.channel
                                    callerid1 = channelIndex.callernum
                                    callerName = channelIndex.callername
                                    allocTime = self._getActivityTime(currentTime, channelIndex.alloc_time)
                                    time = allocTime
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
                                    channel2 = channelIndex.channel2
                                    callerid2 = channelIndex.callerid2
                                    calleeName = channelIndex.name2
                                    callerState = "busy"
                                    calleeState = "busy"
                                }

                                if (callerid1) {
                                    if (/.*[\u4e00-\u9fa5]+.*$/.test(callerid1)) {
                                        sliceCallerid1 = callerid1.length > 10 ? (callerid1.slice(0, 10) + '...') : callerid1
                                    } else {
                                        sliceCallerid1 = callerid1.length > 20 ? (callerid1.slice(0, 20) + '...') : callerid1
                                    }
                                }

                                if (callerName) {
                                    sliceCallerName = callerName.length > 30 ? (callerName.slice(0, 30) + '...') : callerName
                                }

                                if (calleeName) {
                                    sliceCalleeName = calleeName.length > 30 ? (calleeName.slice(0, 30) + '...') : calleeName
                                }

                                channel1Array.push(channel1)
                                channel2Array.push(channel2)

                                return (
                                    <Col className="gutter-row" span={ 6 } key={ key }>
                                        <div className="callDiv">
                                            <div className="caller">
                                                <span className={ "callState " + callerState }></span>
                                                <span className="callerNum" title={ callerid1 }>{ sliceCallerid1 }</span>
                                                <span className="callerName" title={ callerName }>{ sliceCallerName }</span>
                                            </div>
                                            <div className="callTime">
                                                <span className="activityTime">{ time }</span>
                                                <span className={ "pointer connectState " + connectState }></span>
                                            </div>
                                            <div className="callee">
                                                <span className={ "callState " + calleeState }></span>
                                                <span className="calleeNum">{ callerid2 }</span>
                                                <span className="calleeName" title={ calleeName }>{ sliceCalleeName }</span>
                                            </div>
                                        </div>
                                        <div>
                                            <Popconfirm
                                                title={ formatMessage({id: "LANG3010"}) }
                                                okText={ formatMessage({id: "LANG727"}) }
                                                cancelText={ formatMessage({id: "LANG726"}) }
                                                onConfirm={ self._hangUp.bind(self, channel1, channel2) }
                                            >
                                                <Button
                                                    type="primary"
                                                    size="default"
                                                    className="hangUp">
                                                    { formatMessage({id: "LANG3007"}) }
                                                </Button>
                                            </Popconfirm>
                                            <Button
                                                type="primary"
                                                size="default"
                                                className="monitor"
                                                onClick={ self._showMonitor.bind(self, callerid1, callerid2, channel1, channel2, unknown)}
                                                disabled={ !(connectState.indexOf("connected") > -1) }>
                                                { formatMessage({id: "LANG3008"}) }
                                            </Button>
                                        </div>
                                    </Col>
                                )
                            }) 
                        }
                    </Row>
                    <Modal 
                        title={ formatMessage({id: "LANG3008"}) }
                        visible={this.state.visible}
                        onOk={this._monitor} 
                        onCancel={this._monitorCancel}
                        okText={formatMessage({id: "LANG769"})}
                        cancelText={formatMessage({id: "LANG726"})}>
                        <Form>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG3819" /> }>
                                        <span>{formatMessage({id: "LANG3819"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('create_user_id')(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG3820" /> }>
                                        <span>{formatMessage({id: "LANG3820"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('edit_extension', {
                                    initialValue: callList[0] && (callList[0].val + '@' + callList[0].text)
                                })(
                                    <Select>
                                        {
                                            this.state.callList.map(function(item, key) {
                                                return (
                                                    <Option value={ item.val + '@' + item.text } key={ key }>{ item.text }</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG3839" /> }>
                                        <span>{formatMessage({id: "LANG3838"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('edit_mode', {
                                    initialValue: ''
                                })(
                                    <Select>
                                        <Option value="">Listen</Option>
                                        <Option value="w">Whisper</Option>
                                        <Option value="B">Barge</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG2352" /> }>
                                        <span>{formatMessage({id: "LANG2351"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('need_confirm')(
                                    <Checkbox />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
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

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(injectIntl(ActivityCall)))