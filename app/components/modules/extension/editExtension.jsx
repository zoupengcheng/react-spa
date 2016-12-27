'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import * as Actions from './actions/'
import BasicSettings from './basicSettings'
import Media from './media'
import Feature from './feature'
import SpecificTime from './specificTime'
import Title from '../../../views/title'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

class Sysinfo extends Component {
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
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG733"}) } isDisplay='display-block' />
                <Tabs defaultActiveKey="1" onChange={this.onChange}>
                    <TabPane tab={formatMessage({id: "LANG2217"})} key="1">
                        <BasicSettings />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3886"})} key="2">
                        <Media />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG106"})} key="3">
                        <Feature />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3288"})} key="4">
                        <SpecificTime />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

Sysinfo.propTypes = {
}

const mapStateToProps = (state) => ({
   
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Sysinfo))