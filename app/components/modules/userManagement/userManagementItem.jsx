'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, Row } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class UserItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userItem: {}
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _getInitData = () => {
        const userId = this.props.params.id
        const userName = this.props.params.name
        let userItem = {}

        if (userName) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getUser',
                    user_name: userName
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        userItem = res.response.user_name || {}
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            userItem: userItem
        })
    }
    _gotoChangePwd = () => {
        browserHistory.push('/maintenance/ChangePassword')
    }
    _handleCancel = () => {
        browserHistory.push('/maintenance/userManagement/1')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const userId = this.props.params.id
        const userName = this.props.params.name

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = values
                action._location = 'user_list'

                if (userName && userId) {
                    action.action = 'updateUser'
                    action.user_id = userId
                    action.user_name = userName
                    delete action.user_password
                    delete action.privilege
                    delete action.email
                } else {
                    action.action = 'addUser'
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
        const userName = this.props.params.name
        const manager = <span>{ formatMessage({id: "LANG1047"}) }</span>

        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG2802"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG2802"}) }))

        const userItem = this.state.userItem || {}

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
                    <Row>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_user_name"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2844" />}>
                                        <span>{formatMessage({id: "LANG2809"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('user_name', {
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }],
                                    width: 100,
                                    initialValue: (userName ? userName : "")
                                })(
                                    <Input maxLength='32' disabled={ userName ? true : false } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_user_password"
                                className={ userItem.privilege === 0 ? 'hidden' : 'display-block'}
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2845" />}>
                                        <span>{formatMessage({id: "LANG2810"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('user_password', {
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }],
                                    width: 100,
                                    initialValue: userItem.user_password ? userItem.user_password : ""
                                })(
                                    <Input maxLength='127' disabled={ userItem.privilege === 0 } />
                                ) }
                            </FormItem>
                            <FormItem
                                ref="div_user_password"
                                { ...formItemLayout }
                                className={ userItem.privilege === 0 ? 'display-block' : 'hidden'}

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2845" />}>
                                        <span>{formatMessage({id: "LANG2810"})}</span>
                                    </Tooltip>
                                )}>
                                    <a className="prompt_setting" onClick={ this._gotoChangePwd } >{ formatMessage({id: "LANG55"}) }</a>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_privilege"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2846" />}>
                                        <span>{formatMessage({id: "LANG2811"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('privilege', {
                                    rules: [],
                                    width: 100,
                                    initialValue: userItem.privilege || userItem.privilege === 0 ? userItem.privilege + '' : "1"
                                })(
                                    <Select disabled={ userName ? true : false }>
                                        <Option key="0" value="0" className="hidden" >{<span>{formatMessage({id: "LANG3860"})}</span>}</Option>
                                        <Option key="1" value="1">{<span>{formatMessage({id: "LANG1047"})}</span>}</Option>
                                        <Option key="2" value="2" className="hidden" >{<span>{formatMessage({id: "LANG5173"})}</span>}</Option>
                                        <Option key="3" value="3" className="hidden" >{<span>{formatMessage({id: "LANG2863"})}</span>}</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_department"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2847" />}>
                                        <span>{formatMessage({id: "LANG2812"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('department', {
                                    rules: [],
                                    width: 100,
                                    initialValue: userItem.department ? userItem.department : ""
                                })(
                                    <Input maxLength='64' />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_fax"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2852" />}>
                                        <span>{formatMessage({id: "LANG95"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('fax', {
                                    rules: [],
                                    width: 100,
                                    initialValue: userItem.fax ? userItem.fax : ""
                                })(
                                    <Input maxLength='32' />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_email"
                                { ...formItemLayout }
                                className={ userItem.privilege === 0 ? 'hidden' : 'display-block'}

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1082" />}>
                                        <span>{formatMessage({id: "LANG1081"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('email', {
                                    rules: [],
                                    width: 100,
                                    initialValue: userItem.email ? userItem.email : ""
                                })(
                                    <Input maxLength='255' disabled={ userItem.privilege === 0 } />
                                ) }
                            </FormItem>
                            <FormItem
                                ref="div_email"
                                { ...formItemLayout }
                                className={ userItem.privilege === 0 ? 'display-block' : 'hidden'}

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1082" />}>
                                        <span>{formatMessage({id: "LANG1081"})}</span>
                                    </Tooltip>
                                )}>
                                    <a className="prompt_setting" onClick={ this._gotoChangePwd } >{ formatMessage({id: "LANG4203"}) }</a>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_first_name"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2848" />}>
                                        <span>{formatMessage({id: "LANG2817"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('first_name', {
                                    rules: [],
                                    width: 100,
                                    initialValue: userItem.first_name ? userItem.first_name : ""
                                })(
                                    <Input maxLength='32' />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_last_name"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2849" />}>
                                        <span>{formatMessage({id: "LANG2813"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('last_name', {
                                    rules: [],
                                    width: 100,
                                    initialValue: userItem.last_name ? userItem.last_name : ""
                                })(
                                    <Input maxLength='32' />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_family_number"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2850" />}>
                                        <span>{formatMessage({id: "LANG2814"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('family_number', {
                                    rules: [],
                                    width: 100,
                                    initialValue: userItem.family_number ? userItem.family_number : ""
                                })(
                                    <Input maxLength='32' />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                ref="div_phone_number"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2851" />}>
                                        <span>{formatMessage({id: "LANG2815"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('phone_number', {
                                    rules: [],
                                    width: 100,
                                    initialValue: userItem.phone_number ? userItem.phone_number : ""
                                })(
                                    <Input maxLength='32' />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(UserItem))