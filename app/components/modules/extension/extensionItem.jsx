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
            userSettings: {},
            currentEditId: this.props.params.id,
            extension_type: this.props.params.type ? this.props.params.type : 'sip'
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    componentWillUnmount() {
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        const extensionId = this.props.params.id
        const extensionType = this.props.params.type
        const extensionRange = UCMGUI.isExist.getRange('extension')
        const existNumberList = UCMGUI.isExist.getList("getNumberList")
        const extensionTypeUpperCase = extensionType ? extensionType.toUpperCase() : ''

        this.setState({
            extensionRange: extensionRange,
            existNumberList: existNumberList
        })

        if (extensionId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    extension: extensionId,
                    action: `get${extensionTypeUpperCase}Account`
                },
                type: 'json',
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        const settings = response.extension || []

                        this.setState({
                            settings: settings
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })

            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getUser',
                    user_name: extensionId
                },
                type: 'json',
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        const userSettings = response.user_name || []

                        this.setState({
                            userSettings: userSettings
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }
    }
    _handleCancel = (e) => {
        browserHistory.push('/extension-trunk/extension')
    }
    _handleSubmit = (e) => {
        // e.preventDefault()
        const form = this.props.form
        const { formatMessage } = this.props.intl

        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                let action = {}

                _.map(values, function(value, key) {

                })

                if (this.state.currentEditId) {
                    action.action = `update${this.state.extension_type.toUpperCase()}Account`
                } else {
                    action.action = `add${this.state.extension_type.toUpperCase()}AccountAndUser`

                    if (values.first_name && values.last_name) {
                        action.fullname = values.first_name + ' ' + values.last_name
                    } else if (values.first_name) {
                        action.fullname = values.first_name
                    } else if (values.last_name) {
                        action.fullname = values.last_name
                    } else {
                        action.fullname = ''
                    }
                }

                console.log('Received values of form: ', values)
            }
        })
    }
    _onChangeTabs = (activeKey) => {
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         return false
        //     }
        // })
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
                                userSettings={ this.state.userSettings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                extensionRange={ this.state.extensionRange }
                                existNumberList={ this.state.existNumberList }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG3886"}) } key="2">
                            <Media
                                form={ form }
                                settings={ this.state.settings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG106"}) } key="3">
                            <Feature
                                form={ form }
                                settings={ this.state.settings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG3288"}) } key="4">
                            <SpecificTime
                                form={ form }
                                settings={ this.state.settings }
                                currentEditId={ this.state.currentEditId }
                                extensionType={ this.state.extension_type }
                                onExtensionTypeChange={ this._onExtensionTypeChange }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG568"}) } key="5">
                            <FollowMe
                                form={ form }
                                settings={ this.state.settings }
                                currentEditId={ this.state.currentEditId }
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