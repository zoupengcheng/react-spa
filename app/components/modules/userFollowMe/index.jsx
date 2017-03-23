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
import { Button, Checkbox, Col, Form, Input, Icon, message, Radio, Row, Select, Table, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

class FollowMe extends Component {
    constructor(props) {
        super(props)

        this.state = {
            followmeItem: {},
            member_type: 'local',
            memberAccountList: [],
            destination_value: '',
            enable_destination: false,
            destination_type: 'account',
            mohNameList: ['default', 'ringbacktone_default'],
            followmeMembers: [{
                'key': 0,
                'ringtime': '30',
                'number': ['1001', '1005']
            }, {
                'key': 1,
                'ringtime': '30',
                'number': ['1001']
            }, {
                'key': 2,
                'ringtime': '30',
                'number': ['123456']
            }],
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
    _createNumber = (text, record, index) => {
        let number
        const { formatMessage } = this.props.intl

        number = <div style={{ 'paddingLeft': '10px', 'textAlign': 'left' }}>
                    <span>{ record.number.join(' & ') }</span>
                    <span style={{ 'padding': '0 5px' }}>{ formatMessage({id: "LANG569"}) }</span>
                    <Input style={{ 'width': '50px' }} value={ record.ringtime } onChange={ this._onChangeRingtime.bind(this, record.key) } />
                    <span style={{ 'padding': '0 5px' }}>{ formatMessage({id: "LANG570"}) }</span>
                </div>

        return number
    }
    _createOption = (text, record, index) => {
        const { formatMessage } = this.props.intl

        return <div>
                <span
                    className="sprite sprite-del"
                    onClick={ this._delete.bind(this, record.key) }>
                </span>
            </div>
    }
    _delete = (key) => {
        let followmeMembers = _.clone(this.state.followmeMembers)

        followmeMembers = _.filter(followmeMembers, (data) => { return data.key !== key })

        this.setState({
            followmeMembers: followmeMembers
        })
    }
    _getInitData = () => {
        const form = this.props.form
        const { formatMessage } = this.props.intl

        const Disabled = formatMessage({id: "LANG273"})
        const currentEditId = localStorage.getItem('username')

        let mohNameList = []
        let followmeItem = {}
        let memberAccountList = []
        let destination_value = ''
        let enable_destination = false
        let destination_type = 'account'
        let destinationListDataSource = {}
        let extenion = form.getFieldValue('extension')

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
                                    (item.out_of_service === 'yes' ? ' <' + Disabled + '>' : ''))
                        }
                })

        memberAccountList = _.filter(account, (data) => { return data.value !== extenion })

        voicemail = voicemail.map(function(item) {
                    return {
                            key: item.extension,
                            value: item.extension,
                            out_of_service: item.out_of_service,
                            // disabled: (item.out_of_service === 'yes'),
                            label: (item.extension +
                                    (item.fullname ? ' "' + item.fullname + '"' : '') +
                                    (item.out_of_service === 'yes' ? ' <' + Disabled + '>' : ''))
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

        if (currentEditId) {
            $.ajax({
                async: false,
                type: 'json',
                method: 'post',
                url: api.apiHost,
                data: {
                    action: 'getFollowme',
                    followme: currentEditId
                },
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        const followme = res.response.followme || {}

                        _.map(followme, (value, key) => {
                            if (value === null) {
                                followmeItem['' + key] = ''
                            } else {
                                followmeItem['' + key] = value
                            }
                        })

                        destination_type = followme.destination_type
                        enable_destination = followme.enable_destination === 'yes'

                        if (destination_type === 'voicemail') {
                            destination_value = followme['vm_extension']
                        } else if (destination_type === 'queue') {
                            destination_value = followme['queue_dest']
                        } else {
                            destination_value = followme[destination_type]
                        }
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            followmeItem: followmeItem,
            memberAccountList: memberAccountList,
            destination_value: destination_value,
            enable_destination: enable_destination,
            destinationListDataSource: destinationListDataSource,
            destination_type: destination_type.replace(/_t/g, ''),
            mohNameList: mohNameList ? mohNameList : ['default', 'ringbacktone_default']
        })
    }
    _handleCancel = () => {
        browserHistory.push('/user-personal-data/userFollowMe')
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
    _onChangeDesType = (value) => {
        this.setState({
            destination_type: value
        })
    }
    _onChangeEnableDes = (e) => {
        this.setState({
            enable_destination: e.target.checked
        })
    }
    _onChangeMemberType = (e) => {
        this.setState({
            member_type: e.target.value
        })
    }
    _onChangeRingtime = (key, event) => {
        let followmeMembers = _.clone(this.state.followmeMembers)

        followmeMembers[key].ringtime = event.target.value

        this.setState({
            followmeMembers: followmeMembers
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
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, getFieldValue } = this.props.form

        const settings = this.state.followmeItem || {}

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const formItemLayoutRow = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        const radioStyle = {
            height: "30px",
            display: "block",
            lineHeight: "30px"
        }

        const columns = [{
                sorter: true,
                key: 'number',
                dataIndex: 'number',
                title: formatMessage({id: "LANG85"}),
                render: (text, record, index) => (
                    this._createNumber(text, record, index)
                )
            }, { 
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => (
                    this._createOption(text, record, index)
                ) 
            }]

        const title = formatMessage({id: "LANG710"})

        document.title = formatMessage({id: "LANG584"}, {
                    0: formatMessage({id: "LANG82"}),
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
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1980" /> }>
                                                <span>{ formatMessage({id: "LANG274"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('enable_followme', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: settings.enable_followme === 'yes'
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4043" /> }>
                                                <span>{ formatMessage({id: "LANG1142"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('bypass_outrt_auth', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: settings.bypass_outrt_auth === 'yes'
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1977" /> }>
                                                <span>{ formatMessage({id: "LANG1976"}) }</span>
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4092" /> }>
                                                <span>{ formatMessage({id: "LANG4091"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('enable_option', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: settings.enable_option === 'yes'
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2990" /> }>
                                                <span>{ formatMessage({id: "LANG2990"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('enable_destination', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: this.state.enable_destination
                                    })(
                                        <Checkbox onChange={ this._onChangeEnableDes } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 24 }>
                                <Col span={ 12 }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={(
                                            <span>
                                                <Tooltip title={ <FormattedHTMLMessage id="LANG4276" /> }>
                                                    <span>{ formatMessage({id: "LANG1558"}) }</span>
                                                </Tooltip>
                                            </span>
                                        )}
                                    >
                                        { getFieldDecorator('destination_type', {
                                            rules: [],
                                            initialValue: this.state.destination_type
                                        })(
                                            <Select
                                                onChange={ this._onChangeDesType }
                                                disabled={ !this.state.enable_destination }
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
                                    className={ this.state.destination_type !== 'external_number' && this.state.destination_type !== 'hangup'
                                                    ? 'display-block'
                                                    : 'hidden' }
                                >
                                    <FormItem>
                                        { getFieldDecorator('destination_value', {
                                            rules: [
                                                this.state.enable_destination &&
                                                this.state.destination_type !== 'hangup' &&
                                                this.state.destination_type !== 'external_number'
                                                    ? {
                                                            required: true,
                                                            message: formatMessage({id: "LANG2150"})
                                                        }
                                                    : {}
                                            ],
                                            initialValue: this.state.destination_value
                                        })(
                                            <Select disabled={ !this.state.enable_destination }>
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
                                                this.state.enable_destination &&
                                                this.state.destination_type === 'external_number'
                                                    ? {
                                                            required: true,
                                                            message: formatMessage({id: "LANG2150"})
                                                        }
                                                    : {}
                                            ],
                                            initialValue: settings.external_number
                                        })(
                                            <Input disabled={ !this.state.enable_destination } />
                                        ) }
                                    </FormItem>
                                </Col>
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG711"}) }</span>
                                </div>
                            </Col>
                            <Col
                                span={ 24 }
                            >
                                <FormItem
                                    { ...formItemLayoutRow }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1979" /> }>
                                                <span>{ formatMessage({id: "LANG1978"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('member_type', {
                                        initialValue: this.state.member_type
                                    })(
                                        <RadioGroup onChange={ this._onChangeMemberType }>
                                            <Radio value="local">{ formatMessage({id: "LANG1981"}) }</Radio>
                                            <Radio value="external">{ formatMessage({id: "LANG1982"}) }</Radio>
                                        </RadioGroup>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 24 }
                            >
                                <Col
                                    span={ 4 }
                                    offset={ 4 }
                                    className={ this.state.member_type === 'local' ? 'display-block' : 'hidden' }
                                >
                                    <FormItem>
                                        { getFieldDecorator('member_local', {
                                            rules: [],
                                            initialValue: settings.queue_chairman
                                        })(
                                            <Select>
                                                {
                                                    this.state.memberAccountList.map(function(obj) {
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
                                    span={ 4 }
                                    offset={ 4 }
                                    className={ this.state.member_type === 'external' ? 'display-block' : 'hidden' }
                                >
                                    <FormItem>
                                        { getFieldDecorator('member_external', {
                                            rules: [],
                                            initialValue: ''
                                        })(
                                            <Input />
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col
                                    span={ 4 }
                                >
                                    <FormItem>
                                        <span style={{ 'padding': '0 5px' }}>{ formatMessage({id: "LANG569"}) }</span>
                                        { getFieldDecorator('member_ringtime', {
                                            rules: [],
                                            initialValue: '30'
                                        })(
                                            <Input style={{ 'width': '50px' }} />
                                        ) }
                                        <span style={{ 'padding': '0 5px' }}>{ formatMessage({id: "LANG570"}) }</span>
                                    </FormItem>
                                </Col>
                            </Col>
                            <Col
                                span={ 24 }
                            >
                                <FormItem
                                    { ...formItemLayoutRow }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1975" /> }>
                                                <span>{ formatMessage({id: "LANG1974"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('member_order', {
                                        initialValue: 'after'
                                    })(
                                        <RadioGroup>
                                            <Radio value="after">{ formatMessage({id: "LANG1983"}) }</Radio>
                                            <Radio value="alongWith">{ formatMessage({id: "LANG1984"}) }</Radio>
                                        </RadioGroup>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 24 } style={{ 'padding': '10px 0' }}>
                                <Col
                                    span={ 4 }
                                    offset={ 4 }
                                >
                                    <Button
                                        icon="plus"
                                        type="primary"
                                        onClick={ this._addMembers }
                                    >
                                        { formatMessage({id: "LANG769"}) }
                                    </Button>
                                </Col>
                            </Col>
                            <Col span={ 24 } style={{ 'margin': '10px 0 0 0' }}>
                                <Table
                                    rowKey="key"
                                    columns={ columns }
                                    pagination={ false }
                                    showHeader={ false }
                                    dataSource={ this.state.followmeMembers }
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(FollowMe))