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

class LdapServerConf extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ldapConfigs: {}
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
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const state = this.state

        return (
            <div className="content">
                <FormItem
                    { ...formItemLayout }
                    label={ formatMessage({id: "LANG1992"}) }>
                    { getFieldDecorator('basedn', {
                        rules: [],
                        initialValue: state.ldapConfigs.basedn || ""
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={ formatMessage({id: "LANG2016"}) }>
                    { getFieldDecorator('pbxdn', {
                        rules: [],
                        initialValue: state.ldapConfigs.pbxdn || ""
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={ formatMessage({id: "LANG1993"}) }>
                    { getFieldDecorator('rootdn', {
                        rules: [],
                        initialValue: state.ldapConfigs.rootdn || ""
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={ formatMessage({id: "LANG1994"}) }>
                    <Input type="password" name="root_passwd" className="hidden" />
                    { getFieldDecorator('root_passwd', {
                        rules: [],
                        initialValue: state.ldapConfigs.root_passwd || ""
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={ formatMessage({id: "LANG1995"}) }>
                    <Input type="password" name="root_passwd_cfm" className="hidden" />
                    { getFieldDecorator('root_passwd_cfm', {
                        rules: [],
                        initialValue: state.ldapConfigs.root_passwd || ""
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
            </div>
        )
    }
}

module.exports = injectIntl(LdapServerConf)