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
            current_mode: this.props.params.id ? 'edit' : 'add',
            extension_type: this.props.params.type ? this.props.params.type : 'sip'
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    _onChangeTabs = (activeKey) => {
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         return false
        //     }
        // })
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
    _onExtensionTypeChange = (value) => {
        this.setState({
            extension_type: value
        })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG85"}),
                    1: this.props.params.id
                })
                : formatMessage({id: "LANG733"}))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main app-content-extension">
                <Title
                    headerTitle={ title }
                    isDisplay='display-block'
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                />
                <Form className="form-contain-tab">
                    <Tabs defaultActiveKey="1" onChange={ this._onChangeTabs }>
                        <TabPane tab={ formatMessage({id: "LANG2217"}) } key="1">
                            <BasicSettings
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG3886"}) } key="2">
                            <Media
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG106"}) } key="3">
                            <Feature
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG3288"}) } key="4">
                            <SpecificTime
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG568"}) } key="5">
                            <FollowMe
                                form={ form }
                                settings={ this.state.settings }
                                currentMode={ this.state.current_mode }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
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