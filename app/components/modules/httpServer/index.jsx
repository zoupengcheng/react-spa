'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import HttpServer from './http'
import LoginSetting from './loginSetting'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Input, Tabs, message, Modal } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'
import { browserHistory } from 'react-router'

class Http extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: this.props.params.id ? this.props.params.id : '1',
            isDisplay: "display-block"
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _onChange = (e) => {
        if (e === "2") {
            this.setState({
                activeKey: e,
                isDisplay: "display-block"
            })
        } else {
            this.setState({
                activeKey: e,
                isDisplay: "hidden"
            })
        }
    }
    _doSave() {
        const me = this
        $.ajax({
            url: "../cgi?",
            type: "POST",
            data: {
                'action': 'reloadHttpConf',
                'reflash_conf': '0'
            }, 
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown) {
                // top.dialog.dialogMessage({
                //     type: 'error',
                //     content: errorThrown
                // });
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data)

                if (bool) {
                    me._jumpTo()
                }
            }
        })
    }
    _jumpTo = () => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form

        message.loading(formatMessage({ id: "LANG806" }), 0)

        $.ajax({
            type: "POST",
            url: api.apiHost,
            data: "action=reloadHttpServer&reflush_server=0"
        })

        setTimeout(function() {
            message.destroy()

            window.location.reload()
        }, 5000)
    }
    _handleCancel = () => {
        browserHistory.push('/system-settings/httpServer')
    }
    _realSubmit = (values) => {
        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        message.loading(formatMessage({ id: "LANG826" }), 0)

        let action = _.clone(values)

        action.action = 'updateHttpServer'

        action.web_https = (action.web_https === 'disable' ? '0' : '1')
        delete action.cookie_timeout
        delete action.login_max_num
        delete action.login_band_time
        delete action.white_ip_addr

        $.ajax({
            url: api.apiHost,
            method: "post",
            data: action,
            type: 'json',
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(formatMessage({ id: "LANG844" }))
                    this._doSave()
                }
            }.bind(this)
        })
    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        this.props.form.validateFieldsAndScroll({force: true}, (err, values) => {
            // delete err.white_ip_addr
            if (!err) {
                console.log('Received values of form: ', values)
                if (this.state.activeKey === '1') {
                    Modal.confirm({
                        content: <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG807" })}}></span>,
                        okText: formatMessage({id: "LANG727"}),
                        cancelText: formatMessage({id: "LANG726"}),
                        onOk: this._realSubmit.bind(this, values),
                        onCancel: this._handleCancel
                    })
                } else if (this.state.activeKey === '2') { 
                    let action_log = {}
                    action_log.action = 'updateLoginParam'
                    action_log.cookie_timeout = values.cookie_timeout * 60
                    action_log.login_max_num = values.login_max_num
                    action_log.login_band_time = values.login_band_time * 60
                    $.ajax({
                        url: api.apiHost,
                        method: "post",
                        data: action_log,
                        type: 'json',
                        async: false,
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
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG57"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG57"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ 'display-block' }
                />
                <Tabs defaultActiveKey={ this.state.activeKey } onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG57"})} key="1">
                        <HttpServer 
                            form={ this.props.form }
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3965"})} key="2">
                        <LoginSetting
                            form={ this.props.form }
                         />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

Http.propTypes = {
}

export default Form.create()(injectIntl(Http))