'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Input, message, Popover, Select, Transfer } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item
const Option = Select.Option

class SLAStationItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetKeys: [],
            accountList: [],
            slaStationItem: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkName = (rule, value, callback) => {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const len = form.getFieldValue('gs_jblen')

        if (value && len && value < len) {
            callback(formatMessage({id: "LANG2142"}, { 0: formatMessage({id: "LANG1655"}), 1: formatMessage({id: "LANG2460"}) }))
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
        let slaStationItem = {}
        const { formatMessage } = this.props.intl
        const slaStationId = this.props.params.id

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getAccountList' },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    accountList = response.extension || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        if (slaStationId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getSLAStation',
                    sla_station: slaStationId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        slaStationItem = res.response.sla_station || {}
                        targetKeys = slaStationItem.trunks.split(',') || []
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            targetKeys: targetKeys,
            accountList: accountList,
            slaStationItem: slaStationItem
        })
    }
    _handleCancel = () => {
        browserHistory.push('/extension-trunk/slaStation')
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

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const slaStationId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG128"}).toLowerCase()
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

                if (slaStationId) {
                    action.action = 'updateExtensionGroup'
                    action.extension_group = slaStationId
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
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG3227"}, {
                    0: this.props.params.name
                })
                : formatMessage({id: "LANG3226"}))

        const slaStationItem = this.state.slaStationItem || {}
        const station_name = slaStationItem.station_name
        const station = slaStationItem.station
        const ringtimeout = slaStationItem.ringtimeout
        const ringdelay = slaStationItem.ringdelay
        const holdaccess = slaStationItem.holdaccess

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
                            { ...formItemLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG3228"}) }</span>
                            )}
                        >
                            { getFieldDecorator('station_name', {
                                rules: [
                                    { required: true, message: formatMessage({id: "LANG2150"}) },
                                    { validator: this._checkName }
                                ],
                                initialValue: station_name
                            })(
                                <Input placeholder={ formatMessage({id: "LANG3228"}) } />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG3229"}) }
                                        content={ formatMessage({id: "LANG3237"}) }
                                    >
                                            <span>{ formatMessage({id: "LANG3229"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('station', {
                                initialValue: station
                            })(
                                <Select>
                                    {
                                        this.state.accountList.map(function(item) {
                                            return <Option
                                                    key={ item.extension }
                                                    value={ item.extension }
                                                    disabled={ item.out_of_service === 'yes' }>
                                                    { item.extension + (item.fullname ? ' "' + item.fullname + '"' : '') }
                                                </Option>
                                            }
                                        ) 
                                    }
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemTransferLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG3230"}) }</span>
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
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG1598"}) }
                                        content={ formatMessage({id: "LANG3234"}) }
                                    >
                                        <span>{ formatMessage({id: "LANG1598"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('ringtimeout', {
                                rules: [
                                    { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                                ],
                                initialValue: ringtimeout
                            })(
                                <Input min={ 0 } max={ 300 } />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG3235"}) }
                                        content={ formatMessage({id: "LANG3236"}) }
                                    >
                                        <span>{ formatMessage({id: "LANG3235"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('ringdelay', {
                                rules: [
                                    { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                                ],
                                initialValue: ringdelay
                            })(
                                <Input min={ 0 } max={ 300 } />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG3222"}) }
                                        content={ formatMessage({id: "LANG3243"}) }
                                    >
                                            <span>{ formatMessage({id: "LANG3222"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('holdaccess', {
                                initialValue: holdaccess
                            })(
                                <Select>
                                    <Option key="open" value="open">{ "Open" }</Option>
                                    <Option key="private" value="private">{ "Private" }</Option>
                                </Select>
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(SLAStationItem))