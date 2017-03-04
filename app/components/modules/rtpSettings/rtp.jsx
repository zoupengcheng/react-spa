'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Input, Button, Checkbox, message, Popover } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item

class RTP extends Component {
    constructor(props) {
        super(props)
        this.state = {
            settings: {}
        }
    }
    componentDidMount() {
        this._getRTPSettings()
    }
    _getRTPSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getRTPSettings' },
            type: 'json',
            async: false,
            success: function(res) {
                let response = res.response || {}

                this.setState({
                    settings: response.rtp_settings || {}
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleCancel = () => {
        browserHistory.push('/pbx-settings/rtpSettings')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values

                action.action = 'updateRTPSettings'
                action.strictrtp = (action.strictrtp ? 'yes' : 'no')
                action.rtpchecksums = (action.rtpchecksums ? 'yes' : 'no')
                action.icesupport = (action.icesupport ? 'yes' : 'no')

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(formatMessage({ id: "LANG815" }))
                        }
                    }.bind(this)
                })
            }
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        let settings = this.state.settings || {}
        let rtpstart = settings.rtpstart
        let rtpend = settings.rtpend
        let strictrtp = (settings.strictrtp === 'yes')
        let rtpchecksums = (settings.rtpchecksums === 'yes')
        let icesupport = (settings.icesupport === 'yes')
        let stunaddr = settings.stunaddr
        let bfcpstart = settings.bfcpstart
        let bfcpend = settings.bfcpend
        let bfcp_tcp_start = settings.bfcp_tcp_start
        let bfcp_tcp_end = settings.bfcp_tcp_end
        let turnaddr = settings.turnaddr
        let turnusername = settings.turnusername
        let turnpassword = settings.turnpassword

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG676"})})

        return (
            <div className="app-content-main">
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG1618"}) } content={ formatMessage({id: "LANG1619"}) }><span>{ formatMessage({id: "LANG1618"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('rtpstart', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: rtpstart
                        })(
                            <Input min={ 1024 } max={ 65535 } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG1616"}) } content={ formatMessage({id: "LANG1617"}) }><span>{ formatMessage({id: "LANG1616"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('rtpend', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: rtpend
                        })(
                            <Input min={ 1024 } max={ 65535 } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG1620"}) } content={ formatMessage({id: "LANG1621"}) }><span>{ formatMessage({id: "LANG1620"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('strictrtp', {
                            valuePropName: 'checked',
                            initialValue: strictrtp
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG1614"}) } content={ formatMessage({id: "LANG1615"}) }><span>{ formatMessage({id: "LANG1614"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('rtpchecksums', {
                            valuePropName: 'checked',
                            initialValue: rtpchecksums
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4394"}) } content={ formatMessage({id: "LANG4436"}) }><span>{ formatMessage({id: "LANG4394"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('icesupport', {
                            valuePropName: 'checked',
                            initialValue: icesupport
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG1575"}) } content={ formatMessage({id: "LANG4437"}) }><span>{ formatMessage({id: "LANG1575"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('stunaddr', {
                            rules: [
                                { validator: this._checkJBMax }
                            ],
                            initialValue: stunaddr
                        })(
                            <Input />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4738"}) } content={ formatMessage({id: "LANG4742"}) }><span>{ formatMessage({id: "LANG4738"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('bfcpstart', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: bfcpstart
                        })(
                            <Input min={ 1024 } max={ 65535 } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4739"}) } content={ formatMessage({id: "LANG4743"}) }><span>{ formatMessage({id: "LANG4739"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('bfcpend', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: bfcpend
                        })(
                            <Input min={ 1024 } max={ 65535 } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4740"}) } content={ formatMessage({id: "LANG4744"}) }><span>{ formatMessage({id: "LANG4740"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('bfcp_tcp_start', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: bfcp_tcp_start
                        })(
                            <Input min={ 1024 } max={ 65535 } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4741"}) } content={ formatMessage({id: "LANG4745"}) }><span>{ formatMessage({id: "LANG4741"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('bfcp_tcp_end', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: bfcp_tcp_end
                        })(
                            <Input min={ 1024 } max={ 65535 } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4406"}) } content={ formatMessage({id: "LANG4438"}) }><span>{ formatMessage({id: "LANG4406"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('turnaddr', {
                            rules: [
                                { validator: this._checkJBMax }
                            ],
                            initialValue: turnaddr
                        })(
                            <Input />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4407"}) } content={ formatMessage({id: "LANG4439"}) }><span>{ formatMessage({id: "LANG4407"}) }</span></Popover>
                            </span>
                        )}
                    >
                        <input type="text" name="turnusername" className="hidden" />
                        { getFieldDecorator('turnusername', {
                            rules: [
                                { validator: this._checkJBMax }
                            ],
                            initialValue: turnusername
                        })(
                            <Input />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4408"}) } content={ formatMessage({id: "LANG4440"}) }><span>{ formatMessage({id: "LANG4408"}) }</span></Popover>
                            </span>
                        )}
                    >
                        <input type="password" name="turnpassword" className="hidden" />
                        { getFieldDecorator('turnpassword', {
                            rules: [
                                { validator: this._checkJBMax }
                            ],
                            initialValue: turnpassword
                        })(
                            <Input type="password" />
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default injectIntl(RTP)