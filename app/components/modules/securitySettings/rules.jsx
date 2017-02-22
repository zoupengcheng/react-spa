'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Tooltip, Button, message, Modal, Select, Table, Tag, Form, Row, Col, Input, InputNumber } from 'antd'

const confirm = Modal.confirm
const FormItem = Form.Item
const Option = Select.Option

class Rules extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rule_name: {},
            nameList: [],
            interfaceList: [],
            netMethod: '1'
        }
    }
    componentDidMount() {
        this._getInitDate()
    }
    _getInitDate = () => {
        const { formatMessage } = this.props.intl
        const name = this.props.params.name
        let rule_name = this.state.rule_name
        let nameList = this.state.nameList || []
        let interfaceList = this.state.interfaceList || []
        let netMethod = this.state.netMethod
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getNetworkSettings',
                method: '',
                port: ''
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const networkSettings = response.network_settings || []
                    netMethod = networkSettings.method
                    if (netMethod === '0') {
                        interfaceList.push({
                            text: 'LAN',
                            val: 'LAN'
                        })
                    } else if (netMethod === '1') {
                        interfaceList.push({
                            text: 'WAN',
                            val: 'WAN'
                        }, {
                            text: 'LAN',
                            val: 'LAN'
                        }, {
                            text: formatMessage({id: "LANG1959"}),
                            val: 'Both'
                        })
                    } else if (netMethod === '2') {
                        interfaceList.push({
                            text: 'LAN1',
                            val: 'LAN1'
                        }, {
                            text: 'LAN2',
                            val: 'LAN2'
                        }, {
                            text: formatMessage({id: "LANG1959"}),
                            val: 'Both'
                        })
                    }
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
                action: 'listStaticDefense',
                options: 'rule_name'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const tmpList = response.rule_name || []
                    tmpList.map(function(item) {
                        nameList.push(item.rule_name)
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        if (name) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getStaticDefense',
                    rule_name: name
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        rule_name = response.rule_name || {}
                        nameList = _.without(nameList, name)
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            rule_name: rule_name,
            nameList: nameList,
            interfaceList: interfaceList
        })
    }
    _checkName = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && _.indexOf(this.state.nameList, value) > -1) {
            callback(formatMessage({id: "LANG2137"}))
        } else {
            callback()
        }
    }
    _handleCancel = () => {
        browserHistory.push('/system-settings/securitySettings')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const ID = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = _.clone(values)
                if (ID) {
                    action.sequence = parseInt(ID)
                    action.action = 'updateStaticDefense'
                } else {
                    action.sequence = this.state.nameList.length + 1
                    action.action = 'addStaticDefense'
                }
                let net_interface = 'LAN'
                if (this.state.netMethod === '0') {
                    net_interface = 'WAN'
                } else if (this.state.netMethod === '1') {
                    net_interface = 'LAN'
                } else if (this.state.netMethod === '2') {
                    net_interface = 'LAN1'
                } 
                action.source_addr = values.source_addr.split('/')[0]
                action.source_sub = values.source_addr.split('/')[1] ? parseInt(values.source_addr.split('/')[1]) : 0
                action.source_port = values.source_port === 'Any' ? '-1' : values.source_port
                action.dest_addr = values.dest_addr.split('/')[0]
                action.dest_sub = values.dest_addr.split('/')[1] ? parseInt(values.dest_addr.split('/')[1]) : 0
                action.dest_port = values.dest_port === 'Any' ? '-1' : values.dest_port
                action.protocol = values.protocol ? values.protocol : 'tcp'
                action.interface = values.interface ? values.interface : net_interface

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
    _onChangeType = (type) => {
        let rule_name = this.state.rule_name
        rule_name.type = type
        this.setState({
            rule_name: rule_name
        })
    }
    _onChangeFlags = (flags) => {
        let rule_name = this.state.rule_name
        rule_name.flags = flags
        this.setState({
            rule_name: rule_name
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const name = this.props.params.name
        const rule_name = this.state.rule_name || {}
        let source_addr = 'Anywhere'
        let dest_addr = 'Anywhere'
        if (rule_name.source_sub) {
            source_addr = rule_name.source_addr + '/' + rule_name.source_sub
        } else {
            source_addr = rule_name.source_addr
        }
        if (rule_name.dest_sub) {
            dest_addr = rule_name.dest_addr + '/' + rule_name.dest_sub
        } else {
            dest_addr = rule_name.dest_addr
        }
        const title = this.props.params.name ? formatMessage({id: "LANG53"}) : formatMessage({id: "LANG52"})

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const formItemAddLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 12 }
        }

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
                            ref="div_new_fw_name"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1960" />}>
                                    <span>{formatMessage({id: "LANG1947"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('rule_name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: this._checkName
                                }],
                                initialValue: name ? name : ''
                            })(
                                <Input maxLength='25' />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_new_fw_act"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1961" />}>
                                    <span>{formatMessage({id: "LANG1948"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('rule_act', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: rule_name.rule_act ? rule_name.rule_act : ''
                            })(
                                <Select>
                                    <Option value="accept">ACCEPT</Option>
                                    <Option value="reject">REJECT</Option>
                                    <Option value="drop">DROP</Option>
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_new_fw_type"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1963" />}>
                                    <span>{formatMessage({id: "LANG1950"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('type', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: rule_name.type ? rule_name.type : ''
                            })(
                                <Select onChange={ this._onChangeType }>
                                    <Option value='in'>IN</Option>
                                    <Option value='out'>OUT</Option>
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_new_fw_interface"
                            className= { rule_name.type === 'in' ? 'display-block' : 'hidden' }
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1964" />}>
                                    <span>{formatMessage({id: "LANG1938"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('interface', {
                                rules: [{
                                    required: rule_name.type === 'in',
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: rule_name.interface ? rule_name.interface : ''
                            })(
                                <Select>
                                    {
                                        this.state.interfaceList.map(function(item) {
                                            return <Option
                                                    key={ item.text }
                                                    value={ item.val }>
                                                    { item.text }
                                                </Option>
                                            }
                                        ) 
                                    }
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_new_fw_services"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1965" />}>
                                    <span>{formatMessage({id: "LANG1951"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('flags', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: rule_name.flags ? rule_name.flags : ''
                            })(
                                <Select onChange={ this._onChangeFlags } >
                                    <Option value='FTP'>FTP</Option>
                                    <Option value='SSH'>SSH</Option>
                                    <Option value='Telnet'>Telnet</Option>
                                    <Option value='HTTP'>HTTP</Option>
                                    <Option value='LDAP'>LDAP</Option>
                                    <Option value='custom'>Custom</Option>
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemAddLayout }
                            className= { rule_name.flags === 'custom' ? 'display-block' : 'hidden' }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1967" />}>
                                    <span>{formatMessage({id: "LANG1952"})}</span>
                                </Tooltip>
                            )}>
                            <Row>
                                <Col span={ 12 }>
                                    { getFieldDecorator('source_addr', {
                                        rules: [{
                                            required: rule_name.flags === 'custom',
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: source_addr ? source_addr : 'Anywhere'
                                    })(
                                        <Input />
                                    ) }
                                </Col>
                                <Col span={ 1 } offset={ 1 } >
                                    <span>:</span>
                                </Col>
                                <Col span={ 6 }>
                                    { getFieldDecorator('source_port', {
                                        rules: [{
                                            required: rule_name.flags === 'custom',
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: rule_name.source_port && rule_name.source_port !== '-1' ? rule_name.source_port : 'Any'
                                    })(
                                        <Input min={ 1 } max={ 65535 } />
                                    ) }
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem
                            { ...formItemAddLayout }
                            className= { rule_name.flags === 'custom' ? 'display-block' : 'hidden' }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1968" />}>
                                    <span>{formatMessage({id: "LANG1953"})}</span>
                                </Tooltip>
                            )}>
                            <Row>
                                <Col span={ 12 }>
                                    { getFieldDecorator('dest_addr', {
                                        rules: [{
                                            required: rule_name.flags === 'custom',
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: dest_addr ? dest_addr : 'Anywhere'
                                    })(
                                        <Input />
                                    ) }
                                </Col>
                                <Col span={ 1 } offset={ 1 } >
                                    <span>:</span>
                                </Col>
                                <Col span={ 6 }>
                                    { getFieldDecorator('dest_port', {
                                        rules: [{
                                            required: rule_name.flags === 'custom',
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: rule_name.dest_port && rule_name.dest_port !== '-1' ? rule_name.dest_port : 'Any'
                                    })(
                                        <Input min={ 1 } max={ 65535 } />
                                    ) }
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem
                            ref="div_new_fw_proto"
                            { ...formItemLayout }
                            className= { rule_name.flags === 'custom' ? 'display-block' : 'hidden' }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1962" />}>
                                    <span>{formatMessage({id: "LANG1949"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('protocol', {
                                rules: [{
                                    required: rule_name.flags === 'custom',
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: rule_name.protocol ? rule_name.protocol : ''
                            })(
                                <Select>
                                    <Option value='tcp'>TCP</Option>
                                    <Option value='udp'>UDP</Option>
                                    <Option value='both'>{ formatMessage({id: "LANG1959"}) }</Option>
                                </Select>
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(Rules))