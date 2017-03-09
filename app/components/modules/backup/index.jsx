'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import DataSync from './dataSync'
import BackupRestore from './backup'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Input, Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class Backup extends Component {
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
        const { formatMessage } = this.props.intl
        const { form } = this.props

        let loadingMessage = ''
        let successMessage = ''

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG904" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        let all = form.getFieldsValue() 

        let data = {
            action: "setDataSyncValue"
        }

        _.each(all, function(num, key) {
            if (key === 'Pen_auto_backup') {
                data[key] = num ? "1" : "0"
            } else if (key === 'Psync_cdr' || key === 'Psync_record' || key === 'Psync_voicemail' || key === 'Psync_vfax') {
                data[key] = num ? "yes" : "no"
            } else {
                data[key] = num
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
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG62"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG62"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ this.state.isDisplay }
                />
                <Tabs defaultActiveKey="1" onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG63"})} key="1">
                        <BackupRestore />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG64"})} key="2">
                        <DataSync 
                            form={ this.props.form }
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

Backup.propTypes = {
}

export default Form.create()(injectIntl(Backup))