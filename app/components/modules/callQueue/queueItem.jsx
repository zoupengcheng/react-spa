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
            vmPromptList: [],
            vq_switch: false,
            destination_value: '',
            announce_position: false,
            destination_type: 'account',
            destination_value_prompt: '',
            destination_voice_enable: false,
            destination_type_prompt: 'account',
            mohNameList: ['default', 'ringbacktone_default'],
            destinationListDataSource: {
                'account': [],
                'voicemail': [],
                'queue': [],
                'ringgroup': [],
                'vmgroup': [],
                'ivr': [],
                'external_number': [],
                'hangup': []
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
    _endsWith = (str, a) => {
        return str.length >= a.length && str.substring(str.length - a.length) === a
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
        let mohNameList = []
        let extgroupList = []
        let vmPromptList = []
        let vq_switch = false
        let destination_value = ''
        let announce_position = false
        let destination_type = 'account'
        let destination_value_prompt = ''
        let destination_voice_enable = false
        let destination_type_prompt = 'account'
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

        queue = _.filter(queue, (data) => { return data.value !== queueId })

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
            external_number: [],
            hangup: []
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

        $.ajax({
            async: false,
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getMohNameList'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    mohNameList = response.moh_name || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            async: false,
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                page: 1,
                sidx: 'd',
                sord: 'asc',
                type: 'ivr',
                action: 'listFile',
                filter: JSON.stringify({
                    'list_dir': 0,
                    'list_file': 1,
                    'file_suffix': ['mp3', 'wav', 'gsm', 'ulaw', 'alaw']
                })
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let ivr = data.response.ivr,
                        options = {
                            val: 'n',
                            text: 'n'
                        }

                    vmPromptList = this._transVoicemailPromptData(ivr, options, (arr) => {
                        for (let i = 0; i < arr.length; i++) {
                            arr[i].val = 'record/' + this._removeSuffix(arr[i].val)
                        }
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

                        vq_switch = (queueItem.vq_switch === 'yes')
                        announce_position = (queueItem.announce_position === 'yes')
                        destination_voice_enable = (queueItem.destination_voice_enable === 'yes')

                        destination_type = queueItem.destination_type_t
                        destination_type_prompt = queueItem.destination_type_v

                        if (destination_type === 'voicemail') {
                            destination_value = queueItem['vm_extension_t']
                        } else if (destination_type === 'queue') {
                            destination_value = queueItem['queue_dest_t']
                        } else {
                            destination_value = queueItem[destination_type + '_t']
                        }

                        if (destination_type_prompt === 'voicemail') {
                            destination_value_prompt = queueItem['vm_extension_v']
                        } else if (destination_type_prompt === 'queue') {
                            destination_value_prompt = queueItem['queue_dest_v']
                        } else {
                            destination_value_prompt = queueItem[destination_type_prompt + '_v']
                        }

                        targetKeys = queueItem.members ? queueItem.members.split(',') : []
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            vq_switch: vq_switch,
            queueItem: queueItem,
            memberList: memberList,
            queueRange: queueRange,
            numberList: numberList,
            targetKeys: targetKeys,
            vmPromptList: vmPromptList,
            announce_position: announce_position,
            destination_value: destination_value,
            destination_value_prompt: destination_value_prompt,
            destination_voice_enable: destination_voice_enable,
            destinationListDataSource: destinationListDataSource,
            mohNameList: mohNameList ? mohNameList : ['default', 'ringbacktone_default'],
            destination_type: destination_type ? destination_type.replace(/_t/g, '') : 'account',
            destination_type_prompt: destination_type_prompt ? destination_type_prompt.replace(/_t/g, '') : 'account'
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

                    if (key === 'destination_type' || key === 'destination_value' ||
                        key === 'destination_type_prompt' || key === 'destination_value_prompt' || key === 'custom_alert_info') {
                        return false
                    }

                    action[key] = (value !== undefined ? UCMGUI.transCheckboxVal(value) : '')
                })

                action.members = this.state.targetKeys.join(',')

                action.destination_type_t = values.destination_type
                action.destination_type_v = values.destination_type_prompt

                if (action.custom_prompt === 'none') {
                    action.custom_prompt = ''
                }

                _.map(this.state.destinationListDataSource, (data, key) => {
                    if (key === 'hangup' || key === 'external_number') {
                        return
                    }

                    if (key === values.destination_type) {
                        if (key === 'queue') {
                            action['queue_dest_t'] = values.destination_value
                        } else if (key === 'voicemail') {
                            action['vm_extension_t'] = values.destination_value
                        } else {
                            action[key + '_t'] = values.destination_value
                        }
                    } else {
                        if (key === 'queue') {
                            action['queue_dest_t'] = ''
                        } else if (key === 'voicemail') {
                            action['vm_extension_t'] = ''
                        } else {
                            action[key + '_t'] = ''
                        }
                    }

                    if (key === values.destination_type_prompt) {
                        if (key === 'queue') {
                            action['queue_dest_v'] = values.destination_value_prompt
                        } else if (key === 'voicemail') {
                            action['vm_extension_v'] = values.destination_value_prompt
                        } else {
                            action[key + '_v'] = values.destination_value_prompt
                        }
                    } else {
                        if (key === 'queue') {
                            action['queue_dest_v'] = ''
                        } else if (key === 'voicemail') {
                            action['vm_extension_v'] = ''
                        } else {
                            action[key + '_v'] = ''
                        }
                    }
                })

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
    _onChangeAnnouncePosition = (e) => {
        this.setState({
            announce_position: e.target.checked
        })
    }
    _onChangeDesType = (value) => {
        this.setState({
            destination_type: value
        })
    }
    _onChangeDesTypePrompr = (value) => {
        this.setState({
            destination_type_prompt: value
        })
    }
    _onChangeVoiceEnable = (e) => {
        this.setState({
            destination_voice_enable: e.target.checked
        })
    }
    _onChangeVQSwitch = (e) => {
        this.setState({
            vq_switch: e.target.checked
        })
    }
    _removeSuffix = (filename) => {
        let name = filename.toLocaleLowerCase(),
            file_suffix = ['.mp3', '.wav', '.gsm', '.ulaw', '.alaw']

        for (let i = 0; i < file_suffix.length; i++) {
            let num = name.lastIndexOf(file_suffix[i])

            if (num !== -1 && this._endsWith(name, file_suffix[i])) {
                filename = filename.substring(0, num)

                return filename
            }
        }
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
    _transVoicemailPromptData = (res, options, cb) => {
        let arr = [],
            val = options.val,
            text = options.text

        if ($.isArray(res)) {
            for (let i = 0; i < res.length; i++) {
                let obj = {}

                obj['val'] = res[i][val]
                obj['text'] = res[i][text]

                arr.push(obj)
            }

            if (cb && typeof cb === "function") {
                cb(arr)
            }

            return arr
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
                                                    initialValue: settings.musicclass ? settings.musicclass : 'default'
                                                })(
                                                    <Select>
                                                        {
                                                            this.state.mohNameList.map(function(value) {
                                                                return <Option
                                                                            key={ value }
                                                                            value={ value }
                                                                        >
                                                                            { value }
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
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1185" /> }>
                                                            <span>{ formatMessage({id: "LANG1184"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('ringtime', {
                                                    rules: [],
                                                    initialValue: settings.ringtime ? settings.ringtime : 5
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
                                                { getFieldDecorator('queue_timeout', {
                                                    rules: [{
                                                        validator: (data, value, callback) => {
                                                            Validator.range(data, value, callback, formatMessage, 0, 2000)
                                                        }
                                                    }],
                                                    initialValue: settings.queue_timeout
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
                                                            <Option value='hangup'>{ formatMessage({id: "LANG3007"}) }</Option>
                                                        </Select>
                                                    ) }
                                                </FormItem>
                                            </Col>
                                            <Col
                                                span={ 6 }
                                                className={ this.state.destination_type !== 'external_number' && this.state.destination_type !== 'hangup'
                                                                ? 'display-block'
                                                                : 'hidden' }
                                            >
                                                <FormItem>
                                                    { getFieldDecorator('destination_value', {
                                                        rules: [
                                                            this.state.destination_type !== 'external_number' && this.state.destination_type !== 'hangup'
                                                                ? {
                                                                        required: true,
                                                                        message: formatMessage({id: "LANG2150"})
                                                                    }
                                                                : {}
                                                        ],
                                                        initialValue: this.state.destination_value
                                                    })(
                                                        <Select>
                                                            {
                                                                this.state.destinationListDataSource[this.state.destination_type.replace(/_t/g, '')].map(function(obj) {
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
                                                    { getFieldDecorator('external_number_t', {
                                                        rules: [
                                                            this.state.destination_type === 'external_number'
                                                                ? {
                                                                        required: true,
                                                                        message: formatMessage({id: "LANG2150"})
                                                                    }
                                                                : {}
                                                        ],
                                                        initialValue: settings.external_number_t
                                                    })(
                                                        <Input />
                                                    ) }
                                                </FormItem>
                                            </Col>
                                        </Col>
                                        <Col span={ 24 }>
                                            <div className="section-title">
                                                <span>{ formatMessage({id: "LANG4580"}) }</span>
                                            </div>
                                        </Col>
                                        <Col span={ 24 }>
                                            <FormItem
                                                { ...formItemRowLayout }
                                                label={(
                                                    <span>
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG274" /> }>
                                                            <span>{ formatMessage({id: "LANG274"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('destination_voice_enable', {
                                                    rules: [],
                                                    valuePropName: 'checked',
                                                    initialValue: this.state.destination_voice_enable
                                                })(
                                                    <Checkbox onChange={ this._onChangeVoiceEnable } />
                                                ) }
                                            </FormItem>
                                        </Col>
                                        <Col span={ 24 }>
                                            <FormItem
                                                { ...formItemRowLayout }
                                                label={(
                                                    <span>
                                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4581" /> }>
                                                            <span>{ formatMessage({id: "LANG4580"}) }</span>
                                                        </Tooltip>
                                                    </span>
                                                )}
                                            >
                                                { getFieldDecorator('voice_prompt_time', {
                                                    rules: [{
                                                        validator: (data, value, callback) => {
                                                            Validator.range(data, value, callback, formatMessage, 20, 2000)
                                                        }
                                                    }],
                                                    initialValue: settings.voice_prompt_time ? settings.voice_prompt_time : 60
                                                })(
                                                    <Input disabled={ !this.state.destination_voice_enable } />
                                                ) }
                                            </FormItem>
                                        </Col>
                                        <Col span={ 24 }>
                                            <FormItem
                                                { ...formItemRowLayout }
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
                                                    initialValue: settings.custom_prompt ? settings.custom_prompt : 'none'
                                                })(
                                                    <Select disabled={ !this.state.destination_voice_enable }>
                                                        <Option value="none">{ formatMessage({id: "LANG133"}) }</Option>
                                                        {
                                                            this.state.vmPromptList.map(function(data, index) {
                                                                return <Option
                                                                            key={ data.val }
                                                                            value={ data.val }
                                                                        >
                                                                            { data.text }
                                                                        </Option>
                                                            })
                                                        }
                                                    </Select>
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
                                                    { getFieldDecorator('destination_type_prompt', {
                                                        rules: [],
                                                        initialValue: this.state.destination_type_prompt
                                                    })(
                                                        <Select
                                                            onChange={ this._onChangeDesTypePrompr }
                                                            disabled={ !this.state.destination_voice_enable }
                                                        >
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
                                                className={ this.state.destination_type_prompt !== 'external_number'
                                                                ? 'display-block'
                                                                : 'hidden' }
                                            >
                                                <FormItem>
                                                    { getFieldDecorator('destination_value_prompt', {
                                                        rules: [
                                                            this.state.destination_voice_enable &&
                                                            this.state.destination_type_prompt !== 'external_number'
                                                                ? {
                                                                        required: true,
                                                                        message: formatMessage({id: "LANG2150"})
                                                                    }
                                                                : {}
                                                        ],
                                                        initialValue: this.state.destination_value_prompt
                                                    })(
                                                        <Select disabled={ !this.state.destination_voice_enable }>
                                                            {
                                                                this.state.destinationListDataSource[this.state.destination_type_prompt.replace(/_t/g, '')].map(function(obj) {
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
                                                className={ this.state.destination_type_prompt === 'external_number'
                                                                ? 'display-block'
                                                                : 'hidden' }
                                            >
                                                <FormItem>
                                                    { getFieldDecorator('external_number_v', {
                                                        rules: [
                                                            this.state.destination_type_prompt === 'external_number'
                                                                ? {
                                                                        required: true,
                                                                        message: formatMessage({id: "LANG2150"})
                                                                    }
                                                                : {}
                                                        ],
                                                        initialValue: settings.external_number_v
                                                    })(
                                                        <Input disabled={ !this.state.destination_voice_enable } />
                                                    ) }
                                                </FormItem>
                                            </Col>
                                        </Col>
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
                                                    initialValue: this.state.vq_switch
                                                })(
                                                    <Checkbox onChange={ this._onChangeVQSwitch } />
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
                                                    <Select disabled={ !this.state.vq_switch }>
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
                                                    <Input disabled={ !this.state.vq_switch } />
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
                                                    <Input disabled={ !this.state.vq_switch } />
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
                                                    valuePropName: 'checked',
                                                    initialValue: this.state.announce_position
                                                })(
                                                    <Checkbox onChange={ this._onChangeAnnouncePosition } />
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
                                                    rules: [{
                                                        validator: (data, value, callback) => {
                                                            Validator.range(data, value, callback, formatMessage, 20, 2000)
                                                        }
                                                    }],
                                                    initialValue: settings.announce_frequency ? settings.announce_frequency : 20
                                                })(
                                                    <Input disabled={ !this.state.announce_position } />
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
                                                            this.state.destinationListDataSource['account'].map(function(obj) {
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