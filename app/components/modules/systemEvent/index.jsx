'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Warning from './warning'
import WarningEventsList from './warningEventsList'
import WarningContact from './warningContact'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { Form, Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import _ from 'underscore'

class WarningIndex extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: this.props.params.id ? this.props.params.id : '1',
            isDisplay: "hidden"
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _onChange = (e) => {
        
    }
    _handleSubmit = () => {

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
                    1: formatMessage({id: "LANG2580"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG2580"}) } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ this.state.isDisplay }
                />
                <Tabs defaultActiveKey={ this.state.activeKey } onChange={this._onChange}>
                    <TabPane tab={formatMessage({id: "LANG2581"})} key="1">
                        <Warning 
                            dataSource={this.state.basicSettings}
                            fileList={this.state.fileList}
                        />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG2582"})} key="2">
                        <WarningEventsList />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG2546"})} key="3">
                        <WarningContact />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

WarningIndex.propTypes = {
}

export default injectIntl(WarningIndex)