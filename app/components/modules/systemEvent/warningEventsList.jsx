'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Row, Button, message, Modal, InputNumber, Tooltip, Table, Tag, Switch, Select, Col, Form } from 'antd'

const confirm = Modal.confirm
const FormItem = Form.Item
const Option = Select.Option

class WarningEventList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            warning_general: [],
            has_contact: 0,
            noButtonIds: [2, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            Pmin_send_warningemail: "",
            Pmode_send_warningemail: "",
            Ptype_send_warningemail: "",
            typeDisable: true,
            selectedRowKeys: [],
            selectedRows: []
        }
    }
    componentDidMount() {
        this._getInitDate()
        this._getHasContact()
    }
    _getHasContact = () => {
         const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'warningCheckHasContact'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const has_contact = response.body.has_contact

                    this.setState({
                        has_contact: has_contact
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getInitDate = () => {
        const { formatMessage } = this.props.intl
        let Pmin_send_warningemail = ""
        let Pmode_send_warningemail = ""
        let Ptype_send_warningemail = ""

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'warningGetGeneralSettings'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const warning_general = response.body.warning_general || []

                    this.setState({
                        warning_general: warning_general
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        $.ajax({
            url: api.apiHost + "action=getWarningEmailValue",
            method: 'GET',
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    Pmin_send_warningemail = response.Pmin_send_warningemail
                    Pmode_send_warningemail = response.Pmode_send_warningemail
                    Ptype_send_warningemail = response.Ptype_send_warningemail
                    let typeDisable = true
                    if (Pmode_send_warningemail === '0') {
                        typeDisable = true
                    } else if (Pmode_send_warningemail === '1') {
                        typeDisable = false
                    }
                    if (Ptype_send_warningemail === 'minute') {
                        this.setState({
                            minInterval: 1,
                            maxInterval: 59
                        })
                    } else if (Ptype_send_warningemail === 'hour') {
                        this.setState({
                            minInterval: 1,
                            maxInterval: 23
                        })
                    } else if (Ptype_send_warningemail === 'day') {
                        this.setState({
                            minInterval: 1,
                            maxInterval: 30
                        })
                    }

                    this.setState({
                        Pmin_send_warningemail: Pmin_send_warningemail,
                        Pmode_send_warningemail: Pmode_send_warningemail,
                        Ptype_send_warningemail: Ptype_send_warningemail,
                        typeDisable: typeDisable
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _turnOnWarningOK = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>
        const rowList = this.state.selectedRows
        let selectedRows = this.state.selectedRows
        let ids = []
        rowList.map(function(item) {
            ids.push(item.id)
        })
        let action = {}
        action.action = "warningUpdateGeneralSettings"
        action.enable = 1
        action.enable_email = ""
        action.id = ids.join(',')
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: action,
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                    for (let i = 0; i < rowList.length; i++) {
                        selectedRows[i].enable = '1'
                    }
                    this.setState({
                        selectedRows: selectedRows
                    })
                }

                this._getInitDate()
            }.bind(this)
        })
    }
    _turnOffWarningOK = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>
        const rowList = this.state.selectedRows
        let selectedRows = this.state.selectedRows
        let ids = []
        rowList.map(function(item) {
            ids.push(item.id)
        })
        let action = {}
        action.action = "warningUpdateGeneralSettings"
        action.enable = 0
        action.enable_email = ""
        action.id = ids.join(',')
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: action,
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                    for (let i = 0; i < rowList.length; i++) {
                        selectedRows[i].enable = '0'
                    }
                    this.setState({
                        selectedRows: selectedRows
                    })
                }

                this._getInitDate()
            }.bind(this)
        })
    }
    _turnOnMailNotificationOK = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>
        const rowList = this.state.selectedRows
        let ids = []
        rowList.map(function(item) {
            ids.push(item.id)
        })
        let action = {}
        action.action = "warningUpdateGeneralSettings"
        action.enable = ""
        action.enable_email = 1
        action.id = ids.join(',')
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: action,
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                }

                this._getInitDate()
            }.bind(this)
        })
    }
    _turnOffMailNotificationOK = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>
        const rowList = this.state.selectedRows
        let ids = []
        rowList.map(function(item) {
            ids.push(item.id)
        })
        let action = {}
        action.action = "warningUpdateGeneralSettings"
        action.enable = ""
        action.enable_email = 0
        action.id = ids.join(',')
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: action,
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                }

                this._getInitDate()
            }.bind(this)
        })
    }
    _turnOnWarning = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const __this = this

        confirm({
            title: (formatMessage({id: "LANG543"})),
            content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG2563"})}} ></span>,
            onOk() {
                __this._turnOnWarningOK()
            },
            onCancel() {}
        })
    }
    _turnOffWarning = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const __this = this

        confirm({
            title: (formatMessage({id: "LANG543"})),
            content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG2564"})}} ></span>,
            onOk() {
                __this._turnOffWarningOK()
            },
            onCancel() {}
        })
    }
    _turnOnMailNotification = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const __this = this
        const rowList = this.state.selectedRows
        let needTurnWarning = false
        rowList.map(function(item) {
            if (item.enable === '0') {
                needTurnWarning = true
            }
        })
        if (needTurnWarning) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG5004"})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG2565"})}} ></span>,
                onOk() {
                    __this._turnOnMailNotificationOK()
                },
                onCancel() {}
            })
        }
    }
    _turnOffMailNotification =() => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const __this = this

        confirm({
            title: (formatMessage({id: "LANG543"})),
            content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG2566"})}} ></span>,
            onOk() {
                __this._turnOffMailNotificationOK()
            },
            onCancel() {}
        })
    }
    _onSelectChange = () => {
        
    }
    _warningEnable = (id, value) => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>
        let action = {}
        action.action = "warningUpdateGeneralSettings"
        action.enable = value === true ? 1 : 0
        action.enable_email = ""
        action.id = id
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: action,
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                }

                this._getInitDate()
            }.bind(this)
        })
    }
    _warningEnableEmail = (id, record, value) => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>
        const isDoCheck = record.enable
        const __this = this
        if (isDoCheck === '0') {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4487"})}} ></span>,
                onOk() {
                    __this._getInitDate()
                }
            })
        } else if (this.state.has_contact === 0) {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG2631"})}} ></span>,
                onOk() {
                    __this._gotoWarningContact()
                },
                onCancel() {}
            })
        } else {
            let action = {}
            action.action = "warningUpdateGeneralSettings"
            action.enable = ""
            action.enable_email = value === true ? 1 : 0
            action.id = id
            $.ajax({
                url: api.apiHost,
                method: "post",
                data: action,
                type: 'json',
                error: function(e) {
                    message.error(e.statusText)
                },
                success: function(data) {
                    const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                    if (bool) {
                        message.destroy()
                        message.success(successMessage)
                    }

                    this._getInitDate()
                }.bind(this)
            })
        }
    }
    _gotoWarningContact = () => {
        browserHistory.push('/maintenance/systemEvent/3')
    }
    _createID = (text, record, index) => {
        const { formatMessage } = this.props.intl
        const eventName = [<span>{ formatMessage({id: "LANG2591"}) }</span>,
            <span>{ formatMessage({id: "LANG2592"}) }</span>,
            <span>{ formatMessage({id: "LANG2593"}) }</span>,
            <span>{ formatMessage({id: "LANG2594"}) }</span>,
            <span>{ formatMessage({id: "LANG2595"}) }</span>,
            <span>{ formatMessage({id: "LANG2681"}) }</span>,
            <span>{ formatMessage({id: "LANG2758"}) }</span>,
            <span>{ formatMessage({id: "LANG2759"}) }</span>,
            <span>{ formatMessage({id: "LANG2760"}) }</span>,
            <span>{ formatMessage({id: "LANG2761"}) }</span>,
            <span>{ formatMessage({id: "LANG2762"}) }</span>,
            <span>{ formatMessage({id: "LANG3183"}) }</span>,
            <span>{ formatMessage({id: "LANG3184"}) }</span>,
            <span>{ formatMessage({id: "LANG3277"}) }</span>,
            <span>{ formatMessage({id: "LANG3278"}) }</span>,
            <span>{ formatMessage({id: "LANG3504"}) }</span>,
            <span>{ formatMessage({id: "LANG4779"}) }</span>,
            <span>{ formatMessage({id: "LANG4780"}) }</span>
        ]
        const cellvalue = eventName[text - 1]
        return <div>
            { cellvalue }
            </div>
    }
    _createEnable = (text, record, index) => {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }
        return <div>
                    <Switch checked={ record.enable === "0" ? false : true } checkedChildren={'ON'} unCheckedChildren={'OFF'} onChange={ this._warningEnable.bind(this, index + 1) } />
                </div>
    }
    _createEnableEmail = (text, record, index) => {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }
        return <div>
                    <Switch checked={ record.enable_email === "0" ? false : true } checkedChildren={'ON'} unCheckedChildren={'OFF'} onChange={ this._warningEnableEmail.bind(this, index + 1, record) } />
                </div>
    }
    _createOption = (text, record, index) => {
        const { formatMessage } = this.props.intl
        if ($.inArray(record.id, this.state.noButtonIds) > -1) {
            return <div>
                    <span
                        className="sprite sprite-edit sprite-edit-disabled">
                    </span>
                </div>
        } else {
            return <div>
                    <span
                        className="sprite sprite-edit"
                        title={ formatMessage({id: "LANG738"}) }
                        onClick={ this._edit.bind(this, record, index) }>
                    </span>
                </div>
        }
    }
    _edit = (record, index) => {
        if ($.inArray(index + 1, this.state.noButtonIds) > -1) {

        } else {
            browserHistory.push('/maintenance/warningEventsList/edit/' + record.id)
        }
    }
    _onChangeMode = (e) => {
        if (e === '0') {
            this.setState({
                typeDisable: true
            })
        } else if (e === '1') {
            this.setState({
                typeDisable: false
            })
        }
    }
    _onChangeType = (e) => {
        if (e === 'minute') {
            this.setState({
                minInterval: 1,
                maxInterval: 59
            })
        } else if (e === 'hour') {
            this.setState({
                minInterval: 1,
                maxInterval: 23
            })
        } else if (e === 'day') {
            this.setState({
                minInterval: 1,
                maxInterval: 30
            })
        }
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ 
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows
        })
    }
    _handleSubmit = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG905" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)
                let action = {}
                action.action = 'setWarningEmailValue'
                if (values.Pmode_send_warningemail === '0') {
                    action.action = 'setWarningEmailValue'
                    action.Pmode_send_warningemail = values.Pmode_send_warningemail
                } else if (values.Pmode_send_warningemail === '1') {
                    action.action = 'setWarningEmailValue'
                    action.Pmode_send_warningemail = values.Pmode_send_warningemail
                    action.Pmin_send_warningemail = values.email_circle
                    action.Ptype_send_warningemail = values.Ptype_send_warningemail
                }

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)
                        }
                    }.bind(this)
                })
            }
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, setFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        }
        const columns = [{
                key: 'id',
                dataIndex: 'id',
                title: formatMessage({id: "LANG2558"}),
                sorter: (a, b) => a.id - b.id,
                render: (text, record, index) => (
                    this._createID(text, record, index)
                )
            }, {
                key: 'enable',
                dataIndex: 'enable',
                title: formatMessage({id: "LANG2559"}),
                sorter: (a, b) => a.enable.length - b.enable.length,
                render: (text, record, index) => (
                    this._createEnable(text, record, index)
                )
            }, {
                key: 'enable_email',
                dataIndex: 'enable_email',
                title: formatMessage({id: "LANG2560"}),
                sorter: (a, b) => a.enable_email.length - b.enable_email.length,
                render: (text, record, index) => (
                    this._createEnableEmail(text, record, index)
                )
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG2561"}),
                render: (text, record, index) => (
                    this._createOption(text, record, index)
                )
            }]

        const pagination = {
                total: this.state.warning_general.length,
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
                    1: formatMessage({id: "LANG2582"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG2582"}) }
                    onSubmit={ this._handleSubmit }
                    isDisplay='display-block'
                />
                <Form>
                    <Row>
                        <Col span={ 6 } >
                            <FormItem
                                ref="div_Pmode_send_warningemail"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG4801" />}>
                                        <span>{formatMessage({id: "LANG4802"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('Pmode_send_warningemail', {
                                    rules: [],
                                    initialValue: this.state.Pmode_send_warningemail
                                })(
                                    <Select onChange={ this._onChangeMode } >
                                        <Option value='0'>{ formatMessage({id: "LANG4799"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG4800"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 6 } >
                            <FormItem
                                ref="div_email_circle"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG4447" />}>
                                        <span>{formatMessage({id: "LANG4446"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('email_circle', {
                                    rules: [],
                                    initialValue: this.state.Pmin_send_warningemail
                                })(
                                    <InputNumber min={ this.state.minInterval } max={ this.state.maxInterval } disabled={ this.state.typeDisable } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 3 } >
                            <FormItem
                                ref="div_Ptype_send_warningemail"
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('Ptype_send_warningemail', {
                                    rules: [],
                                    initialValue: this.state.Ptype_send_warningemail
                                })(
                                    <Select disabled={ this.state.typeDisable } onChange={ this._onChangeType } >
                                        <Option value='minute'>{ formatMessage({id: "LANG2576"}) }</Option>
                                        <Option value='hour'>{ formatMessage({id: "LANG2577"}) }</Option>
                                        <Option value='day'>{ formatMessage({id: "LANG2578"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._turnOnWarning }
                        >
                            { formatMessage({id: "LANG2554"}) }
                        </Button>
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._turnOffWarning }
                        >
                            { formatMessage({id: "LANG2555"}) }
                        </Button>
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._turnOnMailNotification }
                        >
                            { formatMessage({id: "LANG2556"}) }
                        </Button>
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._turnOffMailNotification }
                        >
                            { formatMessage({id: "LANG2557"}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="id"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.warning_general }
                        showHeader={ !!this.state.warning_general.length }
                    />
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(WarningEventList))