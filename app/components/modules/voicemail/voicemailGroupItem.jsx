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

class VoicemailGroupItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetKeys: [],
            voicemailList: [],
            vmGroupNameList: [],
            vmGroupValues: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getVoicemailList()
        this._getVMgroupNameList()
        this._getVMgroup()
    }

    _getVoicemailList = () => {
        const { formatMessage } = this.props.intl
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getVoicemailList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const disabled = formatMessage({id: "LANG273"})
                    let voicemailList = []
                    let extension = response.extension || []

                    voicemailList = extension.map(function(item) {
                        return {
                                key: item.extension,
                                out_of_service: item.out_of_service,
                                title: (item.extension +
                                        (item.fullname ? ' "' + item.fullname + '"' : '') +
                                        (item.out_of_service === 'yes' ? ' <' + disabled + '>' : ''))
                            }
                    })
                    this.setState({
                        voicemailList: voicemailList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getVMgroupNameList = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getVMgroupNameList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    let vmGroupNameList = response.vmgroup_name || []
                    this.setState({
                        vmGroupNameList: vmGroupNameList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getVMgroup = () => {
        const vmGroup = this.props.params.id
        const isCheckVMGroup = this.props.params.id ? true : false
        if (isCheckVMGroup) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getVMgroup',
                    vmgroup: vmGroup
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        let vmGroupValues = response.vmgroup || {}

                        let targetKeys = vmGroupValues.members ? vmGroupValues.members.split(',') : []
                        this.setState({
                            vmGroupValues: vmGroupValues,
                            targetKeys: targetKeys
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/voicemail/2')
    }

    _handleSubmit = () => {
        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const vmGroupIndex = this.props.params.id
        const vmGroupName = this.props.params.name

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
                action.members = this.state.targetKeys.join()
                if (vmGroupIndex && vmGroupName) {
                    action.action = 'updateVMgroup'
                    action.vmgroup = values.extension
                } else {
                    action.action = 'addVMgroup'
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

    _checkNumber = (rule, value, callback) => {
        const { formatMessage } = this.props.intl
        const isCheckNumber = this.props.params.id ? false : true

        if (isCheckNumber) {
            if (value && _.indexOf(this.state.numberList, value) > -1) {
                callback(formatMessage({id: "LANG2126"}))
            } else {
                callback()
            }
        } else {
            callback()
        }
    }

    _checkName = (rule, value, callback) => {
        const { formatMessage } = this.props.intl
        const isCheckName = this.props.params.id ? false : true

        if (isCheckName) {
            if (value && _.indexOf(this.state.vmGroupNameList, value) > -1) {
                callback(formatMessage({id: "LANG2143"}))
            } else {
                callback()
            }
        } else {
            callback()
        }
    }

    _renderItem = (item) => {
        const customLabel = (
                <span>
                    { item.title }
                </span>
            )

        return {
                label: customLabel,  // for displayed item
                value: item.title   // for title and filter matching
            }
    }

    _handleTransferChange = (targetKeys, direction, moveKeys) => {
        this.setState({
            targetKeys: targetKeys
        })

        console.log('targetKeys extension: ', targetKeys)
        console.log('direction extension: ', direction)
        console.log('moveKeys extension: ', moveKeys)
    }

    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        // this.setState({ targetContactKeys: nextTargetKeys })
        console.log('sourceSelectedKeys: ', sourceSelectedKeys)
        console.log('targetSelectedKeys: ', targetSelectedKeys)
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const vmGroupValues = this.state.vmGroupValues

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
                    0: formatMessage({id: "LANG21"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG772"}))

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
                                <Tooltip title={<FormattedHTMLMessage id="LANG1569" />}>
                                    <span>{ formatMessage({id: "LANG85"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('extension', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.digits(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: this._checkNumber
                                }],
                                initialValue: vmGroupValues.extension ? vmGroupValues.extension : ''
                            })(
                                <Input disabled={ false } placeholder={ formatMessage({id: "LANG85"}) } maxLength="25" />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_vmgroup_name"
                            { ...formItemLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG135"}) }</span>
                            )}
                        >
                            { getFieldDecorator('vmgroup_name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.minlength(data, value, callback, formatMessage, 2)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: this._checkName
                                }],
                                initialValue: vmGroupValues.vmgroup_name ? vmGroupValues.vmgroup_name : ''
                            })(
                                <Input placeholder={ formatMessage({id: "LANG135"}) } maxLength="25" />
                            ) }
                        </FormItem>

                        <FormItem
                            ref="div_vmsecret"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1080" />}>
                                    <span>{ formatMessage({id: "LANG1079"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('vmsecret', {
                                rules: [],
                                initialValue: vmGroupValues.vmsecret ? vmGroupValues.vmsecret : ''
                            })(
                                <Input placeholder={ formatMessage({id: "LANG1079"}) } maxLength="25" />
                            ) }
                        </FormItem>

                        <FormItem
                            ref="div_email"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1082" />}>
                                    <span>{ formatMessage({id: "LANG1081"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('email', {
                                rules: [],
                                initialValue: vmGroupValues.email ? vmGroupValues.email : ''
                            })(
                                <Input placeholder={ formatMessage({id: "LANG1081"}) } maxLength="25" />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemTransferLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG2032"}) }</span>
                            )}
                        >
                            <Transfer
                                showSearch
                                render={ this._renderItem }
                                targetKeys={ this.state.targetKeys }
                                dataSource={ this.state.voicemailList }
                                onChange={ this._handleTransferChange }
                                filterOption={ this._filterTransferOption }
                                notFoundContent={ formatMessage({id: "LANG133"}) }
                                onSelectChange={ this._handleTransferSelectChange }
                                searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                titles={[formatMessage({id: "LANG1567"}), formatMessage({id: "LANG1568"})]}
                            />
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(VoicemailGroupItem))