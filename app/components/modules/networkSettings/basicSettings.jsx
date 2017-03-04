'use strict'

import $ from 'jquery'
import _ from 'underscore'
import moment from "moment"
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Tabs, Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, DatePicker, TimePicker, Button, Modal, Row } from 'antd'

const TabPane = Tabs.TabPane
const baseServerURl = api.apiHost
const FormItem = Form.Item
const confirm = Modal.confirm

class BasicSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            method_display_calss: {
                num_eth: 'display-block'
            },
            method_change_calss: {
                lan1: 'hidden',
                lan2: 'display-block',
                lan: 'hidden',
                lantitle: 'display-block',
                lan2title: 'hidden',
                wantitle: 'hidden'
            },
            lan1_ip_class: {
                dhcp: 'display-block',
                static: 'hidden',
                pppoe: 'hidden'
            },
            lan2_ip_class: {
                dhcp: 'display-block',
                static: 'hidden',
                pppoe: 'hidden'
            },
            default_interface_calss: {
                lan1: 'display-block',
                lan2: 'hidden'
            },
            lan1_ip6_class: {
                static: 'hidden'
            },
            lan2_ip6_class: {
                static: 'hidden'
            },
            dhcp_ip6_class: {
                fromto: 'display-block'
            },
            method_key: []
        }
    }
    componentWillMount() {
        this._initNetwork()
        this._getInitData()
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }

    _initNetwork = () => {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        let myclass = this.state.method_display_calss
        let method_key = this.state.method_key || []
        if (Number(model_info.num_eth) >= 2) {
            myclass.num_eth = 'display-block'
            method_key = [{"key": "1", "name": formatMessage({id: "LANG551"})}, {"key": "2", "name": formatMessage({id: "LANG2219"})}]
            if (model_info.allow_nat === "1") {
                let item = {"key": "0", "name": formatMessage({id: "LANG550"})}
                method_key.push(item)
            }
        } else {
            myclass.num_eth = 'hidden'
        }

        let network_settings = this.props.dataSource
        let dhcp_settings = this.props.dataDHCPSettings
        let dhcp6_settings = this.props.dataDHCP6Settings
        let value = network_settings.method
        let method = {}

        if (value === "0") {
            method = {
                lan1: 'hidden',
                lan2: 'display-block',
                lan: 'display-block',
                lantitle: 'hidden',
                lan2title: 'hidden',
                wantitle: 'display-block'
            }
        } else if (value === "1") {
            method = {
                lan1: 'hidden',
                lan2: 'display-block',
                lan: 'hidden',
                lantitle: 'display-block',
                lan2title: 'hidden',
                wantitle: 'hidden'
            }
        } else {
            method = {
                lan1: 'display-block',
                lan2: 'display-block',
                lan: 'hidden',
                lantitle: 'hidden',
                lan2title: 'display-block',
                wantitle: 'hidden'
            }
        }

        value = network_settings.lan1_ip_method
        let ipmethod = {}
        let ipmethod2 = {}

        if (value === "0") {
            ipmethod = {
                dhcp: 'display-block',
                static: 'hidden',
                pppoe: 'hidden'
            }
        } else if (value === "1") {
            ipmethod = {
                dhcp: 'hidden',
                static: 'display-block',
                pppoe: 'hidden'
            }
        } else {
            ipmethod = {
                dhcp: 'hidden',
                static: 'hidden',
                pppoe: 'display-block'
            }
        }
        value = network_settings.lan2_ip_method

        if (value === "0") {
            ipmethod2 = {
                dhcp: 'display-block',
                static: 'hidden',
                pppoe: 'hidden'
            }
        } else if (value === "1") {
            ipmethod2 = {
                dhcp: 'hidden',
                static: 'display-block',
                pppoe: 'hidden'
            }
        } else {
            ipmethod2 = {
                dhcp: 'hidden',
                static: 'hidden',
                pppoe: 'display-block'
            }
        }

        value = network_settings.default_interface
        let default_interface = {}
        if (value === "LAN1") {
            default_interface = {
                lan1: 'display-block',
                lan2: 'hidden'
            }
        } else {
            default_interface = {
                lan1: 'hidden',
                lan2: 'display-block'
            }
        }

        value = network_settings.lan1_ip6_method
        let ip6method = {}
        let ip6method2 = {}

        if (value === "1") {
            ip6method = {
                static: 'display-block'
            }
        } else {
            ip6method = {
                static: 'hidden'
            }
        }
        value = network_settings.lan2_ip6_method
        if (value === "1") {
            ip6method2 = {
                static: 'display-block'
            }
        } else {
            ip6method2 = {
                static: 'hidden'
            }
        }

        value = network_settings.dhcp6_enable
        let dhcp_ipv6 = {}

        if (value === "1") {
            dhcp_ipv6 = {
                fromto: 'hidden'
            } 
        } else {
            dhcp_ipv6 = {
                fromto: 'display-block'
            }
        }

        this.setState({
            method_display_calss: myclass,
            method_change_calss: method,
            lan1_ip_class: ipmethod,
            lan2_ip_class: ipmethod2,
            lan1_ip6_class: ip6method,
            lan2_ip6_class: ip6method2,
            default_interface_calss: default_interface,
            dhcp_ip6_class: dhcp_ipv6,
            method_key: method_key
        })
    }
    _getInitData = () => {

    }
    _networkMethodSwitch = (value) => {
        let method = {}

        if (value === "0") {
            method = {
                lan1: 'hidden',
                lan2: 'display-block',
                lan: 'display-block',
                lantitle: 'hidden',
                lan2title: 'hidden',
                wantitle: 'display-block'
            }
        } else if (value === "1") {
            method = {
                lan1: 'hidden',
                lan2: 'display-block',
                lan: 'hidden',
                lantitle: 'display-block',
                lan2title: 'hidden',
                wantitle: 'hidden'
            }
        } else {
            method = {
                lan1: 'display-block',
                lan2: 'display-block',
                lan: 'hidden',
                lantitle: 'hidden',
                lan2title: 'display-block',
                wantitle: 'hidden'
            }
        }

        this.props.change8021x(value)

        this.setState({
            method_change_calss: method
        })
    }
    _onChangeTab = (value) => {

    }
    _onChangeIPMethod = (key, value) => {
        let method = {}

        if (value === "0") {
            method = {
                dhcp: 'display-block',
                static: 'hidden',
                pppoe: 'hidden'
            }
        } else if (value === "1") {
            method = {
                dhcp: 'hidden',
                static: 'display-block',
                pppoe: 'hidden'
            }
        } else {
            method = {
                dhcp: 'hidden',
                static: 'hidden',
                pppoe: 'display-block'
            }
        }
        if (key === "lan1_ip_method") {
            this.setState({
                lan1_ip_class: method
            })
        } else {
            this.setState({
                lan2_ip_class: method
            })
        }
    }
    _ipv6MethodSwitch = (key, value) => {
        let method = {}

        if (value === "1") {
            method = {
                static: 'display-block'
            }
        } else {
            method = {
                static: 'hidden'
            }
        }
        if (key === "lan1_ip6_method") {
            this.setState({
                lan1_ip6_class: method
            })
        } else {
            this.setState({
                lan2_ip6_class: method
            })
        }
    }
    _ipv6DHCPSwitch = (value) => {
        let data = {}

        if (value === "1") {
            data = {
                fromto: 'hidden'
            } 
        } else {
            data = {
                fromto: 'display-block'
            }
        }
        this.setState({
            dhcp_ip6_class: data
        })

        this.props.dhcp6Enable(value)
    }
    _onChangeDefaultInterface = (value) => {
        let data = {}

        if (value === "LAN1") {
            data = {
                lan1: 'display-block',
                lan2: 'hidden'
            }
        } else {
            data = {
                lan1: 'hidden',
                lan2: 'display-block'
            }
        }
        this.setState({
            default_interface_calss: data
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const network_settings = this.props.dataSource
        const dhcp_settings = this.props.dataDHCPSettings
        const dhcp6_settings = this.props.dataDHCP6Settings
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1914" />}>
                                <span>{formatMessage({id: "LANG2233"})}</span>
                            </Tooltip>
                        }
                        className={ this.state.method_display_calss.num_eth }
                    >
                        { getFieldDecorator('method', {
                            rules: [],
                            initialValue: network_settings.method
                        })(
                            <Select onChange={ this._networkMethodSwitch } >
                                {
                                    this.state.method_key.map(function(value, index) {
                                        return <Option value={ value.key } key={ index }>{ value.name }</Option>
                                    })
                                }
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG5047" />}>
                                <span>{formatMessage({id: "LANG5046"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('mtu', {
                            rules: [
                                { type: "integer" }
                            ],
                            initialValue: network_settings.mtu
                        })(
                            <Input min={ 1280 } max={ 1500 } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2226" />}>
                                <span>{formatMessage({id: "LANG2220"})}</span>
                            </Tooltip>
                        }
                        className={ this.state.method_change_calss.lan1 }
                    >
                        { getFieldDecorator('default_interface', {
                            rules: [],
                            initialValue: network_settings.default_interface
                        })(
                            <Select onChange={ this._onChangeDefaultInterface }>
                                 <Option value="LAN1">{formatMessage({id: "LANG266"})}</Option>
                                 <Option value="LAN2">{formatMessage({id: "LANG267"})}</Option>
                             </Select>
                        ) }
                    </FormItem>
                    <Tabs type="card" defaultActiveKey="1" onChange={ this._onChangeTab }>
                        <TabPane tab={formatMessage({id: "LANG5195"})} key="1">
                            <FormItem
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1913" />}>
                                        <span>{formatMessage({id: "LANG1912"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('altdns', {
                                    rules: [],
                                    initialValue: network_settings.altdns === "0.0.0.0" ? "" : network_settings.altdns
                                })(
                                    <Input/>
                                ) }
                            </FormItem>
                            <div className={ this.state.method_change_calss.lan1 }>
                                <Row>
                                    <Col span={ 24 }>
                                        <div className="section-title">
                                            <span>{ formatMessage({id: "LANG266"}) }</span>
                                        </div>
                                    </Col>
                                </Row>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG549" />}>
                                            <span>{formatMessage({id: "LANG549"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('lan2_ip_method', {
                                        rules: [],
                                        initialValue: network_settings.lan2_ip_method
                                    })(
                                        <Select onChange={ this._onChangeIPMethod.bind(this, "lan2_ip_method") } >
                                             <Option value="0">{formatMessage({id: "LANG219"})}</Option>
                                             <Option value="1">{formatMessage({id: "LANG220"})}</Option>
                                             <Option value="2">{formatMessage({id: "LANG221"})}</Option>
                                         </Select>
                                    ) }
                                </FormItem>
                                <div className={ this.state.lan2_ip_class.static }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1292" />}>
                                                <span>{formatMessage({id: "LANG1291"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_ip', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan2_ip
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1903" />}>
                                                <span>{formatMessage({id: "LANG1902"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_mask', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan2_mask
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1901" />}>
                                                <span>{formatMessage({id: "LANG1900"})}</span>
                                            </Tooltip>
                                        }
                                        className={ this.state.default_interface_calss.lan1 }
                                    >
                                        { getFieldDecorator('lan2_gateway', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan2_gateway
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1905" />}>
                                                <span>{formatMessage({id: "LANG1904"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_dns1', {
                                            rules: [],
                                            initialValue: network_settings.lan2_dns1
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1907" />}>
                                                <span>{formatMessage({id: "LANG1906"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_dns2', {
                                            rules: [],
                                            initialValue: network_settings.lan2_dns2
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                </div>
                                <div className={ this.state.lan2_ip_class.pppoe }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1909" />}>
                                                <span>{formatMessage({id: "LANG1908"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_username', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan2_username
                                        })(
                                            <Input maxLength="64" />
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1911" />}>
                                                <span>{formatMessage({id: "LANG1910"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_password', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan2_password
                                        })(
                                            <Input maxLength="64" />
                                        ) }
                                    </FormItem>
                                </div>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2521" />}>
                                            <span>{formatMessage({id: "LANG2520"})}</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('lan2_vid', {
                                        rules: [
                                            { type: "integer" }
                                        ],
                                        initialValue: network_settings.lan2_vid
                                    })(
                                        <Input min={ 0 } max={ 4094 } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2523" />}>
                                            <span>{formatMessage({id: "LANG2522"})}</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('lan2_priority', {
                                        rules: [
                                            { type: "integer" }
                                        ],
                                        initialValue: network_settings.lan2_priority
                                    })(
                                        <Input min={ 0 } max={ 7 } />
                                    ) }
                                </FormItem>
                            </div>
                            <Row className={ this.state.method_change_calss.wantitle}>
                                <Col span={ 24 }>
                                    <div className="section-title">
                                        <span>{ formatMessage({id: "LANG264"}) }</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={ this.state.method_change_calss.lantitle}>
                                <Col span={ 24 }>
                                    <div className="section-title">
                                        <span>{ formatMessage({id: "LANG265"}) }</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={ this.state.method_change_calss.lan2title}>
                                <Col span={ 24 }>
                                    <div className="section-title">
                                        <span>{ formatMessage({id: "LANG267"}) }</span>
                                    </div>
                                </Col>
                            </Row>
                            <div className={ this.state.method_change_calss.lan2 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG549" />}>
                                            <span>{formatMessage({id: "LANG549"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('lan1_ip_method', {
                                        rules: [],
                                        initialValue: network_settings.lan1_ip_method
                                    })(
                                        <Select onChange={ this._onChangeIPMethod.bind(this, "lan1_ip_method") } >
                                             <Option value="0">{formatMessage({id: "LANG219"})}</Option>
                                             <Option value="1">{formatMessage({id: "LANG220"})}</Option>
                                             <Option value="2">{formatMessage({id: "LANG221"})}</Option>
                                         </Select>
                                    ) }
                                </FormItem>
                                <div className={ this.state.lan1_ip_class.static }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1292" />}>
                                                <span>{formatMessage({id: "LANG1291"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_ipaddr', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan1_ipaddr
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1903" />}>
                                                <span>{formatMessage({id: "LANG1902"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_submask', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan1_submask
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1901" />}>
                                                <span>{formatMessage({id: "LANG1900"})}</span>
                                            </Tooltip>
                                        }
                                        className={ this.state.default_interface_calss.lan2 }
                                    >
                                        { getFieldDecorator('lan1_gateway', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan1_gateway
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1905" />}>
                                                <span>{formatMessage({id: "LANG1904"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_dns1', {
                                            rules: [],
                                            initialValue: network_settings.lan1_dns1 === "0.0.0.0" ? "" : network_settings.lan1_dns1
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1907" />}>
                                                <span>{formatMessage({id: "LANG1906"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_dns2', {
                                            rules: [],
                                            initialValue: network_settings.lan1_dns2 === "0.0.0.0" ? "" : network_settings.lan1_dns2
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                </div>
                                <div className={ this.state.lan1_ip_class.pppoe }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1909" />}>
                                                <span>{formatMessage({id: "LANG1908"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_username', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan1_username
                                        })(
                                            <Input maxLength="64" />
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1911" />}>
                                                <span>{formatMessage({id: "LANG1910"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_password', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan1_password
                                        })(
                                            <Input maxLength="64" />
                                        ) }
                                    </FormItem>
                                </div>
                            </div>
                            <FormItem
                                { ...formItemLayout }
                                label={(                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2521" />}>
                                        <span>{formatMessage({id: "LANG2520"})}</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('lan1_vid', {
                                    rules: [
                                        { type: "integer" }
                                    ],
                                    initialValue: network_settings.lan1_vid
                                })(
                                    <Input min={ 0 } max={ 4094 } />
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2523" />}>
                                        <span>{formatMessage({id: "LANG2522"})}</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('lan1_priority', {
                                    rules: [
                                        { type: "integer" }
                                    ],
                                    initialValue: network_settings.lan1_priority
                                })(
                                    <Input min={ 0 } max={ 7 } />
                                ) }
                            </FormItem>                    
                            <div className={ this.state.method_change_calss.lan}>
                                <Row>
                                    <Col span={ 24 }>
                                        <div className="section-title">
                                            <span>{ formatMessage({id: "LANG265"}) }</span>
                                        </div>
                                    </Col>
                                </Row>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1916" />}>
                                            <span>{formatMessage({id: "LANG1915"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp_ipaddr', {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: dhcp_settings.dhcp_ipaddr
                                    })(
                                        <Input/>
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1903" />}>
                                            <span>{formatMessage({id: "LANG1902"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp_submask', {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: dhcp_settings.dhcp_submask
                                    })(
                                        <Input/>
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1918" />}>
                                            <span>{formatMessage({id: "LANG1917"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp_enable', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: network_settings.dhcp_enable
                                    })(
                                        <Checkbox onChange={ this.props.dhcpEnable } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1905" />}>
                                            <span>{formatMessage({id: "LANG1904"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp_dns1', {
                                        rules: [],
                                        initialValue: dhcp_settings.dhcp_dns1
                                    })(
                                        <Input disabled={ !network_settings.dhcp_enable } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1907" />}>
                                            <span>{formatMessage({id: "LANG1906"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp_dns2', {
                                        rules: [],
                                        initialValue: dhcp_settings.dhcp_dns2
                                    })(
                                        <Input disabled={ !network_settings.dhcp_enable } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1920" />}>
                                            <span>{formatMessage({id: "LANG1919"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ipfrom', {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: dhcp_settings.ipfrom
                                    })(
                                        <Input disabled={ !network_settings.dhcp_enable } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1922" />}>
                                            <span>{formatMessage({id: "LANG1921"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ipto', {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: dhcp_settings.ipto
                                    })(
                                        <Input disabled={ !network_settings.dhcp_enable } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG4444" />}>
                                            <span>{formatMessage({id: "LANG4443"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp_gateway', {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: dhcp_settings.dhcp_gateway
                                    })(
                                        <Input disabled={ !network_settings.dhcp_enable } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1924" />}>
                                            <span>{formatMessage({id: "LANG1923"})}</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('ipleasetime', {
                                        rules: [
                                            { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                                        ],
                                        initialValue: dhcp_settings.ipleasetime
                                    })(
                                        <Input min={ 300 } max={ 172800 } disabled={ !network_settings.dhcp_enable } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2521" />}>
                                            <span>{formatMessage({id: "LANG2520"})}</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('lan2_vid', {
                                        rules: [
                                            { type: "integer" }
                                        ],
                                        initialValue: network_settings.lan2_vid
                                    })(
                                        <Input min={ 0 } max={ 4094 } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2523" />}>
                                            <span>{formatMessage({id: "LANG2522"})}</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('lan2_priority', {
                                        rules: [
                                            { type: "integer" }
                                        ],
                                        initialValue: network_settings.lan2_priority
                                    })(
                                        <Input min={ 0 } max={ 7 } />
                                    ) }
                                </FormItem>                       
                            </div>
                        </TabPane>
                        <TabPane tab={formatMessage({id: "LANG5130"})} key="2">
                            <div className={ this.state.method_change_calss.lan1 }>
                                <Row>
                                    <Col span={ 24 }>
                                        <div className="section-title">
                                            <span>{ formatMessage({id: "LANG266"}) }</span>
                                        </div>
                                    </Col>
                                </Row>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG549" />}>
                                            <span>{formatMessage({id: "LANG549"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('lan2_ip6_method', {
                                        rules: [],
                                        initialValue: network_settings.lan2_ip6_method
                                    })(
                                        <Select onChange={ this._ipv6MethodSwitch.bind(this, "lan2_ip6_method") } >
                                             <Option value="0">{formatMessage({id: "LANG138"})}</Option>
                                             <Option value="1">{formatMessage({id: "LANG220"})}</Option>
                                         </Select>
                                    ) }
                                </FormItem>
                                <div className={ this.state.lan2_ip6_class.static }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1292" />}>
                                                <span>{formatMessage({id: "LANG1291"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_ipaddr6', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan2_ipaddr6
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG5159" />}>
                                                <span>{formatMessage({id: "LANG5158"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_ip6_prefixlen', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan2_ip6_prefixlen
                                        })(
                                            <Input min={1} max={64} />
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG5192" />}>
                                                <span>{formatMessage({id: "LANG1904"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_ip6_dns1', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan2_ip6_dns1
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG5193" />}>
                                                <span>{formatMessage({id: "LANG1906"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan2_ip6_dns2', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan2_ip6_dns2
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                </div>
                            </div>
                            <Row className={ this.state.method_change_calss.wantitle}>
                                <Col span={ 24 }>
                                    <div className="section-title">
                                        <span>{ formatMessage({id: "LANG264"}) }</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={ this.state.method_change_calss.lantitle}>
                                <Col span={ 24 }>
                                    <div className="section-title">
                                        <span>{ formatMessage({id: "LANG265"}) }</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={ this.state.method_change_calss.lan2title}>
                                <Col span={ 24 }>
                                    <div className="section-title">
                                        <span>{ formatMessage({id: "LANG267"}) }</span>
                                    </div>
                                </Col>
                            </Row>
                            <div className={ this.state.method_change_calss.lan2 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG549" />}>
                                            <span>{formatMessage({id: "LANG549"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('lan1_ip6_method', {
                                        rules: [],
                                        initialValue: network_settings.lan1_ip6_method
                                    })(
                                        <Select onChange={ this._ipv6MethodSwitch.bind(this, "lan1_ip6_method") } >
                                             <Option value="0">{formatMessage({id: "LANG138"})}</Option>
                                             <Option value="1">{formatMessage({id: "LANG220"})}</Option>
                                         </Select>
                                    ) }
                                </FormItem>
                                <div className={ this.state.lan1_ip6_class.static }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1292" />}>
                                                <span>{formatMessage({id: "LANG1291"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_ipaddr6', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan1_ipaddr6
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG5159" />}>
                                                <span>{formatMessage({id: "LANG5158"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_ip6_prefixlen', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: network_settings.lan1_ip6_prefixlen
                                        })(
                                            <Input min={ 1 } max={ 64 } />
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG5192" />}>
                                                <span>{formatMessage({id: "LANG1904"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_ip6_dns1', {
                                            rules: [],
                                            initialValue: network_settings.lan1_ip6_dns1
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG5193" />}>
                                                <span>{formatMessage({id: "LANG1906"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('lan1_ip6_dns2', {
                                            rules: [],
                                            initialValue: network_settings.lan1_ip6_dns2
                                        })(
                                            <Input/>
                                        ) }
                                    </FormItem>
                                </div>
                            </div>
                            <div className={ this.state.method_change_calss.lan}>
                                <Row>
                                    <Col span={ 24 }>
                                        <div className="section-title">
                                            <span>{ formatMessage({id: "LANG265"}) }</span>
                                        </div>
                                    </Col>
                                </Row>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG549" />}>
                                            <span>{formatMessage({id: "LANG549"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp6_enable', {
                                        rules: [],
                                        initialValue: network_settings.dhcp6_enable
                                    })(
                                        <Select onChange={ this._ipv6DHCPSwitch } >
                                             <Option value="0">{formatMessage({id: "LANG273"})}</Option>
                                             <Option value="1">{formatMessage({id: "LANG138"})}</Option>
                                             <Option value="2">{formatMessage({id: "LANG5209"})}</Option>
                                         </Select>
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG5161" />}>
                                            <span>{formatMessage({id: "LANG5160"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp6_prefix', {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: dhcp6_settings.dhcp6_prefix
                                    })(
                                        <Input disabled={ network_settings.dhcp6_enable === "0" } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG5163" />}>
                                            <span>{formatMessage({id: "LANG5162"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp6_prefixlen', {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: dhcp6_settings.dhcp6_prefixlen
                                    })(
                                        <Input min={1} max={64} disabled={ network_settings.dhcp6_enable === "0" } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1905" />}>
                                            <span>{formatMessage({id: "LANG1904"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp6_dns1', {
                                        rules: [],
                                        initialValue: dhcp6_settings.dhcp6_dns1
                                    })(
                                        <Input disabled={ network_settings.dhcp6_enable === "0" } />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG5193" />}>
                                            <span>{formatMessage({id: "LANG1906"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('dhcp6_dns2', {
                                        rules: [],
                                        initialValue: dhcp6_settings.dhcp6_dns2
                                    })(
                                        <Input disabled={ network_settings.dhcp6_enable === "0" } />
                                    ) }
                                </FormItem>
                                <div className={ this.state.dhcp_ip6_class.fromto }>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG5223" />}>
                                                <span>{formatMessage({id: "LANG1919"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('ip6from', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: dhcp6_settings.ip6from
                                        })(
                                            <Input disabled={ network_settings.dhcp6_enable === "0" } />
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG5224" />}>
                                                <span>{formatMessage({id: "LANG1921"})}</span>
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('ip6to', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage({id: "LANG2150"})
                                            }],
                                            initialValue: dhcp6_settings.ip6to
                                        })(
                                            <Input disabled={ network_settings.dhcp6_enable === "0" } />
                                        ) }
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={(                            
                                            <Tooltip title={<FormattedHTMLMessage id="LANG1924" />}>
                                                <span>{formatMessage({id: "LANG1923"})}</span>
                                            </Tooltip>
                                        )}
                                    >
                                        { getFieldDecorator('ip6leasetime', {
                                            rules: [
                                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                                            ],
                                            initialValue: dhcp6_settings.ip6leasetime
                                        })(
                                            <Input min={ 300 } max={ 172800 } disabled={ network_settings.dhcp6_enable === "0" } />
                                        ) }
                                    </FormItem>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

BasicSettings.propTypes = {
}

export default injectIntl(BasicSettings)
