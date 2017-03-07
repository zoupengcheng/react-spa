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
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG1992"}) }>
                        { getFieldDecorator('basedn', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG2016"}) }>
                        { getFieldDecorator('pbxdn', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG1993"}) }>
                        { getFieldDecorator('rootdn', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG1994"}) }>
                        <Input type="password" name="rootpw" className="hidden" />
                        { getFieldDecorator('rootpw', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG1995"}) }>
                        <Input type="password" name="rootpwCfm" className="hidden" />
                        { getFieldDecorator('rootpwCfm', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}

module.exports = Form.create()(injectIntl(LdapServerConf))