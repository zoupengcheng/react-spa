'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Alert, Button, Col, Checkbox, Form, Input, message, Popover, Row, Select, Transfer } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item
const Option = Select.Option

class CRM extends Component {
    constructor(props) {
        super(props)
        this.state = {
            class: {
                others: 'hidden',
                sugarcrm: 'hidden',
                salesforce: 'hidden'
            },
            transferAlert: 'hidden',
            crmSettings: {},
            contactData: [],
            targetContactKeys: []
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getCRMSettings()
    }
    _checkJBLen = (rule, value, callback) => {
        const form = this.props.form

        if (value) {
            form.validateFields(['gs_jbmax'], { force: true })
        }

        callback()
    }
    _checkJBMax = (rule, value, callback) => {
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
    _getCRMSettings = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getCRMSettings' },
            type: 'json',
            async: false,
            success: function(res) {
                const crmSettings = res.response.crm_settings || {}
                const targetContactKeys = []

                if (crmSettings.first_search) {
                    targetContactKeys.push(crmSettings.first_search)
                }

                if (crmSettings.second_search) {
                    targetContactKeys.push(crmSettings.second_search)
                }

                if (crmSettings.third_search) {
                    targetContactKeys.push(crmSettings.third_search)
                }

                this.setState({
                    crmSettings: crmSettings,
                    contactData: [{
                        key: "contacts",
                        title: formatMessage({id: "LANG5116"}, {0: formatMessage({id: "LANG5117"})})
                    }, {
                        key: "leads",
                        title: formatMessage({id: "LANG5116"}, {0: formatMessage({id: "LANG5118"})})
                    }, {
                        key: "accounts",
                        title: formatMessage({id: "LANG5116"}, {0: formatMessage({id: "LANG5119"})})
                    }],
                    targetContactKeys: targetContactKeys,
                    transferAlert: (targetContactKeys.length ? 'hidden' : 'display-block')
                })

                this._onChangeModule(crmSettings.crm_module)
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _handleCancel = () => {
        browserHistory.push('/value-added-features/crm')
    }
    _handleTransferChange = (targetContactKeys, direction, moveKeys) => {
        if (!targetContactKeys.length) {
            this.setState({
                transferAlert: 'display-block',
                targetContactKeys: targetContactKeys
            })
        } else {
            this.setState({
                transferAlert: 'hidden',
                targetContactKeys: targetContactKeys
            })
        }
        console.log('targetKeys: ', targetContactKeys)
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

        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.state.targetContactKeys.length) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values
                const targetContactKeys = this.state.targetContactKeys

                action.action = 'updateCRMSettings'
                action.first_search = this.state.targetContactKeys[0]
                action.second_search = this.state.targetContactKeys[1]
                action.third_search = this.state.targetContactKeys[2]

                if (targetContactKeys[0]) {
                    action.first_search = targetContactKeys[0]
                } else {
                    action.first_search = ''
                }

                if (targetContactKeys[1]) {
                    action.second_search = targetContactKeys[1]
                } else {
                    action.second_search = ''
                }

                if (targetContactKeys[2]) {
                    action.third_search = targetContactKeys[2]
                } else {
                    action.third_search = ''
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
                            message.success(formatMessage({ id: "LANG4764" }))
                        }
                    }.bind(this)
                })
            }
        })
    }
    _onChangeModule = (value) => {
        if (value === 'sugarcrm') {
            this.setState({
                class: {
                    others: 'display-block',
                    sugarcrm: 'display-block',
                    salesforce: 'hidden'
                }
            })
        } else if (value === 'salesforce') {
            this.setState({
                class: {
                    others: 'display-block',
                    sugarcrm: 'hidden',
                    salesforce: 'display-block'
                }
            })
        } else {
            this.setState({
                class: {
                    others: 'hidden',
                    sugarcrm: 'hidden',
                    salesforce: 'hidden'
                }
            })
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

        let crmSettings = this.state.crmSettings || {}
        let crm_module = crmSettings.crm_module
        let crm_addr = crmSettings.crm_addr
        let number_add = crmSettings.number_add
        let first_search = crmSettings.first_search
        let second_search = crmSettings.second_search
        let third_search = crmSettings.third_search

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG5110"})})

        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG5110"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <div className="content">
                    <Form>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover title={ formatMessage({id: "LANG5111"}) } content={ formatMessage({id: "LANG5111"}) }><span>{ formatMessage({id: "LANG5111"}) }</span></Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('crm_module', {
                                initialValue: crm_module
                            })(
                                <Select onChange={ this._onChangeModule }>
                                    <Option value="">{ formatMessage({id: "LANG2770"}) }</Option>
                                    <Option value="sugarcrm">SugarCRM</Option>
                                    <Option value="salesforce">Salesforce</Option>
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover title={ formatMessage({id: "LANG5112"}) } content={ formatMessage({id: "LANG5188"}) }><span>{ formatMessage({id: "LANG5112"}) }</span></Popover>
                                </span>
                            )}
                            className={ this.state.class.sugarcrm }
                        >
                            { getFieldDecorator('crm_addr', {
                                rules: [
                                    { required: true, message: formatMessage({id: "LANG2150"}) },
                                    { validator: this._checkJBMax }
                                ],
                                initialValue: crm_addr
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover title={ formatMessage({id: "LANG5115"}) } content={ formatMessage({id: "LANG5120"}) }><span>{ formatMessage({id: "LANG5115"}) }</span></Popover>
                                </span>
                            )}
                            className={ this.state.class.others }
                        >
                            { getFieldDecorator('number_add', {
                                initialValue: number_add
                            })(
                                <Select>
                                    <Option value="contacts">{ formatMessage({id: "LANG5117"}) }</Option>
                                    <Option value="leads">{ formatMessage({id: "LANG5118"}) }</Option>
                                    <Option value="accounts">{ formatMessage({id: "LANG5119"}) }</Option>
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemTransferLayout }
                            label={(
                                <span>
                                    <Popover title={ formatMessage({id: "LANG5114"}) } content={ formatMessage({id: "LANG5114"}) }><span>{ formatMessage({id: "LANG5114"}) }</span></Popover>
                                </span>
                            )}
                            className={ this.state.class.others }
                        >
                            <Row>
                                <Col span={ 8 }>
                                    <Alert type="error" message={ formatMessage({id: "LANG2168"}, {0: 1}) } className={ this.state.transferAlert } />
                                </Col>
                            </Row>
                            <Transfer
                                showSearch
                                render={ item => item.title }
                                dataSource={ this.state.contactData }
                                filterOption={ this._filterTransferOption }
                                targetKeys={ this.state.targetContactKeys }
                                onChange={ this._handleTransferChange }
                                onSelectChange={ this._handleTransferSelectChange }
                                searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                notFoundContent={ formatMessage({id: "LANG133"}) }
                                titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                            />
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(CRM))