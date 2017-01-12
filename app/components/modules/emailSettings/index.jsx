'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import EmailSendLog from './emailSendLog'
import EmailTemplate from './emailTemplate'
import SMTP from './smtpSettings'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class EmailSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        let action = {}

        action["trunk_type"] = this.state.trunkType

        this.props.form.validateFieldsAndScroll((err, values) => {
            let me = this

            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    if (me.refs["div_" + key] && 
                        me.refs["div_" + key].props &&
                        ((me.refs["div_" + key].props.className &&
                        me.refs["div_" + key].props.className.indexOf("hidden") === -1) ||
                        typeof me.refs["div_" + key].props.className === "undefined")) {
                        if (!err || (err && typeof err[key] === "undefined")) {
                            action[key] = UCMGUI.transCheckboxVal(values[key])   
                        } else {
                            return
                        }
                    }
                }
            }

            console.log('Received values of form: ', values)

            message.loading(formatMessage({ id: "LANG826" }), 0)

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
                        message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                    }
                }.bind(this)
            })
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
                    1: formatMessage({id: "LANG717"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG717"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay='display-block' 
                />
                <Tabs defaultActiveKey="1" onChange={this.onChange}>
                    <TabPane tab={formatMessage({id: "LANG717"})} key="1">
                        <SMTP />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG4572"})} key="2">
                        <EmailTemplate />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG5382"})} key="3">
                        <EmailSendLog />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

EmailSettings.propTypes = {
}

export default Form.create()(injectIntl(EmailSettings))