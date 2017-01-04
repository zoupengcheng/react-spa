'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { injectIntl } from 'react-intl'
import Title from '../../../views/title'
// import { connect } from 'react-redux'
// import * as Actions from './actions/'
// import { bindActionCreators } from 'redux'
import { Form, message, Tabs } from 'antd'
import React, { Component, PropTypes } from 'react'

import Media from './media'
import Feature from './feature'
import FollowMe from './followMe'
import SpecificTime from './specificTime'
import BasicSettings from './basicSettings'

const TabPane = Tabs.TabPane

class ExtensionItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            basicSettings: {},
            medias: {},
            feature: {},
            specificTime: {},
            followMe: {}
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
        const { formatMessage } = this.props.intl
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Title
                    isDisplay='display-block'
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                    headerTitle={ formatMessage({id: "LANG733"}) }
                />
                <Tabs defaultActiveKey="1" onChange={ this._onChange }>
                    <TabPane tab={ formatMessage({id: "LANG2217"}) } key="1">
                        <BasicSettings dataSource={ this.state.basicSettings } />
                    </TabPane>
                    <TabPane tab={ formatMessage({id: "LANG3886"}) } key="2">
                        <Media dataSource={ this.state.medias } />
                    </TabPane>
                    <TabPane tab={ formatMessage({id: "LANG106"}) } key="3">
                        <Feature dataSource={ this.state.feature } />
                    </TabPane>
                    <TabPane tab={ formatMessage({id: "LANG3288"}) } key="4">
                        <SpecificTime dataSource={ this.state.specificTime } />
                    </TabPane>
                    <TabPane tab={ formatMessage({id: "LANG568"}) } key="5">
                        <FollowMe dataSource={ this.state.followMe } />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

ExtensionItem.propTypes = {}

export default Form.create()(injectIntl(ExtensionItem))

// const mapStateToProps = (state) => ({})

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(Actions, dispatch)
// }

// export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ExtensionItem))