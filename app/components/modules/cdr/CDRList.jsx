'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Form, Input, Icon, Table, Button, message, Modal, Popconfirm } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import _ from 'underscore'

const confirm = Modal.confirm

let subCDRList = []

class CDRList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            recordFiles: []
        }
    }
    _getSubCDR = (session) => {
        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                'action': 'getSubCDR',
                'session': session
            },
            dataType: 'json',
            async: false,
            success: function(res) {
                subCDRList = res.response.sub_cdr || []
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _sendDownloadRequest = () => {
        const { formatMessage } = this.props.intl

        message.loading(formatMessage({ id: "LANG3774" }))

        $.ajax({
            type: "GET",
            url: "/cgi?action=reloadCDRRecordFile&reflush_Record=all",
            error: function(e) {
                message.error(e.statusText)
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
                message.error(e.statusText)
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
    _showRecordFile = (list) => {
        this.setState({
            visible: true,
            recordFiles: list
        })
    }
    _hideRecordFile = () => {
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
            status = <span className="sprite sprite-cdr-answer" title={ formatMessage({ id: "LANG4863" }) }></span>
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
                        <span className="sprite sprite-cdr-record" onClick={ this._showRecordFile.bind(this, list) }></span>
                        <span className="record-num">{ list.length }</span>
                      </div>
        } else {
            options = formatMessage({id: "LANG2317"}, {0: formatMessage({id: "LANG2640"})})
        }

        return options
    }
    _checkFileErrorHandler = (data) => {
        var response = data.response || {},
            result = response.result

        if (typeof result === 'number') {
        } else {
        }
    }
    _playRecord = (value) => {
        var filename = value,
            type

        if (filename.indexOf("auto-") > -1) {
            type = 'voice_recording'
        } else {
            type = 'conference_recording'
        }

        $.ajax({
            type: "post",
            url: api.apiHost,
            data: {
                "action": "checkFile",
                "type": type,
                "data": filename
            },
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                    window.location = "/cgi?action=playFile&type=" + type + "&data=" +
                                        encodeURIComponent(filename) + "&_=" + (new Date().getTime())
                } else {
                    this._checkFileErrorHandler(data)
                }
            }.bind(this)
        })
    }
    _downloadRecord = (value) => {
        var file = value, 
            type

        if (file.indexOf("auto-") > -1) {
            type = 'voice_recording'
        } else {
            type = 'conference_recording'
        }

        $.ajax({
            type: "post",
            url: api.apiHost,
            data: {
                "action": "checkFile",
                "type": type,
                "data": file
            },
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                    top.window.open("/cgi?action=downloadFile&type=" + type + "&data=" +
                                    encodeURIComponent(file) + "&_=" + (new Date().getTime()), '_self')
                } else {
                    this._checkFileErrorHandler(data)
                }
            }.bind(this)
        })
    }
    _deleteRecord = (value, index) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        let file = value, 
            type

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage, 0)

        if (file.indexOf("auto-") > -1) {
            type = 'voice_recording'
        } else {
            type = 'conference_recording'
        }

        $.ajax({
            type: "post",
            url: api.apiHost,
            data: {
                "action": "removeFile",
                "type": type,
                "data": file
            },
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    let recordFiles = this.state.recordFiles
                    recordFiles.splice(index, 1)
                    this.setState({
                        recordFiles: recordFiles
                    })

                    this.props.getCdrData()
                }
            }.bind(this)
        })
    }
    render() {
        const {formatMessage} = this.props.intl

        const columns = [
            {
                title: formatMessage({id: "LANG186"}),
                dataIndex: 'disposition',
                render: (text, record, index) => (
                    this._createStatus(text, record, index)
                )
            }, {
                title: formatMessage({id: "LANG581"}),
                dataIndex: 'src'
            }, {
                title: formatMessage({id: "LANG582"}),
                dataIndex: 'dst'
            }, {
                title: formatMessage({id: "LANG5134"}),
                dataIndex: 'action_type'
            }, {
                title: formatMessage({id: "LANG169"}),
                dataIndex: 'start',
                sorter: (a, b) => a > b
            }, {
                title: formatMessage({id: "LANG2238"}),
                dataIndex: 'billsec',
                render: (text, record, index) => (
                    this._createTalkTime(text, record, index)
                )
            }, {
                title: formatMessage({id: "LANG4569"}),
                dataIndex: 'accountcode'
            }, {
                title: formatMessage({id: "LANG4096"}),
                dataIndex: 'recordfiles',
                render: (text, record, index) => (
                    this._createRecordFile(text, record, index)
                )
            }
        ]

        const expandedRowRender = (e) => {
            const columns = [
                {
                    title: formatMessage({id: "LANG186"}),
                    dataIndex: 'disposition',
                    render: (text, record, index) => (
                        this._createStatus(text, record, index)
                    )
                }, {
                    title: formatMessage({id: "LANG581"}),
                    dataIndex: 'src'
                }, {
                    title: formatMessage({id: "LANG582"}),
                    dataIndex: 'dst'
                }, {
                    title: formatMessage({id: "LANG5134"}),
                    dataIndex: 'action_type'
                }, {
                    title: formatMessage({id: "LANG169"}),
                    dataIndex: 'start',
                    sorter: (a, b) => a > b
                }, {
                    title: formatMessage({id: "LANG2238"}),
                    dataIndex: 'billsec',
                    render: (text, record, index) => (
                        this._createTalkTime(text, record, index)
                    )
                }, {
                    title: formatMessage({id: "LANG4569"}),
                    dataIndex: 'accountcode'
                }, {
                    title: formatMessage({id: "LANG4096"}),
                    dataIndex: 'recordfiles',
                    render: (text, record, index) => (
                        this._createRecordFile(text, record, index)
                    )
                }
            ]

            this._getSubCDR(e.session)

            return (
                <Table
                    columns={ columns }
                    dataSource={ subCDRList }
                    pagination={ false } />
            )
        }

        return (
            <div className="content">
                <div className="top-button">
                    <Button type="primary" icon="delete" size='default' onClick={ this.props.deleteAll }>
                        { formatMessage({id: "LANG740"}) }
                    </Button>
                    <Button type="primary" icon="download" size='default' onClick={ this._sendDownloadRequest }>
                        { formatMessage({id: "LANG741" }, { 0: formatMessage({id: "LANG4146"})}) }
                    </Button>
                    <Button type="primary" icon="download" size='default' onClick={ this._sendDownloadSearchRequest }>
                        { formatMessage({id: "LANG3699" })}
                    </Button>
                    <Button type="primary" icon="setting" size='default' onClick={ this._autoDownloadSettings }>
                        { formatMessage({id: "LANG3955" })}
                    </Button>
                </div>
                <Table
                    rowKey={ record => record.session }
                    columns={ columns }
                    dataSource={ this.props.cdrData }
                    pagination={ this.props.pagination }
                    showHeader={ !!this.props.cdrData.length }
                    loading={ this.props.loading}
                    expandedRowRender = { expandedRowRender }
                    onChange={ this.props._handleTableChange }/>
                <Modal
                    title={ formatMessage({id: "LANG2640"}) }
                    visible={ this.state.visible }
                    onCancel={ this._hideRecordFile }
                    footer={ false }
                >
                    <div id="cdr-record">
                        { 
                            this.state.recordFiles.map(function(value, index) {
                                return <div className="record-list" key={ index }>
                                            <span className="sprite sprite-record"></span>
                                            <span className="record-item">{ value }</span>
                                            <div className="record-btn">
                                                <span
                                                    className="sprite sprite-play"
                                                    onClick={ this._playRecord.bind(this, value) }
                                                >
                                                </span>
                                                <span
                                                    className="sprite sprite-download"
                                                    onClick={ this._downloadRecord.bind(this, value) }
                                                >
                                                </span>
                                                <Popconfirm
                                                    title={ formatMessage({id: "LANG841"}) }
                                                    okText={ formatMessage({id: "LANG727"}) }
                                                    cancelText={ formatMessage({id: "LANG726"}) }
                                                    onConfirm={ this._deleteRecord.bind(this, value, index) }
                                                >
                                                    <span className="sprite sprite-del"></span>
                                                </Popconfirm>
                                            </div>
                                       </div>
                            }.bind(this))
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}

export default injectIntl(CDRList)