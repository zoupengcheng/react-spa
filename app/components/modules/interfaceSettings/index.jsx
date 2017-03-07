'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import DigitalHardware from './digitalHardware'
import AnalogHardware from './analogHardware'
import { Tabs, Modal, message, Form } from 'antd'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import $ from 'jquery'
import { browserHistory } from 'react-router'

const TabPane = Tabs.TabPane

class InterfaceSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: this.props.params.id ? this.props.params.id : '1',
            isDisplay: this.props.params.id && this.props.params.id === '2' ? 'display-block' : 'hidden',
            hardware_global_settings: {},
            fxsTissShow: false
        }
    }
    componentDidMount() {
        this._getAnalogSettings()
    }
    componentWillUnmount() {

    }
    _onChange = (activeKey) => {
        if (activeKey === "1") {
            this.setState({
                isDisplay: 'hidden',
                activeKey: activeKey
            })
        } else {
            this.setState({
                isDisplay: 'display-block',
                activeKey: activeKey
            })           
        }
    }
    _getAnalogSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getAnalogSettings'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const hardware_global_settings = response.hardware_global_settings
                    const fxsTissShow = hardware_global_settings.fxs_override_tiss === 1

                    this.setState({
                        hardware_global_settings: hardware_global_settings,
                        fxsTissShow: fxsTissShow
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _updateTiss = (e) => {
        this.setState({
            fxsTissShow: e
        })
    }
    _handleCancel = (e) => {
        const { resetFields } = this.props.form
        this._getAnalogSettings()
        this.setState({
            activeKey: '2'
        })
        resetFields()
    }
    _reBoot = () => {
        UCMGUI.loginFunction.confirmReboot()
    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        const __this = this

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                const hardware_global_settings = this.state.hardware_global_settings
                let needReboot = false
                let action = {}
                action.action = 'updateAnalogSettings'
                action.fxs_override_tiss = values.fxs_override_tiss ? 1 : 0
                for (let item in values) {
                    if ((hardware_global_settings[item] + '') !== values[item]) {
                        if (item !== 'fxs_override_tiss') {
                            action[item] = values[item]
                        }
                        if (item === 'alawoverride') {
                            needReboot = true
                        } else if (item === 'fxo_opermode') {
                            action["ifACIMautodetect"] = "no"
                        }
                    }
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
                            if (needReboot) {
                                Modal.confirm({
                                    title: (formatMessage({id: "LANG543"})),
                                    content: <span dangerouslySetInnerHTML={{ __html: formatMessage({id: "LANG927"}) }}></span>,
                                    okText: formatMessage({id: "LANG727"}),
                                    cancelText: formatMessage({id: "LANG726"}),
                                    onOk: __this._reBoot.bind(this)
                                })
                            }
                        }

                        this._handleCancel()
                    }.bind(this)
                })
            }
        })
    }
    render() {
        const {formatMessage} = this.props.intl

        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG5303"})
        })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG5303"}) }
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                    isDisplay={ this.state.isDisplay }
                />
                <Tabs defaultActiveKey="1" activeKey={ this.state.activeKey } onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG686"})} key="1">
                        <DigitalHardware />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG687"})} key="2">
                        <AnalogHardware 
                            form={this.props.form}
                            hardware_global_settings={this.state.hardware_global_settings}
                            fxsTissShow={this.state.fxsTissShow}
                            updateTiss={this._updateTiss}
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

InterfaceSettings.propTypes = {
}

export default Form.create()(injectIntl(InterfaceSettings))