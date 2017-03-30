'use strict'

import $ from 'jquery'
import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Input, Button, Row, Col, Checkbox, message, Popover, Select, Tabs } from 'antd'
import Title from '../../../views/title'
const FormItem = Form.Item
import _ from 'underscore'
// import ZEROCONFIG from './parser/ZCDataSource'
// import BLL from './parser/ZCNss.jsx'
// import { ZCCurConfig, ValueDelegationObj, PrepareSubmitConfigurations } from './parser/ZCController.jsx'
// import NaviBox from './widgets/naviBox.jsx'

class GlobalPolicy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            globalPolicy: [],
            templateId: 0,
            source: null
        }
    }
    componentWillMount() {
        const { formatMessage } = this.props.intl

        window.ZEROCONFIG.init("", formatMessage, message)
    }
    componentDidMount() {
        // ZCCurConfig.resetStatus()
        // ZCCurConfig.updatePageDOM("globalpolicy", window, document)
        window.BLL.ConfigPage.resetStatus()
        window.BLL.ConfigPage.updatePageDOM("globalpolicy", window, document)
        this._prepareGlobalPolicyList()
    }
    _pageValueLoadedCallback = (result) => {
        const { formatMessage } = this.props.intl

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
            message.destory()
            message.error(formatMessage({ id: "LANG853"}))
            console.error("Fail to load data", result)
        }

        this.state.source = window.BLL.DataCollection.generateGlobalBlockList(data)
        window.ZEROCONFIG.valueDelegation.executeRequests(this._pageLoadCallback)
    }
    _pageLoadCallback = (result) => {
        let state = this.state
        let timers = new window.SimpleTimer()

        $("div#navBar-inner div.combo").navibox({
            mode: "all",
            source: state.source,
            deferred: timers,
            container: "div#itemContainer"
        })

        timers.start(function () {
            $("div#preparePad").hide()
            $("div#contentPad").show()

            // we need to prevent the use of ENTER as submit on input and select fields
            $("input,select", document).keypress(function (event) { 
                return event.keyCode !== 13 
            })
        })

        $(window).scroll(function () {
            if ($('#navBar').offset()) {
                $('#navBar-inner').toggleClass('scrolling', $(window).scrollTop() > $('#navBar').offset().top)
            } else {
                return
            }

            // can be rewritten long form as:
            let scrollPosition, headerOffset, isScrolling
            scrollPosition = $(window).scrollTop()
            headerOffset = $('#navBar').offset().top
            isScrolling = scrollPosition > headerOffset
            $('#navBar-inner').toggleClass('scrolling', isScrolling)
            if (isScrolling) {
                $("#navTop").show()
            } else {
                $("#navTop").hide()
            }
        })
    }
    _save = (e) => {
        const { formatMessage } = this.props.intl
        let state = this.state,
            templateId = state.templateId 

        window.BLL.PrepareSubmitConfigurations(templateId, state.source, function (result) {
            if (result.error.length > 0) {
                // display error here
                // for (let i = 0; i < result.error.length; i++) {
                //    console.log(result.error[i])
                // }
            } else {
                let processList = [],
                    listName = [],
                    ZEROCONFIG = window.ZEROCONFIG

                // message.loading(formatMessage({ id: "LANG978"}), 0)
                // process delete ALL settings first
                ZEROCONFIG.connector.deleteAllTemplateSettings(templateId).done(function (ret) {
                    if (ret.status !== 0) {
                        message.destory()
                        message.error(formatMessage({ id: "LANG862"}))
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
                            message.destory()

                            let resultSet = arguments
                            if (processList.length === 1) {
                                resultSet = []
                                resultSet.push(arguments)
                            }

                            for (let i = 0; i < listName.length; i++) {
                                let result = resultSet[i][0]
                                if (result.status !== 0) {
                                    console.error("Process error:" + listName[i])
                                    message.error(formatMessage({ id: "LANG862"}))
                                    return
                                }
                            }
                            message.success(formatMessage({ id: "LANG873"}))
                        }).fail(function () {
                            message.destory()
                            console.log("FAIL", arguments)
                            message.error(formatMessage({ id: "LANG862"}))
                        })
                    } else {
                        message.destory()
                        message.success(formatMessage({ id: "LANG873"}))
                    }
                })
                .fail(function () {
                    message.destory()
                    message.error(formatMessage({ id: "LANG862"}))
                })
            }
        })
    }
    _prepareGlobalPolicyList = () => {
        const { formatMessage } = this.props.intl
        const self = this
        let templateId = 0,
            ZEROCONFIG = window.ZEROCONFIG

        let checkReady = () => {
            if (ZEROCONFIG.isDataReady() === 1) {
                // ZEROCONFIG.getDataCollection().prepareGlobalList()
                // ZEROCONFIG.interface.prepareGlobalTemplateSource.apply(ZEROCONFIG, [templateId, source => {
                //     message.destroy()
                //     if (source) {
                //         console.log("WL prepareGlobalTemplateSource:", source)
                //         // TODO: Add ucm widget binding of navibox 
                //         this.setState({
                //             globalPolicy: source
                //         })               
                //     } else {
                //         message.error(formatMessage({id: "LANG853"}))
                //     }
                // }])
                window.BLL.DataCollection.prepareGlobalList()

                ZEROCONFIG.connector.getTemplateSettings(templateId)
                    .done(function (result) {
                        setTimeout(() => {
                            self._pageValueLoadedCallback(result)
                        }, 1)
                    }).fail(function () {
                        // TODO: add error display here
                        console.error("FAIL", arguments)
                    })

                let source = $("#invalidModelWarning").html()
                ZEROCONFIG.connector.checkZeroConfigInvalidModels(source, true)
            } else {
                message.destroy()
                if (ZEROCONFIG.isDataReady() === -1) {
                    // message.loading(formatMessage({ id: "LANG3717" }), 0)
                } else {
                    // message.loading(formatMessage({ id: "LANG805" }), 0)
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
        const globalPolicy = this.state.globalPolicy
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const title = formatMessage({id: "LANG632"})

        document.title = formatMessage({id: "LANG584"}, {
            0: model_info.model_name,
            1: title
        })
        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle=""  
                    onSubmit={ this._handleSubmit } 
                    onCancel={ this._handleCancel } 
                    isDisplay='display-block'
                />
                {/* <div>
                    <NaviBox mode="all" 
                         source={ globalPolicy }
                         deferred={ null }/>
                </div> */}
                <div className="content">
                    <div id="preparePad" style={{ width: "500px" }}>
                        <div style={{ marginTop: "60px" }}>
                            <img src="../../images/ani_loading.gif"/>
                        </div>
                        <div id="loadingMsg" style={{ textAlign: "center" }}>{ formatMessage({ id: "LANG805" }) }</div>
                    </div>
                    <div id="contentPad" style={{ display: "none" }}>
                        <div className="lite_desc">
                            <span>{ formatMessage({ id: "LANG3542" }) }</span>
                        </div>
                        <div id="navBar">
                            <div id="navBar-inner">
                                {/* Note #1 */} 
                                <div className="cell label">{ formatMessage({ id: "LANG74" }) }</div>
                                <div className="cell combo"></div>
                                <div className="cell sideControl">
                                    <a id="navTop" href="#" title="Back to top" style={{ display: "none" }}><img src="../images/arrow_back_top.png" /></a>
                                </div>
                            </div>
                            <div style={{ clear: "both" }}></div>
                        </div>
                        <div id="itemContainer"></div>
                    </div>
                </div>
            </div>
        )
    }
}

GlobalPolicy.propTypes = {
}

export default injectIntl(GlobalPolicy)