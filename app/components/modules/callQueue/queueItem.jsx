'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item

class QueueItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetKeys: [],
            accountList: [],
            groupNameList: [],
            queueItem: {}
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
        let targetKeys = []
        let accountList = []
        let groupNameList = []
        let extensionGroup = {}
        const { formatMessage } = this.props.intl
        const extensionGroupId = this.props.params.id
        const extensionGroupName = this.props.params.name

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getExtensionGroupNameList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    groupNameList = response.group_name || []
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
                action: 'getAccountList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const extension = response.extension || []

                    accountList = extension.map(function(item) {
                        return {
                                key: item.extension,
                                out_of_service: item.out_of_service,
                                // disabled: (item.out_of_service === 'yes'),
                                title: (item.extension +
                                    (item.fullname ? ' "' + item.fullname + '"' : '') +
                                    (item.out_of_service === 'yes' ? ' <' + formatMessage({id: "LANG273"}) + '>' : ''))
                            }
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        if (extensionGroupId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getExtensionGroup',
                    extension_group: extensionGroupId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        extensionGroup = res.response.extension_group || {}
                        targetKeys = extensionGroup.members.split(',') || []
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        if (extensionGroupName) {
            groupNameList = _.without(groupNameList, extensionGroupName)
        }

        this.setState({
            targetKeys: targetKeys,
            accountList: accountList,
            groupNameList: groupNameList,
            queueItem: extensionGroup
        })
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/callQueue')
    }
    _handleTransferChange = (targetKeys, direction, moveKeys) => {
        if (!targetKeys.length) {
            this.setState({
                targetKeys: targetKeys
            })
        } else {
            this.setState({
                targetKeys: targetKeys
            })
        }

        console.log('targetKeys: ', targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        // this.setState({ targetContactKeys: nextTargetKeys })
        console.log('sourceSelectedKeys: ', sourceSelectedKeys)
        console.log('targetSelectedKeys: ', targetSelectedKeys)
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const extensionGroupId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                if (!this.state.targetKeys.length) {
                    message.error(errorMessage)

                    return
                }

                message.loading(loadingMessage)

                let action = values

                action.members = this.state.targetKeys.join()

                if (extensionGroupId) {
                    action.action = 'updateExtensionGroup'
                    action.extension_group = extensionGroupId
                } else {
                    action.action = 'addExtensiongroup'
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

                        this._handleCancel()
                    }.bind(this)
                })
            }
        })
    }
    _renderItem = (item) => {
        const customLabel = (
                <span className={ item.out_of_service === 'yes' ? 'out-of-service' : '' }>
                    { item.title }
                </span>
            )

        return {
                label: customLabel,  // for displayed item
                value: item.title   // for title and filter matching
            }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }
        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG608"}, {
                    0: this.props.params.id
                })
                : formatMessage({id: "LANG747"}))

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
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG3"}) }</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1171" /> }>
                                                <span>{ formatMessage({id: "LANG85"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('extension', {
                                        rules: [],
                                        initialValue: this.state.queueItem.extension
                                    })(
                                        <InputNumber />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1180" /> }>
                                                <span>{ formatMessage({id: "LANG135"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('queue_name', {
                                        rules: [],
                                        initialValue: this.state.queueItem.queue_name
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1183" /> }>
                                                <span>{ formatMessage({id: "LANG132"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('strategy', {
                                        rules: [],
                                        initialValue: this.state.queueItem.strategy
                                    })(
                                        <Select>
                                            <Option value='ringall'>{ formatMessage({id: "LANG1197"}) }</Option>
                                            <Option value='linear'>{ formatMessage({id: "LANG1198"}) }</Option>
                                            <Option value='leastrecent'>{ formatMessage({id: "LANG1199"}) }</Option>
                                            <Option value='fewestcalls'>{ formatMessage({id: "LANG1200"}) }</Option>
                                            <Option value='random'>{ formatMessage({id: "LANG1201"}) }</Option>
                                            <Option value='rrmemory'>{ formatMessage({id: "LANG1202"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1179" /> }>
                                                <span>{ formatMessage({id: "LANG1178"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('musicclass', {
                                        rules: [],
                                        initialValue: this.state.queueItem.musicclass
                                    })(
                                        <Select></Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1175" /> }>
                                                <span>{ formatMessage({id: "LANG1174"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('leavewhenempty', {
                                        rules: [],
                                        initialValue: this.state.queueItem.leavewhenempty
                                    })(
                                        <Select>
                                            <Option value='yes'>{ formatMessage({id: "LANG136"}) }</Option>
                                            <Option value='no'>{ formatMessage({id: "LANG137"}) }</Option>
                                            <Option value='strict'>{ formatMessage({id: "LANG1203"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1173" /> }>
                                                <span>{ formatMessage({id: "LANG1172"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('joinempty', {
                                        rules: [],
                                        initialValue: this.state.queueItem.joinempty
                                    })(
                                        <Select>
                                            <Option value='yes'>{ formatMessage({id: "LANG136"}) }</Option>
                                            <Option value='no'>{ formatMessage({id: "LANG137"}) }</Option>
                                            <Option value='strict'>{ formatMessage({id: "LANG1203"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1170" /> }>
                                                <span>{ formatMessage({id: "LANG1169"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <Checkbox />
                                    { getFieldDecorator('pin', {
                                        rules: [],
                                        initialValue: this.state.queueItem.pin
                                    })(
                                        <InputNumber
                                            style={{ 'margin-left': '10px' }}
                                        />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG5072" /> }>
                                                <span>{ formatMessage({id: "LANG5071"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('replace_caller_id', {
                                        rules: [],
                                        initialValue: this.state.queueItem.replace_caller_id
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG609"}) }</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1185" /> }>
                                                <span>{ formatMessage({id: "LANG1184"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('ringtime', {
                                        rules: [],
                                        initialValue: this.state.queueItem.ringtime
                                    })(
                                        <InputNumber />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1188" /> }>
                                                <span>{ formatMessage({id: "LANG1189"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('wrapuptime', {
                                        rules: [],
                                        initialValue: this.state.queueItem.wrapuptime
                                    })(
                                        <InputNumber />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4798" /> }>
                                                <span>{ formatMessage({id: "LANG4797"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('retry', {
                                        rules: [],
                                        initialValue: this.state.queueItem.retry
                                    })(
                                        <InputNumber />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1177" /> }>
                                                <span>{ formatMessage({id: "LANG1176"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('maxlen', {
                                        rules: [],
                                        initialValue: this.state.queueItem.maxlen
                                    })(
                                        <InputNumber />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1182" /> }>
                                                <span>{ formatMessage({id: "LANG1181"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('reportholdtime', {
                                        rules: [],
                                        initialValue: this.state.queueItem.reportholdtime
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2544" /> }>
                                                <span>{ formatMessage({id: "LANG2543"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('auto_record', {
                                        rules: [],
                                        initialValue: this.state.queueItem.auto_record
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1187" /> }>
                                                <span>{ formatMessage({id: "LANG1186"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <Checkbox />
                                    { getFieldDecorator('waittime', {
                                        rules: [],
                                        initialValue: this.state.queueItem.waittime
                                    })(
                                        <InputNumber
                                            style={{ 'margin-left': '10px' }}
                                        />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3553" /> }>
                                                <span>{ formatMessage({id: "LANG2990"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('enable_destination', {
                                        rules: [],
                                        initialValue: this.state.queueItem.enable_destination
                                    })(
                                        <Select>
                                            <Option value='D'>{ formatMessage({id: "LANG273"}) }</Option>
                                            <Option value='T'>{ formatMessage({id: "LANG4582"}) }</Option>
                                            <Option value='V'>{ formatMessage({id: "LANG4583"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3751" /> }>
                                                <span>{ formatMessage({id: "LANG3880"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('destination_type', {
                                        rules: [],
                                        initialValue: this.state.queueItem.destination_type
                                    })(
                                        <Select
                                            style={{ 'width': '45%' }}
                                        ></Select>
                                    ) }
                                    { getFieldDecorator('destination_value', {
                                        rules: [],
                                        initialValue: this.state.queueItem.destination_value
                                    })(
                                        <Select
                                            style={{ 'width': '45%', 'margin-left': '10px' }}
                                        ></Select>
                                    ) }
                                    { getFieldDecorator('external_number', {
                                        rules: [],
                                        initialValue: this.state.queueItem.external_number
                                    })(
                                        <Input
                                            className={ 'hidden' }
                                            style={{ 'margin-left': '10px' }}
                                        />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4084" /> }>
                                                <span>{ formatMessage({id: "LANG4083"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('queue_timeout', {
                                        rules: [],
                                        initialValue: this.state.queueItem.queue_timeout
                                    })(
                                        <InputNumber />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4581" /> }>
                                                <span>{ formatMessage({id: "LANG4580"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('voice_prompt_time', {
                                        rules: [],
                                        initialValue: this.state.queueItem.voice_prompt_time
                                    })(
                                        <InputNumber />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG5060" /> }>
                                                <span>{ formatMessage({id: "LANG28"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('custom_prompt', {
                                        rules: [],
                                        initialValue: this.state.queueItem.custom_prompt
                                    })(
                                        <Select></Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG5408" /> }>
                                                <span>{ formatMessage({id: "LANG5408"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('queue_chairman', {
                                        rules: [],
                                        initialValue: this.state.queueItem.queue_chairman
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4170" /> }>
                                                <span>{ formatMessage({id: "LANG4169"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('enable_feature', {
                                        rules: [],
                                        initialValue: this.state.queueItem.enable_feature
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3249" /> }>
                                                <span>{ formatMessage({id: "LANG3248"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('alertinfo', {
                                        rules: [],
                                        initialValue: this.state.queueItem.alertinfo
                                    })(
                                        <Select>
                                            <Option value="">{ formatMessage({id: "LANG133"}) }</Option>
                                            <Option value="ring1">Ring 1</Option>
                                            <Option value="ring2">Ring 2</Option>
                                            <Option value="ring3">Ring 3</Option>
                                            <Option value="ring4">Ring 4</Option>
                                            <Option value="ring5">Ring 5</Option>
                                            <Option value="ring6">Ring 6</Option>
                                            <Option value="ring7">Ring 7</Option>
                                            <Option value="ring8">Ring 8</Option>
                                            <Option value="ring9">Ring 9</Option>
                                            <Option value="ring10">Ring 10</Option>
                                            <Option value="Bellcore-dr1">Bellcore-dr1</Option>
                                            <Option value="Bellcore-dr2">Bellcore-dr2</Option>
                                            <Option value="Bellcore-dr3">Bellcore-dr3</Option>
                                            <Option value="Bellcore-dr4">Bellcore-dr4</Option>
                                            <Option value="Bellcore-dr5">Bellcore-dr5</Option>
                                            <Option value="custom">{ formatMessage({id: "LANG231"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3250" /> }>
                                                <span>{ formatMessage({id: "LANG3250"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('custom_alert_info', {
                                        rules: [],
                                        initialValue: this.state.queueItem.custom_alert_info
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG143"}) }</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 24 }>
                                <FormItem
                                    { ...formItemTransferLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1191" /> }>
                                                <span>{ formatMessage({id: "LANG1191"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <Transfer
                                        showSearch
                                        render={ this._renderItem }
                                        targetKeys={ this.state.targetKeys }
                                        dataSource={ this.state.accountList }
                                        onChange={ this._handleTransferChange }
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
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(QueueItem))