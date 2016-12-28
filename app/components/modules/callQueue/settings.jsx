'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Input, message, Popover, Transfer } from 'antd'

const FormItem = Form.Item

class AgentLoginSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetKeys: [],
            accountList: [],
            groupNameList: [],
            agentLoginSettings: {}
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
                const response = res.response || {}

                groupNameList = response.group_name || []
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
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
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
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
                    const response = res.response || {}

                    extensionGroup = res.response.extension_group || {}
                    targetKeys = extensionGroup.members.split(',') || []
                }.bind(this),
                error: function(e) {
                    message.error(e.toString())
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
            extensionGroupItem: extensionGroup
        })
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/callQueue')
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
                        message.error(e.toString())
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

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
    render() {
        const { formatMessage } = this.props.intl
        const title = formatMessage({id: "LANG748"})
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const agentLoginSettings = this.state.agentLoginSettings || {}
        const queuelogin = agentLoginSettings.queuelogin
        const queuelogout = agentLoginSettings.queuelogout

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
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG1192"}) }
                                        content={ formatMessage({id: "LANG1193"}) }
                                    >
                                        <span>{ formatMessage({id: "LANG1192"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('queuelogin', {
                                rules: [
                                    { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) }
                                ],
                                initialValue: queuelogin
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG1194"}) }
                                        content={ formatMessage({id: "LANG1195"}) }
                                    >
                                        <span>{ formatMessage({id: "LANG1194"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('queuelogout', {
                                rules: [
                                    { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) }
                                ],
                                initialValue: queuelogout
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    { formatMessage({id: "LANG261"}) }
                                </span>
                            )}
                        >
                            <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG1196" })}}></span>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(AgentLoginSettings))