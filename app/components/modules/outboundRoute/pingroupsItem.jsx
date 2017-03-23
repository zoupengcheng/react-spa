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

class PinGroupsItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pingroupsItem: {},
            pingroupsMembers: [],
            pingroupsNameList: []
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _createOption = (text, record, index) => {
        const { formatMessage } = this.props.intl

        return <div>
                <span
                    className="sprite sprite-del"
                    onClick={ this._delete.bind(this, record.pin) }>
                </span>
            </div>
    }
    _delete = (pin) => {
        let pingroupsMembers = _.clone(this.state.pingroupsMembers)

        pingroupsMembers = _.filter(pingroupsMembers, (data) => { return data.pin !== pin })

        this.setState({
            pingroupsMembers: pingroupsMembers
        })
    }
    _getInitData = () => {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const currentEditId = this.props.params.id

        let pingroups = []
        let currentName = []
        let pingroupsItem = {}
        let pingroupsMembers = []
        let pingroupsNameList = []

        let extensionRange = UCMGUI.isExist.getRange('', formatMessage)

        $.ajax({
            async: false,
            type: 'post',
            url: api.apiHost,
            data: {
                sord: 'asc',
                sidx: 'pin_sets_id',
                action: 'listPinSets'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    pingroups = response.pin_sets_id || []

                    _.map(pingroups, (data) => {
                        if (data.pin_sets_name) {
                            pingroupsNameList.push(data.pin_sets_name)
                        }
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        if (currentEditId) {
            $.ajax({
                async: false,
                type: 'post',
                url: api.apiHost,
                data: {
                    action: 'getPinSets',
                    pin_sets_id: currentEditId
                },
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        
                        pingroupsMembers = res.response.members || []
                        pingroupsItem = res.response.pin_sets_id || {}
                        currentName = pingroupsItem.pin_sets_name
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        pingroupsNameList = _.filter(pingroupsNameList, (value) => { return value !== currentName })

        this.setState({
            pingroupsItem: pingroupsItem,
            pingroupsMembers: pingroupsMembers,
            pingroupsNameList: pingroupsNameList
        })
    }
    _handleCancel = () => {
        browserHistory.push('/extension-trunk/outboundRoute/pingroups')
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

        const settings = this.state.pingroupsItem || {}

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }

        const formItemLayoutRow = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        const columns = [{
                key: 'pin',
                dataIndex: 'pin',
                title: formatMessage({id: "LANG4555"})
            }, {
                key: 'pin_name',
                dataIndex: 'pin_name',
                title: formatMessage({id: "LANG4556"})
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => (
                    this._createOption(text, record, index)
                )
            }]

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG4554"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG4554"})}))

        document.title = formatMessage({id: "LANG584"}, {
                    0: formatMessage({id: "LANG4554"}),
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
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG135" /> }>
                                                <span>{ formatMessage({id: "LANG135"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('pin_sets_name', {
                                        rules: [],
                                        initialValue: settings.pin_sets_name
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 24 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4559" /> }>
                                                <span>{ formatMessage({id: "LANG4559"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('record_in_cdr', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: settings.record_in_cdr === 'yes'
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG128"}) }</span>
                                </div>
                            </Col>
                            <Col
                                span={ 24 }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4555" /> }>
                                                <span>{ formatMessage({id: "LANG4555"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('pin', {
                                        rules: [],
                                        initialValue: settings.pin
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 24 }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4556" /> }>
                                                <span>{ formatMessage({id: "LANG4556"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('pin_name', {
                                        rules: [],
                                        initialValue: settings.pin_name
                                    })(
                                        <Input />
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
                                    dataSource={ this.state.pingroupsMembers }
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(PinGroupsItem))