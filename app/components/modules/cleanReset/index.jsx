'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import ResetReboot from './resetReboot'
import Cleaner from './cleaner'
import Cleanup from './cleanup'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class CleanReset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: this.props.params.id ? this.props.params.id : '1',
            isDisplay: "hidden"
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _handleSubmit = () => {
        // e.preventDefault()
        const { formatMessage } = this.props.intl
        const { form } = this.props

        // if ($P("#form", document).valid()) {
        //    message.loading(formatMessage({ id: "LANG904"}))
        // })

        let all = form.getFieldsValue() 

        let data = {
            action: "setCleanerValue"
        }

        _.each(all, function(num, key) {
            if (key === 'Phour_clean_cdr' || key === 'Pclean_cdr_interval' || key === 'Pclean_record_threshold' || key === 'Phour_clean_vr' || key === 'Pclean_record_interval') {
                data[key] = num
            } else {
                data[key] = num ? "1" : "0"
            }
        })

        $.ajax({
            url: api.apiHost,
            method: "post",
            data: data,
            type: 'json',
            error: function(e) {
                // message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)
                
                if (bool) {
                    this._applyChanges()
                }
            }.bind(this)
        })
    }
    _applyChanges = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'GET',
            url: '../cgi?action=reloadCrontabs&crontabjobs=',
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.success(formatMessage({ id: "LANG844"}))
                }
            }
        }).bind(this)
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
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG5302"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ this.state.isDisplay }
                />
                <Tabs defaultActiveKey="1" onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG649"})} key="1">
                        <ResetReboot/>
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG643"})} key="2">
                        <Cleaner 
                            form={ this.props.form }
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG5122"})} key="3">
                        <Cleanup />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

CleanReset.propTypes = {
}

export default Form.create()(injectIntl(CleanReset))