'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"

import { injectIntl } from 'react-intl'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Checkbox, Col, Form, Input, message, Popover, Row, Select, Transfer } from 'antd'

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
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }

        const formItemTransferLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG3444"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG3446"}))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'
                />
                <div className="content">
                    <Form>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG3228"}) }</span>
                            )}
                        >
                            { getFieldDecorator('station_name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.minlength(data, value, callback, formatMessage, 2)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: this._checkExistence
                                }],
                                initialValue: station_name
                            })(
                                <Input placeholder={ formatMessage({id: "LANG3228"}) } />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG3229"}) }
                                        content={ formatMessage({id: "LANG3237"}) }
                                    >
                                            <span>{ formatMessage({id: "LANG3229"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('sla_station', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: sla_station
                            })(
                                <Select disabled={ !!this.props.params.id }>
                                    {
                                        this.state.accountList.map(function(item) {
                                            return <Option
                                                    key={ item.key }
                                                    value={ item.value }
                                                    className={ item.out_of_service === 'yes' }
                                                >
                                                    { item.label }
                                                </Option>
                                            }
                                        ) 
                                    }
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemTransferLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG3230"}) }</span>
                            )}
                        >
                            <Transfer
                                showSearch
                                render={ this._renderItem }
                                targetKeys={ this.state.targetKeys }
                                onChange={ this._handleTransferChange }
                                dataSource={ this.state.slaTrunkNameList }
                                filterOption={ this._filterTransferOption }
                                notFoundContent={ formatMessage({id: "LANG133"}) }
                                onSelectChange={ this._handleTransferSelectChange }
                                searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                titles={ [formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})] }
                            />
                        </FormItem>
                        <div className="section-title">
                            <span>{ formatMessage({id: "LANG3233"}) }</span>
                        </div>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG1598"}) }
                                        content={ formatMessage({id: "LANG3234"}) }
                                    >
                                        <span>{ formatMessage({id: "LANG1598"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('ringtimeout', {
                                rules: [{
                                    validator: (data, value, callback) => {
                                        Validator.digits(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.range(data, value, callback, formatMessage, 0, 300)
                                    }
                                }],
                                initialValue: ringtimeout
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG3235"}) }
                                        content={ formatMessage({id: "LANG3236"}) }
                                    >
                                        <span>{ formatMessage({id: "LANG3235"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('ringdelay', {
                                rules: [{
                                    validator: (data, value, callback) => {
                                        Validator.digits(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.range(data, value, callback, formatMessage, 0, 300)
                                    }
                                }],
                                initialValue: ringdelay
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>
                                    <Popover
                                        title={ formatMessage({id: "LANG3222"}) }
                                        content={ formatMessage({id: "LANG3243"}) }
                                    >
                                            <span>{ formatMessage({id: "LANG3222"}) }</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            { getFieldDecorator('holdaccess', {
                                initialValue: holdaccess ? holdaccess : 'open'
                            })(
                                <Select>
                                    <Option key="open" value="open">{ "Open" }</Option>
                                    <Option key="private" value="private">{ "Private" }</Option>
                                </Select>
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

GlobalTemplateItem.propTypes = {}

export default Form.create()(injectIntl(GlobalTemplateItem))