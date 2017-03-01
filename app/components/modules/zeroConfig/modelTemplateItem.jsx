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

class ModelTemplateItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            templateInfo: {},
            modelTemplate: [],
            CustomFields: [],
            pageMode: this.props.params.mode,
            currentEditId: this.props.params.id ? this.props.params.id : -1
        }
    }
    componentDidMount() {
        ZCCurConfig.resetStatus()
        ZCCurConfig.updatePageDOM("model-template", window, document)
        
        this._prepareModelTemplateData()
    }
    componentWillUnmount() {        
    }
    _prepareModelTemplateData() {
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
                            console.log("WL getTemplate:", data)
                            if (data.status === 0) {
                                let model_id = data.response.id[0].model_id,
                                    model = ZEROCONFIG.getDataCollection().getModel(model_id)
                                ZCCurConfig.updatePageConfig(data.response.id[0].model_id, model, "template", data.response.id[0])
                                if (ZCCurConfig.modelInfo()) {
                                    ZCCurConfig.modelInfo().prepareListData()
                                }

                                data.response.processName = "Item"
                                resolve(data.response)
                            } else {
                                reject(data.status)
                            }                           
                        })
                    }))

                    processList.push(new Promise((resolve, reject) => {
                        ZEROCONFIG.interface.prepareModelTemplateSource.apply(ZEROCONFIG, [templateId, function(data) {
                            console.log("WL prepareModelTemplateSource:", data)
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
                    processList.push(new Promise((resolve, reject) => {
                        ZEROCONFIG.connector.getModelTemplateCustomSettings(templateId).done(data => {
                            console.log("WL getModelTemplateCustomSettings:", data)
                            if (data.status === 0) {
                                data.response.processName = "CustomFields"
                                resolve(data.response)           
                            } else {
                                reject()
                            }                      
                        })
                    }))

                    Promise.all(processList).then(results => {
                        // Success
                        for (let i = 0; i < results.length; i++) {
                            let result = results[i]
                            if (result.processName !== null && result.processName === "Item") {
                                /* if (result.id !== null && result.id.length > 0) {
                                    this.setState({
                                        templateInfo: result.id[0]
                                    })
                                } */
                                console.log("WL Item:", result)
                                // TODO: Display name/discription box
                            } else if (result.processName !== null && result.processName === "Settings") {
                                console.log("WL Settings:", result)
                            } else if (result.processName !== null && result.processName === "CustomFields") {
                                console.log("WL CustomFields:", result)
                            }
                        }
                        // TODO: Add ucm widget binding of navibox 
                        //       Get model list dropdown; and show the img   
                    }).catch(reason => {
                        // Failed
                        console.log("FAIL")
                        message.error(formatMessage({ id: "LANG862" }))
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
                {"ModelTemplateItem"}
            </div>
        )
    }
}

ModelTemplateItem.propTypes = {}

export default Form.create()(injectIntl(ModelTemplateItem))