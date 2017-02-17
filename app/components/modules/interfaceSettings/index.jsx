'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import DigitalHardware from './digitalHardware'
import AnalogHardware from './analogHardware'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

class InterfaceSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    onChange(activeKey) {
        if (activeKey === "1") {
        } else {              
        }
    }
    _renderDigitalHardware = () => {
        const {formatMessage} = this.props.intl

        return <TabPane tab={formatMessage({id: "LANG686"})} key="1">
                { <DigitalHardware /> }
            </TabPane>
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
                <Title headerTitle={ 
                        formatMessage({id: "LANG5303"}) 
                    } 
                    isDisplay='hidden' 
                />
                <Tabs defaultActiveKey="1" onChange={this.onChange}>
                    { this._renderDigitalHardware() }
                    <TabPane tab={formatMessage({id: "LANG687"})} key="2">
                        { <AnalogHardware /> }
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

InterfaceSettings.propTypes = {
}

export default injectIntl(InterfaceSettings)