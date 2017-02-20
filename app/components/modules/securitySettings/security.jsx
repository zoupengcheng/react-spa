'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Tooltip, Button, message, Modal, Popconfirm, Checkbox, Table, Tag, Form, Row, Col, Input, Collapse, BackTop } from 'antd'

const confirm = Modal.confirm
const FormItem = Form.Item
const Panel = Collapse.Panel

class Security extends Component {
    constructor(props) {
        super(props)
        this.state = {
            netstatInfo: [],
            ruleName: [],
            typicalFirewallsettings: {}
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _add = () => {
        browserHistory.push('/system-settings/security/add')
    }
    _delete = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteStaticDefense",
                "rule_name": record.rule_name
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitData()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/system-settings/security/edit/' + record.sequence + '/' + record.rule_name)
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        let netstatInfo = this.state.netstatInfo
        let ruleName = this.state.ruleName
        let typicalFirewallsettings = this.state.typicalFirewallsettings

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getNetstatInfo'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    netstatInfo = response.netstat || []
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
                sidx: 'sequence',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    ruleName = response.rule_name || []
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
                action: 'getTypicalFirewallSettings'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    typicalFirewallsettings = response.typical_firewallsettings || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        this.setState({
            netstatInfo: netstatInfo,
            ruleName: ruleName,
            typicalFirewallsettings: typicalFirewallsettings
        })
    }
    _createNetstatType = (text, record, index) => {
        const type = record.pro + '/' + record.ip
        return <div>
                <span>{ type }</span>
            </div>
    }
    _createDestAddress = (text, record, index) => {
        let span = ''
        if (record.dest_sub) {
            span = 'Address:' + text + '/' + record.dest_sub + ' Port:'
        } else {
            span = 'Address:' + text + ' Port:'
        }

        if (record.dest_port === '-1') {
            span += 'Any'
        } else {
            span += record.dest_port
        }

        return <div><span>{ span }</span></div>
    }
    _createSourceAddress = (text, record, index) => {
        let span = ''
        if (record.source_sub) {
            span = 'Address:' + text + '/' + record.source_sub + ' Port:'
        } else {
            span = 'Address:' + text + ' Port:'
        }

        if (record.source_port === '-1') {
            span += 'Any'
        } else {
            span += record.source_port
        }

        return <div><span>{ span }</span></div>
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const networkSettings = this.props.networkSettings
        const columns_rules = [{
                key: 'sequence',
                dataIndex: 'sequence',
                title: formatMessage({id: "LANG1957"}),
                sorter: (a, b) => a.sequence.length - b.sequence.length
            }, {
                key: 'rule_name',
                dataIndex: 'rule_name',
                title: formatMessage({id: "LANG1947"}),
                sorter: (a, b) => a.rule_name.length - b.rule_name.length
            }, {
                key: 'rule_act',
                dataIndex: 'rule_act',
                title: formatMessage({id: "LANG1948"}),
                sorter: (a, b) => a.rule_act.length - b.rule_act.length
            }, {
                key: 'protocol',
                dataIndex: 'protocol',
                title: formatMessage({id: "LANG1949"}),
                sorter: (a, b) => a.protocol.length - b.protocol.length
            }, {
                key: 'type',
                dataIndex: 'type',
                title: formatMessage({id: "LANG1950"}),
                sorter: (a, b) => a.type.length - b.type.length
            }, {
                key: 'source_addr',
                dataIndex: 'source_addr',
                title: formatMessage({id: "LANG1952"}),
                sorter: (a, b) => a.source_addr.length - b.source_addr.length,
                render: (text, record, index) => {
                    return this._createSourceAddress(text, record, index)
                }
            }, {
                key: 'dest_addr',
                dataIndex: 'dest_addr',
                title: formatMessage({id: "LANG1953"}),
                sorter: (a, b) => a.dest_addr.length - b.dest_addr.length,
                render: (text, record, index) => {
                    return this._createDestAddress(text, record, index)
                }
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG1958"}),
                render: (text, record, index) => {
                    return <div>
                            <span
                                className="sprite sprite-edit"
                                title={ formatMessage({id: "LANG738"}) }
                                onClick={ this._edit.bind(this, record) }>
                            </span>
                            <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._delete.bind(this, record) }
                            >
                                <span className="sprite sprite-del" title={ formatMessage({id: "LANG739"}) }></span>
                            </Popconfirm>
                        </div>
                }
            }]
        const pagination = {
                total: this.state.ruleName.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }
        const columns_netstat = [{
                key: 'port',
                dataIndex: 'port',
                title: formatMessage({id: "LANG1956"}),
                sorter: (a, b) => a.port.length - b.port.length
            }, {
                key: 'service',
                dataIndex: 'service',
                title: formatMessage({id: "LANG1955"}),
                sorter: (a, b) => a.service.length - b.service.length
            }, {
                key: 'type',
                dataIndex: 'type',
                title: formatMessage({id: "LANG1954"}),
                sorter: (a, b) => a.s.length - b.s.length,
                render: (text, record, index) => {
                    return this._createNetstatType(text, record, index)
                }
            }]
        
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG38"})
                })
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const formItemPingLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 2 }
        }
        const typicalFirewallsettings = this.state.typicalFirewallsettings
        let ping_enable_wan = false
        let ping_enable_lan = false
        let ping_of_death_wan = false
        let ping_of_death_lan = false
        if (typicalFirewallsettings.ping_enable) {
            const en_list = typicalFirewallsettings.ping_enable.split(',')
            for (let i = 0; i < en_list.length; i++) {
                if (en_list[i] === 'WAN' || en_list[i] === 'LAN1') {
                    ping_enable_wan = true
                } else if (en_list[i] === 'LAN' || en_list[i] === 'LAN2') {
                    ping_enable_lan = true
                }
            }
        }
        if (typicalFirewallsettings.ping_of_death) {
            const en_list = typicalFirewallsettings.ping_of_death.split(',')
            for (let i = 0; i < en_list.length; i++) {
                if (en_list[i] === 'WAN' || en_list[i] === 'LAN1') {
                    ping_of_death_wan = true
                } else if (en_list[i] === 'LAN' || en_list[i] === 'LAN2') {
                    ping_of_death_lan = true
                }
            }
        }
        return (
            <div className="app-content-main">
                <div className="content">
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header={ formatMessage({id: "LANG1936" })} key="1">
                            <Table
                                rowKey=""
                                columns={ columns_netstat }
                                pagination={ false }
                                dataSource={ this.state.netstatInfo }
                                showHeader={ !!this.state.netstatInfo.length }
                            />
                        </Panel>
                    </Collapse>
                </div>
                <div className="content">
                    <div className='section-title section-title-specail'>
                        <span>
                            { formatMessage({id: "LANG2231" })}
                        </span>
                    </div>
                    <Row>
                        <Col span={ 6 } >
                            <Button
                                icon="plus"
                                type="primary"
                                size='default'
                                onClick={ this._add }
                            >
                                { formatMessage({id: "LANG1935"}) }
                            </Button>
                        </Col>
                        <Col span={ 18 } >
                            <FormItem
                                ref="div_rejectAll"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2753" />}>
                                        <span>{formatMessage({id: "LANG2752"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('reject_all', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.typicalFirewallsettings.reject_all === 'yes'
                                })(
                                    <Checkbox disabled={ true } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Table
                        rowKey="sequence"
                        columns={ columns_rules }
                        pagination={ false }
                        dataSource={ this.state.ruleName }
                        showHeader={ !!this.state.ruleName.length }
                    />
                </div>
                <div className="content">
                    <div className='section-title section-title-specail'>
                        <span>
                            { formatMessage({id: "LANG1937" })}
                        </span>
                    </div>
                    <Row>
                        <Col span={ 4 }>
                            <Tooltip title={<FormattedHTMLMessage id="LANG2214" />}>
                                <span>{formatMessage({id: "LANG1940"})}</span>
                            </Tooltip>
                        </Col>
                        <Col span={ 5 } className={ networkSettings.method === '1' ? 'hidden' : 'display-block' }>
                            <FormItem
                                { ...formItemPingLayout }

                                label={(
                                    <Tooltip>
                                        <span>{ networkSettings.method === '2' ? 'eth0(LAN1)' : 'eth1(WAN)' }</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('ping_enable_wan', {
                                    rules: [],
                                    width: 100,
                                    valuePropName: 'checked',
                                    initialValue: ping_enable_wan
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 5 } >
                            <FormItem
                            { ...formItemPingLayout }

                                label={(
                                    <Tooltip>
                                        <span>{ networkSettings.method === '2' ? 'eth1(LAN2)' : 'eth0(LAN)' }</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('ping_enable_lan', {
                                    rules: [],
                                    width: 100,
                                    valuePropName: 'checked',
                                    initialValue: ping_enable_lan
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 4 }>
                            <Tooltip title={<FormattedHTMLMessage id="LANG2213" />}>
                                <span>{formatMessage({id: "LANG1942"})}</span>
                            </Tooltip>
                        </Col>
                        <Col span={ 5 } className={ networkSettings.method === '1' ? 'hidden' : 'display-block' }>
                            <FormItem
                                { ...formItemPingLayout }

                                label={(
                                    <Tooltip>
                                        <span>{ networkSettings.method === '2' ? 'eth0(LAN1)' : 'eth1(WAN)' }</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('ping_of_death_wan', {
                                    rules: [],
                                    width: 100,
                                    valuePropName: 'checked',
                                    initialValue: ping_of_death_wan
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 5 } >
                            <FormItem
                            { ...formItemPingLayout }

                                label={(
                                    <Tooltip>
                                        <span>{ networkSettings.method === '2' ? 'eth1(LAN2)' : 'eth0(LAN)' }</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('ping_of_death_lan', {
                                    rules: [],
                                    width: 100,
                                    valuePropName: 'checked',
                                    initialValue: ping_of_death_lan
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
                <div>
                    <BackTop />
                </div>
            </div>
        )
    }
}

export default injectIntl(Security)