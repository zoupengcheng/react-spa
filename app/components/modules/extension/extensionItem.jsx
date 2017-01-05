'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { injectIntl } from 'react-intl'
import Title from '../../../views/title'
import { Form, message, Tabs } from 'antd'
import { browserHistory } from 'react-router'
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
            settings: {},
            current_mode: this.props.params.id ? 'edit' : 'add'
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    _onChange = (activeKey) => {
    }
    _handleCancel = (e) => {
        browserHistory.push('/extension-trunk/extension')
    }
    _handleSubmit = (e) => {
        // e.preventDefault()

        const { formatMessage } = this.props.intl

        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
            }
        })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG733"})
                })

        return (
            <div className="app-content-main" id="addExtension">
                <Title
                    isDisplay='display-block'
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                    headerTitle={ formatMessage({id: "LANG733"}) }
                />
                <Form className="form-contain-tab">
                    <Tabs defaultActiveKey="1" onChange={ this._onChange }>
                        <TabPane tab={ formatMessage({id: "LANG2217"}) } key="1">
                            <BasicSettings
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG3886"}) } key="2">
                            <Media
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG106"}) } key="3">
                            <Feature
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG3288"}) } key="4">
                            <SpecificTime
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG568"}) } key="5">
                            <FollowMe
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                            />
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

ExtensionItem.propTypes = {}

export default Form.create()(injectIntl(ExtensionItem))