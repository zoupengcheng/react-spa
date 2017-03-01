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

import ZEROCONFIG from './parser/ZCDataSource'
import { ZCCurConfig, ValueDelegationObj, PrepareSubmitConfigurations } from './parser/ZCController.jsx'

class GlobalTemplateItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            templateInfo: {},
            globalTemplate: [],
            pageMode: this.props.params.mode,
            currentEditId: this.props.params.id ? this.props.params.id : -1
        }
    }
    componentDidMount() {
        ZCCurConfig.resetStatus()
        ZCCurConfig.updatePageDOM("global-template", window, document)
        
        this._prepareGlobalTemplateData()
    }
    componentWillUnmount() {        
    }
    _prepareGlobalTemplateData() {
        const { formatMessage } = this.props.intl
        let checkReady = () => {
            if (ZEROCONFIG.isDataReady() === 1) {
                ZEROCONFIG.getDataCollection().prepareGlobalList()
                message.destroy()
                let processList = [] 
                if (this.state.pageMode === "edit" && this.state.currentEditId !== -1) {
                    let templateId = this.state.currentEditId
                    processList.push(new Promise((resolve, reject) => {
                        ZEROCONFIG.connector.getTemplate(templateId).done(data => {
                            if (data.status === 0) {
                                data.response.processName = "Item"
                                resolve(data.response)
                            } else {
                                reject(data.status)
                            }                            
                        })
                    }))

                    processList.push(new Promise((resolve, reject) => {
                        ZEROCONFIG.interface.prepareGlobalTemplateSource.apply(ZEROCONFIG, [templateId, function(data) {
                            if (data) {
                                let settingSource = {
                                    processName: "Settings",
                                    source: data
                                }
                                resolve(settingSource)           
                            } else {
                                reject()
                            }
                        }])
                    }))
                    
                    Promise.all(processList).then(results => {
                        // Success
                        for (let i = 0; i < results.length; i++) {
                            let result = results[i]
                            if (result.processName !== null && result.processName === "Item") {
                                if (result.id !== null && result.id.length > 0) {
                                    this.setState({
                                        templateInfo: result.id[0]
                                    })
                                }
                                console.log("WL Item:", this.state.templateInfo)
                                // TODO: Display name/discription box
                            } else if (result.processName !== null && result.processName === "Settings") {
                                if (result.source !== null && result.source.length > 0) {
                                    this.setState({
                                        globalTemplate: result.source
                                    })
                                }
                                console.log("WL Settings:", this.state.globalTemplate)
                            }
                        }
                        // TODO: Add ucm widget binding of navibox     
                    }).catch(reason => {
                        // Failed
                        console.log("FAIL")
                        message.error(formatMessage({ id: "LANG3881" }))
                    }) 
                }
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
    _handleCancel = (e) => {
        browserHistory.push('/value-added-features/zeroConfig')
    }
    _handleSubmit = (e) => {
        // e.preventDefault()
        const form = this.props.form
        const { formatMessage } = this.props.intl
    }
    render() {
        const {formatMessage} = this.props.intl
        return (
            <div className="app-content-main" id="app-content-main">
                {"GlobalTemplateItem"}
            </div>
        )
    }
}

GlobalTemplateItem.propTypes = {}

export default Form.create()(injectIntl(GlobalTemplateItem))