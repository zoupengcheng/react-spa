'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import LdapServerConf from './ldapServerConf'
import LdapPhonebook from './ldapPhonebook'
import { Tabs, Form, message } from 'antd'
import $ from 'jquery'
import UCMGUI from "../../api/ucmgui"
import api from "../../api/api"

const TabPane = Tabs.TabPane
const baseServerURl = api.apiHost

class LdapServer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstLoad: true,
            isDisplay: true
        }
        this._onChange = (activeKey) => {
            if (activeKey === "1") {
                this.setState({
                    isDisplay: true,
                    firstLoad: false
                })
            } else {
                this.setState({
                    isDisplay: false,
                    firstLoad: true
                })
            }
        }
        this._handleSubmit = (e) => {
            const { formatMessage } = this.props.intl
            const form = this.props.form

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

                delete action.root_passwd_cfm

                message.loading(formatMessage({ id: "LANG904" }), 0)

                    let eq_pos = action.pbxdn.indexOf('='),
                        prefix_attr = action.pbxdn.substring(0, eq_pos)

                    action["action"] = "updateLDAPConfig"
                    action["prefix_attr"] = prefix_attr

                    $.ajax({
                        type: "post",
                        url: "../cgi",
                        async: false,
                        data: action,
                        error: function(jqXHR, textStatus, errorThrown) {
                            message.destroy()
                            message.error(errorThrown)
                        },
                        success: function(data) {
                            $.ajax({
                                type: "post",
                                url: "../cgi",
                                data: {
                                    "action": "reloadLDAP",
                                    "reload_ldap": null
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    message.destroy()
                                    message.error(errorThrown)
                                },
                                success: function(data) {
                                    message.destroy()
                                    message.success(formatMessage({ id: "LANG940" }))
                                    this.forceUpdate()
                                }.bind(this)
                            })
                        }.bind(this)
                    })
            })
        }
        this._handleCancel = (e) => {
            const { formatMessage } = this.props.intl
            const form = this.props.form
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
        const {formatMessage} = this.props.intl
        const state = this.state
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG56"})
        })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG56"}) } 
                    onSubmit={ this._handleSubmit } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ state.isDisplay ? "display-block" : "hidden" } 
                />
                <Form style={{ padding: 0 }}>
                    <Tabs defaultActiveKey="1" onChange={ this._onChange }>
                        <TabPane tab={formatMessage({id: "LANG712"})} key="1">
                            { <LdapServerConf form={ this.props.form } /> }
                        </TabPane>
                        <TabPane tab={formatMessage({id: "LANG714"})} key="2">
                            { <LdapPhonebook firstLoad={ state.firstLoad } /> }
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

LdapServer.propTypes = {
}

export default Form.create()(injectIntl(LdapServer))