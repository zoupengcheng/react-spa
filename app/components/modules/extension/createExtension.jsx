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
import { Tabs } from 'antd'
import Title from '../../../views/title'
const TabPane = Tabs.TabPane

class CreateExtension extends Component {
    constructor(props) {
        super(props)
        this.state = {
            basicSettings: {},
            medias: {},
            feature: {},
            specificTime: {}
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _onChange = (activeKey) => {
        if (activeKey === "1") {

        } else {            
            
        }
    }
    _handleSubmit = (e) => {
        // this.state.basicSettings.form.validateFields(() => {
        //     console.log("hi") 
        // })
        console.log("hi")
    }
    render() {
        const {formatMessage} = this.props.intl
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG733"}) } onSubmit={ this._handleSubmit.bind(this) } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Tabs defaultActiveKey="1" onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG2217"})} key="1">
                        <BasicSettings dataSource={this.state.basicSettings} />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3886"})} key="2">
                        <Media dataSource={this.state.medias} />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG106"})} key="3">
                        <Feature dataSource={this.state.feature} />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG3288"})} key="4">
                        <SpecificTime dataSource={this.state.specificTime} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

CreateExtension.propTypes = {
}

const mapStateToProps = (state) => ({
   
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreateExtension))