'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Input, Button, Row, Col, Checkbox, message, Popover, Select, Tabs } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import ZEROCONFIG from './parser/ZCDataSource'
import { ZCCurConfig, ValueDelegationObj, PrepareSubmitConfigurations } from './parser/ZCController.jsx'

class GlobalPolicy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            globalPolicy: []
        }
    }
    componentWillMount() {
        ZCCurConfig.resetStatus()
        ZCCurConfig.updatePageDOM("globalpolicy", window, document)
        
        this._prepareGlobalPolicyList()
    }
    componentDidMount() {
    }
    componentWillUnmount() {        
    }
    _prepareGlobalPolicyList = () => {
        const { formatMessage } = this.props.intl
        let templateId = 0
        let checkReady = () => {
            if (ZEROCONFIG.isDataReady() === 1) {
                ZEROCONFIG.getDataCollection().prepareGlobalList()
                ZEROCONFIG.interface.prepareGlobalTemplateSource.apply(ZEROCONFIG, [templateId, source => {
                    message.destroy()
                    if (source) {
                        console.log("WL prepareGlobalTemplateSource:", source)
                        // TODO: Add ucm widget binding of navibox 
                        this.setState({
                            globalPolicy: source
                        })               
                    } else {
                        message.error(formatMessage({id: "LANG853"}))
                    }
                }])
            } else {
                message.destroy()
                if (ZEROCONFIG.isDataReady() === -1) {
                    message.loading(formatMessage({ id: "LANG3717" }), 0)
                } else {
                    message.loading(formatMessage({ id: "LANG805" }), 0)
                }
                setTimeout(checkReady, 1000)
            }
        }
        checkReady()        
    }
    _handleSubmit = () => {
        const { formatMessage } = this.props.intl
        // TODO: Handle Submit here
        /* PrepareSubmitConfigurations(templateId, source, function (result) {
            if (result.error.length === 0) {

                let processList = []
                let listName = []

                message.destroy()
                message.loading(formatMessage({ id: "LANG978" }), 0)
                
                // process delete ALL settings first
                ZEROCONFIG.connector.deleteAllTemplateSettings(templateId).done(function (ret) {

                    if (ret.status != 0) {
                        message.destroy()
                        message.error(formatMessage({ id: "LANG862" }))
                        console.warn("FAIL: Unable to delete settings", ret)
                        return
                    }

                    if (result.update.refId.length > 0) {
                        listName.push("update")
                        processList.push(ZEROCONFIG.connector.updateTemplateSettings(result.update.refId,
                                                                              result.update.elementId,
                                                                              result.update.elementNum,
                                                                              result.update.entityName,
                                                                              result.update.value))

                        $.when.apply({}, processList).done(function () {
                            message.destroy()

                            let resultSet = arguments
                            if (processList.length == 1) {
                                resultSet = []
                                resultSet.push(arguments)
                            }

                            for (let i = 0; i < listName.length; i++) {
                                let result = resultSet[i][0]
                                if (result.status != 0) {
                                    console.error("Process error:" + listName[i])
                                    message.error(formatMessage({ id: "LANG862" }))
                                    return
                                }
                            }
                            message.error(formatMessage({ id: "LANG873" }))
                        }).fail(function () {
                            message.destory()
                            message.error(formatMessage({ id: "LANG862" }))
                            console.log("FAIL", arguments)
                        })
                    } else {
                        message.destory()
                        message.error(formatMessage({ id: "LANG873" }))
                    }
                }).fail(function () {
                    message.destory()
                    message.error(formatMessage({ id: "LANG862" }))
                })
            }
        }) */
    }
    render() {
        const {formatMessage} = this.props.intl
        let sipMiscSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                {"Globalpolicy"}
            </div>
        )
    }
}

GlobalPolicy.propTypes = {
}

export default injectIntl(GlobalPolicy)