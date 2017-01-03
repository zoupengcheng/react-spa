'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Table, Form, Modal, Button, Row, Col, Checkbox, Input, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import _ from 'underscore'

class OperLogUsrList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            recordFiles: []
        }
    }
    _sendDownloadRequest = () => {
        const { formatMessage } = this.props.intl

        message.loading(formatMessage({ id: "LANG3774" }))

        $.ajax({
            type: "GET",
            url: "/cgi?action=reloadCDRRecordFile&reflush_Record=all",
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    window.open("/cgi?action=downloadFile&type=cdr_recording&data=Master.csv" +
                        "&_location=cdr&_=" + (new Date().getTime()), '_self')
                }
            }.bind(this)
        })
    }
    _sendDownloadSearchRequest = () => {
        const { formatMessage } = this.props.intl

        message.loading(formatMessage({ id: "LANG3774" }))

        let action = this.props.dataSource

        action['action'] = 'CreateCdrRecord'
        action['condition'] = 1

        $.ajax({
            type: "POST",
            url: api.apiHost,
            data: action,
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    window.open("/cgi?action=downloadCdrRecord&type=cdr_recording&data=Master_condition.csv" +
                        "&_location=cdr&_=" + (new Date().getTime()), '_self')
                }
            }.bind(this)
        })
    }
    _showModal = () => {
        this.setState({
            visible: true
        })
    }
    _handleOk = () => {
        this.setState({
            visible: false
        })
    }
    _handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    _autoDownloadSettings = () => {
        browserHistory.push('/cdr/autoDownload')
    }
    _createStatus = (text, record, index) => {
        const {formatMessage} = this.props.intl

        let status

        if (text.indexOf("ANSWERED") > -1) {
            status = <span className="sprite sprit-cdr-answer" title={ formatMessage({ id: "LANG4863" }) }></span>
        } else if (text.indexOf("NO ANSWER") > -1) {
            status = <span className="sprite sprite-cdr-no-answer" title={ formatMessage({ id: "LANG4864" }) }></span>
        } else if (text.indexOf("FAILED") > -1) {
            status = <span className="sprite sprite-cdr-fail" title={ formatMessage({ id: "LANG2405" }) }></span>
        } else if (text.indexOf("BUSY") > -1) {
            status = <span className="sprite sprite-cdr-busy" title={ formatMessage({ id: "LANG2237" }) }></span>
        }

        return status
    }
    _createTalkTime = (text, record, index) => {
        let s = parseInt(text, 10),
            h = Math.floor(s / 3600)

        s = s % 3600

        let m = Math.floor(s / 60)

        s = s % 60

        return h + ":" + (m < 10 ? ("0" + m) : m) + ":" + (s < 10 ? ("0" + s) : s)
    }
    _createRecordFile = (text, record, index) => {
        const {formatMessage} = this.props.intl

        let record_list = text,
            options = ''

        if (record_list.length > 0) {
            let list = record_list.split('@')
            list.pop()
            options = <div>
                        <span className="sprite sptite-record-icon" onClick={ this._showRecordFile.bind(this, list) }></span>
                        <span className="record-num">{ list.length }</span>
                      </div>
        } else {
            options = formatMessage({id: "LANG2317"}, {0: formatMessage({id: "LANG2640"})})
        }

        return options
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        const columns = [
            {
                title: formatMessage({id: "LANG186"}),
                dataIndex: 'status',
                render: (text, record, index) => (
                    this._createStatus(text, record, index)
                )
            }, {
                title: formatMessage({id: "LANG581"}),
                dataIndex: 'callFrom'
            }, {
                title: formatMessage({id: "LANG582"}),
                dataIndex: 'callTo'
            }, {
                title: formatMessage({id: "LANG5134"}),
                dataIndex: 'actionType'
            }, {
                title: formatMessage({id: "LANG169"}),
                dataIndex: 'startTime',
                sorter: (a, b) => a > b
            }, {
                title: formatMessage({id: "LANG2238"}),
                dataIndex: 'talkTime',
                render: (text, record, index) => (
                    this._createTalkTime(text, record, index)
                )
            }, {
                title: formatMessage({id: "LANG4569"}),
                dataIndex: 'password'
            }, {
                title: formatMessage({id: "LANG4096"}),
                dataIndex: 'recordingFile',
                render: (text, record, index) => (
                    this._createRecordFile(text, record, index)
                )
            }
        ]

        const pagination = {
            total: this.props.cdrData.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            },
            onChange: (current) => {
                console.log('Current: ', current)
            }
        }

        return (
            <div className="content">
                <div className="top-button">
                    <Button type="primary" icon="record" size='default' onClick={ this._sendDownloadRequest }>
                        { formatMessage({id: "LANG775" }) }
                    </Button>
                    <Button type="primary" icon="delete" size='default' onClick={ this.props.deleteAll }>
                        { formatMessage({id: "LANG3718"}) }
                    </Button>
                    <Button type="primary" icon="upload" size='default' onClick={ this._showModal }>
                        { formatMessage({id: "LANG782"}) }
                    </Button>
                </div>
                <Table
                    bordered
                    columns={ columns }
                    dataSource={ this.props.cdrData }
                    pagination={ pagination }
                    showHeader={ !!this.props.cdrData.length } 
                />
                <Modal 
                    title={formatMessage({id: "LANG774"})}
                    visible={this.state.visible}
                    onOk={this._handleOk} 
                    onCancel={this._handleCancel}
                    okText={formatMessage({id: "LANG728"})}
                    cancelText={formatMessage({id: "LANG726"})}>
                    <Form>
                        <FormItem
                            { ...formItemLayout }
                            label={formatMessage({id: "LANG1607"})}>
                            { getFieldDecorator('moh_name', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Input maxLength="20" />
                            )}
                        </FormItem>
                        <span>{formatMessage({id: "LANG672"})}</span>
                        <span>{formatMessage({id: "LANG4227"})}</span>
                        <span>{formatMessage({id: "LANG2640"})}</span>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(injectIntl(OperLogUsrList))