'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import NetworkContainer from './network'
import VersionContainer from './version'
import * as Actions from './actions/getNetworkInformation'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

let getNetworkInformation,
    getSystemStatus,
    getSystemGeneralStatus

class Sysinfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        getSystemStatus()
        getSystemGeneralStatus()
    }
    componentWillUnmount() {

    }
    onChange(activeKey) {
        console.log(activeKey)
        if (activeKey === "1") {
            getSystemGeneralStatus()
            getSystemStatus()
        } else {            
            getNetworkInformation()
        }
    }
    render() {
        const {formatMessage} = this.props.intl
        getSystemStatus = this.props.getSystemStatus
        getSystemGeneralStatus = this.props.getSystemGeneralStatus
        getNetworkInformation = this.props.getNetworkInformation
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Tabs defaultActiveKey="1" onChange={this.onChange}>
                    <TabPane tab={formatMessage({id: "LANG3"})} key="1">
                        <VersionContainer /> 
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG4"})} key="2">
                        <NetworkContainer /> 
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

Sysinfo.propTypes = {
    getNetworkInformation: PropTypes.func.isRequired,
    getSystemStatus: PropTypes.func.isRequired,
    getSystemGeneralStatus: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
   
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Sysinfo))