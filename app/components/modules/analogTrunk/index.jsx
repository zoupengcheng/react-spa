'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import AnalogTrunk from './analogTrunk'
import CallProgressToneFileList from './callProgressToneFileList'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

class TrunksAnalog extends Component {
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
    render() {
        const {formatMessage} = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG12"})
        })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ 
                        formatMessage({id: "LANG639"}) 
                    } 
                    isDisplay='hidden' 
                />
                <Tabs defaultActiveKey="1" onChange={this.onChange}>
                    <TabPane tab={formatMessage({id: "LANG639"})} key="1">
                        <AnalogTrunk />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG5149"})} key="2">
                        <CallProgressToneFileList />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

TrunksAnalog.propTypes = {
}

export default injectIntl(TrunksAnalog)