'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Form, Icon, Table, Button, message, Modal } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"

class CDRList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
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
                message.destroy()
                window.open("/cgi?action=downloadFile&type=cdr_recording&data=Master.csv" + "&_location=cdr&_=" + (new Date().getTime()), '_self')
            }
        })
    }
    _sendDownloadSearchRequest = () => {
        const { formatMessage } = this.props.intl

        message.loading(formatMessage({ id: "LANG3774" }))

        var action = {
                "action": "CreateCdrRecord",
                "condition": 1
            },
            fromtime = $('#startfrom').val(),
            totime = $('#startto').val(),
            src = $('#CallerNumber').val(),
            caller_name = $('#CallerName').val(),
            dst = $('#CalledNumber').val(),
            srcTrunks = $('#src_trunk_name'),
            dstTrunks = $('#dst_trunk_name'),
            disposition = $('#disposition'),
            actionType = $('#action_type'),
            accountCode = $('#accountcode'),
            userfield = $('#userfield'),
            srcTrunksNameList = [],
            dstTrunksNameList = [],
            dispositionNameList = [],
            actionTypeNameList = [],
            accountCodeNameList = [],
            userfieldNameList = []

        if (fromtime) {
            action['fromtime'] = fromtime
        }

        if (totime) {
            action['totime'] = totime
        }

        if (src) {
            action['src'] = src
        }

        if (caller_name) {
            action['caller_name'] = caller_name
        }

        if (dst) {
            action['dst'] = dst
        }

        // Srouce Trunks
        srcTrunks.find('option:selected').each(function() {
            srcTrunksNameList.push(this.title)
        })

        if (srcTrunksNameList.length) {
            action['src_trunk_name'] = srcTrunksNameList.join()
        }

        // Destination Trunks
        dstTrunks.find('option:selected').each(function() {
            dstTrunksNameList.push(this.title)
        })

        if (dstTrunksNameList.length) {
            action['dst_trunk_name'] = dstTrunksNameList.join()
        }

        // Status
        disposition.find('option:selected').each(function() {
            dispositionNameList.push(this.value)
        })

        if (dispositionNameList.length) {
            action['disposition'] = dispositionNameList.join()
        }

        // Action Types
        actionType.find('option:selected').each(function() {
            actionTypeNameList.push(this.value)
        })

        if (actionTypeNameList.length) {
            action['action_type'] = actionTypeNameList.join()
        }

        // Account Codes
        accountCode.find('option:selected').each(function() {
            accountCodeNameList.push(this.value)
        })

        if (accountCodeNameList.length) {
            action['accountcode'] = accountCodeNameList.join()
        }

        // Call Types
        userfield.find('option:selected').each(function() {
            userfieldNameList.push(this.value)
        })

        if (userfieldNameList.length) {
            action['userfield'] = userfieldNameList.join()
        }

        $.ajax({
            type: "POST",
            url: api.apiHost,
            data: action,
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                message.destroy()
                window.open("/cgi?action=downloadCdrRecord&type=cdr_recording&data=Master_condition.csv" + "&_location=cdr&_=" + (new Date().getTime()), '_self')
            }
        })
    }
    _showRecordFile = () => {
        this.setState({
            visible: true
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
    render() {
        const {formatMessage} = this.props.intl

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
                dataIndex: 'talkTime'
            }, {
                title: formatMessage({id: "LANG4569"}),
                dataIndex: 'password'
            }, {
                title: formatMessage({id: "LANG4096"}),
                dataIndex: 'recordingFile',
                render: (text, row, index) => {
                    return <span onClick={ this._showRecordFile }>{ text }</span>
                }
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
                    <Button type="primary" icon="delete" size='default' onClick={ this.props.deleteAll }>{ formatMessage({id: "LANG740"}) }</Button>
                    <Button type="primary" icon="download" size='default' onClick={ this._sendDownloadRequest }>{ formatMessage({id: "LANG741" }, { 0: formatMessage({id: "LANG4146"})}) }</Button>
                    <Button type="primary" icon="download" size='default' onClick={ this._sendDownloadSearchRequest }>{ formatMessage({id: "LANG3699" })}</Button>
                    <Button type="primary" icon="setting" size='default' onClick={ this._autoDownloadSettings }>{ formatMessage({id: "LANG3955" })}</Button>
                </div>
                <Table columns={ columns } dataSource={ this.props.cdrData } pagination={ pagination } />
                <Modal title={ formatMessage({id: "LANG2640"}) } visible={ this.state.visible } onCancel={ this._handleCancel } footer={ false }>
                    <div>
                        <Icon type="play-circle-o" />
                        <Icon type="download" />
                        <Icon type="delete" />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default injectIntl(CDRList)