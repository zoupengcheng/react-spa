'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Minibar from './pmsMinibar'
import Wakeup from './pmsWakeup'
import BasicSetting from './basicSettings'
import Room from './pmsRooms'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class PmsSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: this.props.params.id ? this.props.params.id : '1',
            isDisplay: "display-block",
            basicSettings: {
                pms_protocol: "",
                wakeup_prompt: "",
                pms_addr: "",
                ucm_port: "",
                username: "",
                password: ""
            },
            fileList: [{
                val: "wakeup-call",
                text: "wakeup-call"
                }]
        }
    }
    componentDidMount() {
        this._getBasicSettings()
        this._getFileList()
    }
    componentWillUnmount() {

    }
    _removeSuffix = (filename) => {
        let name = filename.toLocaleLowerCase(),
            file_suffix = [".mp3", ".wav", ".gsm", ".ulaw", ".alaw"]

        for (let i = 0; i < file_suffix.length; i++) {
            let num = name.lastIndexOf(file_suffix[i])

            if (num !== -1 && name.endsWith(file_suffix[i])) {
                filename = filename.substring(0, num)

                return filename
            }
        }
    }
    _onChange = (e) => {
        if (e === "1") {
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
    _getBasicSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getPMSSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        basicSettings = res.pms_settings
                        if (!basicSettings.pms_protocol) {
                            basicSettings.pms_protocol = 'disable'
                        }
                    this.setState({
                        basicSettings: basicSettings
                    })
                }
            }.bind(this)
        })        
    }
    _getFileList = () => {
        const __this = this
        let fileList = this.state.fileList

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listFile',
                type: 'ivr',
                filter: '{"list_dir":0,"list_file":1,"file_suffix":["mp3","wav","gsm","ulaw","alaw"]}',
                sidx: 'n',
                sord: 'desc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    response.ivr.map(function(item) {
                        let obj = { 
                            text: item.n,
                            val: "record/" + __this._removeSuffix(item.n)
                        }
                        fileList.push(obj)
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })      
        this.setState({
            fileList: fileList
        })
    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        let action = {}

        let basicSettings = this.state.basicSettings

        let basicSettingsAction = {}
        basicSettingsAction["action"] = "updatePMSSettings"
        const pms_protocol = _.isObject(basicSettings.pms_protocol) ? basicSettings.pms_protocol.value : basicSettings.pms_protocol
        if (pms_protocol === 'disable') {
            basicSettingsAction["pms_enable"] = 0
            basicSettingsAction["pms_protocol"] = null
        } else if (pms_protocol === 'mitel') {
            basicSettingsAction["wakeup_prompt"] = _.isObject(basicSettings.wakeup_prompt) ? basicSettings.wakeup_prompt.value : basicSettings.wakeup_prompt
            basicSettingsAction["pms_protocol"] = pms_protocol
            basicSettingsAction["ucm_port"] = _.isObject(basicSettings.ucm_port) ? basicSettings.ucm_port.value : basicSettings.ucm_port
            basicSettingsAction["pms_enable"] = 1
        } else {
            basicSettingsAction["username"] = _.isObject(basicSettings.username) ? basicSettings.username.value : basicSettings.username
            basicSettingsAction["password"] = _.isObject(basicSettings.password) ? basicSettings.password.value : basicSettings.password
            basicSettingsAction["pms_addr"] = _.isObject(basicSettings.pms_addr) ? basicSettings.pms_addr.value : basicSettings.pms_addr
            basicSettingsAction["ucm_port"] = _.isObject(basicSettings.ucm_port) ? basicSettings.ucm_port.value : basicSettings.ucm_port
            basicSettingsAction["wakeup_prompt"] = _.isObject(basicSettings.wakeup_prompt) ? basicSettings.wakeup_prompt.value : basicSettings.wakeup_prompt
            basicSettingsAction["pms_protocol"] = pms_protocol
            basicSettingsAction["pms_enable"] = 1

            for (let key in basicSettingsAction) {
                if (basicSettingsAction[key] === null || basicSettingsAction[key] === "") {
                    return
                }
            }
        }   

        $.ajax({
            url: api.apiHost,
            method: "post",
            data: basicSettingsAction,
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}} ></span>)
                }
            }.bind(this)
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG4855"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG4855"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ this.state.isDisplay }
                />
                <Tabs defaultActiveKey={ this.state.activeKey } onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG2217"})} key="1">
                        <BasicSetting 
                            dataSource={this.state.basicSettings}
                            fileList={this.state.fileList}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG4857"})} key="2">
                        <Room />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG4858"})} key="3">
                        <Wakeup />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG5056"})} key="4">
                        <Minibar />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

PmsSettings.propTypes = {
}

export default injectIntl(PmsSettings)