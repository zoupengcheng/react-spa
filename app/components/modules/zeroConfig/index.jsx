'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import ZEROCONFIG from './parser/ZCDataSource'
import Devices from './devices'
import GlobalPolicy from './globalPolicy'
import GlobalTemplates from './globalTemplates'
import ModelTemplates from './modelTemplates'
import TemplateManagement from './templateManagement'
import ZeroConfigSettings from './zeroConfigSettings'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Tabs, message } from 'antd'
import { browserHistory } from 'react-router'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class ZeroConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {        
        ZEROCONFIG.init()
    }
    componentWillUnmount() {

    }
    onChange(activeKey) {
        if (activeKey === "1") {

        } else {            
            
        }
    }      
    _handleCancel = () => { 
    }
    _handleSubmit = () => {
    }
    render() {
        const { formatMessage } = this.props.intl

        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG16"})
        })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG16"}) }  
                    onSubmit={ this._handleSubmit } 
                    onCancel={ this._handleCancel } 
                    isDisplay='hidden' 
                />
                <Tabs defaultActiveKey="1" onChange={this.onChange}>
                    <TabPane tab={formatMessage({id: "LANG16"})} key="1">
                        <Devices 
                            dataSource={this.state.SIPGenSettings} 
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3169"})} key="2">
                        <GlobalPolicy 
                            dataSource={this.state.sipMiscSettings}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3444"})} key="3">
                        <GlobalTemplates 
                            dataSource={this.state.sipSessiontimerSettings}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3445"})} key="4">
                        <ModelTemplates 
                            dataSource={this.state.sipTcpSettings}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3980"})} key="5">
                        <TemplateManagement />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3904"})} key="6">
                        <ZeroConfigSettings />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

ZeroConfig.propTypes = {
}

export default injectIntl(ZeroConfig)