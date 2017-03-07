'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Modal, Button, Row, Col, Checkbox, message, Tooltip, Select, Tabs, Spin } from 'antd'
import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import Validator from "../../api/validator"
import Title from '../../../views/title'
import UCMGUI from "../../api/ucmgui"

const FormItem = Form.Item
const Option = Select.Option
const baseServerURl = api.apiHost

class LdapClientConf extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this._handleSubmit = (e) => {
            const { formatMessage } = this.props.intl
            const form = this.props.form
        }
        this._handleCancel = (e) => {
            const { formatMessage } = this.props.intl
            const form = this.props.form
        }
    }
    componentDidMount() {
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG56"}) } 
                    onSubmit={ this._handleSubmit } 
                    onCancel={ this._handleCancel }
                    isDisplay="display-block" 
                />
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG56"}) }>
                                { getFieldDecorator('ldap_server_name', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input placeholder="LdapClient" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG2444"}) }>
                                { getFieldDecorator('ldap_server_address', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input placeholder="192.168.1.1" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG1999"}) }>
                                { getFieldDecorator('ldap_base', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input placeholder="dc=pbx,dc=com" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG2446"}) }>
                                { getFieldDecorator('ldap_user', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input placeholder="cn=admin,dc=pbx,dc=com" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG1424"}) }>
                                <Input type="password" name="ldap_passwd" className="hidden" />
                                { getFieldDecorator('ldap_passwd', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input type="password" placeholder="cn=admin,dc=pbx,dc=com" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG2006"}) }>
                                { getFieldDecorator('ldap_number_filter', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input placeholder="(objectClass=*)" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>    
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG2008"}) }>
                                { getFieldDecorator('ldap_port', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input type="password" placeholder="389" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                        </Col>
                    </Row>
                    <div className='section-title'>{ formatMessage({ id: "LANG715"}) }</div>
                    <div className='lite-desc'>{ formatMessage({ id: "LANG2434"}) }</div>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG1999"}) }>
                        <font>{ formatMessage({ id: "LANG2000"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2438"}) }>
                        <font>{ formatMessage({ id: "LANG2435"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG1424"}) }>
                        <font>{ formatMessage({ id: "LANG2435"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2437"}) }>
                        <font>{ formatMessage({ id: "LANG2436"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2006"}) }>
                        <font>{ formatMessage({ id: "LANG2007"}) }</font>
                    </FormItem> 
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2008"}) }>
                        <font>{ formatMessage({ id: "LANG2009"}) }</font>
                    </FormItem>
                    <div className='section-title'>{ formatMessage({ id: "LANG2455"}) }</div>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2444"}) }>
                        <font>{ formatMessage({ id: "LANG2445"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG1999"}) }>
                        <font>{ formatMessage({ id: "LANG2000"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2446"}) }>
                        <font>{ formatMessage({ id: "LANG2435"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG1424"}) }>
                        <font>{ formatMessage({ id: "LANG2435"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2456"}) }>
                        <font>{ formatMessage({ id: "LANG2457"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2458"}) }>
                        <font>{ formatMessage({ id: "LANG2459"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2447"}) }>
                        <font>{ formatMessage({ id: "LANG2448"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2449"}) }>
                        <font>{ formatMessage({ id: "LANG2450"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2451"}) }>
                        <font>{ formatMessage({ id: "LANG2452"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2453"}) }>
                        <font>{ formatMessage({ id: "LANG2454"}) }</font>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2008"}) }>
                        <font>{ formatMessage({ id: "LANG2009"}) }</font>
                    </FormItem>                         
                </Form>
            </div>
        )
    }
}

module.exports = Form.create()(injectIntl(LdapClientConf))