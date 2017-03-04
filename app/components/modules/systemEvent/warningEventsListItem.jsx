'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage, formatMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, Row } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class EventListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cycle_time_min: 5,
            cycle_time_max: 31536000,
            cycleShow: false,
            thresholdValueShow: false,
            sendDelayShow: false,
            dataItem: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkName = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && _.indexOf(this.state.groupNameList, value) > -1) {
            callback(formatMessage({id: "LANG2137"}))
        } else {
            callback()
        }
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _getInitData = () => {
        const ID = this.props.params.id
        let dataItem = {}
        let cycle_time_max = 31536000
        let cycle_time_min = 1
        let cycleShow = false
        let thresholdValueShow = false
        let sendDelayShow = false

        let warningAction = {}
        if (ID === '7') {
            warningAction.action = 'getWarningSendDelaySetting'
        } else {
            warningAction.action = 'warningGetConfigSettings'
            warningAction.id = ID
        }
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: warningAction,
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    dataItem = response.body
                    if (ID === '1' || ID === '18' || ID === '3' || ID === '6' || ID === '8') {
                        const cycle_unit = dataItem.cycle_time && dataItem.cycle_time !== "" ? dataItem.cycle_time.slice(-1) : 's'
                        if (cycle_unit === 's') {
                            cycle_time_max = 31536000
                            cycle_time_min = 5
                        } else if (cycle_unit === 'm') {
                            cycle_time_max = 525600
                            cycle_time_min = 1
                        } else if (cycle_unit === 'h') {
                            cycle_time_max = 8760
                            cycle_time_min = 1
                        } else if (cycle_unit === 'd') {
                            cycle_time_max = 365
                            cycle_time_min = 1
                        }
                        cycleShow = true
                    }
                    if (ID === '1' || ID === '18' || ID === '3') {
                        thresholdValueShow = true
                    }
                    if (ID === '7') {
                        sendDelayShow = true
                    }
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        this.setState({
            dataItem: dataItem,
            cycle_time_max: cycle_time_max,
            cycle_time_min: cycle_time_min,
            cycleShow: cycleShow,
            thresholdValueShow: thresholdValueShow,
            sendDelayShow: sendDelayShow
        })
    }
    _onChangeCycleUnit = (e) => {
        const cycle_unit = e
        let cycle_time_max = 31536000
        let cycle_time_min = 1
        if (cycle_unit === 's') {
            cycle_time_max = 31536000
            cycle_time_min = 5
        } else if (cycle_unit === 'm') {
            cycle_time_max = 525600
            cycle_time_min = 1
        } else if (cycle_unit === 'h') {
            cycle_time_max = 8760
            cycle_time_min = 1
        } else if (cycle_unit === 'd') {
            cycle_time_max = 365
            cycle_time_min = 1
        }
        this.setState({
            cycle_time_max: cycle_time_max,
            cycle_time_min: cycle_time_min
        })
    }
    _warningStart = () => {
        $.ajax({
            url: api.apiHost + 'action=reloadWarning&warningStart=',
            method: "GET",
            type: 'json',
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                }
            }.bind(this)
        })
    }
    _warningStop = () => {
        $.ajax({
            url: api.apiHost + 'action=reloadWarning&warningStop=',
            method: "GET",
            type: 'json',
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                }

                this._handleCancel()
            }.bind(this)
        })
    }
    _handleCancel = () => {
        browserHistory.push('/maintenance/systemEvent/2')
    }
    _handleSubmit = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const ID = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG904" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>

        this.props.form.validateFieldsAndScroll({force: true}, (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)
                let action = {}

                if (ID === '1' || ID === '18' || ID === '3') {
                    action.action = 'warningUpdateConfigSettings'
                    action.id = parseInt(ID)
                    action.cycle_time = values.cycle_time + values.cycle_unit
                    action.percent = values.percent / 100
                }
                if (ID === '6' || ID === '8') {
                    action.action = 'warningUpdateConfigSettings'
                    action.id = parseInt(ID)
                    action.cycle_time = values.cycle_time + values.cycle_unit
                    action.percent = null
                }
                if (ID === '7') {
                    action.action = "updateWarningSendDelaySetting"
                    action.send_delay = values.send_delay
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
                            message.success(successMessage)
                        }

                        this._warningStart()
                        this._warningStop()
                        this._handleCancel()
                    }.bind(this)
                })
            }
        })
    }
    render() {
        const ID = this.props.params.id

        const { formatMessage } = this.props.intl
        const { getFieldDecorator, setFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const events = [
            "LANG2591",
            "LANG2592",
            "LANG2593",
            "LANG2594",
            "LANG2595",
            "LANG2681",
            "LANG2758",
            "LANG2759",
            "LANG2760",
            "LANG2761",
            "LANG2762",
            "LANG3183",
            "LANG3184",
            "LANG3277",
            "LANG3278",
            "LANG3504",
            "LANG4779",
            "LANG4780"
        ]

        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        }
        const formItemDenyLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 18 }
        }

        const title = formatMessage({id: "LANG2567"}, {0: formatMessage({id: events[ID - 1]})})

        const dataItem = this.state.dataItem || {}
        const cycle_time = dataItem.cycle_time && dataItem.cycle_time !== "" ? parseInt(dataItem.cycle_time) : ''
        const cycle_unit = dataItem.cycle_time && dataItem.cycle_time !== "" ? dataItem.cycle_time.slice(-1) : 's'
        
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'
                />
                <div className="content">
                    <Form>
                        <Row className={ this.state.cycleShow ? 'display-block' : 'hidden' } >
                            <Col span={ 6 } >
                                <FormItem
                                    ref="div_cycle_time"
                                    { ...formItemLayout }

                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2569" />}>
                                            <span>{formatMessage({id: "LANG2568"})}</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('cycle_time', {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                Validator.range(data, value, callback, formatMessage, this.state.cycle_time_min, this.state.cycle_time_max)
                                            }
                                        }],
                                        initialValue: cycle_time
                                    })(
                                        <Input min={ this.state.cycle_time_min } max={ this.state.cycle_time_max } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem
                                    ref="div_cycle_unit"
                                    { ...formItemLayout }>
                                    { getFieldDecorator('cycle_unit', {
                                        rules: [],
                                        initialValue: cycle_unit
                                    })(
                                        <Select onChange={ this._onChangeCycleUnit }>
                                            <Option value="s">{ formatMessage({id: "LANG2575"}) }</Option>
                                            <Option value="m">{ formatMessage({id: "LANG2576"}) }</Option>
                                            <Option value="h">{ formatMessage({id: "LANG2577"}) }</Option>
                                            <Option value="d">{ formatMessage({id: "LANG2578"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className={ this.state.thresholdValueShow ? 'display-block' : 'hidden' }>
                            <Col span={ 6 }>
                                <FormItem
                                    ref="div_percent"
                                    { ...formItemLayout }

                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2571" />}>
                                            <span>{formatMessage({id: "LANG2570"})}</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('percent', {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                Validator.range(data, value, callback, formatMessage, 1, 100)
                                            }
                                        }],
                                        initialValue: dataItem.percent * 100
                                    })(
                                        <Input min={ 1 } max={ 100 } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col>
                                <span>%</span>
                            </Col>
                        </Row>
                        <Row className={ this.state.sendDelayShow ? 'display-block' : 'hidden' } >
                            <Col span={ 9 }>
                                <FormItem
                                    ref="div_send_delay"
                                    { ...formItemLayout }

                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG5349" />}>
                                            <span>{formatMessage({id: "LANG5348"})}</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('send_delay', {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                Validator.range(data, value, callback, formatMessage, 1, 1440)
                                            }
                                        }],
                                        initialValue: dataItem.send_delay
                                    })(
                                        <Input min={ 1 } max={ 1440 } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col>
                                <span>{ formatMessage({id: "LANG2576"}) }</span>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(EventListItem))