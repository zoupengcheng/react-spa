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

class EditLdapPhonebookItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ldapConfigs: {},
            phonebookdn: ""
        }
        this._onChangePhonebookname = (e) => {
            const form = this.props.form
            const state = this.state

            var reg = new RegExp('=' + UCMGUI.betweenXY(state.ldapConfigs.pbxdn, '=', ',') + ','),
                phonebookname = e.target.value,
                phonebookdn = UCMGUI.rChop(state.ldapConfigs.pbxdn, state.ldapConfigs.basedn).replace(reg, '=' + phonebookname + ',') + state.ldapConfigs.basedn

            this.setState({
                phonebookdn: phonebookname ? phonebookdn : '',
                phonebookname: phonebookname
            })
        }
        this._handleSave = () => {
            const { formatMessage } = this.props.intl
            const form = this.props.form

            let action = {}

            this.props.form.validateFieldsAndScroll((err, values) => {
                let me = this
                let refs = this.refs,
                    action = {}
                action = values
                for (let key in values) {
                    if (values.hasOwnProperty(key)) {
                        let divKey = refs["div_" + key]
                        if (divKey && 
                           divKey.props &&
                            ((divKey.props.className &&
                            divKey.props.className.indexOf("hidden") === -1) ||
                            typeof divKey.props.className === "undefined")) {
                            if (!err || (err && typeof err[key] === "undefined")) {
                                action[key] = UCMGUI.transCheckboxVal(values[key])   
                            } else {
                                return
                            }
                        } else if (typeof divKey === "undefined") {
                            if (!err || (err && typeof err[key] === "undefined")) {
                                action[key] = UCMGUI.transCheckboxVal(values[key])   
                            } else {
                                return
                            }
                        }
                    }
                }
                this.props.handleOk()
                message.loading(formatMessage({ id: "LANG904" }), 0)

                if (me.props.record.dn) {
                    action["action"] = "addContact"
                    action["phonebook_dn"] = me.props.record.dn
                } else {
                    action["action"] = "updateContact"
                    action["ldap_contacts"] = JSON.stringify({
                        "phonebook_dn": me.props.record.phonebook_dn,
                        "accountnumber": action["accountnumber"]
                    })
                    action["phonebook_dn"] = me.props.record.phonebook_dn                   
                }
                $.ajax({
                    type: "post",
                    url: baseServerURl,
                    async: false,
                    data: action,
                    error: function(jqXHR, textStatus, errorThrown) {
                        message.destroy()
                        message.error(errorThrown)
                    },
                    success: function(data) {
                        $.ajax({
                            type: "post",
                            url: baseServerURl,
                            async: false,
                            data: {
                                "action": "phonebookUpdate",
                                "phonebook_update": action["phonebook_dn"]
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                message.destroy()
                                message.error(errorThrown)
                            },
                            success: function(data) {
                                message.destroy()
                                this.props.listContacts()
                            }.bind(this)
                        })
                    }.bind(this)
                })
            })
            form.resetFields()
        }
        this._handleCancel = () => {
            const form = this.props.form
            form.resetFields()
            this.props.handleCancel()
        }
    }
    componentDidMount() {
        this._getLDAPConfig()
    }
    _getLDAPConfig = () => {
        $.ajax({
            type: "post",
            url: baseServerURl,
            async: false,
            data: {
                "action": "getLDAPConfig",
                "ldap_configs": null
            },
            error: function(jqXHR, textStatus, errorThrown) {
                message.destroy()
                message.error(errorThrown)
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, this.props.formatMessage)

                if (bool) {
                    if (data.response.ldap_configs) {
                        let ldapConfigs = data.response.ldap_configs[0]
                        this.setState({
                            ldapConfigs: ldapConfigs
                        })
                    }
                }
            }.bind(this)
        })        
    }    
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { formatMessage } = this.props.intl
        const state = this.state
        const record = this.props.record
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 8 }
        }

        let isDisabled = ((record.id === 1) ? true : false)
        return (
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2227"}) }>
                                        {formatMessage({id: "LANG2222"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('accountnumber', {
                                    rules: [{ 
                                        required: true, 
                                        message: formatMessage({id: "LANG2150"}) 
                                    }],
                                    initialValue: record.accountnumber || ""
                                })(
                                    <Input maxLength="32" disabled={ isDisabled } />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2025"}) }>
                                        {formatMessage({id: "LANG1361"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('calleridname', {
                                    rules: [],
                                    initialValue: record.calleridname || ""
                                })(
                                    <Input maxLength="32" disabled={ isDisabled } />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2033"}) }>
                                        {formatMessage({id: "LANG2032"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('email', {
                                    rules: [],
                                    initialValue: record.email || ""
                                })(
                                    <Input maxLength="64" disabled={ isDisabled } />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2027"}) }>
                                        {formatMessage({id: "LANG2026"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('firstname', {
                                    rules: [],
                                    initialValue: record.firstname || ""
                                })(
                                    <Input maxLength="32" disabled={ isDisabled } />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2029"}) }>
                                        {formatMessage({id: "LANG2028"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('lastname', {
                                    rules: [],
                                    initialValue: record.lastname || ""
                                })(
                                    <Input maxLength="32" disabled={ isDisabled } />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2031"}) }>
                                        {formatMessage({id: "LANG2030"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('department', {
                                    rules: [],
                                    initialValue: record.department || ""
                                })(
                                    <Input maxLength="32" disabled={ isDisabled } />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2035"}) }>
                                        {formatMessage({id: "LANG2034"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('mobilenumber', {
                                    rules: [],
                                    initialValue: record.mobilenumber || ""
                                })(
                                    <Input maxLength="32" disabled={ isDisabled } />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2037"}) }>
                                        {formatMessage({id: "LANG2036"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('homenumber', {
                                    rules: [],
                                    initialValue: record.homenumber || ""
                                })(
                                    <Input maxLength="32" disabled={ isDisabled } />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2039"}) }>
                                        {formatMessage({id: "LANG95"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('fax', {
                                    rules: [],
                                    initialValue: record.fax || ""
                                })(
                                    <Input maxLength="32" disabled={ isDisabled } />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                        </Col>
                    </Row>
                    <div className="app-ant-modal-footer">
                        <Button type="primary" onClick= { this._handleCancel }>
                            {formatMessage({id: "LANG726"})}
                        </Button>
                        <Button type="primary" onClick= { this._handleSave }>
                            {formatMessage({id: "LANG728"})}
                        </Button>
                    </div>
                </Form>
        )
    }
}

module.exports = Form.create()(injectIntl(EditLdapPhonebookItem))