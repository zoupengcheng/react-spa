'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Popover, Select, Tabs } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import ZEROCONFIG from './parser/ZCDataSource'
import { ZCCurConfig, ValueDelegationObj, PrepareSubmitConfigurations } from './parser/ZCController.jsx'

class Globalpolicy extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillMount() {
        this._prepareGlobalPolicyList()
    }
    componentDidMount() {
    }
    componentWillUnmount() {        
    }
    _prepareGlobalPolicyList = () => {
        const { formatMessage } = this.props.intl
        ZCCurConfig.resetStatus()
        ZCCurConfig.updatePageDOM("globalpolicy", window, document)
        let templateId = 0,
            source = null
        let pageValueLoadedCallback = result => {
            let data = {}

            if (result.status === 0) {
                // NOTE: it is weird the return data is stored under object.template_id
                for (let i = 0; i < result.response.template_id.length; i++) {
                    let item = result.response.template_id[i]
                    let key = item.element_id + "#" + item.element_number
                    if (!data[key]) {
                        data[key] = { "values": {}, "originName": "", "originType": "" }
                    }

                    data[key].values[item.entity_name] = item.value
                }
            } else { 
                message.destroy()
                message.error(formatMessage({id: "LANG853"}))
            }

            source = ZEROCONFIG.getDataCollection().generateGlobalBlockList(data)
            console.log("weiling generateGlobalBlockList:", source)
            
            // TODO: Add ucm widget binding of navibox
        }

        let checkReady = () => {
            if (ZEROCONFIG.isDataReady() === 1) {
                message.destroy()
                ZEROCONFIG.getDataCollection().prepareGlobalList()
                ZEROCONFIG.connector.getTemplateSettings(templateId)
                    .done(result => {
                        setTimeout(() => {
                            pageValueLoadedCallback(result)
                        }, 1)
                    }).fail(() => {
                        // TODO: add error display here
                        console.error("FAIL", arguments)
                    })
                // TODO: checkZeroConfigInvalidModels
                // let source = $("#invalidModelWarning").html()
                // ZEROCONFIG.connector.checkZeroConfigInvalidModels(source, true)
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

Globalpolicy.propTypes = {
}

export default injectIntl(Globalpolicy)