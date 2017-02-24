'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, message, Select, Tooltip, Checkbox, Row, Col, Transfer } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class CallBackItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            disaList: [],
            ivrList: [],
            fileList: [],
            callBackValues: {}
        }
    }
    componentWillMount() {
        this._getDisaList()
        this._getIvrList()
    }
    componentDidMount() {
        this._getInitData()
    }

    _getDisaList = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getDISAList' },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    let obj = {}
                    let response = res.response || {}
                    let disaList = response.disa || []

                    this.setState({
                        disaList: disaList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getIvrList = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getIVRList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    let response = res.response || {}
                    let ivrList = response.ivr || []

                    this.setState({
                        ivrList: ivrList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _handleSelectValues = (val) => {
        let displayList = []
        if (val === 'disa') {
            let DisaList = this.state.disaList
            for (let i = 0; i < DisaList.length; i++) {
                let disaName = DisaList[i]["display_name"]
                let disaId = DisaList[i]["disa_id"]
                if (disaName && disaId) {
                    let obj = {
                        key: disaId,
                        val: disaName
                    }
                    displayList.push(obj)
                }
            }
        } else if (val === 'ivr') {
            let IvrList = this.state.ivrList
            for (let i = 0; i < IvrList.length; i++) {
                let IvrName = IvrList[i]["ivr_name"]
                let ivrId = IvrList[i]["ivr_id"]
                if (IvrName && ivrId) {
                    let obj = {
                        key: ivrId,
                        val: IvrName
                    }
                    displayList.push(obj)
                }
            }
        }

        this.setState({
            fileList: displayList
        })
        console.log('distination value is: ', displayList)
    }

    _getInitData = () => {
        const callBackIndex = this.props.params.id
        const callBackName = this.props.params.name
        let destinationType = 'disa'

        if (callBackName) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getCallback',
                    callback: callBackIndex
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        let callBackValues = response.callback
                        destinationType = callBackValues.destination_type
                        this.setState({
                            callBackValues: callBackValues
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this._handleSelectValues(destinationType)
    }

    _handleCancel = () => {
        browserHistory.push('/call-features/callback')
    }

    _handleSubmit = () => {
        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const callBackIndex = this.props.params.id
        const callBackName = this.props.params.name

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = values
                if (values.destination_type === 'disa') {
                    this.state.disaList.map(function(item) {
                        if (item.display_name === values.external_number) {
                            action.disa = item.disa_id
                        }
                    })
                } else if (values.destination_type === 'ivr') {
                    this.state.ivrList.map(function(item) {
                        if (item.ivr_name === values.external_number) {
                            action.ivr = item.ivr_id
                        }
                    })
                }
                delete action.external_number

                if (callBackIndex && callBackName) {
                    action.action = 'updateCallback'
                    action.callback = callBackIndex
                } else {
                    action.action = 'addCallback'
                }

                console.log('action: ', action)
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

                        this._handleCancel()
                    }.bind(this)
                })
            }
        })
    }

    _onChangeMode = (e) => {
        let displayList = []
        if (e === 'disa') {
            let DisaList = this.state.disaList
            for (let i = 0; i < DisaList.length; i++) {
                let disaName = DisaList[i]["display_name"]
                let disaId = DisaList[i]["disa_id"]
                if (disaName && disaId) {
                    let obj = {
                        key: disaId,
                        val: disaName
                    }
                    displayList.push(obj)
                }
            }
        } else if (e === 'ivr') {
            let IvrList = this.state.ivrList
            for (let i = 0; i < IvrList.length; i++) {
                let IvrName = IvrList[i]["ivr_name"]
                let ivrId = IvrList[i]["ivr_id"]
                if (IvrName && ivrId) {
                    let obj = {
                        key: ivrId,
                        val: IvrName
                    }
                    displayList.push(obj)
                }
            }
        }

        this.setState({
            fileList: displayList
        })
    }

    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const callBackValues = this.state.callBackValues
        const fileList = this.state.fileList

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemDestinationLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG3741"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG3743"}))

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
                        <FormItem
                            ref="div_name"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3744" />}>
                                    <span>{ formatMessage({id: "LANG135"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: callBackValues.name ? callBackValues.name : ''
                            })(
                                <Input placeholder={ formatMessage({id: "LANG135"}) } maxLength="25" />
                            ) }
                        </FormItem>

                        <FormItem
                            ref="div_callerid_pattern"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3823" />}>
                                    <span>{ formatMessage({id: "LANG2748"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('callerid_pattern', {
                                rules: [],
                                initialValue: callBackValues.callerid_pattern ? callBackValues.callerid_pattern : ''
                            })(
                                <Input placeholder={ formatMessage({id: "LANG2748"}) } maxLength="25" />
                            ) }
                        </FormItem>

                        <FormItem
                            ref="div_outside_pre"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3821" />}>
                                    <span>{ formatMessage({id: "LANG3824"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('outside_pre', {
                                rules: [],
                                initialValue: callBackValues.outside_pre ? callBackValues.outside_pre : ''
                            })(
                                <Input placeholder={ formatMessage({id: "LANG3824"}) } maxLength="25" />
                            ) }
                        </FormItem>

                        <FormItem
                            ref="div_sleep_time"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3748" />}>
                                    <span>{ formatMessage({id: "LANG3747"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('sleep_time', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: callBackValues.sleep_time ? callBackValues.sleep_time : '5'
                            })(
                                <Input placeholder={ formatMessage({id: "LANG3747"}) } maxLength="25" />
                            ) }
                        </FormItem>

                        <Row>
                            <Col span={ 9 } style={{ marginRight: 20 }}>
                                <FormItem
                                    ref="div_destination_type"
                                    { ...formItemDestinationLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3749" />}>
                                            <span>{ formatMessage({id: "LANG168"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('destination_type', {
                                        rules: [],
                                        width: 100,
                                        initialValue: callBackValues.destination_type === "ivr" ? 'ivr' : 'disa'
                                    })(
                                        <Select onChange={ this._onChangeMode } >
                                            <Option value='disa'>{ formatMessage({id: "LANG2353"}) }</Option>
                                            <Option value='ivr'>{ formatMessage({id: "LANG19"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 9 } style={{ marginRight: 20 }}>
                                    { getFieldDecorator('external_number', {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: fileList.length > 0 ? fileList[0].val : ''
                                    })(
                                         <Select>
                                            {
                                                fileList.map(function(item) {
                                                    return <Option value={ item.val }>{ item.val }</Option>
                                                    }
                                                )
                                            }
                                        </Select>
                                    ) }
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(CallBackItem))