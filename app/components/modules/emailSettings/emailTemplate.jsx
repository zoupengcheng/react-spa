'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"

import Editor from 'react-umeditor'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class EmailTemplate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            content: '',
            settings: [],
            emailType: {
                'cdr': 'LANG7',
                'fax': 'LANG95',
                'account': 'LANG85',
                'alert': 'LANG2553',
                'voicemail': 'LANG20',
                'password': 'LANG2810',
                'conference': 'LANG3775',
                'sip_account': 'LANG2927',
                'iax_account': 'LANG2928',
                'fxs_account': 'LANG2929'
            }
        }
    }
    componentDidMount() {
    }
    componentWillMount() {
        // this._getSIPWebRTCHttpSettings()
    }
    _getSIPWebRTCHttpSettings = () => {
        let settings = []
        let oldTLSPort = ''
        let oldHTTPPort = ''
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getSIPWebRTCHttpSettings'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    settings = response.webrtc_http_settings || []

                    oldHTTPPort = settings.bindport

                    if (settings.tlsbindaddr) {
                        oldTLSPort = settings.tlsbindaddr.split(':')[1]

                        if (UCMGUI.isIPv6(settings.tlsbindaddr)) {
                            oldTLSPort = settings.tlsbindaddr.split("]:")[1]
                        }
                    }

                    let httpPort = settings.bindport ? settings.bindport : '8088'
                    let httpAddr = settings.bindaddr ? settings.bindaddr : '0.0.0.0'
                    let tlsbindaddr = settings.tlsbindaddr ? settings.tlsbindaddr : '0.0.0.0:8443'

                    settings.websocket_interface = ('ws://' + httpAddr + ':' + httpPort + '/ws')
                    settings.secure_websocket_interface = ('wss://' + tlsbindaddr + '/ws')

                    this.setState({
                        settings: settings,
                        oldTLSPort: oldTLSPort,
                        oldHTTPPort: oldHTTPPort,
                        enabled: settings.enabled === 'yes',
                        tlsenable: settings.tlsenable === 'yes'
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getIcons = () => {
        let icons = [
            'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            // 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'paragraph', 'fontfamily', 'fontsize', '|',
            'indent', 'justifyleft', 'justifycenter', 'justifyright', '|', 'touppercase', 'tolowercase'
            // '|', 'link', 'unlink'
        ]

        return icons
    }
    _handleCancel = (e) => {
        browserHistory.push('/system-settings/emailSettings')
    }
    _handleSubmit = (e) => {
        // e.preventDefault()
        const form = this.props.form
        const { formatMessage } = this.props.intl

        form.validateFieldsAndScroll({ force: true }, (err, values) => {
            if (!err) {
                message.loading(formatMessage({ id: "LANG826" }), 0)

                let childAction = []
                let updateWebRTCParamList = []
                let updateWebRTCSettings = {
                    'updateSIPWebRTCHttpSettings': ''
                }

                _.map(values, function(value, key) {
                    if (key === 'ws_websocket_interface' || key === 'ws_secure_websocket_interface') {
                        return false
                    }

                    if (key.indexOf('ws_') === 0) {
                        let keyValue = key.slice(3) + '=' + (value !== undefined && value !== null ? encodeURIComponent(UCMGUI.transCheckboxVal(value)) : '')

                        updateWebRTCParamList.push(keyValue)
                    }
                })

                updateWebRTCSettings.updateSIPWebRTCHttpSettings = updateWebRTCParamList.join('&')

                childAction.push(updateWebRTCSettings)

                $.ajax({
                    type: 'json',
                    method: "get",
                    url: api.apiHost + 'action=combineAction&data=' + JSON.stringify(childAction),
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>, 2)

                            this._handleCancel()
                        }
                    }.bind(this)
                })
            }
        })
    }
    _onChangeHTTP = (e) => {
        this.setState({
            enabled: e.target.checked
        })
    }
    _onChangeTLS = (e) => {
        this.setState({
            tlsenable: e.target.checked
        })
    }
    _onHandleChange = (content) => {
        this.setState({
            content: content
        })
    }
    render() {
        let icons = this._getIcons()
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const settings = this.state.settings || {}
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const title = formatMessage({ id: "LANG222" }, {
                        0: formatMessage({ id: "LANG4576" }),
                        1: formatMessage({ id: this.state.emailType[this.props.params.type] })
                    })

        document.title = formatMessage({ id: "LANG584" }, {
                    0: model_info.model_name,
                    1: title
                })

        const formItemRowLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        }

        return (
            <div className="content">
                <Title
                    headerTitle={ title }
                    isDisplay='display-block'
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                />
                <div className="ant-form">
                    <FormItem
                        { ...formItemRowLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1524" /> }>
                                    <span>{ formatMessage({id: "LANG1524"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('emailsubject', {
                            rules: [],
                            initialValue: settings.emailsubject
                        })(
                            <Input />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemRowLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG5376" /> }>
                                    <span>{ formatMessage({id: "LANG5376"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        <Editor
                            ref="editor" 
                            icons={ icons } 
                            defaultValue={ title }
                            value={ this.state.content }
                            onChange={ this._onHandleChange.bind(this) }
                        />
                    </FormItem>
                    <FormItem
                        { ...formItemRowLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG5377" /> }>
                                    <span>{ formatMessage({id: "LANG5377"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('plainText', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: settings.plainText
                        })(
                            <Input type="textarea" rows={ 4 } />
                        ) }
                    </FormItem>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(EmailTemplate))