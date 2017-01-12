'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import General from './general'
import Reg from './registration'
import Sec from './security'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class IaxSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IAXGenSettings: {
                mohinterpret: 'defalut',
                mohsuggest: 'defalut'
            },
            IAXRegSettings: {},
            IAXSecSettings: {},
            mohNameList: []
        }
    }
    componentDidMount() {
        this._getInitData()
        this._getIAXGenSettings()
        this._getIAXRegSettings()
        this._getIAXSecSettings()
    }
    componentWillUnmount() {

    }
    onChange(activeKey) {
        if (activeKey === "1") {

        } else {

        }
    }
    _getInitData = () => {
        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'getMohNameList'
            },
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var list = data.response.moh_name

                if (list && list.length > 0) {
                    this.setState({
                        mohNameList: list
                    })
                }
            }.bind(this)
        })
    }
    _getIAXGenSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getIAXGenSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        IAXGenSettings = res.iax_general_settings
                    this.setState({
                        IAXGenSettings: IAXGenSettings
                    })
                }
            }.bind(this)
        })        
    }
    _getIAXRegSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getIAXRegSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        IAXRegSettings = res.iax_reg_settings
                    this.setState({
                        IAXRegSettings: IAXRegSettings
                    })
                }
            }.bind(this)
        })        
    }
    _getIAXSecSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { action: 'getIAXSecSettings' },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        IAXSecSettings = res
                    this.setState({
                        IAXSecSettings: IAXSecSettings
                    })
                }
            }.bind(this)
        })        
    }
    _handleCancel = () => {
        
    }
    _handleSubmit = () => {
        const { formatMessage } = this.props.intl

        let IAXGenSettingsAction = {}
        IAXGenSettingsAction["action"] = "updateIAXGenSettings"

        _.each(this.state.IAXGenSettings, function(num, key) {
            if (_.isObject(num)) {
                if (typeof (num.errors) === "undefined") {
                    if (num.value === true) {
                        IAXGenSettingsAction[key] = "yes"  
                    } else if (num.value === false) {
                        IAXGenSettingsAction[key] = "no" 
                    } else {
                        IAXGenSettingsAction[key] = num.value
                    }
                } else {
                    return
                }
            } else {
                IAXGenSettingsAction[key] = num
            }
        })
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: IAXGenSettingsAction,
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    // message.destroy()
                    // message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}} ></span>)
                }
            }.bind(this)
        })

        let IAXRegSettingsAction = {}
        IAXRegSettingsAction["action"] = "updateIAXRegSettings"

        _.each(this.state.IAXRegSettings, function(num, key) {
            if (_.isObject(num)) {
                if (typeof (num.errors) === "undefined") {
                    if (num.value === true) {
                        IAXRegSettingsAction[key] = "yes"  
                    } else if (num.value === false) {
                        IAXRegSettingsAction[key] = "no" 
                    } else {
                        IAXRegSettingsAction[key] = num.value
                    }
                } else {
                    return
                }
            } else {
                IAXRegSettingsAction[key] = num
            }
        })
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: IAXRegSettingsAction,
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    // message.destroy()
                    // message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}} ></span>)
                }
            }.bind(this)
        })

        let IAXSecSettingsAction = {}
        IAXSecSettingsAction["action"] = "updateIAXSecSettings"

        _.each(this.state.IAXSecSettings, function(num, key) {
            if (_.isObject(num)) {
                if (typeof (num.errors) === "undefined") {
                    if (num.value === true) {
                        IAXSecSettingsAction[key] = "yes"  
                   } else if (num.value === false) {
                        IAXSecSettingsAction[key] = "no" 
                   } else {
                        IAXSecSettingsAction[key] = num.value
                   }
                } else {
                    return
                }
            } else {
                IAXSecSettingsAction[key] = num
            }
        })
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: IAXSecSettingsAction,
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
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG39"})
        })
        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG34"}) }  
                    onSubmit={ this._handleSubmit } 
                    onCancel={ this._handleCancel } 
                    isDisplay='display-block' 
                />
                <Tabs defaultActiveKey="1" onChange={this.onChange}>
                    <TabPane tab={formatMessage({id: "LANG3"})} key="1">
                        <General 
                            dataSource={this.state.IAXGenSettings}
                            datamohNameList={this.state.mohNameList} 
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG681"})} key="2">
                        <Reg 
                            dataSource={this.state.IAXRegSettings}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG683"})} key="3">
                        <Sec 
                            dataSource={this.state.IAXSecSettings}
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

IaxSettings.propTypes = {
}

export default injectIntl(IaxSettings)