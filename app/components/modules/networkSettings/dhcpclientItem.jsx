'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage, formatMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, TimePicker } from 'antd'
import moment from "moment"

const FormItem = Form.Item
const Option = Select.Option
const addZero = UCMGUI.addZero

class DHCPClientItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ipList: [],
            macList: []
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }

    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _getInitData = () => {
        const id = this.props.params.id
        let ipList = this.state.ipList || []
        let macList = this.state.macList || []

        if (id) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'listDHCPClient'
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        const dhcplist = response.dhcp_client_list
                        dhcplist.map(function(item) {
                            macList.push(item.mac)
                            ipList.push(item.ip)
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            ipList: ipList,
            macList: macList
        })
    }
    _handleCancel = () => {
        browserHistory.push('/system-settings/networkSettings/2')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const id = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = {}
                action["ip"] = values.ip
                action["isbind"] = "yes"
                action["mac"] = values.mac

                if (id) {
                    action.action = 'updateDHCPClient'
                } else {
                    action.action = 'addDHCPClient'
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
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, setFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        let mac = this.props.params.id
        let ip = this.props.params.name

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG4588"}, {
                    0: this.props.params.id
                })
                : formatMessage({id: "LANG4587"}))

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
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4653" /> }>
                                        <span>{ formatMessage({id: "LANG154"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator('mac', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: mac
                            })(
                                <Input/>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4654" /> }>
                                        <span>{ formatMessage({id: "LANG155"}) }</span>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            { getFieldDecorator('ip', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: ip
                            })(
                                <Input/>
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(DHCPClientItem))