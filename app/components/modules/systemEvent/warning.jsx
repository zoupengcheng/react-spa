'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Button, message, Modal, Table, Tag, Select, Form, Row, Col, DatePicker } from 'antd'

const confirm = Modal.confirm
const Option = Select.Option
const FormItem = Form.Item

class WarningLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            warning_log: [],
            visible: false,
            recordFiles: [],
            isDisplay: "display-block-filter",
            isDisplaySearch: 'hidden',
            selectedRowKeys: []
        }
    }
    componentDidMount() {
        this._getWarningLog()
    }
    _createID = (text, record, index) => {
        const { formatMessage } = this.props.intl
        const warningName = [<span>{ formatMessage({id: "LANG2591"}) }</span>,
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
        const cellvalue = warningName[text - 1]
        return <div>
            { cellvalue }
        </div>
    }
    _createAction = (text, record, index) => {
        const { formatMessage } = this.props.intl
        if (text === 0) {
            return <div>
                    <span>{ formatMessage({id: "LANG2597"}) }</span>
                </div>
        } else {
            return <div>
                    <span>{ formatMessage({id: "LANG2596"}) }</span>
                </div>
        }
    }
    _createContent = (text, record, index) => {
        const { formatMessage } = this.props.intl
        const id = record.id
        const content = text.split('|')
        let response = ''
        if (id === 4 || id === 16) {
            response = <span>{ content[0].trim() + formatMessage({id: content[1].trim()}) }</span>
        } else if (id === 6) {
            if (content.length === 5) {
                response = <span>{ content[0].trim() + ' ' + formatMessage({id: content[1].trim()}) + ' ' + content[2].trim() + ' ' + formatMessage({id: content[3].trim()})}<a className="corefile" onClick={ this._downloadcore.bind(this, content[4].trim()) } >{ formatMessage({id: "LANG2683"}) }</a></span>
            } else if (content.length === 4) {
                response = <span>{ content[0].trim() + ' ' + formatMessage({id: content[1].trim()}) + ' ' + content[2].trim() + ' ' + formatMessage({id: content[3].trim()})}</span>
            }
        } else if (id === 7 || id === 15) {
            response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()}), 1: formatMessage({id: content[2].trim()}), 2: formatMessage({id: content[3].trim()})}) }</span>
        } else if (id === 8) {
            response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()}), 1: formatMessage({id: content[2].trim()}), 2: formatMessage({id: content[3].trim()}), 3: formatMessage({id: content[4].trim()}), 4: formatMessage({id: content[5].trim()})}) }</span>
        } else if (id === 14) {
            response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()})}) }</span>
        } else if (id === 10 || id === 11 || id === 17) {
            if (content.length === 3) {
                response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()}), 1: formatMessage({id: content[2].trim()})}) }</span>
            } else if (content.length === 2) {
                response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()})}) }</span>
            }
        } else if (id === 3) {
            if (content.length === 5) {
                response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()}), 1: formatMessage({id: content[2].trim()}), 2: formatMessage({id: content[3].trim()}), 3: formatMessage({id: content[4].trim()})}) }</span>
            } else {
                response = <span>{ text.trim() }</span>
            }
        } else if (id === 1 || id === 18) {
            if (content.length === 6) {
                response = <span>{ content[5].trim() + formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()}), 1: formatMessage({id: content[2].trim()}), 2: formatMessage({id: content[3].trim()}), 3: formatMessage({id: content[4].trim()})})}</span>
            } else {
                response = <span>{ formatMessage({id: text.trim()}) }</span>
            }
        } else if (id === 12) {
            if (content.length === 6) {
                response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()}), 1: formatMessage({id: content[2].trim()}), 2: formatMessage({id: content[3].trim()}), 3: formatMessage({id: content[4].trim()}), 4: formatMessage({id: content[5].trim()})}) }</span>
            } else if (content.length === 7) {
                response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()}), 1: formatMessage({id: content[2].trim()}), 2: formatMessage({id: content[3].trim()}), 3: formatMessage({id: content[4].trim()}), 4: formatMessage({id: content[5].trim()}), 5: formatMessage({id: content[6].trim()})}) }</span>
            }
        } else if (id === 13) {
            if (content.length === 8) {
                response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()}), 1: formatMessage({id: content[2].trim()}), 2: formatMessage({id: content[3].trim()}), 3: formatMessage({id: content[4].trim()}), 4: formatMessage({id: content[5].trim()}), 5: formatMessage({id: content[6].trim()}), 6: formatMessage({id: content[7].trim()})}) }</span>
            } else if (content === 9) {
                response = <span>{ formatMessage({id: content[0].trim()}, {0: formatMessage({id: content[1].trim()}), 1: formatMessage({id: content[2].trim()}), 2: formatMessage({id: content[3].trim()}), 3: formatMessage({id: content[4].trim()}), 4: formatMessage({id: content[5].trim()}), 5: formatMessage({id: content[6].trim()}), 6: formatMessage({id: content[7].trim()}), 7: formatMessage({id: content[8].trim()})}) }</span>
            }
        } else {
            response = <span>{ formatMessage({id: text.trim()}) }</span>
        }
        return <div>
            { response }
        </div>
    }
    _downloadcore = (fileName) => {
        const { formatMessage } = this.props.intl

        $.ajax({
                url: "../cgi?action=checkFile&type=coredump&data=" + fileName,
                type: "GET",
                dataType: "json",
                async: false,
                success: function(res) {
                    var status = res.hasOwnProperty('status') ? res.status : null,
                        existed = false

                    if (status === 0) {
                        if (res.response.result === 0) {
                            existed = true
                        }

                        if (existed) {
                            window.open("/cgi?action=downloadFile&type=coredump&data=" + fileName)
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
    _getWarningLog = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listWarningLog',
                sidx: 'time',
                options: 'id,time,action,content,row_num',
                sord: 'desc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const warning_log = response.warning_log || []

                    this.setState({
                        warning_log: warning_log
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _clearSelectRows = () => {
        this.setState({
            selectedRowKeys: []
        })
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ 
            selectedRowKeys: selectedRowKeys
        })
    }
    _deleleRequestOk = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const { form } = this.props

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        let warningData = [],
            dataPost = {
                logid: '',
                logaction: '',
                logstartfrom: '',
                logstartto: ''
            },
            warningDeleteData = {
                action: 'warningDeleteLog'
            },
            flag = false
        let t_logid = form.getFieldValue('logid')
        let t_type = form.getFieldValue('type')
        let t_logstartfrom = form.getFieldValue('logstartfrom')
        let t_logstartto = form.getFieldValue('logstartto')
        if (t_logid && t_logid !== "") {
            dataPost['logid'] = t_logid
        }
        if (t_type && t_type !== "") {
            dataPost['logaction'] = t_type
        }
        if (t_logstartfrom && _.isObject(t_logstartfrom)) {
            dataPost['logstartfrom'] = t_logstartfrom.format('YYYY-MM-DD HH:mm')
        }
        if (t_logstartto && _.isObject(t_logstartto)) {
            dataPost['logstartto'] = t_logstartto.format('YYYY-MM-DD HH:mm')
        }

        _.extend(warningDeleteData, dataPost)

        $.ajax({
            url: api.apiHost,
            data: warningDeleteData,
            type: 'POST',
            dataType: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getWarningLog()
                    this._clearSelectRows()
                }
            }.bind(this)
        })
    }
    _deleleRequest = () => {
        const { formatMessage } = this.props.intl
        const __this = this

        if (this.state.selectedRowKeys.length === 0) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG129"}, {0: formatMessage({id: "LANG2547"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4072"})}} ></span>,
                onOk() {
                    __this._deleleRequestOk()
                },
                onCancel() {}
            })
        }
    }
    _deleleAllOk = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const { form } = this.props

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        let warningDeleteData = {
                action: 'warningDeleteLog'
            }

        $.ajax({
            url: api.apiHost,
            data: warningDeleteData,
            type: 'POST',
            dataType: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getWarningLog()
                    this._clearSelectRows()
                }
            }.bind(this)
        })
    }
    _deleteAll = () => {
        const { formatMessage } = this.props.intl
        const __this = this

        confirm({
            title: (formatMessage({id: "LANG543"})),
            content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG840"})}} ></span>,
            onOk() {
                __this._deleleAllOk()
            },
            onCancel() {}
        })
    }
    _hideSearch = () => {
        this.setState({
            isDisplay: 'display-block-filter',
            isDisplaySearch: 'hidden'
        })
    }
    _handleSearch = () => {
        this.setState({
            isDisplay: 'display-block',
            isDisplaySearch: 'display-block'
        })
    }
    _handleCancel = () => {
        browserHistory.push('/maintenance/systemEvent/1')
    }
    _handleSubmit = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        message.loading(formatMessage({ id: "LANG3773" }), 0)

        let warningData = [],
            acctid = [],
            dataPost = {},
            warningSearchData = {
                action: 'listWarningLog',
                sidx: 'time',
                options: 'id,time,action,content,row_num',
                sord: 'desc'
            },
            flag = false
        let t_logid = form.getFieldValue('logid')
        let t_type = form.getFieldValue('type')
        let t_logstartfrom = form.getFieldValue('logstartfrom')
        let t_logstartto = form.getFieldValue('logstartto')
        if (t_logid && t_logid !== "") {
            dataPost['logid'] = t_logid
        }
        if (t_type && t_type !== "") {
            dataPost['logaction'] = t_type
        }
        if (t_logstartfrom && _.isObject(t_logstartfrom)) {
            dataPost['logstartfrom'] = t_logstartfrom.format('YYYY-MM-DD HH:mm')
        }
        if (t_logstartto && _.isObject(t_logstartto)) {
            dataPost['logstartto'] = t_logstartto.format('YYYY-MM-DD HH:mm')
        }

        _.extend(warningSearchData, dataPost)

        $.ajax({
            url: api.apiHost,
            data: warningSearchData,
            type: 'POST',
            dataType: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()

                    const response = data.response || {}
                    const warning_log = response.warning_log || []

                    this.setState({
                        warning_log: warning_log
                    })
                }
            }.bind(this)
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        const columns = [{
                key: 'time',
                dataIndex: 'time',
                title: formatMessage({id: "LANG2548"}),
                sorter: (a, b) => a.time - b.time
            }, {
                key: 'id',
                dataIndex: 'id',
                title: formatMessage({id: "LANG2549"}),
                sorter: (a, b) => a.id.length - b.id.length,
                render: (text, record, index) => (
                    this._createID(text, record, index)
                )
            }, {
                key: 'action',
                dataIndex: 'action',
                title: formatMessage({id: "LANG2550"}),
                sorter: (a, b) => a.action.length - b.action.length,
                render: (text, record, index) => (
                    this._createAction(text, record, index)
                )
            }, {
                key: 'content',
                dataIndex: 'content',
                title: formatMessage({id: "LANG2551"}),
                render: (text, record, index) => (
                    this._createContent(text, record, index)
                )
            }]

        const pagination = {
                total: this.state.warning_log.length,
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
                    1: formatMessage({id: "LANG2581"})
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG2581"}) }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel } 
                    onSearch = { this._handleSearch } 
                    isDisplay= { this.state.isDisplay }
                    saveTxt = { formatMessage({id: "LANG1288" }) }
                    cancelTxt = { formatMessage({id: "LANG750" }) }
                />
                <Form id="operationLog-form" className={ this.state.isDisplaySearch }>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={formatMessage({id: "LANG2549"})}
                            >
                                {getFieldDecorator('logid', {
                                    rules: [],
                                    width: 100,
                                    initialValue: ""
                                })(
                                    <Select>
                                        <Option value="">{ formatMessage({id: "LANG104"}) }</Option>
                                        <Option value="1">{ formatMessage({id: "LANG2591"}) }</Option>
                                        <Option value="18">{ formatMessage({id: "LANG4780"}) }</Option>
                                        <Option value="2">{ formatMessage({id: "LANG2592"}) }</Option>
                                        <Option value="3">{ formatMessage({id: "LANG2593"}) }</Option>
                                        <Option value="4">{ formatMessage({id: "LANG2594"}) }</Option>
                                        <Option value="5">{ formatMessage({id: "LANG2595"}) }</Option>
                                        <Option value="6">{ formatMessage({id: "LANG2681"}) }</Option>
                                        <Option value="7">{ formatMessage({id: "LANG2758"}) }</Option>
                                        <Option value="8">{ formatMessage({id: "LANG2759"}) }</Option>
                                        <Option value="9">{ formatMessage({id: "LANG2760"}) }</Option>
                                        <Option value="10">{ formatMessage({id: "LANG2761"}) }</Option>
                                        <Option value="11">{ formatMessage({id: "LANG2762"}) }</Option>
                                        <Option value="17">{ formatMessage({id: "LANG4779"}) }</Option>
                                        <Option value="12">{ formatMessage({id: "LANG3183"}) }</Option>
                                        <Option value="13">{ formatMessage({id: "LANG3184"}) }</Option>
                                        <Option value="14">{ formatMessage({id: "LANG3277"}) }</Option>
                                        <Option value="15">{ formatMessage({id: "LANG3278"}) }</Option>
                                        <Option value="16">{ formatMessage({id: "LANG3504"}) }</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={formatMessage({id: "LANG2550"})}
                            >
                                {getFieldDecorator('type', {
                                    rules: [],
                                    width: 100,
                                    initialValue: ""
                                })(
                                    <Select>
                                        <Option value="">{ formatMessage({id: "LANG104"}) }</Option>
                                        <Option value="0">{ formatMessage({id: "LANG2597"}) }</Option>
                                        <Option value="1">{ formatMessage({id: "LANG2596"}) }</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>{formatMessage({id: "LANG1048"})}</span>
                                )}
                            >
                                {getFieldDecorator('logstartfrom')(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>{formatMessage({id: "LANG1049"})}</span>
                                )}
                            >
                                {getFieldDecorator('logstartto')(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <div className="hide_search sprite sprite-slide-bar" onClick={ this._hideSearch }></div>
                </Form>
                <div className="content">
                    <div className="top-button">
                        <Button type="primary" icon="delete" size='default' onClick={ this._deleleRequest }>
                            { formatMessage({id: "LANG4071" }, { 0: formatMessage({id: "LANG4146"})}) }
                        </Button>
                        <Button type="primary" icon="delete" size='default' onClick={ this._deleteAll }>
                            { formatMessage({id: "LANG740"}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="row_num"
                        columns={ columns }
                        pagination={ pagination }
                        dataSource={ this.state.warning_log }
                        showHeader={ !!this.state.warning_log.length }
                    />
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(WarningLog))