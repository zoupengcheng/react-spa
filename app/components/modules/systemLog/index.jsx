'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Button, message, Modal, Table, Card, Select, Form, Tooltip, Input, InputNumber, Checkbox } from 'antd'

const confirm = Modal.confirm
const Option = Select.Option
const FormItem = Form.Item

class SystemLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            staticSwitch: [],
            dynamicSwitch: [],
            logServer: {},
            logSwitch: {},
            logSwitchList: [{
                id: 0,
                module_name: 'all',
                enable: '0'
            }, {
                id: 1,
                module_name: 'cdrapi',
                enable: '0'
            }, {
                id: 2,
                module_name: 'pbxmid',
                enable: '0'
            }, {
                id: 3,
                module_name: 'apply_python',
                enable: '0'
            }, {
                id: 4,
                module_name: 'cgi',
                enable: '0'
            }, {
                id: 5,
                module_name: 'warning',
                enable: '0'
            }, {
                id: 6,
                module_name: 'zeroconfig',
                enable: '0'
            }],
            selectedRowKeys: []
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _onChangeLevel = (record, level, e) => {
        let staticSwitch = this.state.staticSwitch

        if (record.id === 0) {
            if (level === 'ERROR') {
                staticSwitch.map(function(item, index) {
                    staticSwitch[index].ERROR = e.target.checked ? '1' : '0'
                })
            } else if (level === 'WARN') {
                staticSwitch.map(function(item, index) {
                    staticSwitch[index].WARN = e.target.checked ? '1' : '0'
                })
            } else if (level === 'NOTIC') {
                staticSwitch.map(function(item, index) {
                    staticSwitch[index].NOTIC = e.target.checked ? '1' : '0'
                })
            } else if (level === 'DEBUG') {
                staticSwitch.map(function(item, index) {
                    staticSwitch[index].DEBUG = e.target.checked ? '1' : '0'
                })
            } else if (level === 'VERB') {
                staticSwitch.map(function(item, index) {
                    staticSwitch[index].VERB = e.target.checked ? '1' : '0'
                })
            }
        } else {
            if (level === 'ERROR') {
                staticSwitch.map(function(item, index) {
                    if (item.id === record.id) {
                        staticSwitch[index].ERROR = e.target.checked ? '1' : '0'
                    }
                })
            } else if (level === 'WARN') {
                staticSwitch.map(function(item, index) {
                    if (item.id === record.id) {
                        staticSwitch[index].WARN = e.target.checked ? '1' : '0'
                    }
                })
            } else if (level === 'NOTIC') {
                staticSwitch.map(function(item, index) {
                    if (item.id === record.id) {
                        staticSwitch[index].NOTIC = e.target.checked ? '1' : '0'
                    }
                })
            } else if (level === 'DEBUG') {
                staticSwitch.map(function(item, index) {
                    if (item.id === record.id) {
                        staticSwitch[index].DEBUG = e.target.checked ? '1' : '0'
                    }
                })
            } else if (level === 'VERB') {
                staticSwitch.map(function(item, index) {
                    if (item.id === record.id) {
                        staticSwitch[index].VERB = e.target.checked ? '1' : '0'
                    }
                })
            } else if (level === 'ALL') {
                staticSwitch.map(function(item, index) {
                    if (item.id === record.id) {
                        staticSwitch[index].ERROR = e.target.checked ? '1' : '0'
                        staticSwitch[index].WARN = e.target.checked ? '1' : '0'
                        staticSwitch[index].NOTIC = e.target.checked ? '1' : '0'
                        staticSwitch[index].DEBUG = e.target.checked ? '1' : '0'
                        staticSwitch[index].VERB = e.target.checked ? '1' : '0'
                    }
                })
            }
        }
        
        this.setState({
            staticSwitch: staticSwitch
        })
    }
    _onChangeDynamic = (record, e) => {
        let dynamicSwitch = this.state.dynamicSwitch
        if (record.id === 0) {
            dynamicSwitch.map(function(item, index) {
                dynamicSwitch[index].switch = e.target.checked ? '1' : '0'
            })
        } else {
            dynamicSwitch.map(function(item, index) {
                if (item.id === record.id) {
                    dynamicSwitch[index].switch = e.target.checked ? '1' : '0'
                }
            })
        }
        this.setState({
            dynamicSwitch: dynamicSwitch
        })
    }
    _onChangeProcess = (record, e) => {
        let logSwitchList = this.state.logSwitchList
        if (record.id === 0) {
            logSwitchList.map(function(item, index) {
                logSwitchList[index].enable = e.target.checked ? '1' : '0'
            })
        } else {
            logSwitchList[record.id].enable = e.target.checked ? '1' : '0'
        }
        this.setState({
            logSwitchList: logSwitchList
        })
    }
    _createID = (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        if (record.id === 0) {
            return <span></span>
        } else {
            let checkOneAll = false
            if (record.ERROR === '1' &&
                record.WARN === '1' &&
                record.NOTIC === '1' &&
                record.DEBUG === '1' &&
                record.VERB === '1') {
                checkOneAll = true
            }
            return <div>
                <Checkbox checked={ checkOneAll } onChange={ this._onChangeLevel.bind(this, record, 'ALL') } />
            </div>
        }
    }
    _createError = (text, record, index) => {
        const staticSwitch = this.state.staticSwitch
        let isChecked = true
        if (record.id === 0) {
            staticSwitch.map(function(item) {
                if (item.ERROR === '0' && item.id !== 0) {
                    isChecked = false
                }
            })
        } else {
            isChecked = record.ERROR === '1'
        }
        return <div>
            <Checkbox checked={ isChecked } onChange={ this._onChangeLevel.bind(this, record, 'ERROR') } />
        </div>
    }
    _createWarn = (text, record, index) => {
        const staticSwitch = this.state.staticSwitch
        let isChecked = true
        if (record.id === 0) {
            staticSwitch.map(function(item) {
                if (item.WARN === '0' && item.id !== 0) {
                    isChecked = false
                }
            })
        } else {
            isChecked = record.WARN === '1'
        }
        return <div>
            <Checkbox checked={ isChecked } onChange={ this._onChangeLevel.bind(this, record, 'WARN') } />
        </div>
    }
    _createNotice = (text, record, index) => {
        const staticSwitch = this.state.staticSwitch
        let isChecked = true
        if (record.id === 0) {
            staticSwitch.map(function(item) {
                if (item.NOTIC === '0' && item.id !== 0) {
                    isChecked = false
                }
            })
        } else {
            isChecked = record.NOTIC === '1'
        }
        return <div>
            <Checkbox checked={ isChecked } onChange={ this._onChangeLevel.bind(this, record, 'NOTIC') } />
        </div>
    }
    _createDebug = (text, record, index) => {
        const staticSwitch = this.state.staticSwitch
        let isChecked = true
        if (record.id === 0) {
            staticSwitch.map(function(item) {
                if (item.DEBUG === '0' && item.id !== 0) {
                    isChecked = false
                }
            })
        } else {
            isChecked = record.DEBUG === '1'
        }
        return <div>
            <Checkbox checked={ isChecked } onChange={ this._onChangeLevel.bind(this, record, 'DEBUG') } />
        </div>
    }
    _createVerb = (text, record, index) => {
        const staticSwitch = this.state.staticSwitch
        let isChecked = true
        if (record.id === 0) {
            staticSwitch.map(function(item) {
                if (item.VERB === '0' && item.id !== 0) {
                    isChecked = false
                }
            })
        } else {
            isChecked = record.VERB === '1'
        }
        return <div>
            <Checkbox checked={ isChecked } onChange={ this._onChangeLevel.bind(this, record, 'VERB') } />
        </div>
    }
    _createDynamicSwitch = (text, record, index) => {
        const dynamicSwitch = this.state.dynamicSwitch
        let isChecked = true
        if (record.id === 0) {
            dynamicSwitch.map(function(item) {
                if (item.switch === '0' && item.id !== 0) {
                    isChecked = false
                }
            })
        } else {
            isChecked = record.switch === '1'
        }
        return <div>
            <Checkbox checked={ isChecked } onChange={ this._onChangeDynamic.bind(this, record) } />
        </div>
    }
    _createProcessName = (text, record, index) => {
        const { formatMessage } = this.props.intl
        const processName = [<span>{ formatMessage({id: "LANG4160"}) }</span>,
            <span>{ formatMessage({id: "LANG5142"}) }</span>,
            <span>{ formatMessage({id: "LANG5143"}) }</span>,
            <span>{ formatMessage({id: "LANG5144"}) }</span>,
            <span>{ formatMessage({id: "LANG5145"}) }</span>,
            <span>{ formatMessage({id: "LANG2581"}) }</span>,
            <span>{ formatMessage({id: "LANG5189"}) }</span>
        ]
        const cellvalue = processName[index]
        return <div>
            { cellvalue }
        </div>
    }
    _createProcessSwitch = (text, record, index) => {
        const logSwitchList = this.state.logSwitchList
        let isChecked = true
        if (record.id === 0) {
            logSwitchList.map(function(item) {
                if (item.enable === '0' && item.id !== 0) {
                    isChecked = false
                }
            })
        } else {
            isChecked = record.enable === '1'
        }
        return <div>
            <Checkbox checked={ isChecked } onChange={ this._onChangeProcess.bind(this, record) } />
        </div>
    }
    _download = (fileName) => {
        window.open("/cgi?action=downloadFile&type=syslog")
    }
    _clean = () => {
        const { formatMessage } = this.props.intl
        $.ajax({
            url: api.apiHost,
            data: {
                action: "removeFile",
                type: "syslog"
            },
            type: "POST",
            dataType: "json",
            async: false,
            success: function(res) {
                var status = res.hasOwnProperty('status') ? res.status : null,
                    existed = false

                if (status === 0) {
                    if (res.response.result === 0) {
                        message.success(formatMessage({id: "LANG871"}))
                    } else {
                        message.error(formatMessage({id: "LANG2684"}))
                    }
                } else {
                    message.error(formatMessage({id: "LANG2684"}))
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        let logServer = this.state.logServer
        let dynamicSwitch = this.state.dynamicSwitch
        let staticSwitch = this.state.staticSwitch
        let logSwitch = this.state.logSwitch
        let logSwitchList = this.state.logSwitchList

        $.ajax({
            url: api.apiHost + 'action=getSyslogValue&syslog-server&syslogbk_interval&syslogbk_enabled',
            method: 'GET',
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    logServer = response || []
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
                action: 'listLogSwitchDynamic',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const tmpDynamicSwitch = response.log_switch_dynamic || []
                    dynamicSwitch.push({
                        dlevel: formatMessage({id: "LANG4160"}),
                        id: 0,
                        switch: '0'
                    })
                    tmpDynamicSwitch.map(function(item) {
                        dynamicSwitch.push({
                            dlevel: item.dlevel,
                            id: item.id,
                            switch: item.switch
                        })
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
                action: 'listLogSwitchStatic',
                sidx: 'module_name',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const tmpStaticSwitch = response.log_switch_static || []
                    staticSwitch.push({
                        id: 0,
                        module_name: formatMessage({id: "LANG4160"}),
                        ERROR: '0',
                        WARN: '0',
                        NOTIC: '0',
                        DEBUG: '0',
                        VERB: '0'
                    })
                    tmpStaticSwitch.map(function(item) {
                        staticSwitch.push({
                            id: item.id,
                            module_name: item.module_name,
                            ERROR: item.ERROR,
                            WARN: item.WARN,
                            NOTIC: item.NOTIC,
                            DEBUG: item.DEBUG,
                            VERB: item.VERB
                        })
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
                action: 'getLogSwitch'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    logSwitch = response || {}
                    logSwitchList[1].enable = logSwitch.cdrapi
                    logSwitchList[2].enable = logSwitch.pbxmid
                    logSwitchList[3].enable = logSwitch.apply_python
                    logSwitchList[4].enable = logSwitch.cgi
                    logSwitchList[5].enable = logSwitch.warning
                    logSwitchList[6].enable = logSwitch.zeroconfig
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        this.setState({
            logServer: logServer,
            dynamicSwitch: dynamicSwitch,
            staticSwitch: staticSwitch,
            logSwitch: logSwitch,
            logSwitchList: logSwitchList
        })
    }
    _onChangeSyslogbk = (e) => {
        let logServer = this.state.logServer || {}

        if (e.target.checked) {
            logServer.syslogbk_enabled = '1'
        } else {
            logServer.syslogbk_enabled = '0'
        }
        this.setState({
            logServer: logServer
        })
    }
    _handleCancel = () => {
        browserHistory.push('/maintenance/systemEvent/1')
    }
    _handleSubmit = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props
        const staticSwitch = this.state.staticSwitch
        const dynamicSwitch = this.state.dynamicSwitch
        const logSwitchList = this.state.logSwitchList
        const loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>
        const errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG962" })}}></span>
        message.loading(loadingMessage)

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                let ret = true
                let action_syslog = {}
                let action_static = {}
                let action_dynamic = {}
                let action_logswitch = {}
                action_syslog.action = 'setSyslogValue'
                action_syslog['syslog-server'] = values['syslog-server']
                action_syslog.syslogbk_enabled = values.syslogbk_enabled ? '1' : '0'
                action_syslog.syslogbk_interval = values.syslogbk_interval

                action_static.action = 'updateLogSwitchStatic'
                action_static.ERROR = ''
                action_static.WARN = ''
                action_static.NOTIC = ''
                action_static.VERB = ''
                action_static.DEBUG = ''
                let static_data = []
                staticSwitch.map(function(item) {
                    if (item.id !== 0) {
                        let itemData = []
                        itemData.push(item.id)
                        itemData.push(parseInt(item.ERROR))
                        itemData.push(parseInt(item.WARN))
                        itemData.push(parseInt(item.NOTIC))
                        itemData.push(parseInt(item.DEBUG))
                        itemData.push(parseInt(item.VERB))
                        static_data.push(itemData)
                    }
                })
                action_static.log_switch_static = JSON.stringify({
                            "SCHEMA": ["id", "ERROR", "WARN", "NOTIC", "DEBUG", "VERB"],
                            "TYPE": ["INT", "INT", "INT", "INT", "INT", "INT"],
                            "data": static_data
                        })

                action_dynamic.action = 'updateLogSwitchDynamic'
                action_dynamic.switch = ''
                let dynamic_data = []
                dynamicSwitch.map(function(item) {
                    if (item.id !== 0) {
                        let itemData = []
                        itemData.push(item.id)
                        itemData.push(parseInt(item.switch))
                        dynamic_data.push(itemData)
                    }
                })
                action_dynamic.log_switch_dynamic = JSON.stringify({
                            "SCHEMA": ["id", "switch"],
                            "TYPE": ["INT", "INT"],
                            "data": dynamic_data
                        })

                action_logswitch.action = 'setLogSwitch'
                action_logswitch.cdrapi = logSwitchList[1].enable
                action_logswitch.pbxmid = logSwitchList[2].enable
                action_logswitch.apply_python = logSwitchList[3].enable
                action_logswitch.cgi = logSwitchList[4].enable
                action_logswitch.warning = logSwitchList[5].enable
                action_logswitch.zeroconfig = logSwitchList[6].enable

                if (ret) {
                    $.ajax({
                        url: api.apiHost,
                        data: action_syslog,
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        error: function(e) {
                            message.error(e.statusText)
                            ret = false
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(successMessage)
                            } else {
                                message.destroy()
                                message.error(errorMessage)
                                ret = false
                            }
                        }.bind(this)
                    })
                }

                if (ret) {
                    $.ajax({
                        url: api.apiHost,
                        data: action_static,
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        error: function(e) {
                            message.error(e.statusText)
                            ret = false
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(successMessage)
                            } else {
                                message.destroy()
                                message.error(errorMessage)
                                ret = false
                            }
                        }.bind(this)
                    })
                }

                if (ret) {
                    $.ajax({
                        url: api.apiHost,
                        data: action_dynamic,
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        error: function(e) {
                            message.error(e.statusText)
                            ret = false
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(successMessage)
                            } else {
                                message.destroy()
                                message.error(errorMessage)
                                ret = false
                            }
                        }.bind(this)
                    })
                }

                if (ret) {
                    $.ajax({
                        url: api.apiHost,
                        data: action_logswitch,
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        error: function(e) {
                            message.error(e.statusText)
                            ret = false
                        },
                        success: function(data) {
                            var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(successMessage)
                            } else {
                                message.destroy()
                                message.error(errorMessage)
                                ret = false
                            }
                        }.bind(this)
                    })
                }
            }
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const columns_dynamic = [{
                key: 'dlevel',
                dataIndex: 'dlevel',
                title: formatMessage({id: "LANG4161"}),
                width: 150
            }, {
                key: 'switch',
                dataIndex: 'switch',
                title: formatMessage({id: "LANG4162"}),
                width: 150,
                render: (text, record, index) => (
                    this._createDynamicSwitch(text, record, index)
                )
            }]
        const colums_process = [{
                key: 'module_name',
                dataIndex: 'dlevel',
                title: formatMessage({id: "LANG5141"}),
                width: 150,
                render: (text, record, index) => (
                    this._createProcessName(text, record, index)
                )
            }, {
                key: 'enable',
                dataIndex: 'switch',
                title: formatMessage({id: "LANG4162"}),
                width: 150,
                render: (text, record, index) => (
                    this._createProcessSwitch(text, record, index)
                )
            }]
        const columns = [{
                key: 'id',
                dataIndex: 'id',
                title: formatMessage({id: "LANG4158"}),
                width: 150,
                render: (text, record, index) => (
                    this._createID(text, record, index)
                )
            }, {
                key: 'module_name',
                dataIndex: 'module_name',
                title: formatMessage({id: "LANG4159"}),
                width: 150
            }, {
                key: 'ERROR',
                dataIndex: 'ERROR',
                title: <span>Error</span>,
                width: 150,
                render: (text, record, index) => (
                    this._createError(text, record, index)
                )
            }, {
                key: 'WARN',
                dataIndex: 'WARN',
                title: <span>Warn</span>,
                width: 150,
                render: (text, record, index) => (
                    this._createWarn(text, record, index)
                )
            }, {
                key: 'NOTIC',
                dataIndex: 'NOTIC',
                title: <span>Notice</span>,
                width: 150,
                render: (text, record, index) => (
                    this._createNotice(text, record, index)
                )
            }, {
                key: 'DEBUG',
                dataIndex: 'DEBUG',
                title: <span>Debug</span>,
                width: 150,
                render: (text, record, index) => (
                    this._createDebug(text, record, index)
                )
            }, {
                key: 'VERB',
                dataIndex: 'VERB',
                title: <span>Verbose</span>,
                width: 150,
                render: (text, record, index) => (
                    this._createVerb(text, record, index)
                )
            }]

        const pagination = {
                total: this.state.staticSwitch.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }

        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG661"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG661"}) }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel } 
                    isDisplay= "display-block"
                />
                <Form id="systemLog-form">
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG1556" />}>
                                <span>{formatMessage({id: "LANG1556"})}</span>
                            </Tooltip>
                        )}
                    >
                        {getFieldDecorator('syslog-server', {
                            rules: [],
                            width: 100,
                            initialValue: this.state.logServer['syslog-server']
                        })(
                            <Input maxLength='255' />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG5250" />}>
                                <span>{formatMessage({id: "LANG5249"})}</span>
                            </Tooltip>
                        )}
                    >
                        {getFieldDecorator('syslogbk_enabled', {
                            rules: [],
                            valuePropName: 'checked',
                            width: 100,
                            initialValue: this.state.logServer.syslogbk_enabled === '1'
                        })(
                            <Checkbox onChange={ this._onChangeSyslogbk } />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG5252" />}>
                                <span>{formatMessage({id: "LANG5251"})}</span>
                            </Tooltip>
                        )}
                    >
                        {getFieldDecorator('syslogbk_interval', {
                            rules: [],
                            width: 100,
                            initialValue: this.state.logServer.syslogbk_interval
                        })(
                            <InputNumber min={ 3 } max={ 120 } disabled={ this.state.logServer.syslogbk_enabled === '0' }/>
                        )}
                    </FormItem>
                </Form>
                <div className="content">
                    <div className="section-title">
                        <p><span>
                                { formatMessage({id: "LANG67" })}
                            </span>
                        </p>
                    </div>
                    <div className="top-button">
                        <Button type="primary" icon="download" size='default' onClick={ this._download }>
                            { formatMessage({id: "LANG759" }, { 0: formatMessage({id: "LANG4146"})}) }
                        </Button>
                        <Button type="primary" icon="clear" size='default' onClick={ this._clean }>
                            { formatMessage({id: "LANG743"}) }
                        </Button>
                    </div>
                </div>
                <div className="content">
                    <div className="top-button">
                        <Card title={ formatMessage({id: "LANG662" })}>
                            <Table
                                rowKey="id"
                                columns={ columns }
                                pagination={ pagination }
                                dataSource={ this.state.staticSwitch }
                                showHeader={ !!this.state.staticSwitch.length }
                                scroll={{ y: 240 }}
                            />
                            <Table
                                style={{ width: '50%' }}
                                rowKey="id"
                                columns={ columns_dynamic }
                                pagination={ false }
                                dataSource={ this.state.dynamicSwitch }
                                showHeader={ !!this.state.dynamicSwitch.length }
                            />
                        </Card>
                    </div>
                    <div className="top-button">
                        <Card title={ formatMessage({id: "LANG5141" })} style={{ width: '50%' }}>
                            <Table
                                rowKey="id"
                                columns={ colums_process }
                                pagination={ false }
                                dataSource={ this.state.logSwitchList }
                                showHeader={ !!this.state.logSwitchList.length }
                            />
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(SystemLog))