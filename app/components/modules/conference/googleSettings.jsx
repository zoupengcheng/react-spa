'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, message, Popconfirm, Tooltip, Row, Col, Input } from 'antd'

const FormItem = Form.Item

class GoogleSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountSettings: {},
            authorBlank: 'hidden',
            authorHref: '',
            requestCode: ''
        }
    }
    componentDidMount() {
        this._getGoogleAuthor()
    }
    _calendarSettings = () => {
        browserHistory.push('/call-features/conference/calendarSettings')
    }
    _getGoogleAuthor = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getGoogleAuthorizationInfo'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response.googlecalendar || {}

                this.setState({
                    accountSettings: response
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleSubmit = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = values

                action.action = 'updateOauthJsonFile'

                $.ajax({
                    url: api.apiHost,
                    method: "POST",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)
                        }
                    }.bind(this)
                })
            }
        })
    }
    _resetAuth = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'resetOauthJsonFile'
            },
            type: 'json',
            async: false,
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    this.props.form.resetFields()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getAuthorUrl = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'updateOauthJsonFile',
                client_name: 'calendar'
            },
            type: 'json',
            async: false,
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    var res = data.response.result,
                        openRes = window.open(res, '_blank')

                    if (!openRes) {
                        this.setState({
                            authorHref: res,
                            authorBlank: 'display-block'
                        })
                    } else {
                        this.setState({
                            authorBlank: 'hidden'
                        })
                    }
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _updateCertificate = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG905" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: "POST",
            data: {
                action: 'updateCertificate',
                client_name: 'calendar',
                request_code: this.state.requestCode
            },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                    this.setState({
                        request_code: ''
                    })
                }
            }.bind(this)
        })
    }
    _requestCode = (e) => {
        this.setState({
            requestCode: e.target.value
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        let accountSettings = this.state.accountSettings

        return (
            <div className="app-content-main app-content-conference">
                <div className="content">
                    <div className="top-button">
                        <Button icon="plus" type="primary" size="default" onClick={ this._calendarSettings }>
                            { formatMessage({id: "LANG3516"}) }
                        </Button>
                    </div>
                    <div className="ant-form">
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG4390"}) }</span>
                                </div>
                            </Col>
                        </Row>
                        <Form>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4392" /> }>
                                        <span>{ formatMessage({id: "LANG3514"}) }</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('client_id', {
                                    initialValue: accountSettings.client_id
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4392" /> }>
                                        <span>{ formatMessage({id: "LANG3515"}) }</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('client_secret', {
                                    initialValue: accountSettings.client_secret
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                            <div>
                                <Button type="primary" size="default" onClick={ this._handleSubmit }>
                                    { formatMessage({id: "LANG3518"}) }
                                </Button>
                                <Button type="Ghost" size="default" onClick={ this._resetAuth }>
                                    { formatMessage({id: "LANG750"}) }
                                </Button>
                            </div>
                        </Form>
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG4386"}) }</span>
                                </div>
                            </Col>
                        </Row>
                        <div>
                            <div className="step-content">
                                <span className="step">1</span>
                                <span style={{ marginRight: 20 }}>{ formatMessage({id: "LANG4411"}) }</span>
                                <Button type="primary" size="default" onClick={ this._getAuthorUrl }>
                                    { formatMessage({id: "LANG4387"}) }
                                </Button>
                                <div className={ this.state.authorBlank } style={{ marginTop: 10 }}>
                                    <span style={{ marginRight: 10 }}>{ formatMessage({id: "LANG4388"}) }</span>
                                    <a href={ this.state.authorHref } target="_blank">{ formatMessage({id: "LANG4387"}) }</a>
                                </div>
                            </div>
                            <div className="step-content">
                                <span className="step">2</span>
                                <span>{ formatMessage({id: "LANG4412"}) }</span>
                            </div>
                            <div className="step-content">
                                <span className="step">3</span>
                                <span>{ formatMessage({id: "LANG4413"}) }</span>
                            </div>
                            <div className="step-content">
                                <span className="step">4</span>
                                <span>{ formatMessage({id: "LANG4414"}) }</span>
                                <div style={{ marginTop: 10 }}>
                                    <span style={{ marginRight: 20, marginLeft: 50 }}>{ formatMessage({id: "LANG3794"}) }</span>
                                    <Input style={{ width: 400, marginRight: 20 }} onChange={ this._requestCode } value={ this.state.requestCode } />
                                    <Button type="primary" size="default" onClick={ this._updateCertificate }>
                                        { formatMessage({id: "LANG3518"}) }
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(GoogleSettings))