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
import { Form, Input, message, Transfer } from 'antd'

const FormItem = Form.Item

class ExtensionGroupItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetKeys: [],
            accountList: [],
            groupNameList: [],
            extensionGroupItem: {}
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
        browserHistory.push('/extension-trunk/extensionGroup')
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
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG2714"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG2706"}))

        const extensionGroupItem = this.state.extensionGroupItem || {}
        const name = extensionGroupItem.group_name

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
                                <span>{ formatMessage({id: "LANG135"}) }</span>
                            )}
                        >
                            { getFieldDecorator('group_name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.minlength(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                    }
                                }],
                                initialValue: name
                            })(
                                <Input placeholder={ formatMessage({id: "LANG135"}) } />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemTransferLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG128"}) }</span>
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
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(ExtensionGroupItem))