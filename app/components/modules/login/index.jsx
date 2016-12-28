'use strict'

import Footer from '../../../views/footer'
import React from 'react'
import { browserHistory } from 'react-router'
import { message, Select, Form, Input, Button, Row, Col } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import $ from 'jquery'
import md5 from "../../api/md5"
import api from "../../api/api"
// import Ucmgui from "./../api/ucmgui"
import cookie from 'react-cookie'

const FormItem = Form.Item
const Option = Select.Option

// const UCMGUI = new Ucmgui()

const Login = React.createClass({
    getDefaultProps() {

    },
    getInitialState() {
        return {
            countryArr: JSON.parse(localStorage.getItem('countryArr'))
        }
    },
    componentDidMount() {
        // Get cursor focus
        let username = $('#username').val()

        if (username) {
            $('#password').focus()
        } else {
            $('#username').focus()
        }
    },
    componentWillReceiveProps(nextProps) {

    },
    handleSubmit(e) {
        const { form } = this.props

        const username = form.getFieldValue("username"),
            password = form.getFieldValue("password")

        if (username && password) {
            let cb = $.ajax({
                url: api.apiHost,
                method: 'post',
                data: { 
                    action: 'challenge',
                    user: username
                },
                type: 'json',
                async: false
            })

            const resText = JSON.parse(cb.responseText)

            if ((typeof resText === 'object') && resText.hasOwnProperty('response') && resText.response.hasOwnProperty('challenge')) {
                let challenge = resText.response.challenge,
                    md5key = md5(challenge + password), 
                    obj = {
                        username: username,
                        password: password,
                        md5key: md5key
                    }

                this.login(obj)
            } else {
                this.loginError(resText)
            }
        } else {
            message.error('Username or password can not be empty')
        }

        e.preventDefault()
    },
    login(obj) {
        let password = obj.password,
            username = obj.username,
            md5key = obj.md5key

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'login',
                user: username,
                token: md5key
            },
            type: 'json',
            success: function(res) {
                if ((typeof res === 'object') && res.hasOwnProperty('status')) {
                    if (res.status === 0) {
                        localStorage.setItem('adminId', res.response.user.user_id)
                        localStorage.setItem('username', username)

                        localStorage.setItem('role', res.response.user.user_role)
                        localStorage.setItem('is_strong_password', res.response.user.is_strong_password)
                        localStorage.setItem('first_login', 'no')

                        if (res.response.module_switch && res.response.module_switch.hasOwnProperty('enable_module')) {
                            cookie.save('enable_module', res.response.module_switch.enable_module)
                        }

                        if ((res.response.user.user_role === 'privilege_0') && (res.response.user.is_first_login === 'yes')) {
                            localStorage.setItem('first_login', 'yes')

                            // $(this).attr({
                            //     'action': './settings_guide.html'
                            // })
                        }

                        // UCMGUI.loginFunction.checkTrigger()
                        setTimeout(function() {
                            browserHistory.push('/system-status/dashboard')
                        }, 2000)

                        // window.socket.send({
                        //     "type": "request",
                        //     "message": {
                        //         "transactionid": "123456789zxa",
                        //         "action": "login",
                        //         "username": cookie.load("username"),
                        //         "cookie": cookie.load("session-identify")
                        //     }
                        // })
                        // $(".errorInfo").css("visibility", "hidden")

                        // $P.lang(doc, true, true)
                    } else {
                        this.loginError(res)
                    }
                }
            }.bind(this),
            error: function(e) {
                console.log(e.toString())
            }.bind(this)
        })
    },
    loginError(res) {
        let domPws = $('#password').focus()
        const {formatMessage} = this.props.intl

        if (res.status === -68) {
            let remainTime = res.response.remain_time,
                minute = parseInt((Number(remainTime) / 60)) + formatMessage({id: "LANG5148"})

            if (Number(remainTime) < 60) {
                minute = Number(remainTime) + formatMessage({id: "LANG5147"})
            }

            message.error(formatMessage({id: "LANG4725"}, { 0: minute }))

            domPws.blur()

            return false
        } else if (res.response && res.response.remain_num && res.status === -37) {
            message.error(formatMessage({id: "LANG4794"}, { 0: res.response.remain_num }))

            domPws.blur()

            return false
        } else if (res.status === -70) {
            message.error(formatMessage({id: "LANG4795"}))

            return false
        } else {
            message.error(formatMessage({id: "LANG984"}))

            domPws.focus()
            domPws.select()

            return false
        }
    },
    forgetPassword(e) {
        console.log("forgetPassword")
    },
    handleChange(val) {
        localStorage.setItem('locale', val)

        window.location.reload()
    },
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        return (
            <div className="app-login-wrapper">
                <div className="app-login clearfix">
                    <div className="login-box main-box">
                        <div className="main-box-inner">
                            <Form horizontal={ true } onSubmit={ this.handleSubmit }>
                                <FormItem
                                    id="username"
                                    label={ formatMessage({id: "LANG992"}) }
                                    labelCol={{
                                        span: 6
                                    }}
                                    wrapperCol={{
                                        span: 14
                                    }}>
                                    {getFieldDecorator("username", {
                                        initialValue: "",
                                        rules: [
                                            { required: true, message: formatMessage({id: "LANG4025"}) }
                                        ]
                                    })(
                                        <Input type="text" placeholder={ formatMessage({id: "LANG5259"}) } />
                                    )}
                                </FormItem>

                                <FormItem
                                    id="password"
                                    label={ formatMessage({id: "LANG993"}) }
                                    labelCol={{
                                        span: 6
                                    }}
                                    wrapperCol={{
                                        span: 14
                                    }}>
                                    {getFieldDecorator("password", {
                                        rules: [
                                            { required: true, message: formatMessage({id: "LANG4026"}) }
                                        ]
                                    })(
                                        <Input type="password" placeholder={ formatMessage({id: "LANG5260"}) } />
                                    )}
                                </FormItem>

                                <FormItem wrapperCol={{
                                    span: 14,
                                    offset: 6
                                }}>
                                    <label>
                                        <FormattedMessage
                                            id={ 'LANG4189' }
                                            defaultMessage={ 'Forgot Password?' }
                                            onclick={ this.forgetPassword }
                                        />
                                    </label>

                                    <Select defaultValue={ localStorage.getItem('locale') || "en-US" } style={{ width: 100, float: "right" }} onChange={ this.handleChange }>
                                        {
                                           this.state.countryArr.map(function(it) {
                                            const lang = it.languages
                                            return <Option key={ lang } value={ lang }>
                                                   { it.localName }
                                                </Option>
                                        })}
                                    </Select>
                                </FormItem>

                                <Row>
                                    <Col offset="6" span="16">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            style={{
                                                width: '240px'
                                            }}>确定</Button>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col
                                        span="24"
                                        style={{
                                            textAlign: 'center',
                                            marginTop: 50
                                        }}>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
})

module.exports = Form.create()(injectIntl(Login))