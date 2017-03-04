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
import { Checkbox, Col, Form, Input, message, Row, Select, Tabs, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane

class QueueItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queueItem: {},
            memberList: [],
            targetKeys: [],
            queueRange: [],
            numberList: [],
            destination_value: '',
            destination_type: 'account',
            destinationListDataSource: {
                'account': [],
                'voicemail': [],
                'queue': [],
                'ringgroup': [],
                'vmgroup': [],
                'ivr': [],
                'external_number': []
            }
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
    _generateNewExt = () => {
        let queueRange = this.state.queueRange
        let numberList = this.state.numberList

        let i = queueRange[0]
        let endExt = queueRange[1]

        for (i; i <= endExt; i++) {
            if (numberList.indexOf(i.toString()) === -1) {
                return i
            }
        }
    }
    _getInitData = () => {
        let queueItem = {}
        let targetKeys = []
        let memberList = []
        let extgroupList = []
        let destination_type = 'account'
        let destinationListDataSource = {}

        const queueId = this.props.params.id
        const { formatMessage } = this.props.intl
        const disabled = formatMessage({id: "LANG273"})

        let queueRange = UCMGUI.isExist.getRange('queue', formatMessage)
        let numberList = UCMGUI.isExist.getList('getNumberList', formatMessage)
        let account = UCMGUI.isExist.getList('getAccountList', formatMessage)
        let voicemail = UCMGUI.isExist.getList('getVoicemailList', formatMessage)
        let queue = UCMGUI.isExist.getList('getQueueList', formatMessage)
        let ringgroup = UCMGUI.isExist.getList('getRinggroupList', formatMessage)
        let vmgroup = UCMGUI.isExist.getList('getVMgroupList', formatMessage)
        let ivr = UCMGUI.isExist.getList('getIVRList', formatMessage)

        account = account.map(function(item) {
                    return {
                            key: item.extension,
                            value: item.extension,
                            out_of_service: item.out_of_service,
                            // disabled: (item.out_of_service === 'yes'),
                            label: (item.extension +
                                    (item.fullname ? ' "' + item.fullname + '"' : '') +
                                    (item.out_of_service === 'yes' ? ' <' + disabled + '>' : ''))
                        }
                })

        voicemail = voicemail.map(function(item) {
                    return {
                            key: item.extension,
                            value: item.extension,
                            out_of_service: item.out_of_service,
                            // disabled: (item.out_of_service === 'yes'),
                            label: (item.extension +
                                    (item.fullname ? ' "' + item.fullname + '"' : '') +
                                    (item.out_of_service === 'yes' ? ' <' + disabled + '>' : ''))
                        }
                })

        queue = queue.map(function(item) {
                    return {
                            key: item.extension,
                            value: item.extension,
                            label: item.queue_name
                        }
                })

        ringgroup = ringgroup.map(function(item) {
                    return {
                            key: item.extension,
                            value: item.extension,
                            label: item.ringgroup_name
                        }
                })

        vmgroup = vmgroup.map(function(item) {
                    return {
                            key: item.extension,
                            value: item.extension,
                            label: item.vmgroup_name
                        }
                })

        ivr = ivr.map(function(item) {
                    return {
                            key: item.ivr_id,
                            value: item.ivr_id,
                            label: item.ivr_name
                        }
                })

        memberList = _.clone(account)

        destinationListDataSource = {
            account: account,
            voicemail: voicemail,
            queue: queue,
            ringgroup: ringgroup,
            vmgroup: vmgroup,
            ivr: ivr,
            external_number: []
        }

        $.ajax({
            type: 'json',
            async: false,
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getExtensionGroupList'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    let response = res.response || {}
                    const extgroupLabel = formatMessage({id: "LANG2714"})

                    extgroupList = response.extension_groups || []

                    _.map(extgroupList, (item) => {
                        memberList.push({
                                key: item.group_id,
                                value: item.group_id,
                                label: extgroupLabel + " -- " + item.group_name
                            })
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        if (queueId) {
            $.ajax({
                async: false,
                type: 'json',
                method: 'post',
                url: api.apiHost,
                data: {
                    queue: queueId,
                    action: 'getQueue'
                },
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        queueItem = res.response.queue || {}

                        _.map(queueItem, (value, key) => {
                            if (value === null) {
                                queueItem[key] = ''
                            } else {
                                queueItem[key] = value
                            }
                        })

                        destination_type = queueItem.destination_type
                        targetKeys = queueItem.members ? queueItem.members.split(',') : []
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            queueItem: queueItem,
            memberList: memberList,
            queueRange: queueRange,
            numberList: numberList,
            targetKeys: targetKeys,
            destination_type: destination_type,
            destinationListDataSource: destinationListDataSource
        })
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/callQueue')
    }
    _handleTransferChange = (targetKeys, direction, moveKeys) => {
        this.setState({
            targetKeys: targetKeys
        })

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

        const form = this.props.form
        const queueId = this.props.params.id
        const { formatMessage } = this.props.intl
        const getFieldInstance = form.getFieldInstance

        let loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        let successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                let action = {}

                if (this.props.params.id) {
                    action.queue = queueId
                    action.action = 'updateQueue'
                } else {
                    action.action = 'addQueue'
                }

                _.map(values, function(value, key) {
                    let fieldInstance = getFieldInstance(key)

                    if (key === 'destination_value' || key === 'custom_alert_info') {
                        return false
                    }

                    action[key] = (value !== undefined ? UCMGUI.transCheckboxVal(value) : '')
                })

                action.musicclass = 'default'
                action.members = this.state.targetKeys.join(',')

                // console.log('Received values of form: ', action)
                // console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                $.ajax({
                    data: action,
                    type: 'json',
                    method: "post",
                    url: api.apiHost,
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage, 2)

                            this._handleCancel()
                        }
                    }.bind(this)
                })
            }
        })
    }
    _onChangeDesType = (value) => {
        this.setState({
            destination_type: value
        })
    }
    _renderItem = (item) => {
        const customLabel = (
                <span className={ item.out_of_service === 'yes' ? 'out-of-service' : '' }>
                    { item.label }
                </span>
            )

        return {
                label: customLabel,  // for displayed item
                value: item.value   // for title and filter matching
            }
    }
    render() {
        const settings = this.state.queueItem
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        const formItemRowLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 }
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
                <Form className="form-contain-tab">
                    <Tabs defaultActiveKey="1" onChange={ this._onChangeTabs }>
                        <TabPane tab={ formatMessage({id: "LANG2217"}) } key="1">
                            <div className="content">
                                <div className="ant-form">
                                    <Row>
                                        <Col span={ 24 }>
                                            <div className="section-title">
                                                <span>{ formatMessage({id: "LANG3"}) }</span>
                                            </div>
                                        </Col>
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
                                                    initialValue: this.props.params.id ? this.props.params.id : this._generateNewExt()
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1180" /> }>
                                                            <span>{ formatMessage({id: "LANG135"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('queue_name', {
                                                    rules: [{
                                                        required: true,
                                                        message: formatMessage({id: "LANG2150"})
                                                    }],
                                                    initialValue: settings.queue_name
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1183" /> }>
                                                            <span>{ formatMessage({id: "LANG132"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('strategy', {
                                                    rules: [],
                                                    initialValue: settings.strategy ? settings.strategy : 'ringall'
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
                                                    initialValue: settings.musicclass
                                                })(
                                                    <Select></Select>
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
                                                    initialValue: settings.maxlen ? settings.maxlen : 0
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1188" /> }>
                                                            <span>{ formatMessage({id: "LANG1189"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('wrapuptime', {
                                                    rules: [],
                                                    initialValue: settings.wrapuptime ? settings.wrapuptime : 15
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4798" /> }>
                                                            <span>{ formatMessage({id: "LANG4797"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('retry', {
                                                    rules: [],
                                                    initialValue: settings.retry ? settings.retry : 5
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2544" /> }>
                                                            <span>{ formatMessage({id: "LANG2543"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('auto_record', {
                                                    rules: [],
                                                    valuePropName: 'checked',
                                                    initialValue: settings.auto_record === 'yes'
                                                })(
                                                    <Checkbox />
                                                ) }
                                            </FormItem>
                                        </Col>
                                        <Col span={ 24 }>
                                            <div className="section-title">
                                                <span>{ formatMessage({id: "LANG1186"}) }</span>
                                            </div>
                                        </Col>
                                        <Col span={ 24 }>
                                            <FormItem
                                                { ...formItemRowLayout }
                                                label={(
                                                    <span>
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1187" /> }>
                                                            <span>{ formatMessage({id: "LANG1186"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('waittime', {
                                                    rules: [],
                                                    initialValue: settings.waittime
                                                })(
                                                    <Input />
                                                ) }
                                            </FormItem>
                                        </Col>
                                        <Col span={ 24 }>
                                            <Col span={ 12 }>
                                                <FormItem
                                                    { ...formItemLayout }
                                                    label={(
                                                        <span>
                                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3751" /> }>
                                                                <span>{ formatMessage({id: "LANG1535"}) }</span>
                                                            </Tooltip>
                                                        </span>
                                                    )}
                                                >
                                                    { getFieldDecorator('destination_type', {
                                                        rules: [],
                                                        initialValue: this.state.destination_type
                                                    })(
                                                        <Select onChange={ this._onChangeDesType }>
                                                            <Option value='account'>{ formatMessage({id: "LANG85"}) }</Option>
                                                            <Option value='voicemail'>{ formatMessage({id: "LANG90"}) }</Option>
                                                            <Option value='queue'>{ formatMessage({id: "LANG91"}) }</Option>
                                                            <Option value='ringgroup'>{ formatMessage({id: "LANG600"}) }</Option>
                                                            <Option value='vmgroup'>{ formatMessage({id: "LANG89"}) }</Option>
                                                            <Option value='ivr'>{ formatMessage({id: "LANG19"}) }</Option>
                                                            <Option value='external_number'>{ formatMessage({id: "LANG3458"}) }</Option>
                                                        </Select>
                                                    ) }
                                                </FormItem>
                                            </Col>
                                            <Col
                                                span={ 6 }
                                                className={ this.state.destination_type !== 'external_number'
                                                                ? 'display-block'
                                                                : 'hidden' }
                                            >
                                                <FormItem>
                                                    { getFieldDecorator('destination_value', {
                                                        rules: [],
                                                        initialValue: this.state.destination_value
                                                    })(
                                                        <Select>
                                                            {
                                                                this.state.destinationListDataSource[this.state.destination_type].map(function(obj) {
                                                                        return <Option
                                                                                    key={ obj.key }
                                                                                    value={ obj.value }
                                                                                    className={ obj.out_of_service === 'yes' ? 'out-of-service' : '' }>
                                                                                    { obj.label }
                                                                                </Option>
                                                                    })
                                                            }
                                                        </Select>
                                                    ) }
                                                </FormItem>
                                            </Col>
                                            <Col
                                                span={ 6 }
                                                className={ this.state.destination_type === 'external_number'
                                                                ? 'display-block'
                                                                : 'hidden' }
                                            >
                                                <FormItem>
                                                    { getFieldDecorator('external_number', {
                                                        rules: [
                                                            this.state.destination_type === 'external_number'
                                                                ? {
                                                                        required: true,
                                                                        message: formatMessage({id: "LANG2150"})
                                                                    }
                                                                : {}
                                                        ],
                                                        initialValue: settings.external_number
                                                    })(
                                                        <Input />
                                                    ) }
                                                </FormItem>
                                            </Col>
                                        </Col>
                                        {/* <Col span={ 24 }>
                                            <div className="section-title">
                                                <span>{ formatMessage({id: "LANG4580"}) }</span>
                                            </div>
                                        </Col>
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
                                                    initialValue: settings.voice_prompt_time ? settings.voice_prompt_time : 60
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5060" /> }>
                                                            <span>{ formatMessage({id: "LANG28"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('custom_prompt', {
                                                    rules: [],
                                                    initialValue: settings.custom_prompt
                                                })(
                                                    <Select></Select>
                                                ) }
                                            </FormItem>
                                        </Col> */}
                                    </Row>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG542"}) } key="2">
                            <div className="content">
                                <div className="ant-form">
                                    <Row>
                                        <Col span={ 24 }>
                                            <div className="section-title">
                                                <span>{ formatMessage({id: "LANG5449"}) }</span>
                                            </div>
                                        </Col>
                                        <Col span={ 12 }>
                                            <FormItem
                                                { ...formItemLayout }
                                                label={(
                                                    <span>
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5309" /> }>
                                                            <span>{ formatMessage({id: "LANG5308"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('vq_switch', {
                                                    rules: [],
                                                    valuePropName: 'checked',
                                                    initialValue: settings.vq_switch === 'yes'
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5311" /> }>
                                                            <span>{ formatMessage({id: "LANG5310"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('vq_mode', {
                                                    rules: [],
                                                    initialValue: settings.vq_mode ? settings.vq_mode : 'periodic'
                                                })(
                                                    <Select>
                                                        <Option value="periodic">{ formatMessage({id: "LANG5317"}) }</Option>
                                                        <Option value="digit">{ formatMessage({id: "LANG5316"}) }</Option>
                                                    </Select>
                                                ) }
                                            </FormItem>
                                        </Col>
                                        <Col span={ 12 }>
                                            <FormItem
                                                { ...formItemLayout }
                                                label={(
                                                    <span>
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5313" /> }>
                                                            <span>{ formatMessage({id: "LANG5312"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('vq_periodic', {
                                                    rules: [],
                                                    initialValue: settings.vq_periodic ? settings.vq_periodic : 20
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5315" /> }>
                                                            <span>{ formatMessage({id: "LANG5314"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('vq_outprefix', {
                                                    rules: [],
                                                    initialValue: settings.vq_outprefix
                                                })(
                                                    <Input />
                                                ) }
                                            </FormItem>
                                        </Col>
                                        <Col span={ 24 }>
                                            <div className="section-title">
                                                <span>{ formatMessage({id: "LANG5458"}) }</span>
                                            </div>
                                        </Col>
                                        <Col span={ 12 }>
                                            <FormItem
                                                { ...formItemLayout }
                                                label={(
                                                    <span>
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5446" /> }>
                                                            <span>{ formatMessage({id: "LANG5446"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('announce_position', {
                                                    rules: [],
                                                    initialValue: settings.announce_position
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5447" /> }>
                                                            <span>{ formatMessage({id: "LANG5447"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('announce_frequency', {
                                                    rules: [],
                                                    initialValue: settings.announce_frequency ? settings.announce_frequency : 20
                                                })(
                                                    <Input />
                                                ) }
                                            </FormItem>
                                        </Col>
                                        <Col span={ 24 }>
                                            <div className="section-title">
                                                <span>CTI</span>
                                            </div>
                                        </Col>
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
                                                    initialValue: settings.queue_chairman
                                                })(
                                                    <Select>
                                                        {
                                                            this.state.destinationListDataSource.account.map(function(obj) {
                                                                    return <Option
                                                                                key={ obj.key }
                                                                                value={ obj.value }
                                                                                className={ obj.out_of_service === 'yes' ? 'out-of-service' : '' }>
                                                                                { obj.label }
                                                                            </Option>
                                                                })
                                                        }
                                                    </Select>
                                                ) }
                                            </FormItem>
                                        </Col>
                                        <Col span={ 12 }>
                                            <FormItem
                                                { ...formItemLayout }
                                                label={(
                                                    <span>
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5434" /> }>
                                                            <span>{ formatMessage({id: "LANG5434"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('enable_agent_login', {
                                                    rules: [],
                                                    valuePropName: 'checked',
                                                    initialValue: settings.enable_agent_login === 'yes'
                                                })(
                                                    <Checkbox />
                                                ) }
                                            </FormItem>
                                        </Col>
                                        <Col span={ 24 }>
                                            <div className="section-title">
                                                <span>{ formatMessage({id: "LANG629"}) }</span>
                                            </div>
                                        </Col>
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
                                                    initialValue: settings.leavewhenempty ? settings.leavewhenempty : 'strict'
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
                                                    initialValue: settings.joinempty ? settings.joinempty : 'no'
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1182" /> }>
                                                            <span>{ formatMessage({id: "LANG1181"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('reportholdtime', {
                                                    rules: [],
                                                    valuePropName: 'checked',
                                                    initialValue: settings.reportholdtime === 'yes'
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5072" /> }>
                                                            <span>{ formatMessage({id: "LANG5071"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('replace_caller_id', {
                                                    rules: [],
                                                    valuePropName: 'checked',
                                                    initialValue: settings.replace_caller_id === 'yes'
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4170" /> }>
                                                            <span>{ formatMessage({id: "LANG4169"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('enable_feature', {
                                                    rules: [],
                                                    valuePropName: 'checked',
                                                    initialValue: settings.enable_feature === 'yes'
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3249" /> }>
                                                            <span>{ formatMessage({id: "LANG3248"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('alertinfo', {
                                                    rules: [],
                                                    initialValue: settings.alertinfo ? settings.alertinfo : 'none'
                                                })(
                                                    <Select>
                                                        <Option value="none">{ formatMessage({id: "LANG133"}) }</Option>
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
                                                    initialValue: settings.custom_alert_info
                                                })(
                                                    <Input />
                                                ) }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG143"}) } key="3">
                            <div className="content">
                                <div className="ant-form">
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
                                                    dataSource={ this.state.memberList }
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
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(QueueItem))