'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Form, Icon, Table, Button, message, Modal } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"

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
                    bordered
                    columns={ columns }
                    dataSource={ this.props.cdrData }
                    pagination={ pagination }
                    showHeader={ !!this.props.cdrData.length } 
                />
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